import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Measure from "../models/measure.model";
import fs from "fs";

// @desc Check for existing measures
const checkExistingMeasure = async (
  customer_code: string,
  measure_type: string,
  measure_datetime: string,
): Promise<boolean> => {
  const existingMeasure = await Measure.findOne({
    customer_code,
    measure_type,
    measure_datetime,
  });
  return !!existingMeasure;
}

// @desc Save image to disk and serve it
const saveAndServeImage = (
  image: string,
  measureUuid: string,
): string => {

  const imageBuffer = Buffer.from(image, "base64");

  const imagePath = `./public/images/${measureUuid}.png`;
  fs.writeFileSync(imagePath, imageBuffer);

  return `http://localhost:3000/images/${measureUuid}.png`;
}

// @desc Save measure to database
const saveMeasure = async (
  customer_code: string,
  measure_type: string,
  measure_datetime: string,
  measure_value: number,
  image_url: string,
  measure_uuid: string,
): Promise<void> => {
  const measure = new Measure({
    customer_code,
    measure_type,
    measure_datetime,
    measure_value,
    image_url,
    measure_uuid,
  });
  await measure.save();
}

// @desc Send image to Gemini API
const sendToGemini = async (
  image: string
): Promise<{ measure_value: number }> => {

  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    throw new Error("API key not found");
  }

  console.log("Sending image to Gemini API");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Read the meter and provide the value shown in the following JSON format: { value: <the predicted value> }. If the image is not clear, please return { value: 'unclear' }.\nExamples: { value: 1234 }, { value: 'unclear' }";

  const imageBuffer = {
    inlineData: {
      data: image,
      mimeType: "image/png",
    },
  };

  const response = await model.generateContent([prompt, imageBuffer]);
  const responseText = response.response.text();

  const measureValue = responseText.match(/value: (\d+)/)?.[1];
  if (!measureValue || isNaN(Number(measureValue))) {
    throw new Error("Unable to extract measure value from Gemini response");
  }

  return {
    measure_value: Number(measureValue),
  };

};

// @desc Uploads a file to the server
// @route POST /api/upload
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    const existingMeasure = await checkExistingMeasure(
      customer_code,
      measure_type,
      measure_datetime,
    );
    if (existingMeasure) {
      return res.status(409).json({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada",
      });
    }

    const geminiResponse = await sendToGemini(image);

    const measureUuid = uuidv4();
    const imageUrl = saveAndServeImage(image, measureUuid);

    await saveMeasure(
      customer_code,
      measure_type,
      measure_datetime,
      geminiResponse.measure_value,
      imageUrl,
      measureUuid,
    );

    res.status(200).json({
      image_url: imageUrl,
      measure_value: geminiResponse.measure_value,
      measure_uuid: measureUuid,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error_description: "Ocorreu um erro interno no servidor",
    });
  }
};
