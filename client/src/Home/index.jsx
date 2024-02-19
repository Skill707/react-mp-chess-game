import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Chat from "../components/Chat";
import UsersList from "./UsersList";
import ServersList from "./ServersList";

export default function Home({ socket, loggedUser, setLoggedUser, setInGame }) {
	console.count("Компонент Home обновлён");
	useEffect(() => {
		console.count("Компонент Home отрендерен");
		
		return () => {
			console.count("Компонент Home размонтирован");
		};
	}, []);

	let room = {
		name: "Main",
		messagesArray: [],
		players: [],
		lastUpdateTime: Date.now(),
	};

	return (
		<div id="HomePage">
			{loggedUser.name ? (
				<div className="loggedUser">
					<h3>Username: {loggedUser.name}</h3>
					<Button
						color="primary"
						variant="outlined"
						onClick={() => {
							socket.disconnect();
							localStorage.clear("ChessGameUserName");
							setLoggedUser({ ...loggedUser, name: null, accepted: false });
						}}
					>
						Log out
					</Button>
				</div>
			) : null}
			<div className="Tabs">
				<Chat socket={socket} loggedUser={loggedUser} roomData={room} />
				<ServersList socket={socket} loggedUser={loggedUser} setInGame={setInGame} />
				<UsersList socket={socket} loggedUser={loggedUser} />
			</div>
		</div>
	);
}
