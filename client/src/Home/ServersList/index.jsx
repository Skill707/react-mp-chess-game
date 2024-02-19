import { Button } from "@mui/material";
import css from "./index.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import moment from "moment";
export default function ServersList({ socket, loggedUser, setInGame }) {
	const [serversArray, setServersArray] = useState(null);

	console.log("Компонент ServersList обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент ServersList отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент ServersList размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	useEffect(() => {
		console.log("useEffect в ServersList: loggedUser.accepted обновлён");
		if (loggedUser.accepted) {
			console.log("socket.emit(`getServersArray`, { username: loggedUser })");
			socket.emit("getRooms", { userName: loggedUser.name });
			socket.on("getRoomsResponse", (data) => {
				console.log("setServersArray(data)");
				setServersArray(data);
			});
		} else {
			console.log("setServersArray(null)");
			setServersArray(null);
		}

		return () => {
			console.log("Client: socket.removeAllListeners(getServersArrayResponse)");
			socket.removeAllListeners("getServersArrayResponse");
		};
	}, [socket, loggedUser.accepted]);

	return (
		<div className={css.ServersList} id="ServersList">
			<div className={css.Top}>
				<h3>Rooms: </h3>
			</div>
			<TableContainer sx={{ minWidth: 250, maxWidth: 500, margin: "0 auto" }}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">Black team</TableCell>
							<TableCell align="right">White team</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{serversArray ? (
							serversArray.map((server) => (
								<TableRow key={server.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
									<TableCell component="th" scope="row">
										{server.name}
									</TableCell>
									<TableCell component="th" scope="row" align="right">
										{server.players.find((player) => player.team == "Black") == undefined ? (
											<Button
												color="primary"
												variant="outlined"
												onClick={() => {
													socket.emit("joinToRoom", { userName: loggedUser.name, roomName: server.name, userTeam: "Black" });
													setInGame(true);
													console.log("GAME START");
												}}
											>
												Join
											</Button>
										) : (
											server.players.find((player) => player.team == "Black").name
										)}
									</TableCell>
									<TableCell component="th" scope="row" align="right">
										{server.players.find((player) => player.team == "White") == undefined ? (
											<Button
												color="primary"
												variant="outlined"
												onClick={() => {
													socket.emit("joinToRoom", { userName: loggedUser.name, roomName: server.name, userTeam: "White" });
													setInGame(true);
													console.log("GAME START");
												}}
											>
												Join
											</Button>
										) : (
											server.players.find((player) => player.team == "White").name
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								<TableCell scope="row" colSpan={3}>
									<LinearProgress />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
