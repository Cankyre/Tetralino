let keyList = {};
let das = {};
let arr = {};

let singleMoves = {}

document.addEventListener("keydown", (e) => {
  if (!keyList[e.key]) {
    keyList[e.key] = Date.now();
  }
});

document /* Extra Z */
  .addEventListener("keyup", (e) => {
    if (keyList[e.key]) {
      delete keyList[e.key];
      delete das[e.key]
      delete arr[e.key]
      singleMoves[e.key] = false
    }
  });

function manageControls() {
  if (!keyList) return;
  Object.keys(keyList).forEach((key) => {
    if (key === keys[0] && keyList[key]) {
      if (!das[key]) {
        playerMove(-1);
        das[key] = true;
      } else if (das[key] && !arr[key] && Date.now() - keyList[key] >= DAS) {
        playerMove(-1)
        arr[key] = Date.now();
      } else if (arr[key] && Date.now() - arr[key] >= ARR) {
        playerMove(-1)
        arr[key] = Date.now();
      }
    } else if (key === keys[1]) {
      if (!das[key]) {
        playerMove(1);
        das[key] = true;
      } else if (das[key] && !arr[key] && Date.now() - keyList[key] >= DAS) {
        playerMove(1)
        arr[key] = Date.now();
      } else if (arr[key] && Date.now() - arr[key] >= ARR) {
        playerMove(1)
        arr[key] = Date.now();
      }
    } else if (key === keys[2]) {
      if (SDRR == Infinity) {
        while (playerDrop(1, true));
      } else if (Date.now() - keyList[key] >= SDRR) {
        playerDrop(1, true)
        keyList[key] = Date.now();
      }
    } else if (key === keys[3] && !singleMoves[key]) {
      playerHarddrop()
      singleMoves[key] = true
    } else if (key === keys[4] && !singleMoves[key]) {
      playerRotate(-1);
      singleMoves[key] = true
    } else if (key === keys[5] && !singleMoves[key]) {
      playerRotate(1);
      singleMoves[key] = true
    } else if (key === keys[6] && !singleMoves[key]) {
      playerRotate(2);
      singleMoves[key] = true
    }  else if (key === keys[7] && !singleMoves[key]) {
      holdTeto();
      singleMoves[key] = true
    }  else if (key === keys[8] && !singleMoves[key]) {
      singleMoves[key] = true
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
