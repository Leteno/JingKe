
import { ClickEvent } from "../../misc/event";
import ImageView from "../../widgets/imageview";
import { defaultCtx } from "../../widgets/__test__/default_value.test";
import {People, Place, PlaceAndPeopleView} from "../place_and_people_view"

test("", () => {
  let place = new Place();
  let people1 = new People();
  people1.character.imageSrc = "image://people1"
  place.peoples.push(people1);
  let place1 = new Place();
  place1.imageSrc = "image://place1";
  place.places.push(place1);
  let people2 = new People();
  people2.character.imageSrc = "image://people2"
  place1.peoples.push(people2);

  let view = new PlaceAndPeopleView();
  view.updatePlace(place);

  // Test parent is set in place1
  //expect(place1.parent).toBe(place)

  expect((view.peoplePanel.children[0] as ImageView)
    .img.src).toBe("image://people1");
  expect((view.placePanel.children[0] as ImageView)
    .img.src).toBe("image://place1");

  people1.character.imageSrc = "image://excited-hahaha";
  people1.dirty = true;
  view.drawToCanvas(defaultCtx);
  expect((view.peoplePanel.children[0] as ImageView)
    .img.src).toBe("image://excited-hahaha");

  // Force click place1
  let place1View = view.placePanel.children[0];
  place1View.onclick(new ClickEvent(place1View.x, place1View.y));

  // Back button
  expect((view.placePanel.children[0] as ImageView)
    .img.src).toBe("http://localhost/res/created/back.png");
  // Check people area
  expect((view.peoplePanel.children[0] as ImageView)
    .img.src).toBe("image://people2");
})