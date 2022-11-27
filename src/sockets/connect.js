import { io } from "socket.io-client";

class SocketConnect {
  socket = null;
  connect(url) {
    this.socket = io(url);
  }
  joinRoom(socket, roomId, username) {
    return new Promise((res, rej) => {
      socket.emit("join_room", { roomId, username });
      socket.on("error", (err) => rej(err));
      socket.on("join_succesful", (msg) => res(msg));
    });
  }
}

export default new SocketConnect();
