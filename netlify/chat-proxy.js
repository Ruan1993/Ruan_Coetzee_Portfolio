// netlify/chat-proxy.js

// 1. CommonJS require for dependency
const { GoogleGenAI } = require("@google/genai");

// The GOOGLE_GEMINI_API_KEY environment variable is injected here securely
const ai = new GoogleGenAI(process.env.GOOGLE_GEMINI_API_KEY); 

// 2. Function definition without the 'export' keyword
async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { query, websiteContent } = JSON.parse(event.body);

        const systemPrompt = `
            You are Bloop, a helpful and concise AI assistant.
            Your primary goal is to answer user questions using ONLY the content provided in the 'CONTEXT' section below.
            Do not use any external knowledge.
            If the CONTEXT does not contain the necessary information to answer the question, you MUST respond only with:
            "I'm sorry, I couldn't find information about that specific topic in the provided website content. Please try rephrasing your question or check the website directly."
            
            Keep your answers brief, friendly, and directly related to the user's query.

            CONTEXT:
            ---
            ${websiteContent}
            ---
        `;

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{
                role: "user",
                parts: [
                    { text: systemPrompt },
                    { text: "Question: " + query }
                ]
            }],
            config: {
                temperature: 0.2,
                maxOutputTokens: 250
            }
        });
        
        const aiResponseText = response.text;

        return {
            statusCode: 200,
            body: JSON.stringify({ text: aiResponseText }),
        };

    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error or API failure." }),
        };
    }
}

// 3. CommonJS module export
module.exports = { handler };