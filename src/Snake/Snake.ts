// TODO: Snake extends Player

import { type Food } from "@/Food/Food";
import { type Game } from "@/Game/Game";
import { GameObjectArray } from "@/Game/GameObjectArray";
import { type SnakeDirection } from "@/lib/types/Snake/Snake";
import ClassUtils from "@/utils/ClassUtils";
import { SnakeNode } from "@/Snake/SnakeNode";

/** TODO: Change usage of snake in Game to reflect new API */
export class Snake extends GameObjectArray {
  snakeBody: SnakeNode[];
  direction: SnakeDirection;
  length: number;
  horizontalMoveAmt: number;
  verticalMoveAmt: number;
  y: any;
  x: any;
  static triedMovingBackwards(direction: SnakeDirection, newDirection: SnakeDirection) {
    switch (direction) {
      case 'up':
        return newDirection === 'down';
      case 'right':
        return newDirection === 'left';
      case 'down':
        return newDirection === 'up';
      case 'left':
        return newDirection === 'right';
      default:
        return false;
    }
  }

  constructor(game: Game) {
    const snakeBody = [new SnakeNode(game, 0, 0, game.colSize, game.rowSize, 'down')];
    super(game, snakeBody);

    this.snakeBody = snakeBody;
    this.direction = 'down';
    this.length = 1;
    this.horizontalMoveAmt = game.colSize;
    this.verticalMoveAmt = game.rowSize;

    ClassUtils.bindMethods(['_onKeyDown', 'onSwipe', 'onResize', 'move', 'continue', 'eat', '_grow'], this);
  }

  get head() {
    return this.snakeBody[0];
  }

  /**
   * TODO: Refactor the below methods to work with this.snakeBody & in not a GameObject
   */
  // TODO: Remove and re-add snake body from game
  move(newDirection = this.direction) {
    // Don't move if snake tried moving backwards // TODO: Game over instead
    if (Snake.triedMovingBackwards(this.direction, newDirection)) {
      return;
    }
    // Update the snake's position and direction values
    // TODO: Erase last node. 

    // TODO: Move last node to front of this.snakeBody

    // TODO: Update position of first node.

    // TODO: Draw new first node.
    let updatePosition: Function;
    switch (newDirection) {
      case 'up':
        updatePosition = function (this: SnakeNode) {
          this.y -= this.verticalMoveAmt;
          this.direction = 'up';
        };
        break;
      case 'right':
        updatePosition = function (this: SnakeNode) {
          this.x += this.horizontalMoveAmt;
          this.direction = 'right';
        };
        break;
      case 'down':
        updatePosition = function (this: SnakeNode) {
          this.y += this.verticalMoveAmt;
          this.direction = 'down';
        };
        break;
      case 'left':
        updatePosition = function (this: SnakeNode) {
          this.x -= this.horizontalMoveAmt;
          this.direction = 'left';
        };
        break;
      default:
        updatePosition = function (this: SnakeNode) { };
        break;
    }
    this.snakeBody.forEach(snakeNode => {
      snakeNode.redraw(updatePosition.bind(snakeNode));
    });
  }

  // Move the snake in the current direction
  continue() {
    this.move(this.direction);
  }

  // Head eats
  eat(food: Food) {
    // Remove food from canvas
    this.game.removeFood(food);
    // Grow the snake
    this._grow();
  }

  private _grow() {
    this.length++;
    this.addSnakeNode();
  }

  private addSnakeNode() {
    // TODO: Calculate x and y based on last snake node's position and direction
    const lastNode = this.getLastSnakeNode();
    if (!lastNode) return;

    let newNodeY = lastNode.y;
    if (lastNode.direction === 'down') {
      newNodeY = lastNode.y + lastNode.width;
    } else if (lastNode.direction === 'up') {
      newNodeY = lastNode.y - lastNode.width;
    }

    let newNodeX = lastNode.x;
    if (lastNode.direction === 'left') {
      newNodeY = lastNode.x - lastNode.width;
    } else if (lastNode.direction === 'right') {
      newNodeY = lastNode.x + lastNode.width;
    }
    const newNode = new SnakeNode(this.game, newNodeX, newNodeY, this.game.colSize, this.game.rowSize, this.direction);
    this.snakeBody.push(newNode);


    // TODO: Draw the new node, or redraw the whole snake
  }
  getLastSnakeNode() {
    const index = this.snakeBody.length - 1;
    if (index >= 0) {
      return this.snakeBody[index];
    }
    return null;
  }
  // getNthSnakeNode(n) {
  //   // If an nth node exists
  //   if (n < this.snakeBody.length) {
  //     // Return the nth snake node
  //     return this.snakeBody[n];
  //   }
  // }

  onSwipe(direction: "up" | "right" | "down" | "left") {
    this.move(direction);
  }

  _onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        this.move('up');
        break;
      case 'ArrowRight':
        this.move('right');
        break;
      case 'ArrowDown':
        this.move('down');
        break;
      case 'ArrowLeft':
        this.move('left');
        break;
      default:
        console.log('no snake switch match');
        break;
    }
  }

  onResize(e: Event) {
    this.snakeBody.forEach(function (snakeNode) {
      snakeNode.redraw(() => {
        snakeNode.x = snakeNode.game.colSize * Math.floor(snakeNode.x / snakeNode.game.colSize);
        snakeNode.y = snakeNode.game.rowSize * Math.floor(snakeNode.y / snakeNode.game.rowSize);
        snakeNode.height = snakeNode.game.rowSize;
        snakeNode.width = snakeNode.game.colSize;
      });
    });
  }
}