export class StatusResponse<T> {
  constructor(
    private readonly statusCode: number,
    private readonly body: T | string,
  ) {}

  static buildResponse({ statusCode, body }) {
    const newResponse = new StatusResponse(statusCode, body);
    return newResponse.toResponse();
  }

  private toResponse() {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(this.body),
    };
  }
}
