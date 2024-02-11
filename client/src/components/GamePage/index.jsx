import css from "./index.module.scss";
import GameBoard from "../GameBoard/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { setJoinedServerData } from "../../redux/dataSlice";
import Chat from "../Chat/index";
import GameInfo from "../GameInfo/index";

export default function GamePage({ socket }) {
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);

	useEffect(() => {
		if (joinedServerData != null) {
			socket.emit("getServerData", { username: loggedUser, serverName: joinedServerData.name });
		} else {
			Swal.fire(`Error: Server not found! connected: ${socket.connected} joinedServerData: ${joinedServerData}`);
		}

		socket.on("getServerDataResponse", (data) => {
			dispatch(setJoinedServerData(data));
		});
	}, [socket]);

	return (
		<div id="GamePage">
			<Chat socket={socket} />
			<GameBoard socket={socket} />
			<GameInfo socket={socket} />
		</div>
	);
}
