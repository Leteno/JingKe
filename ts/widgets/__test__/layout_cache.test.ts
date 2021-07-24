
import Panel from "../panel"
import { MeasureResult } from "../sprite";
import TestSprite from "./test_sprite.test"

test("measure param changed", () => {
  let layout = new Panel();
  let v1 = new TestSprite(100, 100);
  let v2 = new TestSprite(100, 100);
  layout.addView(v1);
  layout.addView(v2);
  v1.calculateActualSize = jest.fn<MeasureResult, any[]>(() => {
    return new MeasureResult();
  });
  v2.calculateActualSize = jest.fn<MeasureResult, any[]>(() => {
    return new MeasureResult();
  });

  let ctx = {} as CanvasRenderingContext2D;
  layout.measure(ctx, 200, 200);
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);

  layout.measure(ctx, 200, 200);
  // no change.
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);

  layout.measure(ctx, 201, 200);
  // should change.
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(2);
})

test("measure dirty", () => {
  let layout = new Panel();
  let v1 = new TestSprite(100, 100);
  let v2 = new TestSprite(100, 100);
  layout.addView(v1);
  layout.addView(v2);
  v1.calculateActualSize = jest.fn<MeasureResult, any[]>(() => {
    return new MeasureResult();
  });
  v2.calculateActualSize = jest.fn<MeasureResult, any[]>(() => {
    return new MeasureResult();
  });

  let ctx = {
    save: () => {},
    restore: () => {},
    translate: (x:number, y:number) => {},
  } as CanvasRenderingContext2D;
  layout.measure(ctx, 200, 200);
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);

  layout.measure(ctx, 200, 200);
  // shouldn't change.
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  layout.drawToCanvas(ctx);
  // shouldn't change.
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);

  v1.setIsDirty(true);
  layout.measure(ctx, 200, 200);
  // shouldn't change, I wish it would.
  // However, we add the logic in onDraw
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  // shouldn't change
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
  layout.drawToCanvas(ctx);
  // should change.
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);

  // Next time, drawToCanvas will not update measure
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);

  layout.measure(ctx, 200, 200);
  // shouldn't change.
  expect((v1.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((v2.calculateActualSize as jest.Mock)
    .mock.calls.length).toBe(1);
})

test("layout params change", () => {
  let ctx = {
    save: () => {},
    restore: () => {},
    translate: (x:number, y:number) => {},
  } as CanvasRenderingContext2D;
  let layout = new Panel();
  let v1 = new TestSprite(100, 100);
  let v2 = new TestSprite(300, 100);
  layout.addView(v1);
  layout.addView(v2);
  v1.onLayout = jest.fn<void, any[]>();
  v2.onLayout = jest.fn<void, any[]>();

  layout.measure(ctx, 200, 200);
  layout.layout(200, 200);
  expect((v1.onLayout as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.onLayout as jest.Mock)
    .mock.calls.length).toBe(1);

  layout.measure(ctx, 200, 200);
  layout.layout(200, 200);
  // no change.
  expect((v1.onLayout as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.onLayout as jest.Mock)
    .mock.calls.length).toBe(1);

  layout.measure(ctx, 201, 200);
  layout.layout(201, 200);
  // should change.
  expect((v1.onLayout as jest.Mock)
    .mock.calls.length).toBe(2);
  expect((v2.onLayout as jest.Mock)
    .mock.calls.length).toBe(2);
});

test("onLayout isDirty", () => {
  let ctx = {
    save: () => {},
    restore: () => {},
    translate: (x:number, y:number) => {},
  } as CanvasRenderingContext2D;
  let layout = new Panel();
  let v1 = new TestSprite(100, 100);
  let v2 = new TestSprite(300, 100);
  layout.addView(v1);
  layout.addView(v2);
  v1.onLayout = jest.fn<void, any[]>();
  v2.onLayout = jest.fn<void, any[]>();

  layout.measure(ctx, 200, 200);
  layout.layout(200, 200);
  expect((v1.onLayout as jest.Mock)
    .mock.calls.length).toBe(1);
  expect((v2.onLayout as jest.Mock)
    .mock.calls.length).toBe(1);

    layout.drawToCanvas(ctx);
    // As it is not dirty, onLayout should not call
    expect((v1.onLayout as jest.Mock)
      .mock.calls.length).toBe(1);
    expect((v2.onLayout as jest.Mock)
      .mock.calls.length).toBe(1);

    // set it is dirty for v1.
    v1.setIsDirty(true);
    layout.drawToCanvas(ctx);
    expect((v1.onLayout as jest.Mock)
      .mock.calls.length).toBe(2);
    expect((v2.onLayout as jest.Mock)
      .mock.calls.length).toBe(1);


    // Again, we shall not call onLayout
    // as it is not dirty.
    layout.drawToCanvas(ctx);
    expect((v1.onLayout as jest.Mock)
      .mock.calls.length).toBe(2);
    expect((v2.onLayout as jest.Mock)
      .mock.calls.length).toBe(1);
});