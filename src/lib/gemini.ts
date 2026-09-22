interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
}

function isRetryableStatus(status: unknown): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

/**
 * Retries transient Gemini API failures (rate limits, brief 5xx, network
 * errors) with exponential backoff. Non-retryable errors (bad request,
 * missing/invalid API key, etc.) fail immediately.
 */
export async function withRetry<T>(fn: () => Promise<T>, { retries = 2, baseDelayMs = 600 }: RetryOptions = {}): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: unknown })?.status;
      const retryable = status === undefined || isRetryableStatus(status);
      if (!retryable || attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
    }
  }
  throw lastErr;
}

/** Parses model output as JSON, retrying the generation once on a parse failure. */
export async function generateAndParseJSON<T>(generate: () => Promise<string>): Promise<T> {
  try {
    return JSON.parse(await withRetry(generate)) as T;
  } catch {
    return JSON.parse(await withRetry(generate)) as T;
  }
}

/** Reads GEMINI_API_KEY as a comma-separated list of one or more keys. */
export function getApiKeys(): string[] {
  return (process.env.GEMINI_API_KEY ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/**
 * Tries `attempt` with each key in order (each attempt already has its own
 * internal retry logic — see withRetry/generateAndParseJSON), falling
 * through to the next key only on quota/permission-style failures (429,
 * 403). Any other error fails immediately without burning further keys.
 */
export async function withKeyRotation<T>(keys: string[], attempt: (apiKey: string) => Promise<T>): Promise<T> {
  if (keys.length === 0) throw new Error("No API keys configured");
  let lastErr: unknown;
  for (const key of keys) {
    try {
      return await attempt(key);
    } catch (err) {
      lastErr = err;
      const status = (err as { status?: unknown })?.status;
      if (status !== 429 && status !== 403) throw err;
    }
  }
  throw lastErr;
}
