let keyList = {};
let das = {};
let arr = {};

let singleMoves = {};

document.addEventListener("keydown", (e) => {
  if (!keyList[e.key.toLowerCase() && !e.repeat]) {
    keyList[e.key.toLowerCase()] = Date.now();
    if (e.key == keys[0]) {
      delete keyList[keys[1].toLowerCase()]
    } else if (e.key == keys[1]) {
      delete keyList[keys[0].toLowerCase()]
    }
  }
});

document /* Extra Z */
  .addEventListener("keyup", (e) => {
    if (keyList[e.key.toLowerCase()]) {
      delete keyList[e.key.toLowerCase()];
      delete das[e.key.toLowerCase()];
      delete arr[e.key.toLowerCase()];
      singleMoves[e.key.toLowerCase()] = false;
    }
  });

function manageControls() {
  if (!keyList) return;
  Object.keys(keyList).forEach((key) => {
    key = key.toLowerCase();
    if (key === keys[0].toLowerCase()) {
      // Move left
      if (!das[key]) {
        // On key press
        playerMove(-1);
        das[key] = true;
      } else if (das[key] && !arr[key] && Date.now() - keyList[key] >= DAS) {
        // After DAS timeout
        playerMove(-1);
        arr[key] = Date.now();
      } else if (arr[key] && (ARR == 0)) {
        while (playerMove(-1));
      } else if (arr[key] && (Date.now() - arr[key] >= ARR)) {
        // After each automatic repeat
        playerMove(-1);
        arr[key] = Date.now();
      }
    } else if (key === keys[1].toLowerCase()) {
      // Move right
      if (!das[key]) {
        // On key press
        playerMove(1);
        das[key] = true;
      } else if (das[key] && !arr[key] && Date.now() - keyList[key] >= DAS) {
        // After DAS timeout
        playerMove(1);
        arr[key] = Date.now();
      } else if (arr[key] && (ARR == 0)) {
        while (playerMove(1));
      } else if (arr[key] && Date.now() - arr[key] >= ARR) {
        // After each automatic repeat
        playerMove(1);
        arr[key] = Date.now();
      }
    } else if (key === keys[2].toLowerCase()) {
      // Soft drop
      if (SDRR == Infinity && Date.now() - keyList[key] >= 50) {
        // Instantly drop the piece
        while (playerDrop(1, true));
      } else if (Date.now() - keyList[key] >= SDRR) {
        // After each SDR
        playerDrop(1, true);
        keyList[key] = Date.now();
      }
    } else if (key === keys[3].toLowerCase() && !singleMoves[key]) {
      // Hard drop
      playerHarddrop();
      singleMoves[key] = true;
    } else if (key === keys[4].toLowerCase() && !singleMoves[key]) {
      // Rotate CCW
      playerRotate(-1);
      singleMoves[key] = true;
    } else if (key === keys[5].toLowerCase() && !singleMoves[key]) {
      // Rotate CW
      playerRotate(1);
      singleMoves[key] = true;
    } else if (key === keys[6].toLowerCase() && !singleMoves[key]) {
      // Rotate 180
      playerRotate(2);
      singleMoves[key] = true;
    } else if (key === keys[7].toLowerCase() && !singleMoves[key]) {
      // Hold
      holdTeto();
      singleMoves[key] = true;
    } else if (key === keys[8].toLowerCase() && !singleMoves[key]) {
      // Reset
      justHold = false;
      disableJustHold = false;
      singleMoves[key] = true;
      lines = 0;
      pieces = 0;
      startTime = Date.now();
      bag = [];
      nextbag = [];
      holdPiece = null;
      player.pieceType = getNextPiece();
      player.rotation = 0;
      player.matrix = createPiece(player.pieceType);
      player.pos.y = 0;
      player.pos.x =
        ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
      arena.forEach((row) => row.fill(0));
      player.score = 0;
      updateScore(keyList);
    }
  });
}
