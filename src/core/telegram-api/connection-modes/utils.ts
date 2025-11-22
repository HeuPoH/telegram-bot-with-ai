export function shouldStopPermanently(status: number) {
  return status === 401 || status === 404 ? true : false;
}
