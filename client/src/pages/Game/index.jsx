import { Container } from "@mui/material";
import css from "./index.module.scss";
import GameBoard from "./../../components/GameBoard/index";
import StageBoard from "./../../components/StageBoard/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ServersPage from "../ServersPage";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function Game({ socket }) {
	const navigate = useNavigate();
	const loggedUser = useSelector((state) => state.data.loggedUser);

	useEffect(() => {
		if (loggedUser == null) {
			Swal.fire("Error: Username not setted!");
			navigate("/");
		} else {
			socket.emit("checkNewUsername", { username: loggedUser });
		}

		socket.on("checkNewUsernameResponse", (data) => {
			console.log("🚀 ~ checkNewUsernameResponse: ", data);
			if (data.accepted == true) {
				socket.emit("newUser", { username: loggedUser });
			} else {
				Swal.fire("Username already used!");
				navigate("/");
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
