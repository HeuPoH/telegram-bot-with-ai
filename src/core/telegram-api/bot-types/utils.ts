export type AtMostOne<T, Keys extends keyof T = keyof T> = {
  [K in Keys]: { [P in K]: T[K] } & Partial<Record<Exclude<Keys, K>, never>>;
}[Keys];
