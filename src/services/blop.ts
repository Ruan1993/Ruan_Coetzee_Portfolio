import type { ChatHistoryItem, ChatRequest } from '../types/chat';

export const BLOP_HISTORY_LIMIT = 10;
export const BLOP_MAX_ATTEMPTS = 2;
export const BLOP_REQUEST_TIMEOUT_MS = 20_000;

interface BlopApiResponse {
  text?: unknown;
  error?: unknown;
}

export class BlopRequestError extends Error {
  constructor(
    message: string,
    public readonly kind: 'configuration' | 'rate-limit' | 'timeout' | 'server' | 'network' | 'invalid-response',
  ) {
    super(message);
    this.name = 'BlopRequestError';
  }
}

export interface SendBlopMessageOptions {
  endpoint: string;
  query: string;
  context: string;
  history: readonly ChatHistoryItem[];
  fetcher?: typeof fetch;
  wait?: (milliseconds: number) => Promise<void>;
  maxAttempts?: number;
  timeoutMs?: number;
}

function waitFor(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

function errorForStatus(status: number) {
  if (status === 429) {
    return new BlopRequestError('Blop is receiving lots of questions. Please wait a moment and try again.', 'rate-limit');
  }
  if (status >= 500) {
    return new BlopRequestError('Blop is temporarily unavailable. Please try again in a moment.', 'server');
  }
  return new BlopRequestError('Blop could not process that request. Please try again.', 'invalid-response');
}

export function trimChatHistory(history: readonly ChatHistoryItem[]) {
  return history.slice(-BLOP_HISTORY_LIMIT);
}

const protectedInformationPattern = /\b(?:api\s*keys?|credentials?|passwords?|private\s+(?:client|project|information|details)|confidential|unreleased|system\s+(?:prompt|instructions?))\b/i;
const embargoedProjectPattern = /\bc\s*(?:&|and)\s*c\s+wedding\b/i;

export function getLocalSafetyResponse(query: string): string | undefined {
  if (protectedInformationPattern.test(query) || embargoedProjectPattern.test(query)) {
    return "I can only help with Ruan's approved public portfolio information. I can't provide private, confidential or unreleased details, but I can help with his teaching profile, qualifications, GIS experience or public projects.";
  }
  return undefined;
}

export async function sendBlopMessage({
  endpoint,
  query,
  context,
  history,
  fetcher = fetch,
  wait = waitFor,
  maxAttempts = BLOP_MAX_ATTEMPTS,
  timeoutMs = BLOP_REQUEST_TIMEOUT_MS,
}: SendBlopMessageOptions): Promise<string> {
  const normalizedEndpoint = endpoint.trim();
  if (!normalizedEndpoint) {
    throw new BlopRequestError('Blop is not configured yet.', 'configuration');
  }

  const request: ChatRequest = {
    query,
    context,
    history: trimChatHistory(history),
    botName: 'Blop',
    businessName: "Ruan Coetzee's Portfolio",
  };

  let lastError: BlopRequestError | undefined;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(normalizedEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) throw errorForStatus(response.status);
      const result = await response.json() as BlopApiResponse;
      if (typeof result.text !== 'string' || !result.text.trim()) {
        throw new BlopRequestError('Blop received an invalid response. Please try again.', 'invalid-response');
      }
      return result.text.trim();
    } catch (error) {
      if (error instanceof BlopRequestError) lastError = error;
      else if (error instanceof DOMException && error.name === 'AbortError') {
        lastError = new BlopRequestError('Blop took too long to respond. Please try again.', 'timeout');
      } else {
        lastError = new BlopRequestError('Blop could not connect. Please check your connection and try again.', 'network');
      }

      const retryable = ['timeout', 'server', 'network'].includes(lastError.kind);
      if (!retryable || attempt === maxAttempts - 1) throw lastError;
      await wait(2 ** (attempt + 1) * 1_000);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new BlopRequestError('Blop is temporarily unavailable.', 'network');
}
