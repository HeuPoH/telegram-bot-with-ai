import type { ITelegramApiMethods } from './telegram-api-service.ts';

export class CustomTelegramResponseError extends Error {
  private endPoint: ITelegramApiMethods | undefined;

  constructor(
    message: string,
    private status: number,
  ) {
    super(message);
  }

  setEndPoint(endPoint: ITelegramApiMethods) {
    this.endPoint = endPoint;
  }

  getEndPoint() {
    return this.endPoint;
  }

  getStatus() {
    return this.status;
  }
}
