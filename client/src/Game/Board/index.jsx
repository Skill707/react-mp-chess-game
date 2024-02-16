import css from "./index.module.scss";
import Field from "../Field";
import { useEffect, useState } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import moment from "moment";

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

export default function Board({ socket, loggedUser, roomData, setRoomData }) {
	let fieldArray = roomData.fieldArray;
	const player = roomData.players.find((user) => user.name == loggedUser.name);

	console.log("Компонент Board обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент Board отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент Board размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	const mouseSensor = useSensor(MouseSensor);
	const touchSensor = useSensor(TouchSensor);
	const sensors = useSensors(touchSensor, mouseSensor);

	const currentTurn = roomData.turn;
	let nextTurn = "";
	if (currentTurn == "Black") nextTurn = "White";
	else if (currentTurn == "White") nextTurn = "Black";

	let enemyTeam = "";
	if (player.team == "Black") enemyTeam = "White";
	else if (player.team == "White") enemyTeam = "Black";

	const currentMated = roomData.mated;

	let currentNotMated = "";
	if (currentMated == "Black") currentNotMated = "White";
	else if (currentMated == "White") currentNotMated = "Black";

	function handleDragStart(event) {
		// console.log(event);
		let selectedBox = event.active.data.current;
		if (selectedBox != null) {
			let fieldArray = roomData.fieldArray;
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
							if (sf.piece.team == player.team) {
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

				if (sf != undefined) {
					if (sf.piece != null) {
						if (sf.piece.team == player.team) {
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

				if (sf != undefined) {
					if (sf.piece != null) {
						if (sf.piece.team == player.team) {
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
								if (sf.piece.team == player.team) {
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
								if (sf.piece.team == player.team) {
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
								if (sf.piece.team == player.team) {
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
								if (sf.piece.team == player.team) {
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
			setRoomData({ ...roomData, fieldArray: fieldArray });
		}
	}

	function handleDragEnd(event) {
		// console.log("🚀 ~ handleDragEnd ~ event:", event);
		if (event.over != null) {
			let tempFieldArray = [...roomData.fieldArray];
			let clicked = event.over.data.current;
			let selectedBox = event.active.data.current;
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
								id: `${socket.id}-${Date.now()}`,
								userName: loggedUser.name,
								roomName: roomData.name,
								text: `${first.piece.type} from ${first.x}-${first.y} to ${clicked.x}-${clicked.y}.`,
								date: Date.now(),
							});
						}
						if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };
						item = { ...item, path: false };
						item = { ...item, kill: false };

						return item;
					});
					//////
					socket.emit("updateRoomData", { userName: loggedUser.name, roomName: roomData.name, fieldArray: tempFieldArray, turn: nextTurn });
				}
			} else {
				if (clicked.piece.team == currentTurn);
				else {
					if (clicked.kill) {
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
									id: `${socket.id}-${Date.now()}`,
									userName: loggedUser.name,
									roomName: roomData.name,
									text: `${first.piece.type} from ${first.x}-${first.y} to ${clicked.x}-${clicked.y}. ${clicked.piece.type} down!`,
									date: Date.now(),
								});
							}
							if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };
							item = { ...item, path: false };
							item = { ...item, kill: false };
							return item;
						});
						socket.emit("updateRoomData", {
							userName: loggedUser.name,
							roomName: roomData.name,
							fieldArray: tempFieldArray,
							stageArray: clicked,
							turn: nextTurn,
						});
					}
				}
			}
			///
		}
	}

	// function HandleClick(clicked) {
	// 	if (player.team == currentTurn) {
	// 		console.log("HandleClick ~ selectedBox: ", selectedBox, "clicked: ", clicked);
	// 		let tempFieldArray = [...fieldArray];

	// 		if (selectedBox) {
	// 			if (selectedBox == clicked) dispatch(select(null));
	// 			else {
	// 				if (clicked.piece == null) {
	// 					if (clicked.path) {
	// 						let first = { ...selectedBox };
	// 						let { piece } = first;
	// 						tempFieldArray = tempFieldArray.map((item) => {
	// 							if ((item.ax == clicked.ax) & (item.y == clicked.y)) {
	// 								if ((((clicked.y == 8) & (selectedBox.piece.team == "White")) | ((clicked.y == 1) & (selectedBox.piece.team == "Black"))) & (selectedBox.piece.type == "Pawn")) {
	// 									item = { ...clicked, piece: { type: "Queen", team: piece.team }, path: false };
	// 								} else {
	// 									item = { ...clicked, piece: piece, path: false };
	// 								}
	// 								socket.emit("message", {
	// 									userName: loggedUser.name,
	// 									text: `${first.piece.type} from ${first.x}-${first.y} to ${clicked.x}-${clicked.y}.`,
	// 									id: `${socket.id}-${Date.now()}`,
	// 									date: Date.now(),
	// 									roomName: roomData.name,
	// 								});
	// 							}
	// 							if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };

	// 							return item;
	// 						});
	// 						dispatch(select(null));
	// 						dispatch(editFieldArray(tempFieldArray));
	// 						dispatch(setCurrentTurn(nextTurn));
	// 						socket.emit("updateRoomData", { userName: loggedUser.name, roomName: roomData.name, fieldArray: tempFieldArray, turn: nextTurn, time: Date.now() });
	// 					}
	// 				} else {
	// 					if (clicked.piece.team == currentTurn) dispatch(select(clicked));
	// 					else {
	// 						if (clicked.kill) {
	// 							let first = { ...selectedBox };
	// 							let { piece } = first;
	// 							tempFieldArray = tempFieldArray.map((item) => {
	// 								if ((item.ax == clicked.ax) & (item.y == clicked.y)) {
	// 									if ((clicked.y == 8) | (clicked.y == 1)) {
	// 										item = { ...clicked, piece: { type: "Queen", team: piece.team }, kill: false };
	// 									} else {
	// 										item = { ...clicked, piece: piece, kill: false };
	// 									}
	// 									socket.emit("message", {
	// 										userName: loggedUser.name,
	// 										text: `${first.piece.type} from ${first.x}-${first.y} to ${clicked.x}-${clicked.y}. ${clicked.piece.type} down!`,
	// 										id: `${socket.id}-${Date.now()}`,
	// 										date: Date.now(),
	// 										roomName: roomData.name,
	// 									});
	// 								}
	// 								if ((item.ax == first.ax) & (item.y == first.y)) item = { ...first, piece: null };
	// 								return item;
	// 							});
	// 							dispatch(select(null));
	// 							dispatch(addToStageArray(clicked));
	// 							dispatch(editFieldArray(tempFieldArray));
	// 							dispatch(setCurrentTurn(nextTurn));
	// 							socket.emit("updateRoomData", {
	// 								userName: loggedUser.name,
	// 								roomName: roomData.name,
	// 								fieldArray: tempFieldArray,
	// 								stageArray: clicked,
	// 								turn: nextTurn,
	// 								time: Date.now(),
	// 							});
	// 						}
	// 					}
	// 				}
	// 			}
	// 		} else {
	// 			if (clicked.piece != null) {
	// 				if (clicked.piece.team == currentTurn) dispatch(select(clicked));
	// 			}
	// 		}
	// 	}
	// }

	function mated(field) {
		console.log(`mat from ${field}`);

		socket.emit("updateRoomData", {
			userName: loggedUser.name,
			roomName: roomData.name,
			mated: enemyTeam,
			time: Date.now(),
		});
	}

	function win(field) {
		console.log(`win from ${field}`);

		if (roomData.win == undefined) {
			socket.emit("updateRoomData", {
				userName: loggedUser.name,
				roomName: roomData.name,
				win: enemyTeam,
				time: Date.now(),
			});
		}
	}

	console.log("🚀 ~ useEffect ~ currentMated:", currentMated);
	if (currentMated == undefined) {
		fieldArray.map((field) => {
			if (field.piece != null) {
				if (field.piece.team == player.team) {
					let sf = field;
					if (sf.piece.type == "Pawn") {
						sf = field;
						if (field.piece.team == "Black") sf = getSideOfField("bl", sf, fieldArray);
						else sf = getSideOfField("tl", sf, fieldArray);

						if (sf != undefined) {
							if (sf.piece != null) {
								if (sf.piece.team == enemyTeam) {
									if (sf.piece.type == "King") {
										mated(sf);
									}
								}
							}
						}
						sf = field;
						if (field.piece.team == "Black") sf = getSideOfField("br", sf, fieldArray);
						else sf = getSideOfField("tr", sf, fieldArray);

						if (sf != undefined) {
							if (sf.piece != null) {
								if (sf.piece.team == enemyTeam) {
									if (sf.piece.type == "King") {
										mated(sf);
									}
								}
							}
						}
					} else if (sf.piece.type == "Rook") {
						["t", "b", "l", "r"].forEach((side) => {
							sf = field;
							for (let index = 0; index < 8; index++) {
								sf = getSideOfField(side, sf, fieldArray);
								if (sf == undefined) break;
								else {
									if (sf.piece == null) {
									} else {
										if (sf.piece.team == player.team) {
											break;
										} else if (sf.piece.team == enemyTeam) {
											if (sf.piece.type == "King") {
												mated(sf);
											}
											break;
										}
									}
								}
							}
						});
					} else if (sf.piece.type == "Knight") {
						["tl", "tr", "bl", "br", "lt", "lb", "rt", "rb"].forEach((side) => {
							sf = field;
							sf = getSideOfField2(side, sf, fieldArray);
							if (sf == undefined);
							else {
								if (sf.piece != null) {
									if (sf.piece.team == enemyTeam) {
										if (sf.piece.type == "King") {
											mated(sf);
										}
									}
								}
							}
						});
					} else if (sf.piece.type == "Bishop") {
						["tl", "bl", "tr", "br"].forEach((side) => {
							sf = field;
							for (let index = 0; index < 8; index++) {
								sf = getSideOfField(side, sf, fieldArray);
								if (sf == undefined) break;
								else {
									if (sf.piece != null) {
										if (sf.piece.team == player.team) {
											break;
										} else if (sf.piece.team == enemyTeam) {
											if (sf.piece.type == "King") {
												mated(sf);
											}
											break;
										}
									}
								}
							}
						});
					} else if (sf.piece.type == "Queen") {
						["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
							sf = field;
							for (let index = 0; index < 8; index++) {
								sf = getSideOfField(side, sf, fieldArray);
								if (sf == undefined) break;
								else {
									if (sf.piece != null) {
										if (sf.piece.team == player.team) {
											break;
										} else if (sf.piece.team == enemyTeam) {
											if (sf.piece.type == "King") {
												mated(sf);
											}
											break;
										}
									}
								}
							}
						});
					} else if (sf.piece.type == "King") {
						["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
							sf = field;
							for (let index = 0; index < 1; index++) {
								sf = getSideOfField(side, sf, fieldArray);
								if (sf == undefined) break;
								else {
									if (sf.piece != null) {
										if (sf.piece.team == player.team) {
											break;
										} else if (sf.piece.team == enemyTeam) {
											if (sf.piece.type == "King") {
												mated(sf);
											}
											break;
										}
									}
								}
							}
						});
					}
				}
			}
		});
	} else {
		if (currentMated == player.team) {
			fieldArray.map((field) => {
				if (field.piece != null) {
					if (field.piece.team == player.team) {
						let sf = field;
						if (sf.piece.type == "King") {
							let doWin = true;
							["t", "tl", "tr", "b", "bl", "br", "l", "r"].forEach((side) => {
								sf = field;
								sf = getSideOfField(side, sf, fieldArray);
								if (sf != undefined) {
									if (sf.piece == null) {
										doWin = false;
									}
								}
							});
							if (doWin) {
								win(field);
							}
						}
					}
				}
			});
		}
	}

	return (
		<div id="GameBoard" className={css.GameBoard} style={player.team == "Black" ? { rotate: "180deg" } : { rotate: "0deg" }}>
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
								return <Field key={`${field.x}-${field.y}`} fieldData={field} playerTeam={player.team} currentTurn={currentTurn} currentMated={currentMated} />;
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
