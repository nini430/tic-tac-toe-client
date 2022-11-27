class GameSocket {
  startGame(socket) {
    return new Promise((res, rej) => {
      socket.on("start_game", (data) => {
        return res(data);
      });
    });
  }

  updateGame(socket, roomId, board) {
    socket.emit("update_game", { roomId, board });
  }

  onGameUpdate(socket) {
    return new Promise((res, rej) => {
      socket.on("on_game_update", (info) => res(info));
    });
  }

  finishGame(socket, roomId, message) {
    socket.emit("finish_game", { roomId, message });
  }

  onGameFinish(socket) {
    return new Promise((res, rej) => {
      socket.on("on_game_finish", (msg) => res(msg));
    });
  }

  requestNewGame(socket, name, roomId) {
    return new Promise((res, rej) => {
      socket.emit("try_again", { name, roomId });
      socket.on("try_success", (data) => res(data));
    });
  }

  rejectNewGame(socket, name, roomId) {
    socket.emit("reject", { name, roomId });
  }

  onContinue(socket) {
    return new Promise((res, rej) => {
      socket.on("on_continue", (msg) => res(msg));
    });
  }
  onReject(socket) {
    return new Promise((res, rej) => {
      socket.on("on_reject", (msg) => res(msg));
    });
  }
}

export default new GameSocket();
