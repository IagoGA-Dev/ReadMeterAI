import confirmMeasure from "../controllers/confirmController";
import Router, { Request, Response } from "express";
import { body } from "express-validator";

const validateConfirm = [
    body("measure_uuid").isString().notEmpty(),
    body("confirm_value").isBoolean().notEmpty()
];

const router = Router();

router.patch("/", validateConfirm, (req: Request, res: Response) => confirmMeasure(req, res));

export default router;