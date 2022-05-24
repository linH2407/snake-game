import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants";

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [direction, setDirection] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [move, setMove] = useState([]);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "gray";

    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "black";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  useInterval(() => gameLoop(), speed);

  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };
  const moveSnake = ({ keyCode }) => {

    if (keyCode>=37 && keyCode<=40) {

      setMove(move => [...move, keyCode]);
      if(move[move.length-1]===37 && keyCode === 39 ) return DIRECTIONS[37];
      if(move[move.length-1]===39 && keyCode === 37 ) return DIRECTIONS[39];
      if(move[move.length-1]===38 && keyCode === 40 ) return DIRECTIONS[38];
      if(move[move.length-1]===40 && keyCode === 38 ) return DIRECTIONS[40];
      // console.log("key:",keyCode);
      // console.log(move);
      // console.log(move[move.length-1]);
      // console.log("-------------------------");
      setDirection(DIRECTIONS[keyCode])        
          
    }
    if (keyCode === 32 || gameOver) {
      setSpeed(null);
    }
    if (speed === null && keyCode === 32 && gameOver === false) {
      setSpeed(SPEED);
    }
  };

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      setScore(score + 1);

      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [
      snakeCopy[0][0] + direction[0],
      snakeCopy[0][1] + direction[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirection([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  const playGameAgain = ({ keyCode }) => {
    if (gameOver && keyCode === 13) {
      startGame();
      setScore(0);
    }
  };

  return (
    <div className=" mt-8 text-center">
      <h1 className="text-xl mb-4 font-bold ">Snake Game</h1>
      <p className="mb-2 text-lg font-medium text-gray-800">Score: {score}</p>
      <div
        role="button"
        tabIndex="0"
        onKeyDown={(e) => moveSnake(e)}
        onFocus={startGame}
        onKeyUp={(e) => playGameAgain(e)}
        className="outline-none"
      >
        <canvas
          style={{ border: "1px solid black" }}
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
          className="mx-auto"
        />

        {gameOver && (
          <div className="">
            <p className="mt-4 underline underline-offset-1 ">
              Press enter to restart the game
            </p>
            <p className="text-2xl mt-4 font-semibold">GAME OVER!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
