const express = require("express");
const app = express();
const http = require("http").Server(app);
const PORT = 4000;

const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:5173",
		// https://react-mp-chess-game.vercel.app
		// http://localhost:5173
	},
});

// user = { id, name }
let usersArray = [];
let mainChatMessagesArray = [];

const defaultFieldArray = require("./defaultFieldArray.js");
let roomsArray = require("./roomsArray.js");

socketIO.on("connection", (socket) => {
	console.log(`Server: socket ${socket.id} just connected!`);

	/*
		Requests:
		newUser, getUsers, message, getMainChat, typing, getRooms, getRoomData, joinToRoom, leaveRoom, resetRoomData, disconnect

		Responses:
		newUserResponse (to address), messageResponse (to address), getMainChatResponse, typingResponse (to address),
		getUsersResponse (to address or by update), getRoomsResponse (to address or by update), getRoomDataResponse (to address)
 	 	*/

	socket.on("newUser", (data) => {
		// data = { name }
		console.log(`newUser Request by socket ${socket.id} with name: ${data.name}`);
		const checkUserID = usersArray.find((user) => user.id == socket.id);
		if (checkUserID == undefined) {
			const checkUserName = usersArray.find((user) => user.name == data.name);
			if (checkUserName == undefined) {
				usersArray.push({ ...data, id: socket.id, room: undefined });
				socketIO.to(socket.id).emit("newUserResponse", { userName: data.name, accepted: true, chat: mainChatMessagesArray });
				console.log(`newUserResponse: user ${data.name} added to users list.`);
				socketIO.emit("getUsersResponse", usersArray);
				usersArray.map((user) => {
					// if (user.room == undefined) {
					let msg = {
						id: `${socket.id}-${Date.now()}`,
						userName: "Server",
						text: `${data.name} join to game`,
						date: Date.now(),
					};
					mainChatMessagesArray.push(msg);
					socketIO.to(user.id).emit("messageResponse", msg);
					// }
				});
			} else {
				socketIO.to(socket.id).emit("newUserResponse", { userName: data.name, accepted: false });
				console.log(`newUserResponse: name ${data.name}, already used by socket ${checkUserName.id}`);
			}
		} else {
			socketIO.to(socket.id).emit("newUserResponse", { userName: data.name, accepted: false });
			console.log(`newUserResponse: socket ${socket.id}, already used by user ${checkUserID.name}`);
		}
	});

	socket.on("getUsers", (data) => {
		// data = { userName }
		console.log(`getUsers Request by ${data.userName}`);
		socketIO.to(socket.id).emit("getUsersResponse", usersArray);
	});

	socket.on("message", (data) => {
		// data = { id, roomName, userName, text, date }
		if (data.roomName == "Main") {
			console.log(`message from ${data.userName} to  at ${data.roomName}`);
			usersArray.map((user) => {
				if (user.room == undefined) {
					mainChatMessagesArray.push(data);
					socketIO.to(user.id).emit("messageResponse", data);
				}
			});
		} else {
			roomsArray = roomsArray.map((room) => {
				if (room.name == data.roomName) {
					room.messagesArray.push(data);
					room.players.map((player) => {
						socketIO.to(player.id).emit("messageResponse", data);
						console.log(`message from ${data.userName} to ${player.name} at ${room.name}`);
					});
				}

				return room;
			});
		}
	});

	socket.on("getMainChat", (data) => {
		// data = { userName }
		console.log(`getMainChat Request by ${data.userName}`);
		socketIO.to(socket.id).emit("getMainChatResponse", mainChatMessagesArray);
	});

	socket.on("typing", (data) => {
		// data = { id, roomName, userName, text }
		roomsArray.map((room) => {
			if (room.name == data.roomName) {
				room.players.map((player) => {
					if (player.name != data.userName) {
						socketIO.to(player.id).emit("typingResponse", data);
					}
				});
			}
		});
	});

	socket.on("getRooms", (data) => {
		// data = { userName }
		console.log(`getRooms Request by ${data.userName}`);
		socketIO.to(socket.id).emit("getRoomsResponse", roomsArray);
	});

	socket.on("getRoomData", (data) => {
		// data = { userName, roomName }
		console.log(`getRoomData Request by ${data.userName} of ${data.roomName}`);
		let room = roomsArray.find((room) => room.name == room.roomName);
		socketIO.to(socket.id).emit("getRoomDataResponse", room);
	});

	socket.on("joinToRoom", (data) => {
		// data = { userName, roomName, userTeam }
		let user = usersArray.find((user) => user.name == data.userName);
		usersArray = usersArray.map((user) => {
			if (user.name == data.userName) {
				user = { ...user, room: data.roomName };
			}
			return user;
		});
		socketIO.emit("getUsersResponse", usersArray);
		console.log("🚀 ~ socket.on ~ usersArray:", usersArray);
		roomsArray = roomsArray.map((room) => {
			if (room.name == data.roomName) {
				room.players.push({ ...user, team: data.userTeam });
				console.log(`Server: ${data.userName} joined to ${room.name}`);
				room.players.map((player) => {
					socketIO.to(player.id).emit("getRoomDataResponse", room);
					let msg = {
						id: `${socket.id}-${Date.now()}`,
						userName: "Server",
						text: `${data.userName} join to room`,
						date: Date.now(),
					};
					room.messagesArray.push(msg);
					socketIO.to(player.id).emit("messageResponse", msg);
				});
			}
			return room;
		});
		socketIO.emit("getRoomsResponse", roomsArray);
	});

	socket.on("leaveRoom", (data) => {
		// data = { userName, roomName }
		usersArray = usersArray.map((user) => {
			if (user.name == data.userName) {
				user = { ...user, room: undefined };
			}
			return user;
		});
		socketIO.emit("getUsersResponse", usersArray);
		roomsArray = roomsArray.map((room) => {
			if (room.name == data.roomName) {
				room = { ...room, players: room.players.filter((player) => player.id !== socket.id) };
				console.log(`Server: ${data.userName} leave from ${room.name}`);
				room.players.map((player) => {
					socketIO.to(player.id).emit("getRoomDataResponse", room);
					let msg = {
						id: `${socket.id}-${Date.now()}`,
						userName: "Server",
						text: `${data.userName} leave room`,
						date: Date.now(),
					};
					room.messagesArray.push(msg);
					socketIO.to(player.id).emit("messageResponse", msg);
				});
			}
			return room;
		});
		socketIO.emit("getRoomsResponse", roomsArray);
	});

	socket.on("updateRoomData", (data) => {
		// data = { userName, roomName, ?fieldArray, ?toStageArray, ?turn, ?gameTimer, ?mated, ?winner }
		console.log(`updateRoomData Request by ${data.userName} of ${data.roomName} at ${data.time}.`);
		roomsArray = roomsArray.map((room) => {
			if (room.name == data.roomName) {
				if (data.fieldArray != undefined) {
					room.fieldArray = data.fieldArray;
					room.fieldLastUpdateTime = Date.now();
				}
				if (data.stageArray != undefined) {
					room.stageArray = [...room.stageArray, data.toStageArray];
				}
				if (data.turn != undefined) {
					room.turn = data.turn;
				}
				if (data.gameTimer != undefined) {
					room.gameTimer = data.gameTimer;
				}
				if (data.mated != undefined) {
					console.log(`${data.mated} team mated by ${data.userName}`);
					room.mated = data.mated;
					room.players.map((player) => {
						socketIO.to(player.id).emit("getRoomDataResponse", room);
						let msg = {
							id: `${socket.id}-${Date.now()}`,
							userName: "Server",
							text: `${data.mated} team mated!`,
							date: Date.now(),
						};
						room.messagesArray.push(msg);
						socketIO.to(player.id).emit("messageResponse", msg);
					});
				}
				if (data.winner != undefined) {
					console.log(`${data.win} team win by ${data.userName}`);
					room.winner = data.winner;
					room.players.map((player) => {
						socketIO.to(player.id).emit("getRoomDataResponse", room);
						let msg = {
							id: `${socket.id}-${Date.now()}`,
							userName: "Server",
							text: `${data.winner} team win!`,
							date: Date.now(),
						};
						room.messagesArray.push(msg);
						socketIO.to(player.id).emit("messageResponse", msg);
					});
				}
				room.lastUpdateTime = Date.now();
				room.players.map((player) => {
					socketIO.to(player.id).emit("getRoomDataResponse", room);
				});
			}
			return room;
		});
	});

	socket.on("resetRoomData", (data) => {
		// data = { userName, roomName }
		console.log(`resetRoomData Request by ${data.userName} of ${data.roomName}`);
		roomsArray = roomsArray.map((room) => {
			if (room.name == data.roomName) {
				room.fieldArray = [...defaultFieldArray];
				room.turn = "White";
				room.stageArray = [];
				room.messagesArray = [];
				room.mated = undefined;
				room.winner = undefined;
				room.gameTimer = 0;
				room.lastUpdateTime = Date.now();
				room.fieldLastUpdateTime = Date.now();
				room.players.map((player) => {
					socketIO.to(player.id).emit("getRoomDataResponse", room);
				});
			}
			return room;
		});
	});

	socket.on("disconnect", () => {
		let user = usersArray.find((user) => user.id == socket.id);
		if (user == undefined) {
			console.log(`Server: socket ${socket.id}) disconnected`);
		} else {
			usersArray = usersArray.filter((user) => user.id !== socket.id);
			socketIO.emit("getUsersResponse", usersArray);
			roomsArray = roomsArray.map((room) => {
				room = { ...room, players: room.players.filter((player) => player.id !== socket.id) };
				room.players.map((player) => {
					socketIO.to(player.id).emit("getRoomDataResponse", room);
					let msg = {
						id: `${socket.id}-${Date.now()}`,
						userName: "Server",
						text: `${user.name} disconnected`,
						date: Date.now(),
					};
					room.messagesArray.push(msg);
					socketIO.to(player.id).emit("messageResponse", msg);
				});
				return room;
			});

			socketIO.emit("getRoomsResponse", roomsArray);

			console.log(`Server: user ${user.name}(${socket.id}) disconnected.`);
		}
		socket.disconnect();
	});
});

app.get("/api", (req, res) => {
	res.json({ message: "Hello" });
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
