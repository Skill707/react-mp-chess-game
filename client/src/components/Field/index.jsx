import css from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addToStageArray, editFieldArray, select } from "../../redux/dataSlice";
import Piece from "./../Piece/index";

export default function Field({ fieldData, socket }) {
	const selectedBox = useSelector((state) => state.data.selectedBox);
	const fieldArray = useSelector((state) => state.data.fieldArray);
	const dispatch = useDispatch();
	const playerTeam = "Black";

	function HandleClick(clicked) {
		console.log("HandleClick ~ selectedBox: ", selectedBox, "clicked: ", clicked);
		let tempFieldArray = [...fieldArray];

		if (selectedBox) {
			if (selectedBox == clicked) dispatch(select(null));
			else {
				if (clicked.piece == null) {
					if (clicked.path) {
						let first = { ...selectedBox };
						let { piece } = first;
						tempFieldArray = tempFieldArray.map((item) => {
							if ((item.ax == clicked.ax) & (item.y == clicked.y)) {
								if ((clicked.y == 8) | (clicked.y == 1)) {
									item = { ...clicked, piece: { type: "Queen", team: piece.team }, path: false };
								} else {
									item = { ...clicked, piece: piece, path: false };
								}
							}
							if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };
							return item;
						});
						dispatch(select(null));
						dispatch(editFieldArray(tempFieldArray));
						socket.emit("updateFieldArray", tempFieldArray);
					}
				} else {
					if (clicked.piece.team == playerTeam) dispatch(select(clicked));
					else {
						if (clicked.kill) {
							console.log("kill");
							let first = { ...selectedBox };
							let { piece } = first;
							tempFieldArray = tempFieldArray.map((item) => {
								if ((item.ax == clicked.ax) & (item.y == clicked.y)) {
									if ((clicked.y == 8) | (clicked.y == 1)) {
										item = { ...clicked, piece: { type: "Queen", team: piece.team }, kill: false };
									} else {
										item = { ...clicked, piece: piece, kill: false };
									}
								}
								if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };
								return item;
							});
							dispatch(select(null));
							dispatch(addToStageArray(clicked));
							dispatch(editFieldArray(tempFieldArray));
							socket.emit("updateFieldArray", tempFieldArray);
						}
					}
				}
			}
		} else {
			if (clicked.piece != null) {
				if (clicked.piece.team == playerTeam) dispatch(select(clicked));
			}
		}
	}

	let color = "";
	if (fieldData.y % 2 == 1) {
		if (fieldData.ax % 2 == 1) color = "chocolate";
		else color = "darksalmon";
	} else {
		if (fieldData.ax % 2 == 1) color = "darksalmon";
		else color = "chocolate";
	}

	let border = "";
	if (selectedBox == fieldData) border = "1px solid red";

	return (
		<div style={{ backgroundColor: color, border: border }} className={css.Field} key={`${fieldData.x}-${fieldData.y}`} onClick={() => HandleClick(fieldData)}>
			{fieldData?.kill ? <div className={css.kill}></div> : null}
			<p>{`${fieldData.x}-${fieldData.y}`}</p>
			{fieldData.piece ? <Piece piece={fieldData.piece} /> : null}
			{fieldData?.path ? <div className={css.path}></div> : null}
		</div>
	);
}
