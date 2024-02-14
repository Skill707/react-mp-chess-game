import css from "./index.module.scss";
import Field from "../Field";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setJoinedServerData } from "../../redux/dataSlice";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import Droppable from "../DragAndDrop/Droppable";

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
	// console.log("🚀 ~ getSideOfField ~ all:", side, item, result);
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
	// console.log("🚀 ~ getSideOfField2 ~ all:", side, item, result);
	return result;
}

export default function GameBoard({ socket }) {
	console.log("!!! component GameBoard rendering...");
	const dispatch = useDispatch();
	const selectedBox = useSelector((state) => state.data.selectedBox);
	const playerTeam = useSelector((state) => state.data.playerTeam);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	const loggedUser = useSelector((state) => state.data.loggedUser);

	let fieldArray;
	if (joinedServerData != null) {
		fieldArray = joinedServerData.fieldArray;
	} else {
		fieldArray = null;
	}
	let enemyTeam = "";
	if (playerTeam == "Black") enemyTeam = "White";
	else if (playerTeam == "White") enemyTeam = "Black";

	useEffect(() => {
		socket.on("getServerDataResponse", (data) => {
			if (data !== joinedServerData) {
				console.log("JoinedServerData: need update");
				dispatch(setJoinedServerData(data));
			} else {
				console.log("JoinedServerData: dont need update");
			}
		});
	}, [socket]);

	if (selectedBox) {
		let sf = selectedBox;
		if (sf.piece.type == "Pawn") {
			for (let index = 0; index < 2; index++) {
				if (selectedBox.piece.team == "Black") sf = getSideOfField("b", sf, fieldArray);
				else sf = getSideOfField("t", sf, fieldArray);

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
			if (selectedBox.piece.team == "Black") sf = getSideOfField("bl", sf, fieldArray);
			else sf = getSideOfField("tl", sf, fieldArray);

			if (sf == undefined) {
				if (sf.piece != null) {
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
			if (selectedBox.piece.team == "Black") sf = getSideOfField("br", sf, fieldArray);
			else sf = getSideOfField("tr", sf, fieldArray);

			if (sf == undefined) {
				if (sf.piece == null) {
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
				if (sf != undefined) {
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

	// function mat(field) {
	// 	const currentTurn = joinedServerData.turn;
	// 	let nextTurn = "";
	// 	if (currentTurn == "Black") nextTurn = "White";
	// 	else if (currentTurn == "White") nextTurn = "Black";

	// 	console.log(`mat from ${field}`);
	// 	socket.emit("message", {
	// 		username: loggedUser,
	// 		text: `${playerTeam} team make mat!`,
	// 		id: `${socket.id}-${Date.now()}`,
	// 		date: Date.now(),
	// 		serverName: joinedServerData.name,
	// 	});
	// 	// socket.emit("updateServerData", {
	// 	// 	username: loggedUser,
	// 	// 	serverName: joinedServerData.name,
	// 	// 	turn: nextTurn,
	// 	// 	time: Date.now(),
	// 	// });
	// }

	// fieldArray.map((field) => {
	// 	if (field.piece != null) {
	// 		if (field.piece.team == playerTeam) {
	// 			let sf = field;
	// 			if (sf.piece.type == "Pawn") {
	// 				sf = field;
	// 				if (field.piece.team == "Black") sf = getSideOfField("bl", sf, fieldArray);
	// 				else sf = getSideOfField("tl", sf, fieldArray);

	// 				if (sf != undefined) {
	// 					if (sf.piece != null) {
	// 						if (sf.piece.team == enemyTeam) {
	// 							if (sf.piece.type == "King") {
	// 								mat(sf);
	// 							}
	// 						}
	// 					}
	// 				}
	// 				sf = field;
	// 				if (field.piece.team == "Black") sf = getSideOfField("br", sf, fieldArray);
	// 				else sf = getSideOfField("tr", sf, fieldArray);

	// 				if (sf != undefined) {
	// 					if (sf.piece != null) {
	// 						if (sf.piece.team == enemyTeam) {
	// 							if (sf.piece.type == "King") {
	// 								mat(sf);
	// 							}
	// 						}
	// 					}
	// 				}
	// 			} else if (sf.piece.type == "Rook") {
	// 				["t", "b", "l", "r"].forEach((side) => {
	// 					sf = field;
	// 					for (let index = 0; index < 8; index++) {
	// 						sf = getSideOfField(side, sf, fieldArray);
	// 						if (sf == undefined) break;
	// 						else {
	// 							if (sf.piece == null) {
	// 							} else {
	// 								if (sf.piece.team == playerTeam) {
	// 									break;
	// 								} else if (sf.piece.team == enemyTeam) {
	// 									if (sf.piece.type == "King") {
	// 										mat(sf);
	// 									}
	// 									break;
	// 								}
	// 							}
	// 						}
	// 					}
	// 				});
	// 			} else if (sf.piece.type == "Knight") {
	// 				["tl", "tr", "bl", "br", "lt", "lb", "rt", "rb"].forEach((side) => {
	// 					sf = field;
	// 					sf = getSideOfField2(side, sf, fieldArray);
	// 					if (sf == undefined);
	// 					else {
	// 						if (sf.piece != null) {
	// 							if (sf.piece.team == enemyTeam) {
	// 								if (sf.piece.type == "King") {
	// 									mat(sf);
	// 								}
	// 							}
	// 						}
	// 					}
	// 				});
	// 			} else if (sf.piece.type == "Bishop") {
	// 				["tl", "bl", "tr", "br"].forEach((side) => {
	// 					sf = field;
	// 					for (let index = 0; index < 8; index++) {
	// 						sf = getSideOfField(side, sf, fieldArray);
	// 						if (sf == undefined) break;
	// 						else {
	// 							if (sf.piece != null) {
	// 								if (sf.piece.team == playerTeam) {
	// 									break;
	// 								} else if (sf.piece.team == enemyTeam) {
	// 									if (sf.piece.type == "King") {
	// 										mat(sf);
	// 									}
	// 									break;
	// 								}
	// 							}
	// 						}
	// 					}
	// 				});
	// 			} else if (sf.piece.type == "Queen") {
	// 				["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
	// 					sf = field;
	// 					for (let index = 0; index < 8; index++) {
	// 						sf = getSideOfField(side, sf, fieldArray);
	// 						if (sf == undefined) break;
	// 						else {
	// 							if (sf.piece != null) {
	// 								if (sf.piece.team == playerTeam) {
	// 									break;
	// 								} else if (sf.piece.team == enemyTeam) {
	// 									if (sf.piece.type == "King") {
	// 										mat(sf);
	// 									}
	// 									break;
	// 								}
	// 							}
	// 						}
	// 					}
	// 				});
	// 			} else if (sf.piece.type == "King") {
	// 				["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
	// 					sf = field;
	// 					for (let index = 0; index < 1; index++) {
	// 						sf = getSideOfField(side, sf, fieldArray);
	// 						if (sf == undefined) break;
	// 						else {
	// 							if (sf.piece != null) {
	// 								if (sf.piece.team == playerTeam) {
	// 									break;
	// 								} else if (sf.piece.team == enemyTeam) {
	// 									if (sf.piece.type == "King") {
	// 										mat(sf);
	// 									}
	// 									break;
	// 								}
	// 							}
	// 						}
	// 					}
	// 				});
	// 			}
	// 		}
	// 	}
	// });

	const mouseSensor = useSensor(MouseSensor);
	const touchSensor = useSensor(TouchSensor);
	const sensors = useSensors(touchSensor, mouseSensor);

	function handleDragStart(event) {
		console.log(event.active.data.current);
	}

	function handleDragEnd(event) {
		console.log(event);
	}

	return (
		<div id="GameBoard" className={css.GameBoard} style={playerTeam == "Black" ? { rotate: "180deg" } : { rotate: "0deg" }}>
			<div className={css.Top}>
				<div className={css.EmptyBox}></div>
				<div className={css.LetterBar}>
					{["A", "B", "C", "D", "E", "F", "G", "H"].map((item) => {
						return (
							<div key={item} style={{ rotate: "180deg" }}>
								{item}
							</div>
						);
					})}
				</div>
				<div className={css.EmptyBox}></div>
			</div>
			<div className={css.Middle}>
				<div className={css.NumberBar}>
					{["8", "7", "6", "5", "4", "3", "2", "1"].map((item) => {
						return <div key={item}>{item}</div>;
					})}
				</div>
				<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
					<div className={css.Board}>
						{fieldArray &&
							fieldArray.map((field) => {
								return (
									<Droppable key={`${field.x}-${field.y}`} id={`${field.x}-${field.y}`}>
										<Field fieldData={field} socket={socket} playerTeam={playerTeam} joinedServerData={joinedServerData} />
									</Droppable>
								);
							})}
					</div>
				</DndContext>
				<div className={css.NumberBar}>
					{["8", "7", "6", "5", "4", "3", "2", "1"].map((item) => {
						return (
							<div key={item} style={{ rotate: "180deg" }}>
								{item}
							</div>
						);
					})}
				</div>
			</div>
			<div className={css.Bottom}>
				<div className={css.EmptyBox}></div>
				<div className={css.LetterBar}>
					{["A", "B", "C", "D", "E", "F", "G", "H"].map((item) => {
						return <div key={item}>{item}</div>;
					})}
				</div>
				<div className={css.EmptyBox}></div>
			</div>
		</div>
	);
}
