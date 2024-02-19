import { useEffect, useRef, useState } from "react";
import LoadingModal from "./components/LoadingModal";
import LoginFormModal from "./components/LoginFormModal";
import ServersList from "./Home/ServersList";
import moment from "moment";
import Game from "./Game";
import Chat from "./components/Chat";
import { Button, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Home from "./Home";

function GetUserFromLS() {
	let result = null;

	const LSloggedUser = JSON.parse(localStorage.getItem("ChessGameUserName"));
	const SSloggedUser = JSON.parse(sessionStorage.getItem("ChessGameUserName"));
	if (SSloggedUser) result = SSloggedUser;
	else if (LSloggedUser) result = LSloggedUser;

	return result;
}

export default function App({ socket }) {
	const [inGame, setInGame] = useState(false);
	const [loggedUser, setLoggedUser] = useState({ name: GetUserFromLS(), accepted: false });
	// console.log("🚀 ~ App ~ loggedUser:", loggedUser);
	// const prevLoggedUser = useRef(loggedUser);
	// console.log("🚀 ~ App ~ prevLoggedUser:", prevLoggedUser);
	// useRef

	console.log("Компонент App обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент App отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент App размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	useEffect(() => {
		console.log("useEffect в App: loggedUser.name обновлён");
		if (loggedUser.name != null) {
			if (socket.connected == false) {
				console.log("Client: socket.connect()");
				socket.connect();
			}
		}
	}, [loggedUser.name]);

	let chat;

	useEffect(() => {
		console.log("useEffect в App: socket обновлён");
		if (loggedUser.name != null) {
			socket.on("connect", () => {
				console.log("Client: socket connected. id: ", socket.id);
				console.log(`Client:connected with transport ${socket.io.engine.transport.name}`);
				socket.io.engine.on("upgrade", (transport) => {
					console.log(`transport upgraded to ${transport.name}`);
				});
				socket.connected = true;
				console.log("Client: socket.emit newUser");
				socket.emit("newUser", { name: loggedUser.name });
			});

			socket.on("newUserResponse", (data) => {
				console.log("Client: newUserResponse: ", data);
				if (data.accepted == true) {
					localStorage.setItem("ChessGameUserName", JSON.stringify(data.userName));
					setLoggedUser({ ...loggedUser, accepted: true });
					chat = data.chat;
				} else {
					setLoggedUser({ ...loggedUser, name: null, accepted: false });
					alert("User already connected!");
				}
			});

			socket.on("connect_error", (err) => {
				socket.connected = false;
				console.log(`Client: connect_error due to ${err.message}`);
				setLoggedUser({ ...loggedUser, accepted: false });
				setInGame(false);
			});

			socket.on("disconnect", (reason) => {
				socket.connected = false;
				console.log(`Client: disconnect due to ${reason}`);
				setLoggedUser({ ...loggedUser, accepted: false });
				setInGame(false);
			});
		}
		return () => {
			console.log("Client: socket.removeAllListeners()");
			socket.removeAllListeners();
		};
	}, [socket, loggedUser.name]);

	const darkTheme = createTheme({
		palette: {
			mode: "dark",
			primary: {
				main: "#ffffff",
			},
		},
	});

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<p style={{ position: "absolute" }}>{socket.connected ? "connected" : "disconnected"}</p>
			<LoadingModal openLoadingModal={loggedUser.accepted == false && loggedUser.name != null} loggedUser={loggedUser} connected={socket.connected} />
			{loggedUser.name == null ? <LoginFormModal loggedUser={loggedUser} setLoggedUser={setLoggedUser} /> : null}
			{inGame ? <Game socket={socket} loggedUser={loggedUser} setInGame={setInGame} /> : <Home socket={socket} loggedUser={loggedUser} setLoggedUser={setLoggedUser} setInGame={setInGame} />}
		</ThemeProvider>
	);
}
