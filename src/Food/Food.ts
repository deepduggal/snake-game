import { type Game } from "../Game/Game";
import { GameObject } from "../Game/GameObject";
import ClassUtils from "../utils/ClassUtils";
import { limitNum } from "../utils/MathUtils";

export class Food extends GameObject {
  isEaten: boolean;
  constructor(game: Game, styles = { color: '#ffffff' }) {
    const width = game.rowSize;
    const height = game.colSize;
    const randomX = limitNum(game.colSize * Math.floor(Math.random() * game.cols), 0, game.width - width);
    const randomY = limitNum(game.rowSize * Math.floor(Math.random() * game.rows), 0, game.height - height);

    super(game, randomX, randomY, height, width, styles);

    this.isEaten = false;

    ClassUtils.bindMethods(['becomeEaten', 'onResize'], this);
  }

  becomeEaten() {
    this.isEaten = true;
  }

  onResize(e: Event) {
    this.redraw(() => {
      this.x = this.game.colSize * Math.floor(this.x / this.game.colSize);
      this.y = this.game.rowSize * Math.floor(this.y / this.game.rowSize);
      this.height = this.game.rowSize;
      this.width = this.game.colSize;
    });
  }
}