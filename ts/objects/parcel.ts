

enum TYPE {
  int = 0,
  string = 1,
  array = 2,
  parcel = 3
}

export default class Parcel {
  private length: number;
  private _parcelData: ArrayBuffer;
  private _dataView: DataView;
  private _readIndex: number;
  private _writeIndex: number;

  constructor(length: number=16) {
    if (length <= 0) length = 16;
    this.length = length;

    this._parcelData = new ArrayBuffer(this.length);
    this._dataView = new DataView(this._parcelData);
    this._readIndex = 0;
    this._writeIndex = 0;
  }

  getLength(): number {
    return this.length;
  }

  readInt(): number {
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.int) {
      console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let result = this._dataView.getInt32(this._readIndex);
    this._readIndex += 4;
    return result;
  }
  readString(): string {
    return "";
  }
  readArray() : Array<Parcel> {
    return null;
  }
  readNumberArray(): Array<number> {
    return null;
  }
  readStringArray(): Array<string> {
    return null;
  }

  writeInt(n: number) {
    this.enlargeIfNeeded(5);
    this._dataView.setInt8(this._writeIndex++, TYPE.int);
    this._dataView.setInt32(this._writeIndex, n);
    this._writeIndex += 4;
  }

  writeString(str: string) {
  }

  writeArray(array: Array<Parcel>) {
  }
  writeNumberArray(array: Array<number>) {
  }
  writeStringArray(array: Array<string>) {
  }

  enlargeIfNeeded(needByte: number) {
    let expected = needByte + this._writeIndex;
    if (expected < this.length) {
      // Enough space, skip
      return;
    }
    while (this.length <= expected) this.length *= 2;
    let newBuffer = new ArrayBuffer(this.length);
    let fromView = new Int8Array(this._parcelData);
    let toView = new Int8Array(newBuffer);
    for (let i = 0; i < fromView.byteLength; i++) {
      toView[i] = fromView[i];
    }
    this._parcelData = newBuffer;
    this._dataView = new DataView(newBuffer);
  }

  toString(): string {
    return String.fromCharCode.apply(
      null,
      new Int8Array(this._parcelData)
    );
  }

  fromString(raw: string) {
    let newBuffer = new ArrayBuffer(raw.length);
    let toView = new Int8Array(newBuffer);
    for (let i = 0; i < raw.length; i++) {
      toView[i] = raw.charCodeAt(i);
    }
    this.length = raw.length;
    this._parcelData = newBuffer;
    this._dataView = new DataView(newBuffer);
  }
}