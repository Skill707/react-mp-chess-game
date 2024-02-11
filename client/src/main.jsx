import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import socketIO from "socket.io-client";

const socket = socketIO("https://chess-game-server.glitch.me", { autoConnect: false });
// http://localhost:4000
// https://chess-game-server.glitch.me

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App socket={socket} />
	</Provider>
);
