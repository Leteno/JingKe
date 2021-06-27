
export default class Dialogue {
  username: string;
  content: string;
  showAtLeft: boolean;

  // How many character per second.
  speed: number;

  constructor(
      username: string,
      content: string,
      showAtLeft: boolean=true,
      speed: number=20,
  ) {
    this.username = username;
    this.content = content;
    this.showAtLeft = showAtLeft;
    this.speed = speed;
  }
}