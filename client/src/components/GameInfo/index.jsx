import { Button } from "@mui/material";
import css from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setJoinedServerData, setLoggedUser, setUserAccepted } from "../../redux/dataSlice";
import StageBoard from "../StageBoard";
import { useEffect, useState } from "react";
import moment from "moment";

function Time({ socket }) {
	// console.log("component Time rendering...");
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const [time, setTime] = useState(60);

	let nextTurn = "";
	if (joinedServerData.turn == "Black") nextTurn = "White";
	else if (joinedServerData.turn == "White") nextTurn = "Black";

	// setTimeout(() => {
	// 	let num = (60000 + (joinedServerData.time - Date.now())) / 1000;
	// 	setTime(num);
	// }, 100);

	// if (time <= 0) {
	// 	socket.emit("updateServerData", { username: loggedUser, serverName: joinedServerData.name, turn: nextTurn, time: Date.now() });
	// }

	return <h3>Time: {time}</h3>;
}

export default function GameInfo({ socket, setInGame }) {
	console.log("component GameInfo rendering...");
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	const playerTeam = useSelector((state) => state.data.playerTeam);

	let enemyTeam;
	if (playerTeam == "Black") {
		enemyTeam = "White";
	} else {
		enemyTeam = "Black";
	}

	let oponentPlayerName = "No player";

	if (joinedServerData != null) {
		oponentPlayerName = joinedServerData.players.find((player) => player.team == enemyTeam);
		if (oponentPlayerName != undefined) {
			oponentPlayerName = oponentPlayerName.username;
		}
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
						setInGame(false);
						socket.emit("LeaveFromServer", { serverName: joinedServerData.name, username: loggedUser });
					}}
				>
					Rooms
				</Button>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => {
						socket.disconnect();
						localStorage.clear("ChessGameUserName");
						dispatch(setLoggedUser(null));
						dispatch(setJoinedServerData(null));
						dispatch(setUserAccepted(false));
						setInGame(false);
					}}
				>
					Log out
				</Button>
			</div>
			<div className={css.InfoBar}>
				<h3>Turn: {joinedServerData.turn} team</h3>
				<span>|</span>
				<Time socket={socket} />
			</div>
			<div id="PlayersInfoBox">
				<div className={css.OponentInfoBar}>
					<h3>
						{enemyTeam} team: {oponentPlayerName}
					</h3>
					<StageBoard team={enemyTeam} stageArray={joinedServerData.stageArray}/>
				</div>

				<div className={css.PlayerInfoBar}>
					<h3>
						{playerTeam} team: {loggedUser}
						{joinedServerData.turn == playerTeam ? ". Your turn!" : null}
					</h3>
					<StageBoard team={playerTeam} stageArray={joinedServerData.stageArray}/>
				</div>
			</div>
		</div>
	);
}
