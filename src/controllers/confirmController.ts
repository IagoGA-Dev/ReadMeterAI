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
        measure_uuid: measure.measure_uuid,
        measure_datetime: new Date(measure.measure_datetime),
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url
    });
}

export default confirmMeasure;