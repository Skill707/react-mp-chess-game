import LoginFormModal from "./components/LoginFormModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setLoggedUser, setUserAccepted } from "./redux/dataSlice";
import ServersList from "./components/ServersList";
import GamePage from "./components/GamePage";
import LoadingModal from "./components/LoadingModal";
import DragAndDrop from "./components/DragAndDrop/index";

export default function App({ socket }) {
	console.log("component App rendering...");

	const dispatch = useDispatch();
	const [inGame, setInGame] = useState(false);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const userAccepted = useSelector((state) => state.data.userAccepted);

	useEffect(() => {
		if (loggedUser != null) {
			console.log("🚀 ~ useEffect ~ loggedUser:", loggedUser);
			if (socket.connected == false) {
				console.log("socket.connect();");
				socket.connect();
			}
		}
	}, [loggedUser]);

	useEffect(() => {
		if (loggedUser != null) {
			socket.on("connect", () => {
				console.log("socket connected. id: ", socket.id); // x8WIv7-mJelg7on_ALbx
				console.log(`connected with transport ${socket.io.engine.transport.name}`);
				socket.io.engine.on("upgrade", (transport) => {
					console.log(`transport upgraded to ${transport.name}`);
				});
				socket.connected = true;
				console.log("socket.emit ", loggedUser);
				socket.emit("newUser", { username: loggedUser });
			});

			socket.on("newUserResponse", (data) => {
				console.log("newUserResponse: ", data);
				if (data.accepted == true) {
					localStorage.setItem("ChessGameUserName", JSON.stringify(data.username));
					dispatch(setUserAccepted(true));
				} else {
					dispatch(setLoggedUser(null));
					Swal.fire("User already connected!");
				}
			});

			socket.on("connect_error", (err) => {
				console.log(`connect_error due to ${err.message}`);
				dispatch(setUserAccepted(false));
				setInGame(false);
			});

			socket.on("disconnect", (reason) => {
				console.log(`disconnect due to ${reason}`);
				dispatch(setUserAccepted(false));
				setInGame(false);
			});
		}
		return () => {
			console.log("socket.removeAllListeners()");
			socket.removeAllListeners();
		};
	}, [socket, loggedUser]);

	return (
		<>
			<LoadingModal openLoadingModal={(userAccepted == false) & (loggedUser != null)} loggedUser={loggedUser} />
			{loggedUser == null ? <LoginFormModal /> : null}
			{!inGame && <ServersList socket={socket} setInGame={setInGame} />}
			{inGame && <GamePage socket={socket} setInGame={setInGame} />}
		</>
	);
}
