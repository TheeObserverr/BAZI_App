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
