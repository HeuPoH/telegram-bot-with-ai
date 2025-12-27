export function extractBotIdFromToken(token: string) {
  const id = token.split(':')[0];
  if (!id) {
    console.error(`Token "${token}" has not the bot id`);
    return -1;
  }

  const idAsNumber = +id;
  if (Number.isNaN(idAsNumber)) {
    console.error(`Bot id "${id}" is not correct`);
    return -1;
  }

  return idAsNumber;
}
