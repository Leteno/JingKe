
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
  startIndex: number;
  endIndex: number;
  isPattern: boolean;
  constructor(
    x: number, y: number,
    width: number, height: number,
    startIndex: number, endIndex: number,
    text:string, isPattern: boolean=false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.text = text;
    this.isPattern = isPattern;
  }
}

export default class TextViewStateMachine {
  maxWidth: number;
  maxHeight: number;

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
    let currentXOffset = 0;
    let textStartIndex = 0;

    let widthWhenletterStart = 0;
    let letterTextStartIndex = 0;

    let state:State = State.Normal;
    for (let i = 0; i < text.length; i++) {
      let ch = text.charAt(i);
      let chCode = text.charCodeAt(i);
      let isChinese = chCode > 512;
      let chSize = isChinese ? chineseLetterSize : englishLetterSize;

      if (ch == '\f') {
        // pattern is far beyond state ! Importance and code line.
        // output and new line
        this.outputDrawItem(
          x, y,
          currentXOffset - x, lineHeight,
          textStartIndex, i - 1,
          text.substr(textStartIndex, i - textStartIndex)
        );
        x = currentXOffset;
        // ignore \f
        textStartIndex = i + 1;
        // move to next state
        state = State.PatternMode;
        continue;
      }
      switch(state) {
        case State.Normal:
          if (currentXOffset + chSize > maxWidth || ch == '\n') {
            // output and new line
            this.outputDrawItem(
              x, y,
              currentXOffset - x, lineHeight,
              textStartIndex, i - 1,
              text.substr(textStartIndex, i - textStartIndex)
            );
            x = 0;
            y += lineHeight;
            currentXOffset = 0;
            textStartIndex = i;
            // fall down on purpose, share the same new char logic.
          }
          if (ch == '\n') {
            textStartIndex = i + 1;
            continue;
          }
          if (!isChinese) {
            state = State.NormalEndswithLetter;
            widthWhenletterStart = currentXOffset;
            letterTextStartIndex = i;
          }
          currentXOffset += chSize;
          break;
        case State.NormalEndswithLetter:
          if (currentXOffset + chSize > maxWidth || ch == '\n') {
            if (isChinese || ch == ' ' || ch == ',' || ch == '.' || ch == '，' || ch == '。' || ch == '\n') {
              // current char could seperate English Letter as a word.
              // current line could treat as normal DrawItem
              this.outputDrawItem(
                x, y,
                currentXOffset - x, lineHeight,
                textStartIndex, i - 1,
                text.substr(textStartIndex, i - textStartIndex)
              );
              x = 0;
              y += lineHeight;
              currentXOffset = 0;
              textStartIndex = i;
              if (ch == '\n') {
                textStartIndex = i + 1;
              }
            } else {
              // We should output DrawItem without letters at the end.
              // These letter should be in next time.
              this.outputDrawItem(
                x, y,
                widthWhenletterStart - x, lineHeight,
                textStartIndex, letterTextStartIndex - 1,
                text.substr(textStartIndex, letterTextStartIndex - textStartIndex)
              );
              x = 0;
              y += lineHeight;
              currentXOffset = currentXOffset - widthWhenletterStart;
              textStartIndex = letterTextStartIndex;
            }
          }
          if (isChinese || ch == ' ' || ch == ',' || ch == '.' || ch == '，' || ch == '。' || ch == '\n') {
            state = State.Normal;
          }
          currentXOffset += chSize;
          break;
        case State.PatternMode:
          if (currentXOffset + chSize > maxWidth) {
            // Output a line and continue to be pattern mode.
            this.outputDrawItem(
              x, y,
              currentXOffset - x, lineHeight,
              textStartIndex, i - 1,
              text.substr(textStartIndex, i - textStartIndex),
              true
            );
            x = 0;
            y += lineHeight;
            currentXOffset = 0;
            textStartIndex = i;
          }
          if (ch == '\r') {
            // End of pattern
            // Output a DrawItem and back to normal mode.
            if (textStartIndex < i) {
              this.outputDrawItem(
                x, y,
                currentXOffset - x, lineHeight,
                textStartIndex, i - 1,
                text.substr(textStartIndex, i - textStartIndex),
                true
              );
            }
            state = State.Normal;
            // Ignore current char
            textStartIndex = i + 1;
            x = currentXOffset;
            break;
          }
          currentXOffset += chSize;
          break;
      }
    }
    // last one
    if (textStartIndex < text.length) {
      this.outputDrawItem(
        x, y,
        currentXOffset - x, lineHeight,
        textStartIndex, text.length - 1,
        text.substr(textStartIndex, text.length - textStartIndex)
      );
    }
    this.maxHeight = y + lineHeight;
    if (this.maxHeight > lineHeight) {
      this.maxWidth = maxWidth;
    } else {
      this.maxWidth = currentXOffset;
    }
  }

  private outputDrawItem(
    x: number, y: number,
    width: number, height: number,
    startIndex: number, endIndex: number,
    text:string, isPattern: boolean=false) {
    let ret = new DrawItem(
      x, y,
      width, height,
      startIndex, endIndex,
      text, isPattern);
    this.result.push(ret);
  }
}