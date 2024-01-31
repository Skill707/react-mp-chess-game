import { useSelector } from "react-redux";
import css from "./index.module.scss";

export default function InfoBar() {
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
		<>
			{joinedServerData != null && (
				<div className={css.InfoBar}>
					<p>Black team: {blackTeamPlayerName}</p>
					<p>turn: {joinedServerData.turn}</p>
					<p>White team: {whiteTeamPlayerName}</p>
				</div>
			)}
		</>
	);
}
