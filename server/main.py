import os
import json
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google import genai

app = FastAPI()

origins_env = os.environ.get("CORS_ORIGINS")
allow_origins = ["*"]
if origins_env:
    if origins_env.strip().startswith("["):
        try:
            allow_origins = json.loads(origins_env)
        except Exception:
            allow_origins = [origins_env]
    else:
        allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)

def get_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    query = data.get("query")
    website_content = data.get("websiteContent")
    if not query or not website_content:
        return JSONResponse({"error": "Missing query or websiteContent"}, status_code=400)
    client = get_client()
    if client is None:
        return JSONResponse({"error": "Missing GEMINI_API_KEY"}, status_code=500)
    prompt = (
        "You are Bloop. Use ONLY the CONTEXT.\n\n"
        + "CONTEXT:\n" + website_content + "\n\n"
        + "Question: " + query
    )
    try:
        resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        return JSONResponse({"text": resp.text})
    except Exception:
        return JSONResponse({"error": "AI generation failed"}, status_code=500)

@app.get("/")
async def root():
    return JSONResponse({"status": "ok"})

@app.get("/healthz")
async def healthz():
    return JSONResponse({"status": "ok"})