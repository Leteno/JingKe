
export class Clone {
  static clone (obj: Object) : Object {
    let target = Object.create(obj);
    Object.assign(target, obj);
    return target;
  }
}