
export default interface Animator<T> {
  update()
  getVal() : T
  isStop() : boolean
  onStop()
}