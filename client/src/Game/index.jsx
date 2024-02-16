import moment from "moment";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import Board from "./Board";
import InfoBar from "./InfoBar";

export default function Game({ socket, loggedUser, setLoggedUser, setInGame }) {
	const [roomData, setRoomData] = useState(null);

	console.log("Компонент Game обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент Game отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент Game размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	useEffect(() => {
		socket.on("getRoomDataResponse", (data) => {
			if (data !== roomData) {
				console.log("roomData: need update");
				setRoomData(data);
			} else {
				console.log("roomData: dont need update");
			}
			return () => {
				console.log("Client: socket.removeAllListeners(getRoomDataResponse)");
				socket.removeAllListeners("getRoomDataResponse");
			};
		});
	}, [socket]);

	return (
		<div id="GamePage">
			{roomData != null ? (
				<>
					<Chat socket={socket} loggedUser={loggedUser} roomData={roomData} />
					<Board socket={socket} loggedUser={loggedUser} roomData={roomData} setRoomData={setRoomData} />
					<InfoBar socket={socket} setInGame={setInGame} loggedUser={loggedUser} roomData={roomData} />
				</>
			) : null}
		</div>
	);
}
