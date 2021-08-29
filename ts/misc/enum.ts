
export function getEnumCases<O extends object, K extends keyof O = keyof O>(obj: O): number[] {
  let ret = [];
  let keys = Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
  for (let k in keys) {
    ret.push(
      Number.parseInt(k)
    )
  }
  return ret;
}
