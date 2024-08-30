import express from "express";
import upload from "./routes/upload";
import list from "./routes/list";
import confirm from "./routes/confirm";
import dotenv from "dotenv";
import initDB from "./db";
import path from "path";

dotenv.config();

initDB();
const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use('/images', express.static(path.join(__dirname.replace("src", ""), 'public', 'images')));

app.use("/upload", upload);
app.use("/confirm", confirm);
app.use(list)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
