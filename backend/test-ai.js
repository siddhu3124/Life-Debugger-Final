import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const run = async () => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Hello"
        });
        console.log("Success!");
        console.log(response.text);
    } catch (err) {
        console.error("Error:", err);
    }
};

run();
