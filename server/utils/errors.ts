type ValueError<T> = [T, Error]

export async function HandleError<T>(prom: Promise<T>) {
  return await prom.catch((err) => [null, err]).then((value) => [value, null]) as ValueError<T>
}