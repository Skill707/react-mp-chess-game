import { Button } from "@mui/material";
import css from "./index.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConnected, setJoinedServerData, setLoggedUser, setPlayerTeam, setUserAccepted } from "../../redux/dataSlice";
import Swal from "sweetalert2";

export default function ServersList({ socket }) {
	console.log("component ServersPage rendering...");
	const [serversArray, setServersArray] = useState(null);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const userAccepted = useSelector((state) => state.data.userAccepted);
	const dispatch = useDispatch();

	useEffect(() => {
		console.log("useEffect[]: component ServersPage rendering...");

		if (userAccepted) {
			socket.emit("getServersArray", { username: loggedUser });
			console.log("getServersArray");
			socket.on("getServersArrayResponse", (data) => {
				console.log("useState: setServersArray");
				setServersArray(data);
			});
		} else {
			setServersArray(null);
		}
	}, [userAccepted]);

	return (
		<div>
			<TableContainer component={Paper} sx={{ minWidth: 250, maxWidth: 500, margin: "0 auto" }}>
				<div className={css.Top}>
					<h3>Rooms: </h3>
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
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">Black team</TableCell>
							<TableCell align="right">White team</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{serversArray &&
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
													socket.emit("joinToServer", { serverName: server.name, username: loggedUser, team: "Black" });
													dispatch(setPlayerTeam("Black"));
													dispatch(setJoinedServerData(server));
												}}
											>
												Join
											</Button>
										) : (
											server.players.find((player) => player.team == "Black").username
										)}
									</TableCell>
									<TableCell component="th" scope="row" align="right">
										{server.players.find((player) => player.team == "White") == undefined ? (
											<Button
												color="primary"
												variant="outlined"
												onClick={() => {
													socket.emit("joinToServer", { serverName: server.name, username: loggedUser, team: "White" });
													dispatch(setPlayerTeam("White"));
													dispatch(setJoinedServerData(server));
												}}
											>
												Join
											</Button>
										) : (
											server.players.find((player) => player.team == "White").username
										)}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
