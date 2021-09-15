
// 状态机
enum State {
  Normal,
  NormalEndswithLetter,
  PatternMode,
}

export class DrawItem {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  isPattern: boolean;
  constructor(
    x: number, y: number,
    width: number, height: number,
    text:string, isPattern: boolean=false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.isPattern = isPattern;
  }
}

export default class TextViewStateMachine {

  private result: Array<DrawItem> = []
  output(): Array<DrawItem> {
    return this.result;
  }

  parse(
    text: string,
    lineHeight: number,
    maxWidth: number,
    chineseLetterSize: number,
    englishLetterSize: number) {

    let x = 0, y =0;
    let currentWidth = 0;
    let textStartIndex = 0;

    let widthWhenletterStart = 0;
    let letterTextStartIndex = 0;

    let state:State = State.Normal;
    for (let i = 0; i < text.length; i++) {
      let ch = text.charAt(i);
      let chCode = text.charCodeAt(i);
      let isChinese = chCode > 512;
      let chSize = isChinese ? chineseLetterSize : englishLetterSize;
      switch(state) {
        case State.Normal:
          if (currentWidth + chSize > maxWidth) {
            // output and new line
            this.outputDrawItem(
              x, y,
              currentWidth, lineHeight,
              text.substr(textStartIndex, i - textStartIndex)
            );
            x = 0;
            y += lineHeight;
            currentWidth = 0;
            textStartIndex = i;
            // fall down on purpose, share the same new char logic.
          }
          if (!isChinese) {
            state = State.NormalEndswithLetter;
            widthWhenletterStart = currentWidth;
            letterTextStartIndex = i;
          }
          currentWidth += chSize;
          break;
        case State.NormalEndswithLetter:
          if (currentWidth + chSize > maxWidth) {
            if (isChinese || ch == ' ' || ch == ',' || ch == '.' || ch == '，' || ch == '。') {
              // current char could seperate English Letter as a word.
              // current line could treat as normal DrawItem
              this.outputDrawItem(
                x, y,
                currentWidth, lineHeight,
                text.substr(textStartIndex, i - textStartIndex)
              );
              x = 0;
              y += lineHeight;
              currentWidth = 0;
              textStartIndex = i;
            } else {
              // We should output DrawItem without letters at the end.
              // These letter should be in next time.
              this.outputDrawItem(
                x, y,
                widthWhenletterStart, lineHeight,
                text.substr(textStartIndex, letterTextStartIndex - textStartIndex)
              );
              x = 0;
              y += lineHeight;
              currentWidth = currentWidth - widthWhenletterStart;
              textStartIndex = letterTextStartIndex;
            }
          }
          if (isChinese || ch == ' ' || ch == ',' || ch == '.' || ch == '，' || ch == '。') {
            state = State.Normal;
          }
          currentWidth += chSize;
          break;
      }
    }
    // last one
    if (textStartIndex < text.length) {
      this.outputDrawItem(
        x, y,
        currentWidth, lineHeight,
        text.substr(textStartIndex, text.length - textStartIndex)
      );
    }
  }

  private outputDrawItem(
    x: number, y: number,
    width: number, height: number,
    text:string, isPattern: boolean=false) {
    let ret = new DrawItem(x, y, width, height, text, isPattern);
    this.result.push(ret);
  }
}