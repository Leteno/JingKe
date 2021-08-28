
export class Clone {
  static clone (obj: Object) : Object {
    return JSON.parse(
      JSON.stringify(obj)
    );
  }
}