
export interface SequenceItem {
  onStart();
}

export class Sequence {
  items: Array<SequenceItem>;
  currentIndex: number;
  constructor() {
    this.items = new Array<SequenceItem>();
    this.currentIndex = 0;
  }

  addIntoSequence(item: SequenceItem) {
    this.items.push(item);
  }

  startOne() {
    if (this.currentIndex < this.items.length) {
      let item = this.items[this.currentIndex];
      item.onStart();
    }
  }

  next() {
    if (this.currentIndex >= this.items.length - 1) {
      // Skip
      return;
    }
    this.currentIndex++;
    this.startOne();
  }

  reset() {
    this.currentIndex = 0;
  }
}