import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

origins_env = os.environ.get("CORS_ORIGINS")
allow_origins = ["*"]
if origins_env:
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
CORS(app, origins=allow_origins, methods=["GET", "POST", "OPTIONS"], allow_headers=["*"])

MAX_CONTEXT_LEN = int(os.environ.get("MAX_CONTEXT_LEN", "6000"))

def get_embeddings():
    google_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GOOGLE_GENAI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    os.environ["GOOGLE_API_KEY"] = google_key or ""
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    em = os.environ.get("GOOGLE_EMBED_MODEL", "text-embedding-004")
    return GoogleGenerativeAIEmbeddings(model=em)

def get_llm():
    temperature = float(os.environ.get("LLM_TEMPERATURE", "0.2"))
    google_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GOOGLE_GENAI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    os.environ["GOOGLE_API_KEY"] = google_key or ""
    gm = os.environ.get("GOOGLE_MODEL", "gemini-2.5-flash")
    from langchain_google_genai import ChatGoogleGenerativeAI
    return ChatGoogleGenerativeAI(model=gm, temperature=temperature)

def get_context(text):
    if len(text) > MAX_CONTEXT_LEN:
        return text[:MAX_CONTEXT_LEN]
    return text

@app.post("/api/chat")
def chat():
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400
    query = (data or {}).get("query")
    website_content = (data or {}).get("websiteContent")
    style = (data or {}).get("style") or "concise"
    history = (data or {}).get("history") or []
    if not query or not website_content:
        return jsonify({"error": "Missing query or websiteContent"}), 400
    hist_lines = []
    for item in history[-6:]:
        role = item.get("role")
        content = item.get("content")
        if role and content:
            hist_lines.append(f"{role}: {content}")
    hist_text = "\n".join(hist_lines)
    style_text = "Concise, plain text." if (style != "detailed") else "Detailed, but still plain text; use short bullet points where helpful."
    context = get_context(website_content)
    prompt = (
        "You are the assistant for this website.\n"
        + f"Style: {style_text}\n"
        + "Use ONLY the provided CONTEXT. If the answer is not in CONTEXT, say so and ask a brief clarifying question.\n\n"
        + ("Previous conversation:\n" + hist_text + "\n\n" if hist_text else "")
        + "CONTEXT:\n" + context + "\n\n"
        + "USER QUESTION:\n" + query
    )
    try:
        llm = get_llm()
        resp = llm.invoke(prompt)
        content = getattr(resp, "content", None)
        if isinstance(content, list):
            try:
                parts = []
                for c in content:
                    t = c.get("text") if isinstance(c, dict) else None
                    if t:
                        parts.append(t)
                out = "\n".join(parts) if parts else str(content)
            except Exception:
                out = str(content)
        elif isinstance(content, str):
            out = content
        else:
            out = str(resp)
        return jsonify({"text": out})
    except Exception as e:
        try:
            print("LLM error:", str(e))
            print(traceback.format_exc())
        except Exception:
            pass
        return jsonify({"error": str(e) or "LLM error"}), 500

@app.post("/chat")
def chat_compat():
    return chat()

@app.get("/")
def root():
    return jsonify({"status": "ok"})

@app.get("/healthz")
def healthz():
    return jsonify({"status": "ok"})
@app.errorhandler(500)
def handle_500_error(e):
    try:
        print("Internal Server Error:", str(e))
    except Exception:
        pass
    return jsonify({"error": "internal_server_error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=bool(os.environ.get("FLASK_DEBUG")))