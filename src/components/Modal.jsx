import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { actionTypes } from "../context/game/actionTypes";
import { GameContext } from "../context/game/GameContext";
import { AuthContext } from "../context/AuthContext";
import connect from "../sockets/connect";
import game from "../sockets/game";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

const ModalComponent = () => {
  const [waiting, setIsWaiting] = useState(false);
  const [message, setMessage] = useState({ msg: "Do you want to Try Again?" });
  const {
    state: { tryAgain, roomId },
    dispatch,
  } = useContext(GameContext);
  const { currentUser } = useContext(AuthContext);

  const cancelRequest = () => {
    if (connect.socket) {
      game.rejectNewGame(connect.socket, currentUser.username, roomId);
      dispatch({ type: actionTypes.TRY_AGAIN, payload: false });
      toast.error("You left the room", { autoClose: 3000 });
      setTimeout(() => {
        window.location.reload("/setRoom");
      }, 3000);
    }
  };

  const continueRequest = async () => {
    if (connect.socket) {
      const data = await game.requestNewGame(
        connect.socket,
        currentUser.username,
        roomId
      );
      if (data.wait) {
        setIsWaiting(true);
      } else {
        setIsWaiting(false);
        dispatch({ type: actionTypes.TRY_AGAIN, payload: false });
        dispatch({
          type: actionTypes.SET_BOARD,
          payload: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ],
        });
        dispatch({ type: actionTypes.SET_CLASSNAME, payload: [] });
      }
    }
  };

  const handleOnContinue = async () => {
    if (connect.socket) {
      const data = await game.onContinue(connect.socket);
      if (!data.start) {
        setMessage({ msg: data.msg + ",Do you?", modifed: true });
      } else {
        setIsWaiting(false);
        dispatch({
          type: actionTypes.SET_BOARD,
          payload: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ],
        });
        dispatch({ type: actionTypes.SET_CLASSNAME, payload: [] });

        dispatch({ type: actionTypes.TRY_AGAIN, payload: false });
      }
      toast.success(data.msg, { toastId: data.msg });
    }
  };

  const handleOnReject = async () => {
    if (connect.socket) {
      const data = await game.onReject(connect.socket);
      dispatch({ type: actionTypes.TRY_AGAIN, payload: false });
      toast.error(data.msg, { toastId: data.msg, autoClose: 3000 });
      setTimeout(() => {
        window.location.reload("/setRoom");
      }, 3000);
    }
  };

  useEffect(() => {
    handleOnContinue(); // eslint-disable-next-line
    handleOnReject(); // eslint-disable-next-line
  }, []);

  return (
    <>
      {waiting ? (
        <div className="loading">
          <h2>Please wait ....</h2>
        </div>
      ) : (
        <Modal
          className="modal"
          show={tryAgain}
          
        >
          <Modal.Header>
            <Modal.Title>Try Again</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message.msg}</Modal.Body>
          <Modal.Footer>
            <Button onClick={continueRequest} className="ready">
              Yes,I'm ready!
            </Button>
            <Button onClick={cancelRequest} variant="secondary">
              Not really!
            </Button>
          </Modal.Footer>
          <ToastContainer />
        </Modal>
      )}
    </>
  );
};

export default ModalComponent;
