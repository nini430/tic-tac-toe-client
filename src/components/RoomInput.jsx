import React, { useContext } from "react";
import { useState } from "react";
import { Form, FormControl, InputGroup, Button } from "react-bootstrap";
import connectionInstance from "../sockets/connect";
import { toast, ToastContainer } from "react-toastify";
import { GameContext } from "../context/game/GameContext";
import { actionTypes } from "../context/game/actionTypes";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const toastOptions = {
  autoClose: 1000,
  position: "top-center",
};
const RoomInput = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const { dispatch } = useContext(GameContext);
  const { currentUser } = useContext(AuthContext);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (connectionInstance.socket) {
      const data = await connectionInstance.joinRoom(
        connectionInstance.socket,
        roomId,
        currentUser.username
      );
      if (data.start) {
        dispatch({ type: actionTypes.SET_GAME, payload: true });
        dispatch({ type: actionTypes.SET_PLAYER_TURN, payload: true });
        dispatch({
          type: actionTypes.SET_PLAYER_SYMBOL,
          payload: data.yourSymbol,
        });
      }
      toast.success(data.msg, toastOptions);

      setTimeout(() => {
        dispatch({ type: actionTypes.SET_ROOM, payload: roomId });
        navigate("/");
      }, 2000);
    }
  };
  return (
    <div className="roomInput">
      <h1>Enter Room Id You want to Join:</h1>
      <Form>
        <InputGroup className="inputGroup">
          <FormControl
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Room Id"
            size="lg"
            type="text"
          />
          <Button onClick={handleJoin} disabled={!roomId} type="submit">
            Start
          </Button>
        </InputGroup>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default RoomInput;
