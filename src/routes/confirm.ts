import confirmMeasure from "../controllers/confirmController";
import Router, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const validateConfirm = [
  body("measure_uuid").isString().notEmpty(),
  body("confirm_value").isBoolean().notEmpty()
];

const router = Router();

router.patch("/", validateConfirm, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: errors.array()
    });
  }
  confirmMeasure(req, res)
});

export default router;