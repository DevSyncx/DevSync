require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

(async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 👇 updated model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Hello Gemini!");
    console.log("✅ Gemini says:", result.response.text());
  } catch (err) {
    console.error("❌ Gemini test error:", err);
  }
})();
