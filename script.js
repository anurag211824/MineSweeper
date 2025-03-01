// Display/UI

import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
} from "./minesweeper.js"

const BOARD_SIZE = 5
const NUMBER_OF_MINES = 2

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")

board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", e => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})
boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftText.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const markedTilesCount = board.reduce(
    (count, row) => count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length, 
    0
  );
  minesLeftText.textContent = Math.max(0, NUMBER_OF_MINES - markedTilesCount);
}


function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    messageText.textContent = "You Win"
  }
  if (lose) {
    messageText.textContent = "You Lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}
document.querySelectorAll(".board > *").forEach(cell => {
  // Left-click to reveal
  cell.addEventListener("click", () => {
      if (cell.dataset.status === "mine") {
          // Reveal all bombs
          document.querySelectorAll('.board > [data-status="mine"]').forEach(mineCell => {
              mineCell.textContent = "💣";
          });
      } else {
          cell.textContent = ""; // Handle other cases (e.g., numbers)
      }
  });

  // Right-click to flag/unflag
  cell.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // Prevent default right-click menu
      if (cell.dataset.status === "hidden") {
          cell.dataset.status = "flagged";
          cell.textContent = "🚩"; // Display a flag emoji
      } else if (cell.dataset.status === "flagged") {
          cell.dataset.status = "hidden";
          cell.textContent = ""; // Remove flag
      }
  });
});


function stopProp(e) {
  e.stopImmediatePropagation()
}