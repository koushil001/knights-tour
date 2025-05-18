const dx = [2, 1, -1, -2, -2, -1, 1, 2];
const dy = [1, 2, 2, 1, -1, -2, -2, -1];

let board = [];
let N = 8;
let path = []; // knight's moves path
let animationRunning = false;

const boardDiv = document.getElementById('board');
const speedInput = document.getElementById('speed');
const speedDisplay = document.getElementById('speedDisplay');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const currentMoveDisplay = document.getElementById('currentMove');
const showPathCheckbox = document.getElementById('showPath');

speedInput.addEventListener('input', () => {
  speedDisplay.textContent = speedInput.value + 'ms';
});

startBtn.addEventListener('click', () => {
  if(animationRunning) return; // Prevent starting multiple times
  startTour();
});

resetBtn.addEventListener('click', () => {
  if(animationRunning) return; // Prevent reset during animation
  resetBoard();
});

function isSafe(x, y) {
  return x >= 0 && y >= 0 && x < N && y < N && board[x][y] === -1;
}

function countOnwardMoves(x, y) {
  let count = 0;
  for(let i=0; i<8; i++) {
    let nx = x + dx[i];
    let ny = y + dy[i];
    if(isSafe(nx, ny)) count++;
  }
  return count;
}

function solveKnightTour(x, y, movei) {
  board[x][y] = movei;
  path.push({x, y});

  if(movei === N * N - 1) return true;

  let nextMoves = [];
  for(let i=0; i<8; i++) {
    let nx = x + dx[i];
    let ny = y + dy[i];
    if(isSafe(nx, ny)) {
      nextMoves.push({x: nx, y: ny, onward: countOnwardMoves(nx, ny)});
    }
  }

  nextMoves.sort((a,b) => a.onward - b.onward);

  for(let move of nextMoves) {
    if(solveKnightTour(move.x, move.y, movei + 1)) return true;
  }

  board[x][y] = -1;
  path.pop();
  return false;
}

function drawInitialBoard() {
  boardDiv.innerHTML = '';
  boardDiv.style.gridTemplateColumns = `repeat(${N}, 50px)`;
  for(let i=0; i<N; i++) {
    for(let j=0; j<N; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Add checker pattern: if sum of indices is even -> white else black
      if((i + j) % 2 === 0) cell.classList.add('white');
      else cell.classList.add('black');

      cell.id = `cell-${i}-${j}`;
      boardDiv.appendChild(cell);
    }
  }
}

function clearBoardDisplay() {
  for(let i=0; i<N; i++) {
    for(let j=0; j<N; j++) {
      const cell = document.getElementById(`cell-${i}-${j}`);
      cell.innerHTML = '';
    }
  }
  currentMoveDisplay.textContent = "Move: 0";
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateKnightTour() {
  animationRunning = true;
  for(let i=0; i<path.length; i++) {
    clearBoardDisplay();

    const {x, y} = path[i];
    const cell = document.getElementById(`cell-${x}-${y}`);

    // Add knight image
    const img = document.createElement('img');
    img.src = 'images/knight.png'; // make sure this path is correct
    img.classList.add('knight');
    cell.appendChild(img);

    // Show move number if enabled
    if(showPathCheckbox.checked) {
      path.slice(0, i + 1).forEach(({x, y}, idx) => {
        const c = document.getElementById(`cell-${x}-${y}`);
        const stepNum = document.createElement('span');
        stepNum.classList.add('step-number');
        stepNum.textContent = idx;
        c.appendChild(stepNum);
      });
    }

    currentMoveDisplay.textContent = `Move: ${i}`;

    await delay(parseInt(speedInput.value));
  }
  animationRunning = false;
}

function startTour() {
  N = parseInt(document.getElementById('boardSize').value);
  if(isNaN(N) || N < 5 || N > 9) {
    alert('Please enter a board size between 5 and 9');
    return;
  }

  board = Array.from({length: N}, () => Array(N).fill(-1));
  path = [];
  drawInitialBoard();

  if(solveKnightTour(0, 0, 0)) {
    animateKnightTour();
  } else {
    alert('No solution exists for this board size.');
  }
}

function resetBoard() {
  board = Array.from({length: N}, () => Array(N).fill(-1));
  path = [];
  drawInitialBoard();
  currentMoveDisplay.textContent = "Move: 0";
}

// Initial setup
drawInitialBoard();
