import { ClickEvent, PressEvent, DragEvent } from "./event";

export default class EventHandler {
  static LONGPRESS_TIME = 500;
  static CONTINUE_PRESS_TIME = 50;
  private onclickHandler: (event:ClickEvent) => boolean;
  private onpressHandler: (event:PressEvent) => boolean;
  private ondragHandler: (event:DragEvent) => boolean;

  private startTime: number;
  private pointDownX: number;
  private pointDownY: number;
  private movingX: number;
  private movingY: number;
  private timeoutId: number;
  private intervalId: number;

  constructor() {
    this.onclickHandler = undefined;
    this.onpressHandler = undefined;
    this.startTime = 0;
  }

  bind(widget: HTMLElement) {
    let that: EventHandler = this;

    document.addEventListener(
      "touchstart",
      function (ev: TouchEvent) {
        that.onpointerdown(
          Math.round(ev.touches[0].pageX),
          Math.round(ev.touches[0].pageY)
        );
      }
    );

    document.addEventListener(
      "touchmove",
      function (ev: TouchEvent) {
        that.onpointermove(
          Math.round(ev.touches[0].pageX),
          Math.round(ev.touches[0].pageY)
        );
      }
    );

    document.addEventListener(
      "touchend",
      function (ev: TouchEvent) {
        that.onpointerup(
          that.movingX,
          that.movingY
        );
        ev.preventDefault();
      }
    );

    document.addEventListener(
      "mousedown",
      function (ev: MouseEvent) {
        that.onpointerdown(
          Math.round(ev.pageX),
          Math.round(ev.pageY)
        )
      }
    );

    document.addEventListener(
      "mousemove",
      function (ev: MouseEvent) {
        that.onpointermove(
          Math.round(ev.pageX),
          Math.round(ev.pageY)
        )
      }
    );

    document.addEventListener(
      "mouseup",
      function (ev: MouseEvent) {
        that.onpointerup(
          Math.round(ev.pageX),
          Math.round(ev.pageY)
        )
      }
    );
  }

  bindOnClickHandler(fn: (event:ClickEvent)=>boolean) {
    this.onclickHandler = fn;
  }

  bindOnPressHandler(fn: (event:PressEvent)=>boolean) {
    this.onpressHandler = fn;
  }

  bindOnDragHandler(fn: (event:DragEvent)=>boolean) {
    this.ondragHandler = fn;
  }

  onpointerdown(x: number, y: number) {
    this.stopTimeout();
    this.startTime = new Date().getTime();
    this.pointDownX = x;
    this.pointDownY = y;
    this.movingX = x;
    this.movingY = y;
    this.timeoutId = window.setTimeout(
      (() => {
        let fn = () => {
          let overlap = new Date().getTime() - this.startTime;
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
    let overlap = new Date().getTime() - this.startTime;
    if (overlap >= EventHandler.LONGPRESS_TIME) {
      this.sendPressEvent(x, y, overlap);
    } else {
      this.sendClickEvent(x, y);
    }
  }
  onpointermove(x: number, y: number) {
    this.movingX = x;
    this.movingY = y;
    if (EventHandler.positionChanged(
      x, y,
      this.pointDownX, this.pointDownY)) {
      this.stopTimeout();
    }
    let dragX = x - this.pointDownX;
    let dragY = y - this.pointDownY;
    this.sendDragEvent(
      this.pointDownX,
      this.pointDownY,
      dragX, dragY,
      this.startTime);
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

  private sendDragEvent(
    startX: number, startY: number,
    dragX: number, dragY: number,
    startTime: number) {
    if (this.ondragHandler) {
      this.ondragHandler(new DragEvent(
        startX, startY, dragX, dragY,
        startTime
      ));
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