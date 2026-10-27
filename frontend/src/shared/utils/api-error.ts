type TFunction = (key: string) => string;

interface ApiErrorBody {
  message?: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export const API_ERROR_KEYS = {
  conflict: 'errors.api.conflict',
  notFound: 'errors.api.notFound',
  validation: 'errors.api.validation',
  generic: 'errors.api.generic',
} as const;

export type ApiErrorKey = keyof typeof API_ERROR_KEYS;

/** Backend messages that are too generic to show as-is; use translated fallbacks instead. */
const GENERIC_BACKEND_MESSAGES = new Set([
  'Internal server error',
  'Validation failed',
  'Database constraint violation',
]);

function getApiErrorBody(error: unknown): ApiErrorBody | undefined {
  return (error as { response?: { data?: ApiErrorBody } })?.response?.data;
}

function getStatusBasedMessage(
  status: number | undefined,
  t: TFunction,
  overrides: Partial<Record<ApiErrorKey, string>>,
): string {
  const keys = { ...API_ERROR_KEYS, ...overrides };

  switch (status) {
    case 409:
      return t(keys.conflict);
    case 404:
      return t(keys.notFound);
    case 400:
      return t(keys.validation);
    default:
      return t(keys.generic);
  }
}

/**
 * Prefer the backend's `message` when it is specific enough to show to users.
 * Falls back to translated status-based messages when the response has no
 * message or only a generic one (e.g. "Internal server error").
 */
export function getApiErrorMessage(
  error: unknown,
  t: TFunction,
  overrides: Partial<Record<ApiErrorKey, string>> = {},
): string {
  const body = getApiErrorBody(error);
  const backendMessage = body?.message?.trim();
  const status = body?.status ?? (error as { response?: { status?: number } })?.response?.status;

  if (backendMessage && !GENERIC_BACKEND_MESSAGES.has(backendMessage)) {
    return backendMessage;
  }

  return getStatusBasedMessage(status, t, overrides);
}
