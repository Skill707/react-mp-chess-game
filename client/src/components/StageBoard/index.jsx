import css from "./index.module.scss";
import Field from "../Field";
import { useSelector } from "react-redux";

const playerTeam = "Black";
let enemyTeam = "";
if (playerTeam == "Black") enemyTeam = "White";
else enemyTeam = "Black";

export default function StageBoard() {
	console.log("StageBoard component rendered");
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	let stageArray = joinedServerData.stageArray;
	const w = window.innerWidth;
	const h = window.innerHeight;

	return (
		<div className={w > h ? css.StageBoard : css.StageBoard2}>
			{stageArray &&
				stageArray.map((field) => {
					return <Field fieldData={field} key={`${field.x}-${field.y}-${field.piece.type}`} id={`${field.x}-${field.y}`} />;
				})}
		</div>
	);
}
