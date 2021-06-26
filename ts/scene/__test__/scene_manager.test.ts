
import SceneManager from "../scene_manager"
import TestScene from "./test_scene.test"

test("simple", () => {
  let ctx = {} as CanvasRenderingContext2D;
  let manager = new SceneManager(ctx);
  let s1 = new TestScene();
  let s1OnStart = jest.fn();
  s1.onStart = s1OnStart;
  manager.push("s1", s1);
  expect(manager.currentScene).toBe(undefined);
  let warningFunction = jest.fn()
  console.warn = warningFunction;
  expect(manager.push("s1", s1)).toBe(false);
  expect(warningFunction.mock.calls[0][0])
    .toContain("conflict to push scene");

  manager.switchScene("s1");

  expect(manager.currentScene).toBe(s1);
  expect(s1OnStart.mock.calls.length).toBe(1);
  expect(s1OnStart.mock.calls[0][0]).toBe(ctx);
})

test("switchScene", () => {
  let ctx = {} as CanvasRenderingContext2D;
  let manager = new SceneManager(ctx);
  let s1 = new TestScene();
  let s1OnStart = jest.fn();
  s1.onStart = s1OnStart;
  manager.push("s1", s1);

  let s2 = new TestScene();
  let s2OnStart = jest.fn();
  s2.onStart = s2OnStart;
  manager.push("s2", s2);

  manager.switchScene("s1");
  expect(manager.currentScene).toBe(s1);
  expect(s1OnStart.mock.calls.length).toBe(1);
  expect(s1OnStart.mock.calls[0][0]).toBe(ctx);

  manager.switchScene("s2");
  expect(manager.currentScene).toBe(s2);
  expect(s2OnStart.mock.calls.length).toBe(1)
  expect(s2OnStart.mock.calls[0][0]).toBe(ctx);

  manager.switchScene("s1");
  expect(manager.currentScene).toBe(s1);
  expect(s1OnStart.mock.calls.length).toBe(2);
  expect(s1OnStart.mock.calls[1][0]).toBe(ctx);
})