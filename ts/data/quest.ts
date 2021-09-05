import parcel from "../objects/parcel";
import { Serializable } from "../objects/serializable";
import { QuestType } from "./quest_data";

// 任务
export default class Quest extends Serializable {
  type: QuestType;
  progress: Array<string>;
  done: boolean;
  constructor() {
    super();
    this.progress = [];
    this.done = false;
  }
  toParcel(p: parcel) {
    p.writeInt(this.type);
    p.writeStringArray(this.progress);
    p.writeInt(this.done? 1 : 0);
  }
  fromParcel(p: parcel) {
    this.type = p.readInt();
    this.progress = p.readStringArray();
    this.done = p.readInt() > 0;
  }
}