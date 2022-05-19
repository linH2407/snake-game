const CANVAS_SIZE = [400, 400];
const SNAKE_START = [
  [8, 7],
  [8, 8]
];
const APPLE_START = [8, 3];
const SCALE = 40;
const SPEED = 200;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
  // 87: [0, -1], //w
  // 83: [0, 1], //s
  // 65: [-1, 0], //a
  // 68: [0, 1], //d
};
const DIRECT = {
  87: [0, -1], //w
  83: [0, 1], //s
  65: [-1, 0], //a
  68: [0, 1], //d
}
export {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START, 
  SCALE,
  SPEED,
  DIRECTIONS,
  DIRECT
};
