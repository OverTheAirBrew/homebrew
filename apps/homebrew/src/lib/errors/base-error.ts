export abstract class BaseError extends Error {
  constructor(
    public httpCode: number,
    public code: string,
    public name: string,
    public message: string,
  ) {
    super(message);
  }
}
