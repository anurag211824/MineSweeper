export const TILE_STATUSES = {
  HIDDEN: "hidden",
  NUMBER: "number",
  MINE: "mine",
  MARKED: "marked",
};

export function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePostions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;

      const tile = {
        element,
        x,
        y,
        mine: minePostions.some((pos) => {
          return pos.x === x && pos.y === y;
        }),
        get status() {
          return element.dataset.status;
        },
        set status(value) {
          element.dataset.status = value;
        },
      };
      row.push(tile);
    }
    board.push(row);
  }
  return board;
}

function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };
    if (
      !positions.some((p) => {
        return p.x === position.x && p.y === position.y;
      })
    ) {
      positions.push(position);
    }
  }
  return positions;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

export function markTile(tile) {
  if (tile.status === TILE_STATUSES.HIDDEN) {
    tile.status = TILE_STATUSES.MARKED;
  } else if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    return;
  }
}

export function revealTile(board,tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
      return;
    }
    if (tile.mine) {
      tile.status = TILE_STATUSES.MINE;
      return; 
    }
    tile.status = TILE_STATUSES.NUMBER;
    const adjacentTiles = nearbyTiles(board, tile);
    const mines = adjacentTiles.filter((t) => t.mine);
    
    if (mines.length === 0) {
      adjacentTiles.forEach((t) => revealTile(board,t));
    } else {
      tile.element.textContent = mines.length;
    }
  }
  
export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
      );
    });
  });
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) {
        tiles.push(tile);
      }
    }
  }
  return tiles;
}
