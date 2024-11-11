import { type Game } from "../Game/Game";
import { GameObject } from "../Game/GameObject";
import { type SnakeDirection } from "../lib/types/Snake/Snake";

export class SnakeNode extends GameObject {
  static _defaultStyles = { color: '#ffda44' };
  direction: SnakeDirection;
  horizontalMoveAmt: number;
  verticalMoveAmt: number;
  length: number;

  constructor(game: Game, startX: number, startY: number, height: number, width: number, direction: SnakeDirection, styles = SnakeNode._defaultStyles) {
    super(game, startX, startY, height, width, styles);

    this.game = game;
    this.direction = 'down'; // The snake's current direction
    this.horizontalMoveAmt = game.colSize; // The amount the snake moves horizontally
    this.verticalMoveAmt = game.rowSize; // The amount the snake moves vertically
    this.length = 1; // The snake's length
  }
}