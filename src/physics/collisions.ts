import { Game } from "../Game/Game";
import { GameObject } from "../Game/GameObject";
import { isInRange } from "../utils/MathUtils";

/** Collision Methods */
export class Collisions {
  // Check if next position values of a gameObject would be within canvas
  static willCollideWithWall(game: Game, gameObject: GameObject, nextX: number, nextY: number) {
    // Check if gameObject is within canvas
    const minX = 0;
    const maxX = game.width - gameObject.width;
    const minY = 0;
    const maxY = game.height - gameObject.height;
    const willBeOnCanvas = isInRange(nextX, minX, maxX) && isInRange(nextY, minY, maxY);

    return !willBeOnCanvas;
  }

  static didCollideWithWall(game: Game, gameObject: GameObject) {
    // Check if gameObject is within canvas
    const minX = 0;
    const maxX = game.width - gameObject.width;
    const minY = 0;
    const maxY = game.height - gameObject.height;
    const isOnCanvas = isInRange(gameObject.x, minX, maxX) && isInRange(gameObject.y, minY, maxY);

    return !isOnCanvas;
  }

  // Check if a and b collided
  static didCollide(a: GameObject, b: GameObject) {
    // Check if a and b are on the same x-axis
    const aX = a.x;
    const aX2 = a.x + a.width;
    const bX = b.x;
    const bX2 = b.x + b.width;
    const isOnSameX = (aX >= bX && aX <= bX2) || (aX2 >= bX && aX2 <= bX2);

    // Check if a and b are on the same y-axis
    const aY = a.y;
    const aY2 = a.y + a.height;
    const bY = b.y;
    const bY2 = b.y + b.height;
    const isOnSameY = (aY >= bY && aY <= bY2) || (aY2 >= bY && aY2 <= bY2);

    // Check if a and b are on the same x-axis and y-axis
    return isOnSameX && isOnSameY;
  }

  // static didCollideWithSelf(gameObject) {

  // }

  // Return all gameObjects that collided with gameObject
  static collidedWith<T extends GameObject = GameObject>(gameObject: GameObject, multiple: T[]) {
    return multiple.filter(oneOf => Collisions.didCollide(gameObject, oneOf));
  }
}