
import {Text} from "../widgets/textview"
import { Character } from "./character";

export default class Dialogue {
  character: Character;
  content: Text;
  showAtLeft: boolean;

  // How many character per second.
  speed: number;

  constructor(
      character: Character,
      content: Text,
      showAtLeft: boolean=true,
      speed: number=20,
  ) {
    this.character = character;
    this.content = content;
    this.showAtLeft = showAtLeft;
    this.speed = speed;
  }
}