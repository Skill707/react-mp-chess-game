import { Button, Container } from "@mui/material";
import css from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setJoinedServerData, setLoggedUser } from "../../redux/dataSlice";
import { IoIosLogOut } from "react-icons/io";

export default function Navbar({ socket }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	let blackTeamPlayerName;
	let whiteTeamPlayerName;
	if (joinedServerData != null) {
		blackTeamPlayerName = joinedServerData.players.find((player) => player.team == "Black");
		if (blackTeamPlayerName) blackTeamPlayerName = blackTeamPlayerName.username;
		else blackTeamPlayerName = "None";
		whiteTeamPlayerName = joinedServerData.players.find((player) => player.team == "White");
		if (whiteTeamPlayerName) whiteTeamPlayerName = whiteTeamPlayerName.username;
		else whiteTeamPlayerName = "None";
	}

	return (
		<header>
			<Container className={css.Navbar}>
				<div>
					<h2>Chess online</h2>
				</div>

				{loggedUser != null && (
					<div style={{ display: "flex", gap: "20px" }}>
						{joinedServerData && (
							<Button
								color="primary"
								variant="contained"
								onClick={() => {
									dispatch(setJoinedServerData(null));
									socket.emit("LeaveFromServer", { serverName: joinedServerData.name, username: loggedUser });
									navigate("/servers");
								}}
							>
								Servers
							</Button>
						)}
						<Button
							color="primary"
							variant="contained"
							onClick={() => {
								socket.disconnect();
								localStorage.clear("ChessGameUserName");
								dispatch(setLoggedUser(null));
								dispatch(setJoinedServerData(null));
								navigate("/");
							}}
						>
							<span>{loggedUser}</span> <IoIosLogOut />
						</Button>
					</div>
				)}

				{joinedServerData != null && (
					<div className={css.InfoBar}>
						<p>Black team: {blackTeamPlayerName}</p>
						<p>turn: {joinedServerData.turn}</p>
						<p>White team: {whiteTeamPlayerName}</p>
					</div>
				)}
			</Container>
		</header>
	);
}
