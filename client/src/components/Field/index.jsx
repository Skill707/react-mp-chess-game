import css from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addToStageArray, editFieldArray, select, setCurrentTurn } from "../../redux/dataSlice";
import Piece from "./../Piece/index";

export default function Field({ fieldData, socket, playerTeam }) {
	const selectedBox = useSelector((state) => state.data.selectedBox);
	// const playerTeam = useSelector((state) => state.data.playerTeam);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	let fieldArray = joinedServerData.fieldArray;
	const currentTurn = joinedServerData.turn;
	let nextTurn = "";
	if (currentTurn == "Black") nextTurn = "White";
	else if (currentTurn == "White") nextTurn = "Black";

	const dispatch = useDispatch();

	function HandleClick(clicked) {
		if (playerTeam == currentTurn) {
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
									if ((((clicked.y == 8) & (selectedBox.piece.team == "White")) | ((clicked.y == 1) & (selectedBox.piece.team == "Black"))) & (selectedBox.piece.type == "Pawn")) {
										item = { ...clicked, piece: { type: "Queen", team: piece.team }, path: false };
									} else {
										item = { ...clicked, piece: piece, path: false };
									}
									socket.emit("message", {
										username: loggedUser,
										text: `${first.x}-${first.y} to ${clicked.x}-${clicked.y}.`,
										id: `${socket.id}-${Date.now()}`,
										date: Date.now(),
										serverName: joinedServerData.name,
									});
								}
								if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };

								return item;
							});
							dispatch(select(null));
							dispatch(editFieldArray(tempFieldArray));
							dispatch(setCurrentTurn(nextTurn));
							socket.emit("updateServerData", { username: loggedUser, serverName: joinedServerData.name, fieldArray: tempFieldArray, turn: nextTurn });
						}
					} else {
						if (clicked.piece.team == currentTurn) dispatch(select(clicked));
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
										socket.emit("message", {
											username: loggedUser,
											text: `${first.x}-${first.y} to ${clicked.x}-${clicked.y}. ${clicked.piece.type} down.`,
											id: `${socket.id}-${Date.now()}`,
											date: Date.now(),
											serverName: joinedServerData.name,
										});
									}
									if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };
									return item;
								});
								dispatch(select(null));
								dispatch(addToStageArray(clicked));
								dispatch(editFieldArray(tempFieldArray));
								dispatch(setCurrentTurn(nextTurn));
								socket.emit("updateServerData", { username: loggedUser, serverName: joinedServerData.name, fieldArray: tempFieldArray, stageArray: clicked, turn: nextTurn });
							}
						}
					}
				}
			} else {
				if (clicked.piece != null) {
					if (clicked.piece.team == currentTurn) dispatch(select(clicked));
				}
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

	let rotate = "0deg";
	if (playerTeam == "Black") rotate = "180deg";
	else rotate = "0deg";

	return (
		<div style={{ border: border, rotate: rotate }} className={css.Field} key={`${fieldData.x}-${fieldData.y}`} onClick={() => HandleClick(fieldData)}>
			{fieldData?.kill ? <div className={css.kill}></div> : null}
			{/* <p>{`${fieldData.x}-${fieldData.y}`}</p> */}
			{fieldData.piece ? <Piece piece={fieldData.piece} /> : null}
			{fieldData?.path ? <div className={css.path}></div> : null}
		</div>
	);
}
