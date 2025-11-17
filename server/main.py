import os
import time
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
try:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
except Exception:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings, OllamaEmbeddings
from langchain_community.chat_models import ChatOllama

app = Flask(__name__)

origins_env = os.environ.get("CORS_ORIGINS")
allow_origins = ["*"]
if origins_env:
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
CORS(app, origins=allow_origins, methods=["GET", "POST", "OPTIONS"], allow_headers=["*"])

INDEX_CACHE = {}
MAX_CONTEXT_LEN = int(os.environ.get("MAX_CONTEXT_LEN", "15000"))
INDEX_CACHE_SIZE = int(os.environ.get("INDEX_CACHE_SIZE", "3"))

def get_embeddings():
    google_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GOOGLE_GENAI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if google_key:
        os.environ["GOOGLE_API_KEY"] = google_key
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        em = os.environ.get("GOOGLE_EMBED_MODEL", "text-embedding-004")
        return GoogleGenerativeAIEmbeddings(model=em)
    base_url = os.environ.get("OLLAMA_BASE_URL")
    model = os.environ.get("OLLAMA_EMBEDDING_MODEL")
    if base_url and model:
        return OllamaEmbeddings(base_url=base_url, model=model)
    return HuggingFaceEmbeddings(model_name=os.environ.get("HF_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"))

def get_llm():
    temperature = float(os.environ.get("LLM_TEMPERATURE", "0.2"))
    google_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GOOGLE_GENAI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    if google_key:
        os.environ["GOOGLE_API_KEY"] = google_key
        gm = os.environ.get("GOOGLE_MODEL", "gemini-1.5-flash-latest")
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=gm, temperature=temperature)
    if openai_key:
        om = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=om, temperature=temperature)
    base_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
    model = os.environ.get("OLLAMA_MODEL", "llama3.1:8b")
    return ChatOllama(base_url=base_url, model=model, temperature=temperature)

def get_vectorstore(text):
    if len(text) > MAX_CONTEXT_LEN:
        text = text[:MAX_CONTEXT_LEN]
    h = hashlib.sha256(text.encode("utf-8")).hexdigest()
    if h in INDEX_CACHE:
        return INDEX_CACHE[h]["store"]
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = splitter.split_text(text)
    embeddings = get_embeddings()
    store = FAISS.from_texts(docs, embeddings)
    INDEX_CACHE[h] = {"store": store, "ts": time.time()}
    if len(INDEX_CACHE) > INDEX_CACHE_SIZE:
        oldest = sorted(INDEX_CACHE.items(), key=lambda x: x[1]["ts"])[0][0]
        INDEX_CACHE.pop(oldest, None)
    return store

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
    store = get_vectorstore(website_content)
    retriever = store.as_retriever(search_kwargs={"k": 4})
    docs = retriever.get_relevant_documents(query)
    context = "\n\n".join([d.page_content for d in docs])
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
        out = getattr(resp, "content", None)
        if not out:
            out = str(resp)
        return jsonify({"text": out})
    except Exception as e:
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