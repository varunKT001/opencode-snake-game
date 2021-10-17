import React, { useState, useEffect } from 'react';
import Snake from './components/Snake';
import Insect from './components/Insect';

//initial state of snake
const initialState = {
  pos: [{ left: 20, top: 20 }],
  speed: 200,
  dir: '',
  score: 0,
};

const size = 4;

//Random position generator for insect
const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / size) * size;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / size) * size;
  return { left: x, top: y };
};

//get high score
const getLocalHighScore = () => {
  let localHighScore = localStorage.getItem('score');
  if (localHighScore != null || localHighScore != undefined) {
    return localHighScore;
  }
  return 0;
};

//set high score
const setLocalHighScore = (n) => {
  localStorage.setItem('score', n);
};

function App() {
  //playing
  const [playing, setPlaying] = useState(false);

  //started
  const [started, setStarted] = useState(false);

  //score
  const [score, setScore] = useState(initialState.score);

  //high score
  const [highScore, setHighScore] = useState(getLocalHighScore());

  //snake cordinates
  const [snakeCordinates, setSnakeCordinates] = useState(initialState.pos);

  //insect cordinates
  const [insectCordinates, setInsectCordinates] = useState(
    getRandomCoordinates()
  );

  //snake direction
  const [direction, setDirection] = useState(initialState.dir);

  //snake speed
  const [speed, setSpeed] = useState(initialState.speed);

  //gameover
  const [gameover, setGameover] = useState(false);

  //play
  const play = () => {
    setPlaying((prev) => {
      return !prev;
    });
    setStarted(false);
    restart();
  };

  //handle user input
  const handleKeyPress = (e) => {
    e = e || window.event;
    setStarted(true);
    switch (e.keyCode) {
      case 38:
        setDirection('UP');
        break;
      case 40:
        setDirection('DOWN');
        break;
      case 37:
        setDirection('LEFT');
        break;
      case 39:
        setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  //moving the snake
  const moveSnake = () => {
    //take temporary positions
    let tempSnakePosition;
    let dir;
    //get fresh cordinates
    setSnakeCordinates((prev) => {
      tempSnakePosition = [...prev];
      return prev;
    });
    setDirection((prev) => {
      dir = prev;
      return prev;
    });
    //find head
    let tempHead = tempSnakePosition[tempSnakePosition.length - 1];
    //change head
    let l = tempHead.left;
    let t = tempHead.top;
    switch (dir) {
      case 'RIGHT':
        l = tempHead.left + size;
        break;
      case 'LEFT':
        l = tempHead.left - size;
        break;
      case 'DOWN':
        t = tempHead.top + size;
        break;
      case 'UP':
        t = tempHead.top - size;
        break;
      default:
        break;
    }
    //update head
    tempHead = { left: l, top: t };
    tempSnakePosition.push(tempHead);
    //remove tail
    tempSnakePosition.shift();
    //update snake
    setSnakeCordinates(tempSnakePosition);
  };

  const gameOver = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setGameover(true);
  };

  //restart game
  const restart = () => {
    setSnakeCordinates(initialState.pos);
    setInsectCordinates(getRandomCoordinates());
    setDirection(initialState.dir);
    setSpeed(initialState.speed);
    setStarted(false);
    setGameover(false);
    setScore(initialState.score);
  };

  //check if snake collided with wall
  const checkWall = () => {
    let head = snakeCordinates[snakeCordinates.length - 1];
    if (head.left >= 100 || head.top >= 100 || head.left < 0 || head.top < 0) {
      gameOver();
    }
  };

  //check if snake eaten himself
  const checkSnake = () => {
    let tempSnakeCordinates = [...snakeCordinates];
    let tempHead = tempSnakeCordinates[tempSnakeCordinates.length - 1];
    tempSnakeCordinates.pop();
    tempSnakeCordinates.some((part) => {
      if (part.left == tempHead.left && part.top == tempHead.top) {
        gameOver();
      }
    });
  };

  //check if insect eaten
  const checkInsect = () => {
    let tempSnakeCordinates = [...snakeCordinates];
    let tempHead = tempSnakeCordinates[tempSnakeCordinates.length - 1];
    let tempInsect = { ...insectCordinates };
    if (tempHead.left == tempInsect.left && tempHead.top == tempInsect.top) {
      setInsectCordinates(getRandomCoordinates);
      increaseSnakeLength();
      increaseSnakeSpeed();
      setScore((prev) => {
        return prev + 10;
      });
    }
  };

  //inc. length
  const increaseSnakeLength = () => {
    let tempSnakeCordinates = [...snakeCordinates];
    tempSnakeCordinates.unshift({});
    setSnakeCordinates(tempSnakeCordinates);
  };

  //inc. speed
  const increaseSnakeSpeed = () => {
    setSpeed((prev) => {
      if (prev <= 25) {
        return prev;
      }
      return prev - 25;
    });
  };

  useEffect(() => {
    checkWall();
    checkSnake();
    checkInsect();
  }, [snakeCordinates]);

  useEffect(() => {
    setLocalHighScore(highScore);
  }, [highScore]);

  useEffect(() => {
    //move snake every speed ms
    let interval = setInterval(moveSnake, speed);
    //track user input
    document.onkeydown = handleKeyPress;
    //cleanup
    return () => clearInterval(interval);
  }, []);

  if (!playing) {
    return (
      <React.Fragment>
        <header className='container'>
          <div className='px-4 pt-5 my-5 text-center'>
            <h1 className='page-heading display-4 font-weight-bold'>
              Sneeky Snake
            </h1>
            <div className='col-lg-6 mx-auto'>
              <p className='lead mb-4'>How much can you go without loosing ?</p>
            </div>
          </div>
          <div className='px-4 pt-5 my-5'>
            <div className='col-lg-6 mx-auto'>
              <h3 className='font-weight-bold mb-3 mx-auto'>Rules:</h3>
              <p className='mb-0'>
                1. Use Arrow Keys to move LEFT, RIGHT, UP and DOWN.
              </p>
              <p className='mb-0'>2. If you hit the wall, the game is over.</p>
              <p className='mb-0'>3. If you bit yourself, the game is over.</p>
              <p className='mb-0'>
                4. Eat the insect to increase your snake's length as well as
                your score.
              </p>
              <div className='p-3 py-1 mt-3 rounded bg-info text-white font-weight-bold'>
                <strong>Note</strong>
                <p className='mb-1'>
                  Eating the insect will increase the speed of movement and
                  hence increasing dificulty
                </p>
              </div>
              <button onClick={play} className='btn btn-primary mt-3'>
                Play Now
              </button>
            </div>
          </div>
        </header>
      </React.Fragment>
    );
  }

  //if gameover
  if (gameover) {
    return (
      <main className='gameover-container container d-flex flex-column justify-content-center align-items-center'>
        <h1>Game Over</h1>
        <h4>Your Score: {score}</h4>
        <h4>High Score: {highScore}</h4>
        <div>
          <button className='btn btn-lg btn-primary mt-3 mx-1' onClick={play}>
            Back
          </button>
          <button className='btn btn-lg btn-danger mt-3 mx-1' onClick={restart}>
            Restart
          </button>
        </div>
      </main>
    );
  }

  return (
    <React.Fragment>
      <main class='game-main container d-flex flex-column justify-content-center align-item-center'>
        {!started ? (
          <h3 className='text-center mt-3 mb-3'>Press any key to continue</h3>
        ) : (
          <h3 className='text-center mt-3 mb-3'>{score}</h3>
        )}
        <div className='game-container'>
          <Snake snakePosition={snakeCordinates} />
          <Insect insectPosition={insectCordinates} />
        </div>
      </main>
    </React.Fragment>
  );
}

export default App;
