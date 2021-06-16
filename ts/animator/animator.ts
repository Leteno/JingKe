
export default interface Animator<T> {
  update(dt: number)
  getVal() : T
  isStop() : boolean
  onStop()
}