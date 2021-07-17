/**
 * Clears out the full lines and adds score to the player
 */
function arenaSweep() {
  let rowCount = 0;
  outer: for (let y = arena.length - 1; y > 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    rowCount += 1;
  }
  switch (rowCount) {
    case 1:
      player.score += 100;
      break;
    case 2:
      player.score += 300;
      break;
    case 3:
      player.score += 500;
      break;
    case 4:
      player.score += 800;
      break;
  }
}

/**
 * Checks if the arena and the player collide with each other
 * @param {number[][]} arena
 * @param {object} player
 * @returns {boolean}
 */

function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Creates a matrix for a given width and height
 * @param {number} w
 * @param {number} h
 * @returns {number[][]}
 */

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

/**
 * Returns a matrixx for a given piece type
 * @param {string} type
 * @returns {number[][]}
 */

function createPiece(type) {
  return JSON.parse(JSON.stringify(matrixes[type])) || null;
}

/**
 * Creates a bag jpp
 * @returns {string[]}
 */

function createBag() {
  return ["I", "L", "J", "O", "S", "Z", "T"].sort(() => Math.random() - 0.5);
}

/**
 *
 * @param {number[][]} matrix
 * @param {object} offset
 * @param {number} fixedColor
 */

function drawMatrix(matrix, offset, fixedColor) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = fixedColor || colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

/**
 * Gets the y location of the ghost piece
 * @returns {number}
 */

function checkGhostPiece() {
  var y = 20;
  savedY = 0;
  while (y > player.pos.y) {
    if (
      collide(arena, {
        matrix: player.matrix,
        pos: { x: player.pos.x, y: y },
      })
    ) {
      savedY = y;
    }
    y--;
  }
  return savedY - 1;
}

/**
 * Draws the ghost piece jpp
 */

function drawGhostPiece() {
  var matrix = player.matrix;
  theoryY = checkGhostPiece();
  drawMatrix(matrix, { x: player.pos.x, y: theoryY }, colors[8]);
}

/**
 * Draws the next queue
 * @param {string[]} nexts
 * @param {number} fixedColor
 */

function drawNext(nexts, fixedColor) {
  for (var next in nexts.slice(0, 5)) {
    createPiece(nexts[next])
      .forEach((row, i) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            nextctx.fillStyle = fixedColor || colors[value];
            nextctx.fillRect(
              x + (nextQueue.width / 40 - row.length / 2),
              1 + 2.5 * next + i,
              1,
              1
            );
          }
        });
      });
  }
}

/**
 * Draws the hold jpp
 * @param {number} fixedColor
 * @returns
 */

function drawHold(fixedColor) {
  if (!holdPiece) return;
  createPiece(holdPiece)
    .forEach((row, i) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          holdctx.fillStyle = fixedColor || colors[value];
          holdctx.fillRect(x + (hold.width / 40 - row.length / 2), 1 + i, 1, 1);
        }
      });
    });
}

/**
 * The global drawing function
 */

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  nextctx.fillStyle = "#000";
  nextctx.fillRect(0, 0, nextQueue.width, nextQueue.height);

  holdctx.fillStyle = "#000";
  holdctx.fillRect(0, 0, hold.width, hold.height);

  drawGhostPiece();
  drawNext(bag);
  drawHold(justHold ? "#888888" : undefined);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

/**
 * Holds a Tetromino
 */

function holdTeto() {
  if (!justHold) {
    justHold = true;
    if (holdPiece) {
      [holdPiece, player.pieceType] = [player.pieceType, holdPiece];
      playerReset(player.pieceType);
    } else {
      holdPiece = player.pieceType;
      playerReset();
    }
  }
}

/**
 * Puts the player matrix onto the board in order to save it.
 * @param {number[][]} arena
 * @param {object} player
 */

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

/**
 * flips a matrix around
 * @param {number[][]} matrix
 * @param {number} dir a number (-1, 1 or 2)
 */

function rotate(matrix, dir) {
  player.rotation += player.rotation + dir < 0 ? dir + 4 : dir;
  player.rotation %= 4;
  player.rotation = Math.abs(player.rotation);
  if (dir <= 1) {
    for (let y = 0; y < matrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
      }
    }
    if (dir > 0) {
      matrix.forEach((row) => row.reverse());
    } else {
      matrix.reverse();
    }
  } else {
    matrix.reverse();
    matrix.forEach((row) => row.reverse());
  }
}

/**
 * Returns the next piece to come
 * @returns {string}
 */

function getNextPiece() {
  /* if (bag.length <= 0) {
        bag = nextbag;
    } */
  while (bag.length <= 6) {
    if (nextbag.length <= 0) {
      nextbag = createBag();
    }
    bag.push(nextbag.shift());
  }
  return bag.shift();
}

/**
 * Drops the current piece one
 * @param {number} score The score to attribute to the player
 * @returns {boolean}
 */

function playerDrop(score, c) {
  player.score += score;
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    if (c) {
        player.score -= score;
        return false
    }
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
    return false;
  } else {
    dropCounter = 0;
    return true;
  }
}

/**
 * Hard drop jpp
 */

function playerHarddrop() {
  while (playerDrop(2));
}

/**
 * Moves the current piece
 * @param {number} offset
 */

function playerMove(offset) {
  player.pos.x += offset;
  if (collide(arena, player)) {
    player.pos.x -= offset;
  }
}

/**
 * Reset the board for the next piece. Also detects the player loss
 * @param {string} type
 */

function playerReset(type) {
  if (disableJustHold) {
    justHold = false;
    disableJustHold = false;
  }
  if (justHold) {
    disableJustHold = true;
  }
  player.rotation = 0;
  player.pieceType = type || getNextPiece();
  player.matrix = createPiece(player.pieceType);
  player.pos.y = 0;
  player.pos.x =
    ((arena[0].length / 2) | 0) -
    ((player.matrix[0].length % 2 == 0
      ? player.matrix[0].length / 2
      : player.matrix[0].length / 2 + 1) |
      0);
  if (collide(arena, player)) {
    bag = [];
    nextbag = [];
    holdPiece = null;
    arena.forEach((row) => row.fill(0));
    player.score = 0;
    updateScore();
    playerReset();
  }
}

/**
 * Rotationne the joueur (SRS Blackmagic here)
 * @param {number} dir
 */

function playerRotate(dir) {
  const table = player.pieceType == "I" ? ISRS : regularSRS;
  var endRotate =
    player.rotation + dir < 0
      ? player.rotation + dir + 4
      : player.rotation + dir;
  endRotate %= 4;
  for (var rotation in table[player.rotation]) {
    player.pos.x +=
      table[player.rotation][rotation][0] - table[endRotate][rotation][0];
    player.pos.y +=
      table[player.rotation][rotation][1] - table[endRotate][rotation][1];
    rotate(player.matrix, dir);
    if (collide(arena, player)) {
      rotate(player.matrix, -dir);
      player.pos.x -=
        table[player.rotation][rotation][0] - table[endRotate][rotation][0];
      player.pos.y -=
        table[player.rotation][rotation][1] - table[endRotate][rotation][1];
    } else {
      break;
    }
  }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;

/**
 * The main loop of the game
 * @param {number} time
 */

function update(time = 0) {
  const deltaTime = time - lastTime;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop(0);
  }

  lastTime = time;

  draw();
  requestAnimationFrame(update);
  updateScore();
  manageControls();
}

/**
 * Updates the displayed score
 */

function updateScore() {
  document.getElementById("score").innerText = player.score;
}

const colors = [
  null,
  "#0DC2FF",
  "orange",
  "#0D00ff",
  "#ffff00",
  "#FF000D",
  "#00ff00",
  "purple",
  "#888888",
];

const arena = createMatrix(10, 20);

const player = {
  pos: { x: 0, y: 0 },
  matrix: null,
  pieceType: null,
  rotation: 0,
  score: 0,
  rotation: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("tetris");
  context = canvas.getContext("2d");

  nextQueue = document.getElementById("nextQueue");
  nextctx = nextQueue.getContext("2d");

  hold = document.getElementById("hold");
  holdctx = hold.getContext("2d");

  context.scale(20, 20);
  nextctx.scale(20, 20);
  holdctx.scale(20, 20);

  btn = document.getElementById("keysSubmit");
  btn.onclick = saveKeys;
  input = document.getElementById("input");

  (bag = []),
    (nextbag = []),
    (keys = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      " ",
      "w",
      "c",
      "x",
      "Shift",
      "r",
    ]);
  holdPiece = null;
  justHold = false;
  disableJustHold = false;

  playerReset();
  updateScore();
  update();
});

function saveKeys() {
  keys = input.value.split(";");
}
