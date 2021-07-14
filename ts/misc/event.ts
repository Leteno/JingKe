import Sprite from "../widgets/sprite";

export class ClickEvent {
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