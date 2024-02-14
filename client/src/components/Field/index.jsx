import css from "./index.module.scss";
import Piece from "./../Piece/index";
import React, { useMemo } from "react";
import moment from "moment";
import Draggable from "./../DragAndDrop/Draggable";
import Droppable from "../DragAndDrop/Droppable";

export default function Field({ fieldData, playerTeam, currentTurn }) {
	const memoizedField = useMemo(() => {
		let nextTurn = "";
		if (currentTurn == "Black") nextTurn = "White";
		else if (currentTurn == "White") nextTurn = "Black";

		let rotate = "0deg";
		if (playerTeam == "Black") rotate = "180deg";
		else rotate = "0deg";

		return (
			<Droppable id={`${fieldData.x}-${fieldData.y}`} field={fieldData} enabled={fieldData.kill || fieldData.path}>
				<Draggable id={`${fieldData.x}-${fieldData.y}`} field={fieldData} enabled={fieldData.piece != null ? currentTurn == fieldData.piece.team && fieldData.piece.team == playerTeam : false}>
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
