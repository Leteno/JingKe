
export abstract class BindableData {
  dirty: boolean;
  constructor() {
    this.dirty = false;
  }
}