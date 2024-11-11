import ClassUtils from "../utils/ClassUtils";
import { type Game } from "./Game";
import { type GameObject } from "./GameObject";

/**
 * TODO: Make GameObjectArray like GameObject, but with an array of GameObjects
 */
export class GameObjectArray {
  game: Game;
  gameObjects: GameObject[];

  constructor(game: Game, gameObjects: GameObject[] = []) {
    this.game = game;
    this.gameObjects = gameObjects;

    ClassUtils.bindMethods(['insert', 'delete', 'draw', 'erase', 'redraw', 'onResize'], this);
  }

  // Add a GameObject to the array
  insert(gameObject: GameObject) {
    this.gameObjects.push(gameObject);
  }

  // Remove a GameObject from the array
  delete(gameObject: GameObject) {
    this.gameObjects = this.gameObjects.filter(gameObj => gameObj !== gameObject);
  }

  // Add a collection of GameObjects to canvas
  draw() {
    this.gameObjects.forEach(gameObject => {
      gameObject.draw();
    });
  }

  // Remove a collection of GameObjects from canvas
  erase() {
    this.gameObjects.forEach(gameObject => {
      gameObject.erase();
    });
  }

  redraw(update: Function) {
    this.gameObjects.forEach(gameObject => {
      gameObject.redraw(update);
    });
  }
}