/* eslint-disable no-unused-vars */
import css from "./index.module.scss";
import Field from "../Field";
import { useDispatch, useSelector } from "react-redux";

const playerTeam = "Black";
let enemyTeam = "";
if (playerTeam == "Black") enemyTeam = "White";
else enemyTeam = "Black";

export default function StageBoard() {
	console.log("StageBoard component rendered");

	let stageArray = useSelector((state) => state.test.stageArray);
	const w = window.innerWidth;
	const h = window.innerHeight;

	return (
		<div className={w > h ? css.StageBoard : css.StageBoard2}>
			{stageArray.map((field) => {
					return <Field fieldData={field} key={`${field.x}-${field.y}`} id={`${field.x}-${field.y}`} />;
				})}
		</div>
	);
}
