import { Align, LayoutType } from "../misc/layout";
import ImageView, { PointerPosition } from "../widgets/imageview";
import LinearLayout from "../widgets/linear_layout";
import Panel from "../widgets/panel";

export class People {
  showNoteSign: boolean;
  imageSrc: string;
  pointerPosition: PointerPosition;
  onclickListener: ()=>void

  constructor() {
    this.showNoteSign = false;
    this.pointerPosition = PointerPosition.NONE;
  }
}

export class Place {
  showNoteSign: boolean;
  pointerPosition: PointerPosition;
  imageSrc: string;
  peoples: Array<People>;
  places: Array<Place>;
  parent: Place;
  onclickListener: ()=>void;
  onBackListener: ()=>void;

  constructor() {
    this.showNoteSign = false;
    this.pointerPosition = PointerPosition.NONE;
    this.peoples = new Array<People>();
    this.places = new Array<Place>();
    this.parent = undefined;
    this.onBackListener = undefined;
    this.onclickListener = undefined;
  }
}

export class PlaceAndPeopleView extends Panel {
  peoplePanel: LinearLayout;
  placePanel: LinearLayout;
  place: Place;
  constructor() {
    super();
    this.peoplePanel = new LinearLayout();
    this.placePanel = new LinearLayout();
    this.addView(this.peoplePanel);
    this.addView(this.placePanel);

    this.peoplePanel.layoutParam.xcfg = Align.START;
    this.placePanel.layoutParam.xcfg = Align.END;
  }

  updatePlace(place: Place) {
    this.refineEvent(place);
    this.place = place;
    this.setIsDirty(true);

    this.peoplePanel.removeAllViews();
    this.placePanel.removeAllViews();
    let that:PlaceAndPeopleView = this;

    if (place && place.places) {
      place.places.forEach(p => {
        let placeView = new ImageView(p.imageSrc);
        placeView.forceWidth = 80;
        placeView.forceHeight = 80;
        placeView.margin.bottom = 10;
        placeView.showNoteSign = p.showNoteSign;
        placeView.pointerPosition = p.pointerPosition;
        placeView.onclickInternal = (event) => {
          if (p.onclickListener) {
            p.onclickListener();
          }
          that.updatePlace(p);
          return true;
        }
        this.placePanel.addView(placeView);
      })
    }

    if (place && place.peoples) {
      place.peoples.forEach(p => {
        let peopleView = new ImageView(p.imageSrc);
        peopleView.forceWidth = 80;
        peopleView.forceHeight = 80;
        peopleView.margin.bottom = 10;
        peopleView.showNoteSign = p.showNoteSign;
        peopleView.pointerPosition = p.pointerPosition;
        peopleView.onclickInternal = () => {
          if (p.onclickListener) {
            p.onclickListener();
          }
          return true;
        }
        this.peoplePanel.addView(peopleView);
      })
    }

    if (place && place.parent) {
      let backView = new ImageView("res/created/back.png")
      backView.forceWidth = 80;
      backView.forceHeight = 80;
      backView.margin.bottom = 10;
      backView.onclickInternal = (event) => {
        if (place.onBackListener) {
          place.onBackListener();
        }
        that.updatePlace(place.parent);
        return true;
      }
      this.placePanel.addView(backView);
    }
    // TODO actually we don't need to set child as dirty,
    // when parent is dirty.
    this.peoplePanel.setIsDirty(true);
    this.placePanel.setIsDirty(true);
  }

  /**
   * Refine the event in place:
   * * SubPlace should have parent.
   * 
   * So here we will not refine all the descendants
   * we only care about the children, as the next generation
   * will be refined in next updatePlace(child)
   * @param place 
   */
  private refineEvent(place: Place) {
    if (place && place.places) {
      place.places.forEach(child => {
        child.parent = place;
      })
    }
  }
}