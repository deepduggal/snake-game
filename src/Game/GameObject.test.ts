/**
 * Write unit tests for GameObject
 */
import { GameObject } from './GameObject';
import { Game } from './Game';

// Create a new Game instance for testing.
function createTestGame(): Game {
  return new Game('#game');
}

describe('GameObject', () => {
  it('should draw a rectangle on the canvas', () => {
    const game = createTestGame(); // TODO: Mock the game
    game.ctx.fillRect = jest.fn(); // Mock the fillRect method

    const gameObject = new GameObject(game, 0, 0, 10, 10);
    gameObject.draw();
    expect(game.ctx.fillRect).toHaveBeenCalled();
  });
});