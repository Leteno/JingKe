import { PlaceAndPeopleView } from "../../../compose/place_and_people_view";
import { Align, LayoutType } from "../../../misc/layout";
import BirdViewImage from "../../../widgets/birdview_image";
import ImageView from "../../../widgets/imageview";

export class Act1Views {
  static cityPhoto: BirdViewImage;
  static placeAndPeopleView: PlaceAndPeopleView;
  static me: ImageView;

  static init(canvasWidth: number, canvasHeight: number) {
    let cityPhoto = new BirdViewImage("res/city_of_yan.png");
    cityPhoto.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    cityPhoto.forceHeight = canvasHeight * 2 / 3;
    cityPhoto.layoutParam.xcfg = Align.CENTER;
    cityPhoto.layoutParam.ycfg = Align.CENTER;
    let placeAndPeopleView = new PlaceAndPeopleView();
    placeAndPeopleView.layoutParam.xLayout = LayoutType.MATCH_PARENT;
    placeAndPeopleView.margin.left = 10;
    placeAndPeopleView.margin.right = 10;
    placeAndPeopleView.margin.top = 40 + canvasHeight/6;
    let me = new ImageView("res/created/me.png");
    me.forceWidth = 30;
    me.forceHeight = 30;
    me.margin.right = 10;
    me.margin.top = 10 + canvasHeight/6;
    me.layoutParam.xcfg = Align.END;

    this.cityPhoto = cityPhoto;
    this.placeAndPeopleView = placeAndPeopleView;
    this.me = me;
  }
}