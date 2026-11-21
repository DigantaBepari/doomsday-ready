export interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Could not reach the Doomsday Ready API.", "NETWORK_ERROR", 0);
  }

  const payload = await response.json().catch(() => null) as unknown;
  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    throw new ApiError(
      errorPayload?.error?.message ?? "Something went wrong. Please try again.",
      errorPayload?.error?.code ?? "REQUEST_FAILED",
      response.status,
    );
  }
  return payload as T;
};
