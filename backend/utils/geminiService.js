const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const askGemini = async (prompt) => {
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      console.log(`Gemini attempt ${attempt + 1} failed`);
      if (error?.status === 503 && !isLastAttempt) {
        console.log("Gemini busy, retrying after delay...");
        await sleep(1000 * (attempt + 1)); 
        continue;
      }

      console.error("Gemini Error:", error);
      throw new Error("Gemini unavailable");
    }
  }
};

module.exports = { askGemini };