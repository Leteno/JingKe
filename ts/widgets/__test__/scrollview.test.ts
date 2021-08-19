import {ScrollView} from "../scrollview"

test("scrollBy", () => {
  let scrollView = new ScrollView();
  scrollView.width = 200;
  scrollView.height = 400;
  scrollView.childrenMaxWidth = 100;
  scrollView.childrenMaxHeight = 100;

  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(10, 10);
  expect(scrollView.offsetX).toBe(10);
  expect(scrollView.offsetY).toBe(10);

  scrollView.scrollBy(-10, -40);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(200, 200);
  expect(scrollView.offsetX).toBe(100);
  expect(scrollView.offsetY).toBe(200);
})

test("scrollBy big parent small children", () => {

  let scrollView = new ScrollView();
  scrollView.width = 200;
  scrollView.height = 400;
  scrollView.childrenMaxWidth = 100;
  scrollView.childrenMaxHeight = 100;

  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(10, 10);
  expect(scrollView.offsetX).toBe(10);
  expect(scrollView.offsetY).toBe(10);

  scrollView.scrollBy(-10, -40);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(200, 200);
  expect(scrollView.offsetX).toBe(100);
  expect(scrollView.offsetY).toBe(200);
})

test("scrollBy small parent with big child", () => {
  let scrollView = new ScrollView();
  scrollView.width = 100;
  scrollView.height = 100;
  scrollView.childrenMaxWidth = 200;
  scrollView.childrenMaxHeight = 400;
  
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(10, 10);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(-10, -40);
  expect(scrollView.offsetX).toBe(-10);
  expect(scrollView.offsetY).toBe(-40);

  scrollView.scrollBy(200, 200);
  expect(scrollView.offsetX).toBe(0);
  expect(scrollView.offsetY).toBe(0);

  scrollView.scrollBy(-200, -200);
  expect(scrollView.offsetX).toBe(-100);
  expect(scrollView.offsetY).toBe(-200);
})