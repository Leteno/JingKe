import NumberLinearAnimator from "./number-linear-animator";

/**
 * You could:
 * let timeout = new Timeout(2000);
 * timeout.onStop = () => {
 *   // The code I want to run when timeout
 * }
 * timeout.update(dt);
 */
export default class Timeout extends NumberLinearAnimator {
  constructor(timeout: number) {
    super(0, timeout, timeout);
  }
}