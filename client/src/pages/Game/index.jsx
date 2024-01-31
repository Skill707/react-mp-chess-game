import { Button, Container } from "@mui/material";
import css from "./index.module.scss";
import GameBoard from "./../../components/GameBoard/index";
import StageBoard from "./../../components/StageBoard/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { setJoinedServerData } from "../../redux/dataSlice";

export default function Game({ socket }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);

	useEffect(() => {
		if (loggedUser == null) {
			Swal.fire("Error: Username not setted!");
			navigate("/");
		} else {
			if (socket.connected & (joinedServerData != null)) {
				socket.emit("getServerData", { serverName: joinedServerData.name });
			} else {
				Swal.fire(`Error: Server not found! connected: ${socket.connected} joinedServerData: ${joinedServerData}`);
				navigate("/servers");
			}
		}

		socket.on("getServerDataResponse", (data) => {
			dispatch(setJoinedServerData(data));
		});
	}, [socket]);

	return (
		<section>
			{(joinedServerData != null) & (loggedUser != null) ? (
				<Container className={css.GamePage}>
					<GameBoard socket={socket} />
					<div style={{ display: "flex", height: "50px", alignItems: "center" }}>
						<h4>StageBoard</h4>
						<Button
							color="primary"
							variant="contained"
							onClick={() => {
								socket.emit("resetServerData", { serverName: joinedServerData.name });
							}}
						>
							Reset
						</Button>
					</div>
					<StageBoard socket={socket} />
				</Container>
			) : null}
		</section>
	);
}
