import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Buffer } from "buffer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";

const Auth = ({ isRegister }) => {
  const { login, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const setAvatar = async () => {
    const res = await axios.get(
      `https://api.multiavatar.com/4645646/${Math.round(Math.random() * 100)}`
    );
    const buffer = new Buffer(res.data);
    return buffer.toString("base64");
  };

  const handleRegister = async () => {
    try {
      const img = await setAvatar();
      const res = await axios.post("https://tic-tac-toe-app-mutliplayers.herokuapp.com/api/auth/register", {
        ...inputs,
        img,
      });
      toast.success(res.data, { autoClose: 1000, position: "top-right" });
      navigate("/login");
      setInputs({ username: "", email: "", password: "" });
      setErrors({});
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  const handleLogin = async () => {
    try {
      await login({ email: inputs.email, password: inputs.password });
      setInputs({ username: "", email: "", password: "" });
      setErrors({});
      navigate("/");
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  const clearInputs = () => {
    setInputs({ username: "", email: "", password: "" });
    setErrors({});
  };

  return (
    <div className="auth">
      <h1>Tic Tac Toe Game</h1>
      <Form>
        {isRegister && (
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={inputs.username}
              isInvalid={errors.username}
              type="text"
              name="username"
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </Form.Group>
        )}
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={inputs.email}
            isInvalid={errors.email}
            type="email"
            name="email"
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={inputs.password}
            isInvalid={errors.password}
            type="password"
            name="password"
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </Form.Group>
        <Button onClick={isRegister ? handleRegister : handleLogin}>
          {isRegister ? "Sign Up" : "Sign In"}
        </Button>
        <span onClick={clearInputs}>
          {isRegister ? "Already a member?" : "Don't you have an account?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Sign Up"}
          </Link>
        </span>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Auth;
