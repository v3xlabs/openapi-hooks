export class ApiError extends Error {
  static fromResponse(response: Response, data?: unknown) {
    return new ApiError(
      response.statusText || `HTTP ${response.status}`,
      response.status,
      response,
      data,
    );
  }

  static fromNetworkError(error: Error) {
    return new ApiError(
      `Network error: ${error.message}`,
      0,
      undefined,
      undefined,
    );
  }

  constructor(
    message: string,
    public status: number,
    public response?: Response,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
