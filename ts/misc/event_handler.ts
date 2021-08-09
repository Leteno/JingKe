import { ClickEvent } from "./event";


export default class EventHandler {
  private onclickHandler: (event:ClickEvent) => boolean;

  constructor() {
  }
  bind(widget: HTMLElement) {
    widget.onpointerdown = this.onpointerdown.bind(this);
    widget.onpointerup = this.onpointerup.bind(this);
    widget.onpointermove = this.onpointermove.bind(this);
  }

  bindOnClickHandler(fn: (event:ClickEvent)=>boolean) {
    this.onclickHandler = fn;
  }

  onpointerdown(event: PointerEvent) {
    event.preventDefault();
  }
  onpointerup(event: PointerEvent) {
    if (this.onclickHandler) {
      this.onclickHandler(new ClickEvent(
        event.x, event.y
      ));
    }
    event.preventDefault();
  }
  onpointermove(event: PointerEvent) {
    event.preventDefault();
  }
}