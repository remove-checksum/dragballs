export function makeStruct<
  const Keys extends Array<string>,
  Buftype extends Uint32ArrayConstructor
>(keys: Keys, sizing: Buftype, length: number) {
  const source = Object.create(null);

  for (let key of keys) {
    source[key] = new sizing(length)
  }

  return source as Record<(typeof keys)[number], Uint32Array>;
}
