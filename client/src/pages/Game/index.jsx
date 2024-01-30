import { Container } from "@mui/material";
import css from "./index.module.scss";
import GameBoard from "./../../components/GameBoard/index";
import StageBoard from "./../../components/StageBoard/index";
import socketIO from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ServersPage from "../ServersPage";
import { useEffect } from "react";

export default function Game() {
	const navigate = useNavigate();
	const loggedUser = useSelector((state) => state.data.loggedUser);

	useEffect(() => {
		if (loggedUser == null) navigate("/");
	}, []);

	if (loggedUser != null) {
		var socket = socketIO.connect("https://bronzed-curious-cost.glitch.me"); 
		// http://localhost:4000
		// https://bronzed-curious-cost.glitch.me
		socket.emit("checkNewUsername", { username: loggedUser });
	}

	useEffect(() => {
		socket.on("checkNewUsernameResponse", (data) => {
			console.log("🚀 ~ checkNewUsernameResponse: ", data);
			if (data.accepted) {
				socket.emit("newUser", { username: loggedUser });
			}
		});
	}, [socket]);

	return (
		<section>
			{loggedUser ? (
				<Container className={css.GamePage}>
					<GameBoard socket={socket} />
					<h4>StageBoard</h4>
					<StageBoard />
					<ServersPage socket={socket} />
				</Container>
			) : null}
		</section>
	);
}
