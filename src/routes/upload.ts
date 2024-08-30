import { uploadFile } from "../controllers/uploadController";
import Router from "express";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = Router();

const validateUpload = [
  body("image").isBase64().notEmpty(),
  body("customer_code").isString().notEmpty(),
  body("measure_datetime").isISO8601(),
  body("measure_type").isIn(["WATER", "GAS"]),
];

router.post("/", validateUpload, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  uploadFile(req, res);
});

export default router;
