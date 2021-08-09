import { ClickEvent, PressEvent } from "./event";
import { timestamp } from "./time";


export default class EventHandler {
  static LONGPRESS_TIME = 1000;
  private onclickHandler: (event:ClickEvent) => boolean;
  private onpressHandler: (event:PressEvent) => boolean;

  private startTime: number;
  private startEvent: PointerEvent;
  private timeoutId: number;

  private hasSendLongPressEvent: boolean;

  constructor() {
    this.onclickHandler = undefined;
    this.onpressHandler = undefined;
    this.startTime = 0;
  }

  bind(widget: HTMLElement) {
    widget.onpointerdown = this.onpointerdown.bind(this);
    widget.onpointerup = this.onpointerup.bind(this);
    widget.onpointermove = this.onpointermove.bind(this);
  }

  bindOnClickHandler(fn: (event:ClickEvent)=>boolean) {
    this.onclickHandler = fn;
  }

  bindOnPressHandler(fn: (event:PressEvent)=>boolean) {
    this.onpressHandler = fn;
  }

  onpointerdown(event: PointerEvent) {
    this.stopTimeout();
    this.startTime = timestamp();
    this.startEvent = event;
    this.hasSendLongPressEvent = false;
    this.timeoutId = window.setTimeout(
      (() => {
        let overlap = timestamp() - this.startTime;
        if (!this.hasSendLongPressEvent) {
          this.sendPressEvent(event.x, event.y, overlap);
          this.hasSendLongPressEvent = true;
        }
      }).bind(this),
      EventHandler.LONGPRESS_TIME
    )
    event.preventDefault();
  }
  onpointerup(event: PointerEvent) {
    this.stopTimeout();
    if (EventHandler.positionChanged(event, this.startEvent)) {
      return;
    }
    let overlap = timestamp() - this.startTime;
    if (overlap >= EventHandler.LONGPRESS_TIME) {
      if (!this.hasSendLongPressEvent) {
        this.sendPressEvent(event.x, event.y, overlap);
        this.hasSendLongPressEvent = true;
      }
    } else {
      this.sendClickEvent(event.x, event.y);
    }
    event.preventDefault();
  }
  onpointermove(event: PointerEvent) {
    if (this.startEvent && EventHandler.positionChanged(event, this.startEvent)) {
      this.stopTimeout();
    }
    event.preventDefault();
  }

  private stopTimeout() {
    if (this.timeoutId > 0) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = -1;
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

  static positionChanged(event1: PointerEvent, event2: PointerEvent):boolean {
    let error = 10;
    return Math.abs(event1.x - event2.x) >= error ||
      Math.abs(event1.y - event2.y) >= error;
  }
}