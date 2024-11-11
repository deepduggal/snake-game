/**
 * How this code works:
 * Classes: Game, GameObjects (ex. Snake, Food)
 * TODO: Game should include a separate GameMap instance (for a responsive map) and a Collison class that takes the Game as a constructor arg
 */
import { Game } from "./Game/Game";

// Init
window.addEventListener('load', function () {
  const game = new Game('#game-container');
  game.init();
  console.log('test');
  game.startGameLoop();
}, false);