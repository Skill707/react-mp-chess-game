/* eslint-disable no-unused-vars */
import css from "./index.module.scss";
import Field from "../Field";
import { useDispatch, useSelector } from "react-redux";

const playerTeam = "Black";
let enemyTeam = "";
if (playerTeam == "Black") enemyTeam = "White";
else enemyTeam = "Black";

function getSideOfField(side, item, array) {
	let result;
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

export default function GameBoard() {
	console.log("GameBoard component rendered");

	let fieldArray = useSelector((state) => state.test.fieldArray);
	const selectedField = useSelector((state) => state.test.selectedBox);
	const dispatch = useDispatch();

	if (selectedField) {
		let sf = selectedField;
		if (sf.piece.type == "Pawn") {
			for (let index = 0; index < 2; index++) {
				sf = getSideOfField("b", sf, fieldArray);
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
		} else if (sf.piece.type == "Rook") {
			["t", "b", "l", "r"].forEach((side) => {
				sf = selectedField;
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
				sf = selectedField;
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
				sf = selectedField;
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
				sf = selectedField;
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
				sf = selectedField;
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

	const w = window.innerWidth;
	const h = window.innerHeight;

	return (
		<div className={w > h ? css.GameBoard : css.GameBoard2}>
			{fieldArray &&
				fieldArray.map((field) => {
					return <Field fieldData={field} key={`${field.x}-${field.y}`} id={`${field.x}-${field.y}`} />;
				})}
		</div>
	);
}
