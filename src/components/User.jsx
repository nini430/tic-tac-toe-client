import React from "react";
import { useContext } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";


const User = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const logoutHandler = () => {
    logout();
    window.location.replace("/login");
  };
  return (
    <div className="user">
      <Dropdown>
        <Dropdown.Toggle className="content">
          <Image src={`data:image/svg+xml;base64,${currentUser?.img}`} />
          <span>{currentUser?.username}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={logoutHandler}>Log Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <h1>Welcome {currentUser?.username}!</h1>
    </div>
  );
};

export default User;
