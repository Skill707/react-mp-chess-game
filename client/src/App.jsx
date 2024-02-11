import LoginFormModal from "./components/LoginFormModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { setConnected, setUserAccepted } from "./redux/dataSlice";
import ServersList from "./components/ServersList";
import GamePage from "./components/GamePage";

export default function App({ socket }) {
	console.log("component App rendering...");

	const dispatch = useDispatch();
	const [openLoginFormModal, setOpenLoginFormModal] = useState(false);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	const socketConnected = useSelector((state) => state.data.socketConnected);
	const userAccepted = useSelector((state) => state.data.userAccepted);

	useEffect(() => {
		if (socketConnected == false) {
			console.log("socket connecting...");
			socket.connect();
		}
	}, [socketConnected]);

	useEffect(() => {
		socket.on("connect", () => {
			console.log("socket connected. id: ", socket.id); // x8WIv7-mJelg7on_ALbx
			dispatch(setConnected(true));
		});

		socket.on("disconnect", () => {
			console.log("socket disconnected");
			dispatch(setConnected(false));
		});
	}, [socket]);

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
	}, []);

	useEffect(() => {
		if (loggedUser == null) {
			setOpenLoginFormModal(true);
		}
	}, [loggedUser, userAccepted]);

	return (
		<>
			<LoginFormModal socket={socket} openLoginFormModal={openLoginFormModal} setOpenLoginFormModal={setOpenLoginFormModal} />
			{joinedServerData ? <GamePage socket={socket} /> : <ServersList socket={socket} />}
		</>
	);
}
