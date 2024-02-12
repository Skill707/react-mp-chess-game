import LoginFormModal from "./components/LoginFormModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setJoinedServerData, setUserAccepted } from "./redux/dataSlice";
import ServersList from "./components/ServersList";
import GamePage from "./components/GamePage";
import LoadingModal from "./components/LoadingModal";

export default function App({ socket }) {
	console.log("component App rendering...");

	const dispatch = useDispatch();
	const [openLoginFormModal, setOpenLoginFormModal] = useState(false);
	const [openLoadingModal, setOpenLoadingModal] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const [inGame, setInGame] = useState(false);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const userAccepted = useSelector((state) => state.data.userAccepted);

	useEffect(() => {
		if (socketConnected == false) {
			console.log("socket connecting...");
			setOpenLoadingModal(true);
			socket.connect();
		} else {
			console.log("socket connected!");
		}
	}, [socketConnected]);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("socket connected. id: ", socket.id); // x8WIv7-mJelg7on_ALbx
			console.log(`connected with transport ${socket.io.engine.transport.name}`);
			setOpenLoadingModal(false);
			setSocketConnected(true);
			socket.io.engine.on("upgrade", (transport) => {
				console.log(`transport upgraded to ${transport.name}`);
			});
		});

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
			setSocketConnected(false);
			dispatch(setJoinedServerData(null));
			setInGame(false)
			dispatch(setUserAccepted(false));
			setOpenLoadingModal(true);
			socket.connect();
		});

		socket.on("disconnect", (reason) => {
			console.log(`disconnect due to ${reason}`);
			setSocketConnected(false);
			dispatch(setJoinedServerData(null));
			setInGame(false)
			dispatch(setUserAccepted(false));
			setOpenLoadingModal(true);
		});
	}, [socket, socketConnected]);

	useEffect(() => {
		if ((userAccepted == false) & (loggedUser != null)) {
			socket.emit("oldUser", { username: loggedUser });
			socket.on("oldUserResponse", (data) => {
				if (data.accepted == true) {
					console.log("oldUserResponse accepted");
					dispatch(setUserAccepted(true));
				} else {
					console.log("oldUserResponse rejected");
					Swal.fire("User already connected!");
					dispatch(setUserAccepted(false));
				}
			});
		}
	}, [userAccepted]);

	useEffect(() => {
		if (socketConnected & (loggedUser == null) & (userAccepted == false)) {
			setOpenLoginFormModal(true);
		}
	}, [socketConnected, loggedUser, userAccepted]);

	return (
		<>
			<LoadingModal openLoadingModal={openLoadingModal} socketConnected={socketConnected} loggedUser={loggedUser} />
			<LoginFormModal socket={socket} openLoginFormModal={openLoginFormModal} setOpenLoginFormModal={setOpenLoginFormModal} />
			{!inGame && <ServersList socket={socket} setSocketConnected={setSocketConnected} setInGame={setInGame} />}
			{inGame && <GamePage socket={socket} setInGame={setInGame} />}
		</>
	);
}
