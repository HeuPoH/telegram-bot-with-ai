export function shouldStopPermanently(status: number) {
  return status === 401 ? true : false;
}
