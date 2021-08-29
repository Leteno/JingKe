import Parcel from "../objects/parcel";
import { BindableAndSerializable, Serializable } from "../objects/serializable";
import { Character } from "./character";

export enum Event {
  FRE_BEGIN = 0,
  FRE_WHAT_LEARN = 1,
  FRE_WHAT_LOVE = 2,
  FRE_WHAT_CHARECTOR = 3,
}

export class Player extends BindableAndSerializable {
  version: number;
  chooses: Map<number, number>;
  character: Character;
  private static instance: Player;

  static CHOOSE_NOT_FOUND:number = -1;

  private constructor() {
    super();
    this.character = new Character();
    this.character.name = "荆棘";
    this.character.imageSrc = "res/copyleft/people_gainie.png";
    this.version = 1;
    this.chooses = new Map<number, number>();
  }

  static getInstance():Player {
    if (this.instance == null) {
      // init here.
      this.instance = new Player();
    }
    return this.instance;
  }

  saveChoose(event: Event, choose: number) {
    this.chooses.set(event, choose);
  }

  getChoose(event: Event): number {
    if (!this.chooses.has(event)) {
      return Player.CHOOSE_NOT_FOUND;
    }
    return this.chooses.get(event);
  }
  
  toParcel(): Parcel {
    let p = new Parcel();
    p.writeInt(this.version);
    // TODO support Map.
    return p;
  }
  fromParcel(p: Parcel) {
    this.version = p.readInt();
    // TODO support Map.
  }
}