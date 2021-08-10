import { BindableData } from "./bindable_data";


export enum ABILITY {
  LOYAL = 0, // 侠义
  ATTACK = 1, // 勇武
  INTELIGENCE = 2, // 智慧
  TRUST = 3, // 信誉
}

export class Character extends BindableData {
  name: string;
  imageSrc: string;
  abilities: Array<number>;
  specials: Array<string>;

  constructor() {
    super();
    this.abilities = new Array<number>();
    this.specials = new Array<string>();

    // Abilities
    this.abilities[ABILITY.ATTACK] = 0;
    this.abilities[ABILITY.INTELIGENCE] = 0;
    this.abilities[ABILITY.LOYAL] = 0;
    this.abilities[ABILITY.TRUST] = 0;
  }
}