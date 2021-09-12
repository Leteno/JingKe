import { Goods } from "./goods";
import parcel from "../objects/parcel";
import { Serializable } from "../objects/serializable";

export default abstract class BussinessMan implements Serializable {
  goodsList: Array<Goods>;

  constructor() {
    this.goodsList = [];
    this.initGoodsList(this.goodsList);
  }

  abstract initGoodsList(list: Array<Goods>);

  toParcel(p: parcel) {
    p.writeInt(this.goodsList.length);
    this.goodsList.forEach(goods => {
      goods.toParcel(p);
    })
  }
  fromParcel(p: parcel) {
    let length = p.readInt();
    this.goodsList.splice(0);
    for (let i = 0; i < length; i++) {
      let goods = new Goods();
      goods.fromParcel(p);
      this.goodsList.push(goods);
    }
  }
}