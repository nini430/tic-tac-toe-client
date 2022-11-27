import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Room, User } from "../components";
import { AuthContext } from "../context/AuthContext";
import { actionTypes } from "../context/game/actionTypes";
import { GameContext } from "../context/game/GameContext";
import connectInstance from "../sockets/connect";
import game from "../sockets/game";
import LoadingGif from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";

const Game = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    state: { roomId, gameStarted },
    dispatch,
  } = useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!roomId) {
      navigate("/setRoom");
    }
  }, [roomId, navigate]);

  const handleStartGame = async () => {
    if (connectInstance.socket) {
      const data = await game.startGame(connectInstance.socket);

      dispatch({ type: actionTypes.SET_PLAYER_SYMBOL, payload: "o" });
      dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: false });
      dispatch({ type: actionTypes.SET_GAME, payload: true });
      toast.success(`${data.username} joined and starts first`, {
        toastId: data.username,
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    handleStartGame(); // eslint-disable-next-line
  }, []);
  return (
    <div className="game">
      <User />
      {gameStarted ? (
        <Room />
      ) : (
        <div className="loading">
          <h2>Waiting the Oponent to Join...</h2>
          <img src={LoadingGif} alt="" />
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Game;
