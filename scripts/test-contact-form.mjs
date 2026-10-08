import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });

try {
  const {
    CONTACT_FROM_NAME,
    CONTACT_SUBJECT,
    WEB3FORMS_ENDPOINT,
    submitContactForm,
  } = await server.ssrLoadModule('/src/services/web3forms.ts');
  const values = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+27 12 345 6789',
    message: 'Automated test message',
  };

  let missingKeyFetchCalls = 0;
  const missingKeyResult = await submitContactForm(values, '', async () => {
    missingKeyFetchCalls += 1;
    return new Response();
  });
  assert.deepEqual(missingKeyResult, { success: false, message: 'The contact form is not configured yet.' });
  assert.equal(missingKeyFetchCalls, 0, 'Missing configuration must not make a network request.');

  let submittedBody;
  const successResult = await submitContactForm(values, 'public-test-placeholder', async (url, options) => {
    assert.equal(url, WEB3FORMS_ENDPOINT);
    assert.equal(options?.method, 'POST');
    assert.deepEqual(options?.headers, { Accept: 'application/json' });
    submittedBody = options?.body;
    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
  });
  assert.deepEqual(successResult, { success: true });
  assert.ok(submittedBody instanceof FormData);
  assert.equal(submittedBody.get('access_key'), 'public-test-placeholder');
  assert.equal(submittedBody.get('subject'), CONTACT_SUBJECT);
  assert.equal(submittedBody.get('from_name'), CONTACT_FROM_NAME);
  assert.equal(submittedBody.get('name'), values.name);
  assert.equal(submittedBody.get('email'), values.email);
  assert.equal(submittedBody.get('reply_to'), values.email);
  assert.equal(submittedBody.get('phone'), values.phone);
  assert.equal(submittedBody.get('message'), values.message);

  const providerError = await submitContactForm(values, 'public-test-placeholder', async () => (
    new Response(JSON.stringify({ success: false, message: 'Provider rejected the request.' }), { headers: { 'Content-Type': 'application/json' } })
  ));
  assert.deepEqual(providerError, { success: false, message: 'Provider rejected the request.' });

  await assert.rejects(
    submitContactForm(values, 'public-test-placeholder', async () => { throw new TypeError('Network unavailable'); }),
    /Network unavailable/,
  );

  console.log('Contact form tests passed without sending a real Web3Forms submission.');
} finally {
  await server.close();
}
