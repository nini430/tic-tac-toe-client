import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { GameContextProvider } from "./context/game/GameContext";
import { Auth, Game, SetRoom } from "./pages";
import connectInstance from "./sockets/connect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Game />,
  },
  {
    path: "/setRoom",
    element: <SetRoom />,
  },
  {
    path: "/register",
    element: <Auth isRegister={true} />,
  },
  {
    path: "/login",
    element: <Auth isRegister={false} />,
  },
]);
const App = () => {
  const connect = () => {
    connectInstance.connect("https://tic-tac-toe-app-mutliplayers.herokuapp.com/");
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <AuthContextProvider>
      <GameContextProvider>
        <RouterProvider router={router} />
      </GameContextProvider>
    </AuthContextProvider>
  );
};

export default App;
