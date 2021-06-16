
export function timestamp() {
  return window.performance && window.performance.now ?
     window.performance.now() * 1000 :
     new Date().getTime();
}