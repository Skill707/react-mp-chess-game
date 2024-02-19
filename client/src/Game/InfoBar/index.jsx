import { Button } from "@mui/material";
import css from "./index.module.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import StageBoard from "./StageBoard";

function Time({ socket }) {
	// console.log("component Time rendering...");

	// const [time, setTime] = useState(60);

	// let nextTurn = "";
	// if (roomData.turn == "Black") nextTurn = "White";
	// else if (roomData.turn == "White") nextTurn = "Black";

	// setTimeout(() => {
	// 	let num = (60000 + (roomData.time - Date.now())) / 1000;
	// 	setTime(num);
	// }, 100);

	// if (time <= 0) {
	// 	socket.emit("updateServerData", { userName: loggedUser.name, roomName: roomData.name, turn: nextTurn, time: Date.now() });
	// }

	return <h3>Time: </h3>;
}

export default function InfoBar({ socket, loggedUser, setInGame, roomData }) {
	// console.log("Компонент InfoBar обновлён, ", moment().format("h:mm:ss:ms"));
	// useEffect(() => {
	// 	console.log("Компонент InfoBar отрендерен, ", moment().format("h:mm:ss:ms"));
	// 	return () => {
	// 		console.log("Компонент InfoBar размонтирован, ", moment().format("h:mm:ss:ms"));
	// 	};
	// }, []);

	const player = roomData.players.find((user) => user.name == loggedUser.name);

	let enemyTeam;
	if (player.team == "Black") {
		enemyTeam = "White";
	} else {
		enemyTeam = "Black";
	}

	let oponentPlayerName = "No player";

	if (roomData != null) {
		oponentPlayerName = roomData.players.find((player) => player.team == enemyTeam);
		if (oponentPlayerName != undefined) {
			oponentPlayerName = oponentPlayerName.name;
		} else {
			oponentPlayerName = "No player";
		}
	}

	return (
		<div className={css.GameInfo} id="GameInfo">
			<div className={css.ButtonsBar}>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => {
						socket.emit("resetRoomData", { userName: loggedUser.name, roomName: roomData.name });
					}}
				>
					Reset
				</Button>
				<Button
					color="primary"
					variant="outlined"
					onClick={() => {
						setInGame(false);
						socket.emit("leaveRoom", { userName: loggedUser.name, roomName: roomData.name });
					}}
				>
					Rooms
				</Button>
			</div>
			<div className={css.InfoBar}>
				<h3>Turn: {roomData.turn} team</h3>
				<span>|</span>
				<Time socket={socket} />
			</div>
			<div id="PlayersInfoBox">
				<div className={css.OponentInfoBar}>
					<h3>
						{enemyTeam} team: {oponentPlayerName}
					</h3>
					{/* <StageBoard team={enemyTeam} stageArray={roomData.stageArray} /> */}
				</div>

				<div className={css.PlayerInfoBar}>
					<h3>
						{player.team} team: {loggedUser.name}
						{roomData.turn == player.team ? ". Your turn!" : null}
					</h3>
					{/* <StageBoard team={player.team} stageArray={roomData.stageArray} /> */}
				</div>
			</div>
		</div>
	);
}
