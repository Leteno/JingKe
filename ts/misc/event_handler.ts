import { ClickEvent, PressEvent } from "./event";
import { timestamp } from "./time";


export default class EventHandler {
  static LONGPRESS_TIME = 500;
  static CONTINUE_PRESS_TIME = 50;
  private onclickHandler: (event:ClickEvent) => boolean;
  private onpressHandler: (event:PressEvent) => boolean;

  private startTime: number;
  private pointDownX: number;
  private pointDownY: number;
  private timeoutId: number;
  private intervalId: number;

  constructor() {
    this.onclickHandler = undefined;
    this.onpressHandler = undefined;
    this.startTime = 0;
  }

  bind(widget: HTMLElement) {
    let that: EventHandler = this;
    widget.onpointerdown = ((event) => {
      that.onpointerdown(event.x, event.y);
      event.preventDefault();
    });
    widget.onpointerup = ((event) => {
      that.onpointerup(event.x, event.y);
      event.preventDefault();
    });
    widget.onpointermove = ((event) => {
      that.onpointermove(event.x, event.y);
      event.preventDefault();
    });
  }

  bindOnClickHandler(fn: (event:ClickEvent)=>boolean) {
    this.onclickHandler = fn;
  }

  bindOnPressHandler(fn: (event:PressEvent)=>boolean) {
    this.onpressHandler = fn;
  }

  onpointerdown(x: number, y: number) {
    this.stopTimeout();
    this.startTime = timestamp();
    this.pointDownX = x;
    this.pointDownY = y;
    this.timeoutId = window.setTimeout(
      (() => {
        let fn = () => {
          let overlap = timestamp() - this.startTime;
          this.sendPressEvent(x, y, overlap);
        }
        this.intervalId = window.setInterval(
          () => {
            fn();
          },
          EventHandler.CONTINUE_PRESS_TIME
        );
        fn();
      }).bind(this),
      EventHandler.LONGPRESS_TIME
    )
  }
  onpointerup(x: number, y: number) {
    this.stopTimeout();
    if (EventHandler.positionChanged(
        x, y, this.pointDownX, this.pointDownY)) {
      return;
    }
    let overlap = timestamp() - this.startTime;
    if (overlap >= EventHandler.LONGPRESS_TIME) {
      this.sendPressEvent(x, y, overlap);
    } else {
      this.sendClickEvent(x, y);
    }
  }
  onpointermove(x: number, y: number) {
    if (EventHandler.positionChanged(
      x, y,
      this.pointDownX, this.pointDownY)) {
      this.stopTimeout();
    }
  }

  private stopTimeout() {
    if (this.timeoutId > 0) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = -1;
    }
    if (this.intervalId > 0) {
      window.clearInterval(this.intervalId);
      this.intervalId = -1;
    }
  }

  private sendClickEvent(x: number, y: number) {
    if (this.onclickHandler) {
      this.onclickHandler(new ClickEvent(
        Math.floor(x), Math.floor(y)
      ));
    }
  }

  private sendPressEvent(x: number, y: number, time: number) {
    if (this.onpressHandler) {
      this.onpressHandler(new PressEvent(
        Math.floor(x), Math.floor(y)
      ))
    }
  }

  static positionChanged(
    x1: number, y1: number,
    x2: number, y2: number):boolean {
    let error = 10;
    return Math.abs(x1 - x2) >= error ||
      Math.abs(y1 - y2) >= error;
  }
}