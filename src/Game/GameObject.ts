import ClassUtils from "../utils/ClassUtils";
import { type Game } from "./Game";

/**
 * A thing that exists in the game. It has a size and position.
 */
export class GameObject {
  game: Game;
  private _x: number;
  private _y: number;
  height: number;
  width: number;
  color: string;
  private _isOnCanvas: boolean;

  constructor(game: Game, startX: number, startY: number, height: number, width: number, styles = { color: '#fff' }) {
    // Store Game instance
    this.game = game;

    // GameObject values
    this.height = height;
    this.width = width;
    this._x = startX;
    this._y = startY;
    this.color = styles.color;

    // Status
    this._isOnCanvas = false; // Is the GameObject on the canvas?

    ClassUtils.bindMethods(['draw', 'erase', 'redraw', 'onResize'], this);
  }

  get isOnCanvas() { return this._isOnCanvas; }
  get x() { return this._x; }
  set x(x) {
    // Limit x to completely fit player on canvas
    // const minX = 0;
    // const maxX = this.game.width - this.width;
    this._x = x; // limitNum(x, minX, maxX);
  }
  get y() { return this._y; }
  set y(y) {
    // Limit y to completely fit player on canvas
    // const minY = 0;
    // const maxY = this.game.height - this.height;
    this._y = y; // limitNum(y, minY, maxY);
  }

  // Draw the GameObject on the canvas
  draw() {
    if (!this._isOnCanvas && this.game.ctx) {
      // Style the GameObject
      this.game.ctx.fillStyle = this.color;
      // Draw the GameObject
      this.game.ctx.fillRect(this.x, this.y, this.height, this.width);

      // Update status
      this._isOnCanvas = true;
    }
  }

  // Remove the GameObject from the canvas
  erase() {
    // Remove the GameObject from the canvas
    if (this._isOnCanvas && this.game.ctx) {
      this.game.ctx.clearRect(this.x, this.y, this.height, this.width);
      this.game.ctx.beginPath();
      // Update status
      this._isOnCanvas = false;
    }
  }

  // Redraw the GameObject on the canvas
  redraw(update: Function) {
    // Remove old GameObject
    this.erase();

    if (update) update();

    // Re-add GameObject
    this.draw();
  }

  onResize(e: Event) {
    this.redraw(() => {
      this.x = this.game.colSize * Math.floor(this.x / this.game.colSize);
      this.y = this.game.rowSize * Math.floor(this.y / this.game.rowSize);
      this.width = this.game.colSize;
      this.height = this.game.rowSize;
    });
  }
}