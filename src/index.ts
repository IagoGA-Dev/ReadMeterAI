import express from "express";
import upload from "./routes/upload";
import dotenv from "dotenv";
import initDB from "./db";
import path from "path";

dotenv.config();

initDB();
const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use('/images', express.static(path.join(__dirname.replace("src", ""), 'public', 'images')));

app.use("/api/upload", upload);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
