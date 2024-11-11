import { Food } from "@/Food/Food";
import { Snake } from "@/Snake/Snake";
import { Collisions } from "@/physics/collisions";
import ClassUtils from "@/utils/ClassUtils";

// TODO: SnakeGame extends Game
export class Game {
  ctx: CanvasRenderingContext2D | null;
  colSize: number;
  rowSize: number;
  container: HTMLElement | null;
  canvas: HTMLCanvasElement;
  _rows: number;
  _cols: number;
  opts: { speed: number; };
  _gameLoopTimer: number | null;
  _players: Snake[];
  _foods: Food[];
  _isGameOver: boolean;
  _touchData: { startX: number, startY: number };
  constructor(containerSelector: string) {
    // Set page-related values
    this.container = document.querySelector(containerSelector);

    /** Create the canvas and get the 2D rendering context */
    // Create a canvas element
    this.canvas = document.createElement('canvas');
    // Get the 2D rendering context
    this.ctx = this.canvas.getContext('2d');

    // Set the canvas height and width
    const containerRect = this.container?.getBoundingClientRect() ?? null;
    if (containerRect) {
      const smallerOfHeightWidth = Math.floor(Math.min(containerRect.height, containerRect.width)); // Square game, not rectangle
      this.canvas.height = smallerOfHeightWidth;
      this.canvas.width = smallerOfHeightWidth;
    }

    // Set GameMap values
    // 2D Coordinate System: Set the number of rows and columns
    this._rows = 10; // Keep _rows and _cols the same, for square game
    this._cols = 10;
    this.rowSize = Math.floor(this.width / this._rows);
    this.colSize = Math.floor(this.height / this._cols);
    // this.cellSize

    // Customize game values (ex. speed)
    this.opts = {
      speed: 1000
    };
    this._gameLoopTimer = null;
    this._players = [new Snake(this)];
    this._foods = [];
    this._isGameOver = false;

    // Events
    this._touchData = {
      startX: 0,
      startY: 0
    };

    // Bind this for class methods
    ClassUtils.bindMethods(['_beforeLoad', '_onGestureStart', '_onGestureEnd', '_onResize', '_onKeyDown', '_addEventListeners',
      'init', 'startGameLoop', 'stopGameLoop', 'updateGame',
      'gameOver', 'spawnFood', 'addFood', 'removeFood', 'handlePlayerCollisions'], this);
  }

  get height() { return this.canvas.height; }
  get width() { return this.canvas.width; }
  get rows() { return this._rows; }
  get cols() { return this._cols; }

  /** Add the canvas to the page */
  _addCanvasToPage() {
    // Append the canvas to parent element
    if (this.container) {
      this.container.appendChild(this.canvas);
    }
  }

  // Show a menu/title screen before the game starts
  _beforeLoad() {
    if (this.ctx) {
      // Set the font
      this.ctx.font = '48px Montserrat';
      // Back-up Text
      this.ctx.fillText('Snake', 10, 50);
    }
  }
  // Initialize the game.
  init() {
    // Add player 1 to canvas
    this._players[0].draw();

    this._addCanvasToPage();

    this._addEventListeners();
  }
  // Start the game
  startGameLoop() {
    // TODO: Use requestAnimationFrame(), not a timer.
    // TODO: Use setInterval, but fix the player going off-screen first
    // TODO: Should clearInterval
    // Start the game loop
    this._gameLoopTimer = window.setInterval(this.updateGame, this.opts.speed);
  }
  // Stop the game
  stopGameLoop() {
    // Stop the game loop
    if (this._gameLoopTimer !== null) {
      clearInterval(this._gameLoopTimer);
      this._gameLoopTimer = null;
    }
  }

  handlePlayerCollisions() {
    this._players.forEach((player) => {
      const foodsPlayerCollidedWith = Collisions.collidedWith(player.head, this._foods);

      // Player collided with wall
      if (Collisions.didCollideWithWall(this, player.head)) {
        console.log('Wall collision!')
        // player.kill();
        this.gameOver();
      }

      // TODO: Player collided with self
      // else if () {

      // }

      // Check if player collided with any foods
      else if (foodsPlayerCollidedWith.length > 0) {
        foodsPlayerCollidedWith.forEach(food => {
          player.eat(food);
        });
      }
      else {
        // Auto-move player
        player.continue();
        // Add food to game
        this.spawnFood();
      }
    });
  }
  // Specify the game loop. Auto update values here.
  updateGame() {
    console.log('updateGame');
    if (!this._isGameOver) {
      this.handlePlayerCollisions();
    } else {
      // Game over
      this.gameOver();
    }
  }

  spawnFood() {
    if (this._foods.length === 0) {
      this.addFood();
      console.log('spawnFood', this._foods);
    }
  }

  addFood() {
    const food = new Food(this);
    // Add food to canvas
    food.draw();
    // Add food to game
    this._foods.push(food);
  }
  removeFood(food: Food) {
    food.becomeEaten();
    this._foods = this._foods.filter(food => food !== food);
  }

  gameOver() {
    console.log('Game Over!');
    this._isGameOver = true;
    this.stopGameLoop();
  }

  /** Event Handlers */
  _onGestureStart(e: TouchEvent) {
    e.preventDefault();

    // if (e.touches && e.touches.length > 1) {
    //   return;
    // }

    // Store touch start
    this._touchData = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    };
  }
  _onGestureEnd(e: TouchEvent) {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let deltaX = touchEndX - this._touchData.startX;
    let deltaY = touchEndY - this._touchData.startY;

    // 1st player swipe controls
    // Determine the direction of the swipe
    let swipeDirection: "up" | "right" | "down" | "left";
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        swipeDirection = 'right';
        this._players[0].onSwipe(swipeDirection);
      } else {
        swipeDirection = 'left';
        this._players[0].onSwipe(swipeDirection);
      }
    } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
      if (deltaY > 0) {
        swipeDirection = 'down';
        this._players[0].onSwipe(swipeDirection);
      } else {
        swipeDirection = 'up';
        this._players[0].onSwipe(swipeDirection);
      }
    }


    // Reset touch data
    this._touchData = {
      startX: 0,
      startY: 0
    };
  }
  // _onGestureMove(e: TouchEvent) {

  // }
  // _onGestureCancel(e: TouchEvent) {

  // }
  _onKeyDown(e: KeyboardEvent) {
    if (!this._isGameOver) {
      e.preventDefault();
      // Call each player's keydown method
      // TODO: When canvas is focused, e.preventDefault()e.stopPropagation();
      this._players.forEach(player => {
        player._onKeyDown(e);
      });
    }
  }
  _onResize(e: Event) {
    // Resize the canvas
    const containerRect = this.container?.getBoundingClientRect() ?? null;
    if (containerRect) {
      const smallerOfHeightWidth = Math.floor(Math.min(containerRect.height, containerRect.width)); // Square game, not rectangle
      this.canvas.height = smallerOfHeightWidth;
      this.canvas.width = smallerOfHeightWidth;
    }

    // TODO: Update game coordinate system
    this.rowSize = Math.floor(this.width / this._rows);
    this.colSize = Math.floor(this.height / this._cols);

    // Redraw all GameObjects that are on the canvas
    this._players.forEach(player => {
      player.onResize(e);
    });
    this._foods.forEach(food => {
      food.onResize(e);
    });
  }
  _addEventListeners() {
    // Main Menu
    document.body.addEventListener('DOMContentLoaded', this._beforeLoad, false);
    // Keyboard
    document.body.addEventListener('keydown', this._onKeyDown, false);

    // Touch
    this.canvas.addEventListener('touchstart', this._onGestureStart, true);
    // this.canvas.addEventListener('pointermove', this.handleGestureMove, true);
    this.canvas.addEventListener('touchend', this._onGestureEnd, true);
    // this.canvas.addEventListener('pointercancel', this.handleGestureEnd, true);


    // Add event listener to resize the canvas when the window size changes
    window.addEventListener('resize', this._onResize, false);
  }
}