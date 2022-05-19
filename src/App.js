import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  DIRECT,
} from "./constants";

const App = () => {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [pause, setPause] = useState(false);

  
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
    (keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode])) ||
      (keyCode === 87 &&
        keyCode === 83 &&
        keyCode === 65 &&
        keyCode === 68 &&
        setDir(DIRECT[keyCode]));
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
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(score);
    setPause(true);
  };
  const pauseGame = () => {
    setSpeed(null);
  };
  const playGameAgain = () => {
    setSpeed(SPEED);
  };

  

  return (
    <div className=" mt-8 text-center">
      <h1 className="text-xl mb-4 font-bold ">Snake Game</h1>
      <p className="mb-2 text-lg font-medium text-gray-800">Score: {score}</p>
      <div
        role="button"
        tabIndex="0"
        onKeyDown={(e) => moveSnake(e)}
        className=""
      >
        <canvas
          style={{ border: "1px solid black" }}
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
          className="mx-auto"
        />

        {gameOver && (
          <div className="text-2xl mt-4 font-semibold">GAME OVER!</div>
        )}
        <div className="w-[400px] mx-auto">
          <div className="flex justify-between ">
            <button
              onClick={startGame}
              className="bg-gray-800 text-white px-3 py-1 rounded-md font-semibold border-none outline-none hover:bg-black mt-4"
            >
              Start Game
            </button>

            {pause && (
              <div className="flex gap-2">
                <button
                  onClick={pauseGame}
                  className="bg-gray-800 text-white px-3 py-1 rounded-md font-semibold border-none outline-none hover:bg-black mt-4"
                >
                  Pause
                </button>
                <button
                  onClick={playGameAgain}
                  className="bg-gray-800 text-white px-4 py-1 rounded-md font-semibold border-none outline-none hover:bg-black mt-4"
                >
                  Play
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
