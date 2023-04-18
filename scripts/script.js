// Define GameBoard - IIFE module
const GameBoard = (() => {
  // board is an array of objects - row / column / object
  const _board = new Array(9);

  const winningCellCombos = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const addToBoard = (token, cellId) => {
    if (_board[cellId] === undefined) {
      _board[cellId] = token;
    }
  };

  const emptyBoard = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = undefined;
    }
  };

  const getBoard = () => _board;

  const checkArrayFull = () => {
    return _board.includes(null);
  };

  const checkGameStatus = () => {
    let gameStatus = "";

    if (!_board.includes(undefined)) {
      gameStatus = "draw";
    }

    winningCellCombos.forEach((item) => {
      if (
        _board[item[0]] === _board[item[1]] &&
        _board[item[0]] === _board[item[2]] &&
        _board[item[0]] != null
      ) {
        gameStatus = "win";
      }
    });

    return gameStatus;
  };

  return {
    addToBoard,
    checkArrayFull,
    emptyBoard,
    checkGameStatus,
    getBoard,
  };
})();

// Define players - factory functions
const Player = (playerName) => {
  let token = null;
  let name = playerName;

  return { token, name };
};

// Defines screen controller IIFE module for screen related logic
const ScreenController = (() => {
  const gameBoard = document.querySelector(".game-screen");
  const menu = document.querySelector(".menu-container");
  const playerStatusP = document.querySelector(".player-status");
  const restartButton = document.querySelector(".restart-button-container");

  const displayHomeScreen = () => {
    gameBoard.style.display = "none";
    menu.style.display = "flex";
    hideRestartButton();
  };

  const hideHomeScreen = () => {
    menu.style.display = "none";
    gameBoard.style.display = "grid";
  };

  const hideRestartButton = () => (restartButton.style.display = "none");

  const displayRestartButton = () => (restartButton.style.display = "block");

  const initButtons = () => {
    const playerButtons = document.querySelectorAll(".player-buttons");
    playerButtons.forEach((item) => {
      item.style.color = "black";
      item.style.backgroundColor = "transparent";
    });
  };

  const changeButtons = (button) => {
    const noughts = document.getElementById("noughts");
    const crosses = document.getElementById("crosses");

    if (button.id === "noughts") {
      noughts.style.backgroundColor = "black";
      noughts.style.color = "blanchedalmond";
      crosses.style.backgroundColor = "blanchedalmond";
      crosses.style.color = "black";
    } else {
      noughts.style.color = "black";
      noughts.style.backgroundColor = "blanchedalmond";
      crosses.style.color = "blanchedalmond";
      crosses.style.backgroundColor = "black";
    }
  };

  const displayArray = () => {
    let cellValue;

    const GameBoardCells = document.querySelectorAll(".square");
    GameBoardCells.forEach(function (item) {
      cellValue = GameBoard.getBoard()[item.id];
      if (cellValue != undefined) {
        item.textContent = cellValue;
      }
    });
  };

  const clearGameBoard = () => {
    const GameBoardCells = document.querySelectorAll(".square");
    GameBoardCells.forEach((item) => (item.textContent = ""));
  };

  const gameStatus = (player) => {
    playerStatusP.textContent = `${player.name}'s Turn`;
  };

  const gameWinner = (player) => {
    playerStatusP.textContent = `${player.name} wins!`;
    displayRestartButton();
  };

  const draw = () => {
    playerStatusP.textContent = "It's a Draw!";
    displayRestartButton();
  };

  return {
    changeButtons,
    clearGameBoard,
    displayHomeScreen,
    displayArray,
    draw,
    hideHomeScreen,
    gameStatus,
    gameWinner,
    initButtons,
  };
})();

// Defines game controller IIFE module
const GameController = (() => {
  const PlayerOne = Player("Player One");
  const PlayerTwo = Player("Player Two");
  const players = [PlayerOne, PlayerTwo];
  let _currentPlayer = players[0];

  const startGame = () => {
    ScreenController.hideHomeScreen();
    playGame();
  };

  const homeScreen = () => {
    GameBoard.emptyBoard();
    ScreenController.clearGameBoard();
    ScreenController.initButtons();
    PlayerOne.token = "0";
    PlayerTwo.token = "X";
    _currentPlayer = players[0];

    ScreenController.displayHomeScreen();
    document.querySelectorAll(".player-buttons").forEach((item) => {
      item.addEventListener("click", () => {
        if (item.textContent === "X") {
          PlayerOne.token = "X";
          PlayerTwo.token = "0";
          _currentPlayer = players[0];
        } else {
          PlayerOne.token = "0";
          PlayerTwo.token = "X";
          _currentPlayer = players[1];
        }
        ScreenController.changeButtons(item);
      });
    });
    document
      .getElementById("start-button")
      .addEventListener("click", startGame);
  };
  homeScreen();

  const switchPlayer = () =>
    _currentPlayer === players[0]
      ? (_currentPlayer = players[1])
      : (_currentPlayer = players[0]);

  const gameBoardLogic = function () {
    GameBoard.addToBoard(_currentPlayer.token, this.id);
    ScreenController.displayArray();
    if (GameBoard.checkGameStatus() === "win") {
      ScreenController.gameWinner(_currentPlayer);
      stopGame();
    } else if (GameBoard.checkGameStatus() === "draw") {
      ScreenController.draw();
      stopGame();
    } else {
      switchPlayer();
      ScreenController.gameStatus(_currentPlayer);
    }
  };

  const playGame = () => {
    ScreenController.displayArray();
    ScreenController.gameStatus(_currentPlayer);

    document.querySelectorAll(".square").forEach((item) => {
      item.addEventListener("click", gameBoardLogic);
    });
  };

  const stopGame = () => {
    document.querySelectorAll(".square").forEach((item) => {
      item.removeEventListener("click", gameBoardLogic);
    });

    document
      .getElementById("restart-button")
      .addEventListener("click", homeScreen);
  };
})();
