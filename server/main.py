from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google import genai

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"]
)

client = genai.Client()

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    query = data.get("query")
    website_content = data.get("websiteContent")
    if not query or not website_content:
        return JSONResponse({"error": "Missing query or websiteContent"}, status_code=400)
    prompt = (
        "You are Bloop. Use ONLY the CONTEXT.\n\n"
        + "CONTEXT:\n" + website_content + "\n\n"
        + "Question: " + query
    )
    resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    return JSONResponse({"text": resp.text})