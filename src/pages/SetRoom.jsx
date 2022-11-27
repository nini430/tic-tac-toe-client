import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, RoomInput } from "../components";
import { AuthContext } from "../context/AuthContext";
import { GameContext } from "../context/game/GameContext";

const SetRoom = () => {
  const { currentUser } = useContext(AuthContext);
  const { state } = useContext(GameContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!!state?.roomId) {
      navigate("/");
    }
  }, [state?.roomId, navigate]);
  return (
    <div className="game">
      <User />
      <RoomInput />
    </div>
  );
};

export default SetRoom;
