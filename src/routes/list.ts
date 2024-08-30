import { getMeasureList } from "../controllers/listController";
import Router from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/:customer_code/list", (req: Request, res: Response) => getMeasureList(req, res));

export default router;
