import css from "./index.module.scss";
import Field from "../Field";
import { useSelector } from "react-redux";

export default function StageBoard({ team }) {
	console.log("StageBoard component rendered");
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	let stageArray = joinedServerData.stageArray;

	let playerTeam = "White";
	stageArray = stageArray.filter((i) => i.piece.team == team);

	return (
		<div className={css.StageBoard} style={stageArray.length > 0 ? { padding: "4px" } : null}>
			{stageArray &&
				stageArray.map((field) => {
					return <Field playerTeam={playerTeam} fieldData={field} key={`${field.x}-${field.y}-${field.piece.type}`} id={`${field.x}-${field.y}`} />;
				})}
		</div>
	);
}
