import { actionTypes } from "./actionTypes";

export const initialState = {
  roomId: "",
  gameStarted: JSON.parse(localStorage.getItem("gameStarted")) || false,
  playerSymbol: "x",
  myTurn: false,
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
  tryAgain: false,
  className: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_GAME:
      return { ...state, gameStarted: action.payload };

    case actionTypes.SET_PLAYER_SYMBOL:
      return { ...state, playerSymbol: action.payload };

    case actionTypes.SET_PLAYER_TURN:
      return { ...state, myTurn: action.payload };

    case actionTypes.SET_ROOM:
      return { ...state, roomId: action.payload };

    case actionTypes.SET_BOARD:
      return { ...state, board: action.payload };
    case actionTypes.REFRESH:
      const { roomId } = state;
      const { roomId: roomIdInit, ...others } = initialState;
      return { ...others, roomId };
    case actionTypes.TRY_AGAIN:
      return { ...state, tryAgain: action.payload };
    case actionTypes.SET_CLASSNAME:
      return { ...state, className: action.payload };

    default:
      return state;
  }
};

export default reducer;
