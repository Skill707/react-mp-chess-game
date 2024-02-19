import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import Board from "./Board";
import InfoBar from "./InfoBar";

export default function Game({ socket, loggedUser, setInGame }) {
	const [roomData, setRoomData] = useState(null);

	console.count("Компонент Game обновлён");
	useEffect(() => {
		console.count("Компонент Game отрендерен");
		return () => {
			console.count("Компонент Game размонтирован");
		};
	}, []);

	useEffect(() => {
		// console.count("useEffect в Game: socket обновлён");
		socket.on("getRoomDataResponse", (data) => {
			console.count("useEffect в Game: setRoomData(data)");
			setRoomData(data);
		});
		// return () => {
		// 	console.log("Client: socket.removeAllListeners(getRoomDataResponse)");
		// 	socket.removeAllListeners("getRoomDataResponse");
		// };
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
