// import { GoogleGenAI } from "@google/genai";

// const MODEL_NAME = "gemini-2.5-flash";

// let client;

// // ✅ Singleton AI Client
// const getClient = () => {
//   if (client) return client;

//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     console.error("❌ GEMINI_API_KEY missing");
//     throw new Error("AI configuration error");
//   }

//   client = new GoogleGenAI({ apiKey });
//   return client;
// };


// // ✅ FINAL FUNCTION
// export const analyzeLifeProblem = async (problemText, category = "General") => {

//   if (!problemText || typeof problemText !== "string") {
//     throw new Error("Problem text is required");
//   }

//   const lowerText = problemText.toLowerCase();


//   // ✅ LIFE DEBUGGER INFO AUTO RESPONSE
//   if (
//    lowerText.includes("life debugger") ||           	lowerText.includes("who created life debugger") ||
//    lowerText.includes("about life debugger") ||
//    lowerText.includes("life debugger details") ||
//    lowerText.includes("life debugger information") ||
//    lowerText.includes("life debugger info") ||
//    lowerText.includes("life debugger background") ||
//    lowerText.includes("life debugger story") ||
//    lowerText.includes("about you") ||
//    lowerText.includes("who are you") ||
//    lowerText.includes("what is life debugger") ||
//    lowerText.includes("life debugger creator") ||
//    lowerText.includes("life debugger founder")
//   ) {

//     return `
// LIFE DEBUGGER INFORMATION

// Name:
// Life Debugger

// Born Date:
// 07 March 2026

// Created & Developed By:
// Siddhu Pappu

// About Life Debugger:
// Life Debugger is an AI-powered life problem-solving platform designed to help users analyze personal challenges and receive clear, practical solutions in a simple way.

// Purpose:
// The main goal of Life Debugger is to simplify decision-making by combining structured thinking with AI-powered guidance.

// Key Features:
// • AI-based life problem analysis  
// • Cause-focused solutions  
// • Actionable suggestions and steps  
// • Chat-style interactive interface  
// • Secure authentication system  

// Vision:
// Life Debugger aims to become a trusted digital companion that helps people think clearly, stay focused, and solve problems confidently.

// Thank you for using Life Debugger.
// `;
//   }


//   const ai = getClient();


//   // ✅ PERFECT PROMPT STRUCTURE
//   const prompt = `
// You are a practical life coach and problem-solving expert.

// Analyze the problem and respond STRICTLY in this format:

// CAUSE:
// Explain clearly why this problem may be happening.

// SOLUTION:
// Give a realistic and practical solution in a clear paragraph.

// SUGGESTIONS:
// Give 4 short actionable suggestions.

// ACTION STEPS:
// Give 4 small step-by-step actions the person can follow immediately.

// NEXT QUESTIONS:
// Suggest 4 short follow-up questions the user might ask next.

// RULES:
// • Be clear and simple  
// • Friendly tone  
// • No emojis  
// • Plain clean text  
// • Keep answers short but helpful  

// Category: ${category}

// Problem:
// ${problemText.trim()}
// `;

//   try {

//     const response = await ai.models.generateContent({
//       model: MODEL_NAME,
//       contents: prompt
//     });

//     const text =
//       typeof response.text === "function"
//         ? response.text()
//         : response.text;

//     if (!text || typeof text !== "string") {
//       throw new Error("Empty AI response");
//     }

//     return text.trim();

//   } catch (error) {

//     console.error("🔥 Gemini AI Error:", error);

//     throw new Error("AI response failed");

//   }
// };

import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash";

let client;

// ✅ Singleton Client
const getClient = () => {
  if (client) return client;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY missing");
    throw new Error("AI configuration error");
  }

  client = new GoogleGenAI({ apiKey });
  return client;
};


// ✅ FINAL FUNCTION
export const analyzeLifeProblem = async (
  problemText,
  category = "General",
  username = "User"
) => {

  if (!problemText || typeof problemText !== "string") {
    throw new Error("Problem text is required");
  }

  const text = problemText.toLowerCase().trim();


  // ✅ GREETING RESPONSE
  if (["hi", "hello", "hey", "hii", "helo"].includes(text)) {
    return `Hello ${username} 👋  
Welcome to Life Debugger 😊  

I'm here to help you.  
Tell me your problem and I will try to give you a clear and practical solution. 🚀`;
  }


  // ✅ THANK YOU RESPONSE
  if (
    text.includes("thank you") ||
    text.includes("thanks") ||
    text === "thankyou"
  ) {
    return `You're welcome ${username}😊  

I'm glad I could help.  
Hope you like using Life Debugger 🚀  

If you have any other problem, feel free to ask anytime 👍`;
  }

  const lowerText = problemText.toLowerCase();

  // ✅ LIFE DEBUGGER INFO RESPONSE
  if (
   lowerText.includes("life debugger") ||           	
   lowerText.includes("who created life debugger") ||
   lowerText.includes("about life debugger") ||
   lowerText.includes("life debugger details") ||
   lowerText.includes("life debugger information") ||
   lowerText.includes("life debugger info") ||
   lowerText.includes("life debugger background") ||
   lowerText.includes("life debugger story") ||
   lowerText.includes("about you") ||
   lowerText.includes("who are you") ||
   lowerText.includes("what is life debugger") ||
   lowerText.includes("life debugger creator") ||
   lowerText.includes("life debugger founder")
 
  ) {

    return `
LIFE DEBUGGER INFORMATION

Name:
Life Debugger

Born Date:
07 March 2026

Created & Developed By:
Siddhu Pappu

About Life Debugger:
Life Debugger is an AI-powered life problem-solving platform designed to help users analyze personal challenges and receive clear, practical solutions in a simple way.

Purpose:
The main goal of Life Debugger is to simplify decision-making by combining structured thinking with AI-powered guidance.

Key Features:
• AI-based life problem analysis  
• Cause-focused solutions  
• Actionable suggestions and steps  
• Chat-style interactive interface  
• Secure authentication system  

Vision:
Life Debugger aims to become a trusted digital companion that helps people think clearly, stay focused, and solve problems confidently.

Thank you for using Life Debugger 😊
`;
  }


  // ✅ NORMAL AI ANALYSIS
  const ai = getClient();

  const prompt = `
You are a practical life coach and problem-solving expert.

Analyze the problem and respond STRICTLY in this format:

CAUSE:
Explain clearly why this problem may be happening.

SOLUTION:
Give a realistic and practical solution in a clear paragraph.

SUGGESTIONS:
Give 4 short actionable suggestions.

ACTION STEPS:
Give 4 small step-by-step actions the person can follow immediately.

NEXT QUESTIONS:
Suggest 4 short follow-up questions the user might ask next.

RULES:
• Be clear and simple  
• Friendly tone  
• No emojis  
• Plain clean text  
• Keep answers short but helpful  

Category: ${category}

Problem:
${problemText.trim()}
`;

  try {

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    const output =
      typeof response.text === "function"
        ? response.text()
        : response.text;

    if (!output || typeof output !== "string") {
      throw new Error("Empty AI response");
    }

    return output.trim();

  } catch (error) {

    console.error("🔥 Gemini AI Error:", error);

    throw new Error("AI response failed");

  }
};