import css from "./index.module.scss";
import React, { useMemo } from "react";
import moment from "moment";
import Draggable from "../DragAndDrop/Draggable";
import Droppable from "../DragAndDrop/Droppable";
import Piece from "./Piece";

export default function Field({ fieldData, playerTeam, currentTurn, currentMate }) {
	const memoizedField = useMemo(() => {
		let nextTurn = "";
		if (currentTurn == "Black") nextTurn = "White";
		else if (currentTurn == "White") nextTurn = "Black";

		let rotate = "0deg";
		if (playerTeam == "Black") rotate = "180deg";
		else rotate = "0deg";

		let drag = false;
		if (fieldData.piece != null) {
			if (currentTurn == fieldData.piece.team && fieldData.piece.team == playerTeam) {
				if (currentMate == playerTeam) {
					if (fieldData.piece.type == "King") {
						drag = true
					}
				} else {
					drag = true;
				}
			} else {
				drag = false;
			}
		} else drag = false;

		return (
			<Droppable id={`${fieldData.x}-${fieldData.y}`} field={fieldData} enabled={fieldData.kill || fieldData.path}>
				<Draggable id={`${fieldData.x}-${fieldData.y}`} field={fieldData} enabled={drag}>
					<div style={{ rotate: rotate }} className={css.Field} key={`${fieldData.x}-${fieldData.y}`}>
						{fieldData?.kill ? <div className={css.kill}></div> : null}
						<p>{moment().format("ss")}</p>
						{fieldData.piece ? <Piece piece={fieldData.piece} /> : null}
						{fieldData?.path ? <div className={css.path}></div> : null}
					</div>
				</Draggable>
			</Droppable>
		);
	}, [fieldData, currentTurn]);

	return memoizedField;
}

/*

onClick={() => HandleClick(fieldData)}
				draggable={fieldData.piece != null ? currentTurn == fieldData.piece.team && fieldData.piece.team == playerTeam : false}
				onDragStart={(ev) => {
					if (fieldData.piece != null ? currentTurn == fieldData.piece.team && fieldData.piece.team == playerTeam : false) {
						dispatch(select(fieldData));
					}
				}}
				onDrop={(ev) => {
					if (fieldData.kill || fieldData.path) {
						ev.preventDefault();
						HandleClick(fieldData);
					}
				}}
				onDragOver={(ev) => {
					if (fieldData.kill || fieldData.path) {
						ev.preventDefault();
					}
				}}

*/
