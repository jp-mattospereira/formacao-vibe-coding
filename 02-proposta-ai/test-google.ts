import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const models = [
    "gemini-flash-latest",
    "gemini-pro-latest",
    "gemini-3.5-flash",
    "gemini-3.1-pro-preview",
    "models/gemini-flash-latest",
    "models/gemini-3-flash-preview"
  ];
  for (const m of models) {
    try {
      const { text } = await generateText({
        model: google(m),
        prompt: "Hello",
      });
      console.log(`Success with ${m}:`, text);
    } catch (error: any) {
      console.error(`Error with ${m}:`, error.message);
    }
  }
}

main();
