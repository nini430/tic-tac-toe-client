import React, { useEffect, useContext } from "react";
import { actionTypes } from "../context/game/actionTypes";
import { GameContext } from "../context/game/GameContext";
import connect from "../sockets/connect";
import game from "../sockets/game";
import { checkGame } from "../utils/checkGame";
import { ToastContainer, toast } from "react-toastify";
import { ModalComponent } from "../components";

const Room = () => {
  const {
    state: { board, playerSymbol, myTurn, roomId, tryAgain, className },
    dispatch,
  } = useContext(GameContext);
  const updateBoard = (rowIndx, columnInx) => {
    if (board[rowIndx][columnInx] === null) {
      board[rowIndx][columnInx] = playerSymbol;
      let boardRef = board;
      dispatch({ type: actionTypes.SET_BOARD, payload: boardRef });
      dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: false });

      if (connect.socket) {
        game.updateGame(connect.socket, roomId, board);
      }
      const [currentUser, otherUser, ...classStyle] = checkGame(
        boardRef,
        playerSymbol
      );

      dispatch({ type: actionTypes.SET_CLASSNAME, payload: classStyle });
      if (currentUser && otherUser) {
        if (connect.socket) {
          game.finishGame(connect.socket, roomId, {
            message: "There was a tie!",
            className: [...classStyle],
          });
          toast.success("There was a tie!", { autoClose: 1000 });
          setTimeout(() => {
            dispatch({ type: actionTypes.TRY_AGAIN, payload: true });
          }, 2000);
        }
      } else if (currentUser) {
        if (connect.socket) {
          game.finishGame(connect.socket, roomId, {
            lose: true,
            msg: "You Lost!",
            className: [...classStyle],
          });
          toast.success("You won!", { autoClose: 1000 });
          setTimeout(() => {
            dispatch({ type: actionTypes.TRY_AGAIN, payload: true });
          }, 2000);
        }
      }
    }
  };

  useEffect(() => {
    if (connect.socket) {
      game.onGameUpdate(connect.socket).then((data) => {
        let boardRef = data.board;
        dispatch({ type: actionTypes.SET_BOARD, payload: boardRef });
        dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: true });
      });

      game.onGameFinish(connect.socket).then((data) => {
        if (data.lose) {
          toast.error(data.msg, { toastId: data.msg, autoClose: 1000 });
        } else {
          toast.success(data.msg, { toastId: data.msg, autoClose: 1000 });
        }
        dispatch({ type: actionTypes.SET_CLASSNAME, payload: data.className });
        setTimeout(() => {
          dispatch({ type: actionTypes.TRY_AGAIN, payload: true });
        }, 2000);
      });
    }
  });
  return (
    <div className={`board ${className}`}>
      {tryAgain && <ModalComponent />}
      {!myTurn && <div className="stopGame" />}
      {board?.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="boardRow">
            {row.map((column, columnIndex) => (
              <div
                key={columnIndex}
                onClick={() => updateBoard(rowIndex, columnIndex)}
                className="cell"
              >
                {board[rowIndex][columnIndex]
                  ? board[rowIndex][columnIndex] === "x"
                    ? "X"
                    : "O"
                  : null}
              </div>
            ))}
          </div>
        );
      })}
      {className[0] && <div className={`line ${className}`}></div>}
      <ToastContainer />
    </div>
  );
};

export default Room;
