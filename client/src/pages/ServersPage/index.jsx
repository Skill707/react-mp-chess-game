import { Button, ButtonBase, Container } from "@mui/material";
import css from "./index.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJoinedServerData, setPlayerTeam } from "../../redux/dataSlice";
import Swal from "sweetalert2";

export default function ServersPage({ socket }) {
	const [serversArray, setServersArray] = useState(null);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (socket.connected) {
			console.log("connected");
		} else {
			if (loggedUser == null) {
				Swal.fire("Error: Username not setted!");
				navigate("/");
			} else {
				socket.connect();
				socket.emit("checkNewUsername", { username: loggedUser });
			}
		}

		socket.on("checkNewUsernameResponse", (data) => {
			console.log("🚀 ~ checkNewUsernameResponse: ", data);
			if (data.accepted == true) {
				socket.emit("newUser", { username: data.username });
			} else {
				Swal.fire("Username already used!");
				navigate("/");
			}
		});

		socket.emit("getServersArray");
		socket.on("getServersArrayResponse", (data) => {
			setServersArray(data);
		});
	}, [socket]);

	return (
		<section>
			<Container>
				<h2>Servers: </h2>
				<TableContainer component={Paper} sx={{ minWidth: 250, maxWidth: 500, margin: "0 auto" }}>
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
													variant="contained"
													onClick={() => {
														socket.emit("joinToServer", { serverName: server.name, username: loggedUser, team: "Black" });
														dispatch(setPlayerTeam("Black"));
														dispatch(setJoinedServerData(server));
														navigate("/game");
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
													variant="contained"
													onClick={() => {
														socket.emit("joinToServer", { serverName: server.name, username: loggedUser, team: "White" });
														dispatch(setPlayerTeam("White"));
														dispatch(setJoinedServerData(server));
														navigate("/game");
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
			</Container>
		</section>
	);
}
