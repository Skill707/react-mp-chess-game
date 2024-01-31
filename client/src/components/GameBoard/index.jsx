import css from "./index.module.scss";
import Field from "../Field";
import { useDispatch, useSelector } from "react-redux";

function getSideOfField(side, item, array) {
	let result = "none";
	switch (side) {
		case "t":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 1)) & (obj.ax == item.ax));
			break;
		case "tl":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 1)) & (obj.ax == item.ax - 1));
			break;
		case "tr":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 1)) & (obj.ax == String(Number(item.ax) + 1)));
			break;
		case "b":
			result = array.find((obj) => (obj.y == item.y - 1) & (obj.ax == item.ax));
			break;
		case "bl":
			result = array.find((obj) => (obj.y == item.y - 1) & (obj.ax == item.ax - 1));
			break;
		case "br":
			result = array.find((obj) => (obj.y == item.y - 1) & (obj.ax == String(Number(item.ax) + 1)));
			break;
		case "l":
			result = array.find((obj) => (obj.y == item.y) & (obj.ax == item.ax - 1));
			break;
		case "r":
			result = array.find((obj) => (obj.y == item.y) & (obj.ax == String(Number(item.ax) + 1)));
			break;
		default:
			break;
	}
	console.log("🚀 ~ getSideOfField ~ all:", side, item, result);
	return result;
}

function getSideOfField2(side, item, array) {
	let result;
	switch (side) {
		case "tl":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 2)) & (obj.ax == item.ax - 1));
			break;
		case "tr":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 2)) & (obj.ax == String(Number(item.ax) + 1)));
			break;
		case "bl":
			result = array.find((obj) => (obj.y == item.y - 2) & (obj.ax == item.ax - 1));
			break;
		case "br":
			result = array.find((obj) => (obj.y == item.y - 2) & (obj.ax == String(Number(item.ax) + 1)));
			break;
		case "lt":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 1)) & (obj.ax == item.ax - 2));
			break;
		case "lb":
			result = array.find((obj) => (obj.y == item.y - 1) & (obj.ax == item.ax - 2));
			break;
		case "rt":
			result = array.find((obj) => (obj.y == String(Number(item.y) + 1)) & (obj.ax == String(Number(item.ax) + 2)));
			break;
		case "rb":
			result = array.find((obj) => (obj.y == item.y - 1) & (obj.ax == String(Number(item.ax) + 2)));
			break;
		default:
			break;
	}
	console.log("🚀 ~ getSideOfField2 ~ all:", side, item, result);
	return result;
}

export default function GameBoard({ socket }) {
	console.log("GameBoard component rendered");
	const selectedBox = useSelector((state) => state.data.selectedBox);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	let fieldArray = joinedServerData.fieldArray;
	const currentTurn = joinedServerData.turn;
	let playerTeam = currentTurn;
	let enemyTeam = "";
	if (playerTeam == "Black") enemyTeam = "White";
	else if (playerTeam == "White") enemyTeam = "Black";

	const dispatch = useDispatch();

	if (selectedBox) {
		let sf = selectedBox;
		if (sf.piece.type == "Pawn") {
			for (let index = 0; index < 2; index++) {
				if (selectedBox.piece.team == "Black") {
					sf = getSideOfField("b", sf, fieldArray);
				} else {
					sf = getSideOfField("t", sf, fieldArray);
				}
				if (sf == undefined) break;
				else {
					if (sf.piece == null) {
						fieldArray = fieldArray.map((item) => {
							if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, path: true };
							return item;
						});
					} else {
						if (sf.piece.team == playerTeam) {
							break;
						} else if (sf.piece.team == enemyTeam) {
							break;
						}
					}
				}
			}
			sf = selectedBox;
			if (selectedBox.piece.team == "Black") {
				sf = getSideOfField("bl", sf, fieldArray);
			} else {
				sf = getSideOfField("tl", sf, fieldArray);
			}
			if (sf == undefined);
			else {
				if (sf.piece == null) {
				} else {
					if (sf.piece.team == playerTeam) {
					} else if (sf.piece.team == enemyTeam) {
						fieldArray = fieldArray.map((item) => {
							if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
							return item;
						});
					}
				}
			}
			sf = selectedBox;
			if (selectedBox.piece.team == "Black") {
				sf = getSideOfField("br", sf, fieldArray);
			} else {
				sf = getSideOfField("tr", sf, fieldArray);
			}
			if (sf == undefined);
			else {
				if (sf.piece == null) {
				} else {
					if (sf.piece.team == playerTeam) {
					} else if (sf.piece.team == enemyTeam) {
						fieldArray = fieldArray.map((item) => {
							if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
							return item;
						});
					}
				}
			}
		} else if (sf.piece.type == "Rook") {
			["t", "b", "l", "r"].forEach((side) => {
				sf = selectedBox;
				for (let index = 0; index < 8; index++) {
					sf = getSideOfField(side, sf, fieldArray);
					if (sf == undefined) break;
					else {
						if (sf.piece == null) {
							fieldArray = fieldArray.map((item) => {
								if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, path: true };
								return item;
							});
						} else {
							if (sf.piece.team == playerTeam) {
								break;
							} else if (sf.piece.team == enemyTeam) {
								fieldArray = fieldArray.map((item) => {
									if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
									return item;
								});
								break;
							}
						}
					}
				}
			});
		} else if (sf.piece.type == "Knight") {
			["tl", "tr", "bl", "br", "lt", "lb", "rt", "rb"].forEach((side) => {
				sf = selectedBox;
				sf = getSideOfField2(side, sf, fieldArray);
				if (sf == undefined);
				else {
					if (sf.piece == null) {
						fieldArray = fieldArray.map((item) => {
							if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, path: true };
							return item;
						});
					} else {
						if (sf.piece.team == enemyTeam) {
							fieldArray = fieldArray.map((item) => {
								if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
								return item;
							});
						}
					}
				}
			});
		} else if (sf.piece.type == "Bishop") {
			["tl", "bl", "tr", "br"].forEach((side) => {
				sf = selectedBox;
				for (let index = 0; index < 8; index++) {
					sf = getSideOfField(side, sf, fieldArray);
					if (sf == undefined) break;
					else {
						if (sf.piece == null) {
							fieldArray = fieldArray.map((item) => {
								if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, path: true };
								return item;
							});
						} else {
							if (sf.piece.team == playerTeam) {
								break;
							} else if (sf.piece.team == enemyTeam) {
								fieldArray = fieldArray.map((item) => {
									if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
									return item;
								});
								break;
							}
						}
					}
				}
			});
		} else if (sf.piece.type == "Queen") {
			["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
				sf = selectedBox;
				for (let index = 0; index < 8; index++) {
					sf = getSideOfField(side, sf, fieldArray);
					if (sf == undefined) break;
					else {
						if (sf.piece == null) {
							fieldArray = fieldArray.map((item) => {
								if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, path: true };
								return item;
							});
						} else {
							if (sf.piece.team == playerTeam) {
								break;
							} else if (sf.piece.team == enemyTeam) {
								fieldArray = fieldArray.map((item) => {
									if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
									return item;
								});
								break;
							}
						}
					}
				}
			});
		} else if (sf.piece.type == "King") {
			["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
				sf = selectedBox;
				for (let index = 0; index < 1; index++) {
					sf = getSideOfField(side, sf, fieldArray);
					if (sf == undefined) break;
					else {
						if (sf.piece == null) {
							fieldArray = fieldArray.map((item) => {
								if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, path: true };
								return item;
							});
						} else {
							if (sf.piece.team == playerTeam) {
								break;
							} else if (sf.piece.team == enemyTeam) {
								fieldArray = fieldArray.map((item) => {
									if ((item.ax == sf.ax) & (item.y == sf.y)) item = { ...sf, kill: true };
									return item;
								});
								break;
							}
						}
					}
				}
			});
		}
	}

	return (
		<>
			<div className={css.GameBoard}>
				{fieldArray &&
					fieldArray.map((field) => {
						return <Field fieldData={field} socket={socket} key={`${field.x}-${field.y}`} id={`${field.x}-${field.y}`} />;
					})}
			</div>
		</>
	);
}
