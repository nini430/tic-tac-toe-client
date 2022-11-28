export const checkGame = (board, playerSymbol) => {
  for (let i = 0; i < board.length; i++) {
    let row = [];

    for (let j = 0; j < board[i].length; j++) {
      row.push(board[i][j]);
    }

    if (row.every((value) => value === playerSymbol)) {
      return [true, false, "row" + i];
    }

    if (row.every((value) => value !== playerSymbol && value !== null)) {
      return [false, true, "row" + i];
    }
  }

  for (let i = 0; i < board.length; i++) {
    let column = [];
    for (let j = 0; j < board[i].length; j++) {
      column.push(board[j][i]);
    }

    if (column.every((value) => value === playerSymbol)) {
      return [true, false, "col" + i];
    }
    if (column.every((value) => value !== playerSymbol && value !== null)) {
      return [false, true, "col" + i];
    }
  }

  if (board[1][1]) {
    if (board[1][1] === board[0][0] && board[1][1] === board[2][2]) {
      if (board[1][1] === playerSymbol) {
        return [true, false, "dia1"];
      } else {
        return [false, true, "dia1"];
      }
    }
  }
  if (board[1][1]) {
    if (board[1][1] === board[0][2] && board[1][1] === board[2][0]) {
      if (board[1][1] === playerSymbol) {
        return [true, false, "dia2"];
      } else {
        return [false, true, "dia2"];
      }
    }
  }

  if (board.every((row) => row.every((value) => value !== null))) {
    return [true, true];
  }

  return [false, false];
};
