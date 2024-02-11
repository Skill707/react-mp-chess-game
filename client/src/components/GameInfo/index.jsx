import { Button, IconButton } from "@mui/material";
import css from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setConnected, setJoinedServerData, setLoggedUser, setUserAccepted } from "../../redux/dataSlice";
import { IoIosLogOut } from "react-icons/io";
import { useEffect } from "react";
import StageBoard from "../StageBoard";

export default function GameInfo({ socket }) {
	console.log("component GameInfo rendering...");
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	const playerTeam = useSelector((state) => state.data.playerTeam);
	const socketConnected = useSelector((state) => state.data.socketConnected);

	let enemyTeam;
	if (playerTeam == "Black") {
		enemyTeam = "White";
	} else {
		enemyTeam = "Black";
	}
	let oponentPlayerName = joinedServerData.players.find((player) => player.team == enemyTeam);
	if (oponentPlayerName == undefined) {
		oponentPlayerName = "No player";
	} else {
		oponentPlayerName = oponentPlayerName.username;
	}

	return (
		<div className={css.GameInfo} id="GameInfo">
			<div className={css.ButtonsBar}>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => {
						socket.emit("resetServerData", { username: loggedUser, serverName: joinedServerData.name });
					}}
				>
					Reset
				</Button>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => {
						dispatch(setJoinedServerData(null));
						socket.emit("LeaveFromServer", { serverName: joinedServerData.name, username: loggedUser });
					}}
				>
					Rooms
				</Button>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => {
						console.log(`socket ${socket.id} disconnected`);
						socket.disconnect();
						localStorage.clear("ChessGameUserName");
						dispatch(setLoggedUser(null));
						dispatch(setJoinedServerData(null));
						dispatch(setUserAccepted(false));
						dispatch(setConnected(false));
					}}
				>
					Log out
				</Button>
			</div>
			<div className={css.InfoBar}>
				<h3>turn: {joinedServerData.turn}</h3>
			</div>
			<div className={css.OponentInfoBar}>
				<h3>
					{enemyTeam} team: {oponentPlayerName}
				</h3>
				<StageBoard team={enemyTeam} />
			</div>

			<div className={css.PlayerInfoBar}>
				<h3>
					{playerTeam} team: {loggedUser}
					{joinedServerData.turn == playerTeam ? ". Your turn!" : null}
				</h3>
				<StageBoard team={playerTeam} />
			</div>
		</div>
	);
}
