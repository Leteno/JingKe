
export default interface Animator<T> {
  update(dt: number)
  getVal() : T
  onValChange(val: T)
  isStop() : boolean
  onStop()
}