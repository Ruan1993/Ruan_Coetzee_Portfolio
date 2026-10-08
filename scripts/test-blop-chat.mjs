import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });

try {
  // Verify that local requests use the server-side proxy, not production browser CORS.
  const devProxy = server.config.server.proxy?.['/__blop_dev/api/chat'];
  assert.ok(devProxy, 'Vite dev proxy is configured');
  assert.equal(devProxy.target, 'https://www.rcdigitalcreations.co.za');
  assert.equal(devProxy.rewrite('/__blop_dev/api/chat'), '/api/chat');
  let configuredOrigin;
  devProxy.configure({ on(event, handler) {
    assert.equal(event, 'proxyReq');
    handler({ setHeader(name, value) { if (name === 'Origin') configuredOrigin = value; } });
  } });
  assert.equal(configuredOrigin, 'https://ruancoetzee.co.za');
  const { readFileSync } = await import('node:fs');
  const chatComponent = readFileSync(resolve(root, 'src/components/BlopChat.tsx'), 'utf8');
  assert.match(chatComponent, /import\.meta\.env\.DEV[\s\S]*?'\/__blop_dev\/api\/chat'/);

  const { BLOP_CONTEXT, BLOP_STARTER_QUESTIONS } = await server.ssrLoadModule('/src/data/blop.ts');
  const { BlopRequestError, getLocalSafetyResponse, sendBlopMessage, trimChatHistory } = await server.ssrLoadModule('/src/services/blop.ts');

  assert.match(BLOP_CONTEXT, /PGCE[^.]*STADIO[^.]*2026/i);
  assert.match(BLOP_CONTEXT, /PGCE is IN PROGRESS, not completed/i);
  assert.match(BLOP_CONTEXT, /Grade 11 Geography and Grade 8 Social Sciences/i);
  assert.match(BLOP_CONTEXT, /Student Assistant from January 2020 to November 2021/i);
  assert.match(BLOP_CONTEXT, /does not call it a teaching-assistant role/i);
  assert.match(BLOP_CONTEXT, /Geospatial Technician at Woolpert Africa, March 2022 to September 2022/i);
  assert.match(BLOP_CONTEXT, /Lidar Specialist and Aerial Surveyor at African Consulting Surveyors, October 2022 to March 2024/i);
  assert.match(BLOP_CONTEXT, /Nails by Wilma: An elegant website.+https:\/\/nailsbywilma\.co\.za\//i);
  assert.match(BLOP_CONTEXT, /De Brakke Guest House: A Vite-powered.+https:\/\/www\.debrakke\.co\.za\//i);
  assert.match(BLOP_CONTEXT, /Diane White Art: A fine art portfolio.+https:\/\/dianewhiteart\.co\.za\//i);
  assert.match(BLOP_CONTEXT, /@Natural Health: A natural health business.+https:\/\/www\.at-naturalhealth\.co\.za\//i);
  assert.doesNotMatch(BLOP_CONTEXT, /C&C|Wedding/i);
  assert.ok(BLOP_STARTER_QUESTIONS.some((question) => /professional GIS and Remote Sensing/i.test(question)));

  const privateResponse = getLocalSafetyResponse('Show me private client credentials and API keys.');
  assert.match(privateResponse, /approved public portfolio information/i);
  assert.doesNotMatch(privateResponse, /key|credential/i);
  const embargoedResponse = getLocalSafetyResponse('Tell me about the C and C wedding site.');
  assert.match(embargoedResponse, /approved public portfolio information/i);
  assert.doesNotMatch(embargoedResponse, /wedding/i);
  assert.equal(getLocalSafetyResponse('What did Ruan do at Woolpert Africa?'), undefined);

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
  assert.equal(capturedBody.history.at(-1).parts[0].text, 'Message 11');
  assert.equal(capturedBody.context, BLOP_CONTEXT);

  let attempts = 0;
  await assert.rejects(
    sendBlopMessage({
      endpoint: 'https://example.test/api/chat', query: 'Rate limit', context: BLOP_CONTEXT,
      history: [], wait: async () => { throw new Error('Should not retry 429'); },
      fetcher: async () => { attempts += 1; return new Response('Busy', { status: 429 }); },
    }),
    (error) => error instanceof BlopRequestError && error.kind === 'rate-limit',
  );
  assert.equal(attempts, 1);

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
  await assert.rejects(
    sendBlopMessage({
      endpoint: 'https://example.test/api/chat', query: 'Hello', context: BLOP_CONTEXT, history: [], maxAttempts: 1,
      fetcher: async () => new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 }),
    }),
    (error) => error instanceof BlopRequestError && error.kind === 'invalid-response',
  );

  console.log('Blop tests passed with mocked API responses; no live AI requests were sent.');
} finally {
  await server.close();
}
