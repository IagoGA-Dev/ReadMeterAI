import { Request, Response } from "express";
import Measure from "../models/measure.model";

const confirmMeasure = async (req: Request, res: Response) => {
    const { measure_uuid, confirm_value } = req.body;

    const measure = await Measure.findOne({ measure_uuid });

    if (!measure) {
        res.status(404).json({
            error_code: "MEASURE_NOT_FOUND",
            error_description: "Medida não encontrada"
        });
        return;
    } else if (measure.has_confirmed) {
        res.status(409).json({
            error_code: "CONFIRMATION_DUPLICATE",
            error_description: "Medida já confirmada"
        });
        return;
    }

    measure.measure_value = confirm_value;
    measure.has_confirmed = true;

    await measure.save();

    res.status(200).json({
        success: true
    });
}

export default confirmMeasure;