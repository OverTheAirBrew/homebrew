export abstract class BaseError extends Error {
  public readonly httpCode: number;
  public readonly errorCode: string;

  constructor(message: string, opts: { httpCode: number; errorCode: string }) {
    super(message);

    this.httpCode = opts.httpCode;
    this.errorCode = opts.errorCode;
  }
}
