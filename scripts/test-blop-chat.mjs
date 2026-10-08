import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });

try {
  const { BLOP_CONTEXT } = await server.ssrLoadModule('/src/data/blop.ts');
  const { BlopRequestError, sendBlopMessage, trimChatHistory } = await server.ssrLoadModule('/src/services/blop.ts');

  assert.match(BLOP_CONTEXT, /PGCE[^.]*currently in progress/i);
  assert.doesNotMatch(BLOP_CONTEXT, /C&C|Wedding/i);

  const longHistory = Array.from({ length: 12 }, (_, index) => ({
    role: index % 2 ? 'model' : 'user',
    parts: [{ text: `Message ${index}` }],
  }));
  assert.equal(trimChatHistory(longHistory).length, 10);
  assert.equal(trimChatHistory(longHistory)[0].parts[0].text, 'Message 2');

  let capturedBody;
  const response = await sendBlopMessage({
    endpoint: 'https://example.test/api/chat',
    query: 'What is Ruan studying?',
    context: BLOP_CONTEXT,
    history: longHistory,
    maxAttempts: 1,
    fetcher: async (url, options) => {
      assert.equal(url, 'https://example.test/api/chat');
      assert.equal(options?.method, 'POST');
      assert.deepEqual(options?.headers, { 'Content-Type': 'application/json' });
      capturedBody = JSON.parse(options?.body);
      return new Response(JSON.stringify({ text: 'His PGCE is currently in progress.' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    },
  });
  assert.equal(response, 'His PGCE is currently in progress.');
  assert.equal(capturedBody.botName, 'Blop');
  assert.equal(capturedBody.businessName, "Ruan Coetzee's Portfolio");
  assert.equal(capturedBody.history.length, 10);
  assert.equal(capturedBody.context, BLOP_CONTEXT);

  let attempts = 0;
  const delays = [];
  const retryResponse = await sendBlopMessage({
    endpoint: 'https://example.test/api/chat',
    query: 'Retry safely',
    context: BLOP_CONTEXT,
    history: [],
    maxAttempts: 3,
    wait: async (milliseconds) => { delays.push(milliseconds); },
    fetcher: async () => {
      attempts += 1;
      if (attempts < 3) return new Response('Busy', { status: 429 });
      return new Response(JSON.stringify({ text: 'Ready now.' }));
    },
  });
  assert.equal(retryResponse, 'Ready now.');
  assert.deepEqual(delays, [2_000, 4_000]);

  await assert.rejects(
    sendBlopMessage({ endpoint: '', query: 'Hello', context: BLOP_CONTEXT, history: [] }),
    (error) => error instanceof BlopRequestError && error.kind === 'configuration',
  );
  await assert.rejects(
    sendBlopMessage({
      endpoint: 'https://example.test/api/chat', query: 'Hello', context: BLOP_CONTEXT, history: [], maxAttempts: 1,
      fetcher: async () => new Response(JSON.stringify({ nope: true })),
    }),
    (error) => error instanceof BlopRequestError && error.kind === 'invalid-response',
  );

  console.log('Blop tests passed with mocked API responses; no live AI requests were sent.');
} finally {
  await server.close();
}
