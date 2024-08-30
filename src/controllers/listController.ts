import { Request, Response } from "express";
import Measure from "../models/measure.model";

interface MeasureList {
    measure_uuid: string;
    measure_datetime: Date;
    measure_type: string;
    has_confirmed: boolean;
    image_url: string;
}

interface MeasureListResponse {
    customer_code: string;
    measures: MeasureList[]
}

const getMeasureList = async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    let response = {
        customer_code,
        measures: []
    } as MeasureListResponse;

    // Build the query object
    let query: any = { customer_code };

    // Validate and add measure_type to query if provided
    if (measure_type) {
        const validMeasureTypes = ["WATER", "GAS"];
        const measureTypeUpper = (measure_type as string).toUpperCase();
        if (validMeasureTypes.includes(measureTypeUpper)) {
            query.measure_type = measureTypeUpper;
        } else {
            res.status(400).json({
                error_code: "INVALID_MEASURE_TYPE",
                error_description: "Tipo de medida inválido. Deve ser 'WATER' ou 'GAS'."
            });
            return;
        }
    }

    const measures = await Measure.find(query);

    if (!measures || measures.length === 0) {
        res.status(404).json({
            error_code: "MEASURES_NOT_FOUND",
            error_description: "Nenhuma leitura encontrada"
        });
        return;
    }

    measures.forEach((measure) => { 
        response.measures.push({
            measure_uuid: measure.measure_uuid,
            measure_datetime: new Date(measure.measure_datetime),
            measure_type: measure.measure_type,
            has_confirmed: true,
            image_url: measure.image_url
        });
    });

    res.status(200).json(response);
}

export { getMeasureList };