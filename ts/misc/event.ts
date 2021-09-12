import Sprite from "../widgets/sprite";

export interface SimpleEvent {
  x: number;
  y: number;
}

export class ClickEvent implements SimpleEvent {
  x: number;
  y: number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  static from(pEvent: PointerEvent): ClickEvent {
    return new ClickEvent(pEvent.offsetX, pEvent.offsetY);
  }

  // Suppose we have a clickEvent(100, 200)
  // And we have a panel(x:50, y:50) with viewA and viewB
  // After alignChildren, the return event would be (50, 150)
  // And viewA or viewB could just compare with its position
  static alignChildren(event: ClickEvent, view: Sprite): ClickEvent {
    let ret = new ClickEvent(event.x, event.y);
    ret.x -= view.x + view.padding.left;
    ret.y -= view.y + view.padding.top;
    return ret;
  }
}

export class PressEvent implements SimpleEvent {
  x: number;
  y: number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }

  static from(pEvent: PointerEvent): PressEvent {
    return new PressEvent(pEvent.offsetX, pEvent.offsetY);
  }

  // Suppose we have a PressEvent(100, 200)
  // And we have a panel(x:50, y:50) with viewA and viewB
  // After alignChildren, the return event would be (50, 150)
  // And viewA or viewB could just compare with its position
  static alignChildren(event: PressEvent, view: Sprite): PressEvent {
    let ret = new PressEvent(event.x, event.y);
    ret.x -= view.x + view.padding.left;
    ret.y -= view.y + view.padding.top;
    return ret;
  }
}

export class DragEvent implements SimpleEvent {
  // To know which view is responsible for it.
  x: number;
  y: number;
  // To know whether these dragEvent come from one.
  startTime: number;
  // dragOffset
  dragX: number;
  dragY: number;

  constructor(startX: number, startY: number,
    dragX: number, dragY: number, startTime: number) {
    this.x = startX;
    this.y = startY;
    this.dragX = dragX;
    this.dragY = dragY;
    this.startTime = startTime;
  }

  static alignChildren(event: DragEvent, view: Sprite): DragEvent {
    let ret = new DragEvent(
      event.x, event.y,
      event.dragX, event.dragY,
      event.startTime
    );
    ret.x -= view.x + view.padding.left;
    ret.y -= view.y + view.padding.top;
    return ret;
  }
}