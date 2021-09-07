import { BindableData } from "../data/bindable_data";

export class LogModel extends BindableData {
  static instance: LogModel = new LogModel();
  private content: Array<string>;
  constructor() {
    super();
    this.content = [];
  }
  pushText(t: string) {
    this.content.push(t);
    if (this.content.length > 10) {
      this.content = this.content.slice(1);
    }
  }
  getText() {
    let totalText = "";
    this.content.forEach(t => {
      totalText += t + "\n";
    });
    return totalText;
  }
}

export default class DebugLog {
  static d(text: string) {
    LogModel.instance.pushText(text);
  }
}