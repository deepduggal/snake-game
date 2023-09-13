/**
 * How this code works:
 * Classes: Game, GameObjects (ex. Snake, Food)
 * TODO: Game should include a separate GameMap instance (for a responsive map) and a Collison class that takes the Game as a constructor arg
 */

/** Math */
const limitNum = (num, min, max) => Math.min(Math.max(num, min), max);
const isInRange = (num, min, max) => num >= min && num <= max;

/** Utils */
const ClassUtils = {
  // Bind classInstance to methods
  bindMethods(classMethodNames, classInstance) {
    classMethodNames.forEach(classMethod => {
      classInstance[classMethod] = classInstance[classMethod].bind(classInstance);
    });
  }
};

/** Collision Methods */
class Collisions {
  // Check if next position values of a gameObject would be within canvas
  static willCollideWithWall(game, nextX, nextY) {
    // Check if gameObject is within canvas
    const minX = 0;
    const maxX = game.width - gameObject.width;
    const minY = 0;
    const maxY = game.height - gameObject.height;
    const willBeOnCanvas = isInRange(nextX, minX, maxX) && isInRange(nextY, minY, maxY);

    return !willBeOnCanvas;
  }

  static didCollideWithWall(game, gameObject) {
    // Check if gameObject is within canvas
    const minX = 0;
    const maxX = game.width - gameObject.width;
    const minY = 0;
    const maxY = game.height - gameObject.height;
    const isOnCanvas = isInRange(gameObject.x, minX, maxX) && isInRange(gameObject.y, minY, maxY);

    return !isOnCanvas;
  }

  // Check if a and b collided
  static didCollide(a, b) {
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
  static collidedWith(gameObject, multiple) {
    return multiple.filter(oneOf => Collisions.didCollide(gameObject, oneOf));
  }
}

/**
 * A thing that exists in the game. It has a size and position.
 */
class GameObject {
  constructor(game, startX, startY, height, width, styles = { color: '#fff' }) {
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

    ClassUtils.bindMethods(['add', 'remove', 'redraw', 'onResize'], this);
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

  add() {
    if (!this._isOnCanvas) {
      // Style the GameObject
      this.game.ctx.fillStyle = this.color;
      // Draw the GameObject
      this.game.ctx.fillRect(this.x, this.y, this.height, this.width);

      // Update status
      this._isOnCanvas = true;
    }
  }

  remove() {
    // Remove the GameObject from the canvas
    if (this._isOnCanvas) {
      this.game.ctx.clearRect(this.x, this.y, this.height, this.width);
      this.game.ctx.beginPath();
      // Update status
      this._isOnCanvas = false;
    }
  }

  redraw(update) {
    // Remove old GameObject
    this.remove();

    if (update) update();

    // Re-add GameObject
    this.add();
  }

  onResize(e) {
    this.redraw(() => {
      this.x = this.game.colSize * Math.floor(this.x / this.game.colSize);
      this.y = this.game.rowSize * Math.floor(this.y / this.game.rowSize);
      this.width = this.game.colSize;
      this.height = this.game.rowSize;
    });
  }
}

// TODO: Snake extends Player
class Snake extends GameObject {
  static _defaultStyles = { color: '#ffda44' };
  static triedMovingBackwards(direction, newDirection) {
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

  constructor(game, styles = Snake._defaultStyles) {
    super(game, 0, 0, game.colSize, game.rowSize, styles);

    // Set snake values
    this.direction = 'down'; // The snake's current direction
    this.horizontalMoveAmt = game.colSize; // The amount the snake moves horizontally
    this.verticalMoveAmt = game.rowSize; // The amount the snake moves vertically
    this.length = 1; // The snake's length

    ClassUtils.bindMethods(['onKeyDown', 'onSwipe', 'onResize', 'move', 'continue', 'eat', 'grow'], this);
  }

  // Remove and re-add snake from game
  move(direction = this.direction) {
    // Don't move if snake is moving backwards
    if (Snake.triedMovingBackwards(this.direction, direction)) {
      return;
    }
    // Update the snake's position and direction values
    let updatePosition;
    switch (direction) {
      case 'up':
        updatePosition = () => {
          this.y -= this.verticalMoveAmt;
          this.direction = 'up';
        };
        break;
      case 'right':
        updatePosition = () => {
          this.x += this.horizontalMoveAmt;
          this.direction = 'right';
        };
        break;
      case 'down':
        updatePosition = () => {
          this.y += this.verticalMoveAmt;
          this.direction = 'down';
        };
        break;
      case 'left':
        updatePosition = () => {
          this.x -= this.horizontalMoveAmt;
          this.direction = 'left';
        };
        break;
      default:
        console.error('no snake switch match');
        break;
    }
    this.redraw(updatePosition);
  }

  // Move the snake in the current direction
  continue() {
    // this.move(this.direction);
  }

  eat(food) {
    // Remove food from canvas
    food.becomeEaten();
    // Grow the snake
    this.grow();
  }
  // TODO: Eat something to grow the snake
  grow() {
    // TODO: Do something if the snake eats food and grows
    this.length++;
    console.log(this.length);
  }

  onSwipe(direction) {
    this.move(direction);
  }

  onKeyDown(e) {
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
        break;
    }
  }

  onResize(e) {
    this.redraw(() => {
      this.x = this.game.colSize * Math.floor(this.x / this.game.colSize);
      this.y = this.game.rowSize * Math.floor(this.y / this.game.rowSize);
      this.height = this.game.rowSize;
      this.width = this.game.colSize;
    });
  }
}
class Food extends GameObject {
  constructor(game, styles = { color: '#ffffff' }) {
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
    this.game.removeFood(this);
  }

  onResize(e) {
    this.redraw(() => {
      this.x = this.game.colSize * Math.floor(this.x / this.game.colSize);
      this.y = this.game.rowSize * Math.floor(this.y / this.game.rowSize);
      this.height = this.game.rowSize;
      this.width = this.game.colSize;
    });
  }
}

class Game {
  constructor(containerSelector) {
    // Set page-related values
    this.container = document.querySelector(containerSelector);

    /** Create the canvas and get the 2D rendering context */
    // Create a canvas element
    this.canvas = document.createElement('canvas');
    // Get the 2D rendering context
    this.ctx = this.canvas.getContext('2d');

    // Set the canvas height and width
    const containerRect = this.container.getBoundingClientRect();
    const smallerOfHeightWidth = Math.floor(Math.min(containerRect.height, containerRect.width)); // Square game, not rectangle
    this.canvas.height = smallerOfHeightWidth;
    this.canvas.width = smallerOfHeightWidth;

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
    ClassUtils.bindMethods(['_onGestureStart', '_onGestureEnd', '_onResize', '_onKeyDown', '_addEventListeners',
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
    this.container.appendChild(this.canvas);
  }

  // Initialize the game.
  init() {
    // Add player 1 to canvas
    this._players[0].add(0, 0);

    this._addCanvasToPage();

    this._addEventListeners();
  }
  // Start the game
  startGameLoop() {
    // TODO: Use requestAnimationFrame(), not a timer.
    // TODO: Use setInterval, but fix the player going off-screen first
    // TODO: Should clearInterval
    // Start the game loop
    this._gameLoopTimer = setInterval(this.updateGame, this.opts.speed);
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
      const foodsPlayerCollidedWith = Collisions.collidedWith(player, this._foods);

      // Player collided with wall
      if (Collisions.didCollideWithWall(this, player)) {
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
    food.add();
    // Add food to game
    this._foods.push(food);
  }
  removeFood(foodToRemove) {
    foodToRemove.remove();
    this._foods = this._foods.filter(food => food !== foodToRemove);
  }

  gameOver() {
    console.log('Game Over!');
    this._isGameOver = true;
    this.stopGameLoop();
  }

  /** Event Handlers */
  _onGestureStart(e) {
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
  _onGestureEnd(e) {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let deltaX = touchEndX - this._touchData.startX;
    let deltaY = touchEndY - this._touchData.startY;

    // Determine the direction of the swipe
    let swipeDirection;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        swipeDirection = 'right';
      } else {
        swipeDirection = 'left';
      }
    } else {
      if (deltaY > 0) {
        swipeDirection = 'down';
      } else {
        swipeDirection = 'up';
      }
    }

    // 1st player swipe controls
    this._players[0].onSwipe(swipeDirection);

    // Reset touch data
    this._touchData = {
      startX: 0,
      startY: 0
    };
  }
  // _onGestureMove(e) {

  // }
  // _onGestureCancel(e) {

  // }
  _onKeyDown(e) {
    if (!this._isGameOver) {
      e.preventDefault();
      // Call each player's keydown method
      // TODO: When canvas is focused, e.preventDefault()e.stopPropagation();
      this._players.forEach(player => {
        player.onKeyDown(e);
      });
    }
  }
  _onResize(e) {
    // Resize the canvas
    const containerRect = this.container.getBoundingClientRect();
    const smallerOfHeightWidth = Math.floor(Math.min(containerRect.height, containerRect.width)); // Square game, not rectangle
    this.canvas.height = smallerOfHeightWidth;
    this.canvas.width = smallerOfHeightWidth;

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

// Event Listeners
document.body.addEventListener('DOMContentLoaded', function (e) {
  // Set the font
  ctx.font = '48px Montserrat';
  // Back-up Text
  ctx.fillText('Snake', 10, 50);
}, false);

// Init
window.addEventListener('load', function () {
  const game = new Game('#game-container');
  game.init();
  game.startGameLoop();
}, false);