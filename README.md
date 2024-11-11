# Snake: The Game
A snake that eats food. Made with JS (canvas & no libraries). Responsive w/ swipe controls.

Play Now: [Snake Game](https://deepduggal.github.io/snake-game/src/index.html)


## Features
- Arrow keys to move or snake will automove (Done)
- Food spawns at a random location
- Eat the food and grow
- Lose by
  - Crashing into side (done)
  - Crashing into yourself
  - Going backwards (Currently doesn't move you backwards, but doesn't kill you).
- Responsive (Done)
- Touch Controls (Done)

## Future Features
- Local two player (WASD)
- More screen, remove square game shape requirement.

### Issues
- Can't move up
- Game over happens a few steps after player is off screen.
- Two yellow squares shown when food is eaten

- Using timers. Should use something else. requestAnimationFrame?
- Need to make the game show a message and restart when the game ends (currently some console logs). Maybe a menu.
