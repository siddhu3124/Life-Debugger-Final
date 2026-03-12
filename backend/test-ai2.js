import "dotenv/config";
import { analyzeLifeProblem } from "./services/aiService.js";

const run = async () => {
    try {
        const result = await analyzeLifeProblem("I can't sleep at night because I am stressed.", "Health", "Siddhu");
        console.log("Success:", result);
    } catch (err) {
        console.error("Caught error:", err);
    }
};

run();
