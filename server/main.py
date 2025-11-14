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
    style = data.get("style")
    history = data.get("history") or []
    if not query or not website_content:
        return JSONResponse({"error": "Missing query or websiteContent"}, status_code=400)
    client = get_client()
    if client is None:
        return JSONResponse({"error": "Missing GEMINI_API_KEY"}, status_code=500)
    max_len_env = os.environ.get("MAX_CONTEXT_LEN")
    try:
        max_len = int(max_len_env) if max_len_env else 15000
    except Exception:
        max_len = 15000
    if len(website_content) > max_len:
        website_content = website_content[:max_len]
    hist_lines = []
    for item in history[-6:]:
        role = item.get("role")
        content = item.get("content")
        if role and content:
            hist_lines.append(f"{role}: {content}")
    hist_text = "\n".join(hist_lines)
    style_text = "Concise, plain text." if (style != "detailed") else "Detailed, but still plain text; use short bullet points where helpful."
    prompt = (
        "You are the assistant for Ruan Coetzee's website.\n"
        + f"Style: {style_text}\n"
        + "Use ONLY the provided CONTEXT. If the answer is not in CONTEXT, say so and ask a brief clarifying question.\n\n"
        + ("Previous conversation:\n" + hist_text + "\n\n" if hist_text else "")
        + "CONTEXT:\n" + website_content + "\n\n"
        + "USER QUESTION:\n" + query
    )
    try:
        resp = client.models.generate_content(model="gemini-1.5-flash-latest", contents=prompt)
        return JSONResponse({"text": resp.text})
    except Exception:
        return JSONResponse({"error": "AI generation failed"}, status_code=500)

@app.get("/")
async def root():
    return JSONResponse({"status": "ok"})

@app.get("/healthz")
async def healthz():
    return JSONResponse({"status": "ok"})