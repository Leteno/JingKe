

enum TYPE {
  int = 0,
  string = 1,
  array = 2,
  parcel = 3,
  double = 4,
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

  isEmpty() {
    return this._writeIndex == 0;
  }

  private isEnoughForRead(requireSpace: number) {
    return this._writeIndex >= this._readIndex + requireSpace;
  }

  private warn(s: string) {

  }

  readInt(): number {
    if (!this.isEnoughForRead(5)) {
      this.warn(`Not enough space for readInt() index: ${this._readIndex}`);
      return 0;
    }
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.int) {
      console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let result = this._dataView.getInt32(this._readIndex);
    this._readIndex += 4;
    return result;
  }

  readDouble(): number {
    if (!this.isEnoughForRead(5)) {
      this.warn(`Not enough space for readDouble() index: ${this._readIndex}`);
      return 0;
    }
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.double) {
      console.warn(`readDouble on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let result = this._dataView.getFloat64(this._readIndex);
    this._readIndex += 4;
    return result;
  }

  readString(): string {
    if (!this.isEnoughForRead(5)) {
      this.warn(`Not enough space for readString() index: ${this._readIndex}`);
      return "";
    }
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.string) {
      console.warn(`readString on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let size = this._dataView.getInt32(this._readIndex);
    this._readIndex += 4;
    if (!this.isEnoughForRead(size * 2)) {
      this.warn(`Not enough space for readString() index: ${this._readIndex}`);
      return "";
    }
    let data = this._parcelData.slice(
      this._readIndex,
      this._readIndex + size * 2 /** U16 2bytes */);
    let result = String.fromCharCode.apply(
      null,
      new Int16Array(data)
    );
    this._readIndex += size * 2;
    return result;
  }

  readParcel() : Parcel {
    if (!this.isEnoughForRead(1)) {
      this.warn(`Not enough space for readParcel() index: ${this._readIndex}`);
      return new Parcel();
    }
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.parcel) {
      console.warn(`readParcel on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let data = this.readString();
    let result = new Parcel();
    result.fromString(data);
    return result;
  }

  readArray() : Array<Parcel> {
    if (!this.isEnoughForRead(5)) {
      this.warn(`Not enough space for readArray() index: ${this._readIndex}`);
      return [];
    }
    let result = new Array<Parcel>();
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.array) {
      console.warn(`readArray on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let len = this._dataView.getInt32(this._readIndex);
    this._readIndex += 4;
    for (let i = 0; i < len; i++) {
      result.push(this.readParcel());
    }
    return result;
  }

  readNumberArray(): Array<number> {
    if (!this.isEnoughForRead(5)) {
      this.warn(`Not enough space for readNumberArray() index: ${this._readIndex}`);
      return [];
    }
    let array = new Array<number>();
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.array) {
      console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let len = this._dataView.getInt32(this._readIndex);
    this._readIndex += 4;
    for (let i = 0; i < len; i++) {
      if (!this.isEnoughForRead(4)) {
        this.warn(`Not enough space for readNumberArray() index: ${this._readIndex}`);
        return array;
      }
      let data = this._dataView.getInt32(this._readIndex);
      this._readIndex += 4;
      array.push(data);
    }
    return array;
  }

  readStringArray(): Array<string> {
    if (!this.isEnoughForRead(5)) {
      this.warn(`Not enough space for readInt() index: ${this._readIndex}`);
      return [];
    }
    let array = new Array<string>();
    let type = this._dataView.getInt8(this._readIndex);
    if (type != TYPE.array) {
      console.warn(`readInt on unexpect type: ${type}, index: ${this._readIndex}`);
    }
    this._readIndex++;
    let len = this._dataView.getInt32(this._readIndex);
    this._readIndex += 4;
    for (let i = 0; i < len; i++) {
      if (!this.isEnoughForRead(4)) {
        this.warn(`Not enough space for readInt() index: ${this._readIndex}`);
        return array;
      }
      let strlen = this._dataView.getInt32(this._readIndex);
      this._readIndex += 4;
      if (!this.isEnoughForRead(strlen * 2)) {
        return array;
      }
      let data = this._parcelData.slice(
        this._readIndex,
        this._readIndex + strlen * 2 /** U16 2bytes */);
      let str = String.fromCharCode.apply(
        null,
        new Int16Array(data)
      );
      array.push(str);
      this._readIndex += strlen * 2;
    }
    return array;
  }

  writeInt(n: number) {
    this.enlargeIfNeeded(5);
    this._dataView.setInt8(this._writeIndex++, TYPE.int);
    this._dataView.setInt32(this._writeIndex, n);
    this._writeIndex += 4;
  }

  writeDouble(double: number) {
    this.enlargeIfNeeded(5);
    this._dataView.setInt8(this._writeIndex++, TYPE.double);
    this._dataView.setFloat64(this._writeIndex, double);
    this._writeIndex += 4;
  }

  writeString(str: string) {
    /**
     * Type  1
     * Length of string 4
     * U16 need 2bytes (str.length * 2)
     */
    this.enlargeIfNeeded(1 + 4 + str.length * 2);
    this._dataView.setInt8(this._writeIndex++, TYPE.string);
    this._dataView.setInt32(this._writeIndex, str.length);
    this._writeIndex += 4;
    for (let i = 0; i < str.length; i++) {
      this._dataView.setInt16(this._writeIndex, str.charCodeAt(i), true);
      this._writeIndex += 2;
    }
  }

  writeParcel(parcel: Parcel) {
    this.enlargeIfNeeded(1);
    this._dataView.setInt8(this._writeIndex++, TYPE.parcel);
    let str = parcel.toString();
    this.writeString(str);
  }

  writeArray(array: Array<Parcel>) {
    this.enlargeIfNeeded(1 + 4);
    this._dataView.setInt8(this._writeIndex++, TYPE.array);
    this._dataView.setInt32(this._writeIndex, array.length);
    this._writeIndex += 4;

    for (let i = 0; i < array.length; i++) {
      this.writeParcel(array[i]);
    }
  }

  writeNumberArray(array: Array<number>) {
    this.enlargeIfNeeded(1 + 4 + array.length * 4);
    this._dataView.setInt8(this._writeIndex++, TYPE.array);
    this._dataView.setInt32(this._writeIndex, array.length);
    this._writeIndex += 4;
    for (let i = 0; i < array.length; i++) {
      this._dataView.setInt32(this._writeIndex, array[i]);
      this._writeIndex += 4;
    }
  }

  writeStringArray(array: Array<string>) {
    this.enlargeIfNeeded(1 + 4);
    this._dataView.setInt8(this._writeIndex++, TYPE.array);
    this._dataView.setInt32(this._writeIndex, array.length);
    this._writeIndex += 4;
    for (let i = 0; i < array.length; i++) {
      let str = array[i];
      this.enlargeIfNeeded(4 + str.length * 2);
      this._dataView.setInt32(this._writeIndex, str.length);
      this._writeIndex += 4;
      for (let i = 0; i < str.length; i++) {
        this._dataView.setInt16(this._writeIndex, str.charCodeAt(i), true);
        this._writeIndex += 2;
      }
    }
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
    this._writeIndex = raw.length;
    this._parcelData = newBuffer;
    this._dataView = new DataView(newBuffer);
  }
}