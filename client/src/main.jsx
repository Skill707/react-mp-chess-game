import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import socketIO from "socket.io-client";

const socket = socketIO("http://localhost:4000", { autoConnect: false });
// http://localhost:4000
// https://chess-game-server.glitch.me

ReactDOM.createRoot(document.getElementById("root")).render(<App socket={socket} />);