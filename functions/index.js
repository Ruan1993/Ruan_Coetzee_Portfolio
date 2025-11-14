const { onRequest } = require('firebase-functions/v2/https');
const genai = require('@google/genai');
const GoogleGenAI = genai.GoogleGenAI;
const { defineString } = require('firebase-functions/params');
const GEMINI_API_KEY_PARAM = defineString('GEMINI_API_KEY');

const ALLOWED = ['*'];

exports.chatProxy = onRequest({ region: 'us-central1' }, async (req, res) => {
  const origin = req.headers.origin || '';
  const allowAny = ALLOWED.includes('*');
  if (!allowAny && !ALLOWED.includes(origin)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  res.set('Access-Control-Allow-Origin', origin || '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Vary', 'Origin');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    if (req.query && req.query.debug === '1') {
      res.json({ headers: req.headers, body: req.body });
      return;
    }
    const { query, websiteContent } = req.body || {};
    if (!query || !websiteContent) {
      res.status(400).json({ error: 'Missing query or websiteContent' });
      return;
    }
    const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY_PARAM.value();
    if (!apiKey) {
      res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
      return;
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are Bloop, an assistant for this site. Use ONLY the CONTEXT.\n\nCONTEXT:\n${websiteContent}\n\nQuestion: ${query}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      config: { temperature: 0.2, maxOutputTokens: 250 }
    });
    res.json({ text: response.text });
  } catch (e) {
    console.error('chatProxy error:', e);
    res.status(500).json({ error: e ? String(e) : 'Server error' });
  }
});