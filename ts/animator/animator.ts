
export default interface Animator<T> {

  // return: the rest of dt if end meet.
  update(dt: number): number

  getVal() : T
  onValChange(val: T)
  isStop() : boolean
  onStop()
}