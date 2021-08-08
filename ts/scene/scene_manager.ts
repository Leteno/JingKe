
import Scene from "./scene"

export default class SceneManager {
  sceneMap: Map<string, Scene>;
  currentScene: Scene;
  ctx: CanvasRenderingContext2D;

  static sInstance: SceneManager;

  private constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.sceneMap = new Map<string, Scene>();
  }

  static getInstance(): SceneManager {
    return this.sInstance;
  }

  static init(ctx: CanvasRenderingContext2D) {
    this.sInstance = new SceneManager(ctx);
  }

  push(key: string, scene: Scene) : boolean {
    if (this.sceneMap.has(key)) {
      console.warn(`conflict to push scene ${key} ${scene}`)
      return false;
    }
    this.sceneMap.set(key, scene);
  }

  remove(key: string) : boolean {
    if (!this.sceneMap.has(key)) {
      return false;
    }
    return this.sceneMap.delete(key);
  }

  /**
   * Will switch to the scene which is named key.
   * 
   * Will raise exception if there is no scene related to key.
   */
  switchScene(key: string) {
    if (!this.sceneMap.has(key)) {
      console.warn(`switchScene to key ${key} which has no scene related`);
      return;
    }
    this.currentScene = this.sceneMap.get(key) as Scene;
    this.currentScene.onStart(this.ctx);
  }
}