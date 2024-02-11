const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;

const socketIO = require("socket.io")(http, {
	cors: {
		origin: "http://localhost:5173",
		// https://react-mp-chess-game.vercel.app
		// http://localhost:5173
	},
});
app.use(cors());

let users = [];

const defaultFieldArray = [
	{
		x: "a",
		ax: "1",
		y: "8",
		piece: {
			type: "Rook",
			team: "Black",
		},
	},
	{
		x: "b",
		ax: "2",
		y: "8",
		piece: { type: "Knight", team: "Black" },
	},
	{
		x: "c",
		ax: "3",
		y: "8",
		piece: { type: "Bishop", team: "Black" },
	},
	{
		x: "d",
		ax: "4",
		y: "8",
		piece: { type: "Queen", team: "Black" },
	},
	{
		x: "e",
		ax: "5",
		y: "8",
		piece: { type: "King", team: "Black" },
	},
	{
		x: "f",
		ax: "6",
		y: "8",
		piece: { type: "Bishop", team: "Black" },
	},
	{
		x: "g",
		ax: "7",
		y: "8",
		piece: { type: "Knight", team: "Black" },
	},
	{
		x: "h",
		ax: "8",
		y: "8",
		piece: { type: "Rook", team: "Black" },
	},
	{
		x: "a",
		ax: "1",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "b",
		ax: "2",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "c",
		ax: "3",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "d",
		ax: "4",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "e",
		ax: "5",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "f",
		ax: "6",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "g",
		ax: "7",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "h",
		ax: "8",
		y: "7",
		piece: { type: "Pawn", team: "Black" },
	},
	{
		x: "a",
		ax: "1",
		y: "6",
		piece: null,
	},
	{
		x: "b",
		ax: "2",
		y: "6",
		piece: null,
	},
	{
		x: "c",
		ax: "3",
		y: "6",
		piece: null,
	},
	{
		x: "d",
		ax: "4",
		y: "6",
		piece: null,
	},
	{
		x: "e",
		ax: "5",
		y: "6",
		piece: null,
	},
	{
		x: "f",
		ax: "6",
		y: "6",
		piece: null,
	},
	{
		x: "g",
		ax: "7",
		y: "6",
		piece: null,
	},
	{
		x: "h",
		ax: "8",
		y: "6",
		piece: null,
	},
	{
		x: "a",
		ax: "1",
		y: "5",
		piece: null,
	},
	{
		x: "b",
		ax: "2",
		y: "5",
		piece: null,
	},
	{
		x: "c",
		ax: "3",
		y: "5",
		piece: null,
	},
	{
		x: "d",
		ax: "4",
		y: "5",
		piece: null,
	},
	{
		x: "e",
		ax: "5",
		y: "5",
		piece: null,
	},
	{
		x: "f",
		ax: "6",
		y: "5",
		piece: null,
	},
	{
		x: "g",
		ax: "7",
		y: "5",
		piece: null,
	},
	{
		x: "h",
		ax: "8",
		y: "5",
		piece: null,
	},
	{
		x: "a",
		ax: "1",
		y: "4",
		piece: null,
	},
	{
		x: "b",
		ax: "2",
		y: "4",
		piece: null,
	},
	{
		x: "c",
		ax: "3",
		y: "4",
		piece: null,
	},
	{
		x: "d",
		ax: "4",
		y: "4",
		piece: null,
	},
	{
		x: "e",
		ax: "5",
		y: "4",
		piece: null,
	},
	{
		x: "f",
		ax: "6",
		y: "4",
		piece: null,
	},
	{
		x: "g",
		ax: "7",
		y: "4",
		piece: null,
	},
	{
		x: "h",
		ax: "8",
		y: "4",
		piece: null,
	},
	{
		x: "a",
		ax: "1",
		y: "3",
		piece: null,
	},
	{
		x: "b",
		ax: "2",
		y: "3",
		piece: null,
	},
	{
		x: "c",
		ax: "3",
		y: "3",
		piece: null,
	},
	{
		x: "d",
		ax: "4",
		y: "3",
		piece: null,
	},
	{
		x: "e",
		ax: "5",
		y: "3",
		piece: null,
	},
	{
		x: "f",
		ax: "6",
		y: "3",
		piece: null,
	},
	{
		x: "g",
		ax: "7",
		y: "3",
		piece: null,
	},
	{
		x: "h",
		ax: "8",
		y: "3",
		piece: null,
	},

	{
		x: "a",
		ax: "1",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "b",
		ax: "2",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "c",
		ax: "3",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "d",
		ax: "4",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "e",
		ax: "5",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "f",
		ax: "6",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "g",
		ax: "7",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "h",
		ax: "8",
		y: "2",
		piece: { type: "Pawn", team: "White" },
	},
	{
		x: "a",
		ax: "1",
		y: "1",
		piece: { type: "Rook", team: "White" },
	},
	{
		x: "b",
		ax: "2",
		y: "1",
		piece: { type: "Knight", team: "White" },
	},
	{
		x: "c",
		ax: "3",
		y: "1",
		piece: { type: "Bishop", team: "White" },
	},
	{
		x: "d",
		ax: "4",
		y: "1",
		piece: { type: "Queen", team: "White" },
	},
	{
		x: "e",
		ax: "5",
		y: "1",
		piece: { type: "King", team: "White" },
	},
	{
		x: "f",
		ax: "6",
		y: "1",
		piece: { type: "Bishop", team: "White" },
	},
	{
		x: "g",
		ax: "7",
		y: "1",
		piece: { type: "Knight", team: "White" },
	},
	{
		x: "h",
		ax: "8",
		y: "1",
		piece: { type: "Rook", team: "White" },
	},
];

let servers = [
	{
		name: "Server1",
		turn: "White",
		fieldArray: defaultFieldArray,
		stageArray: [],
		messagesArray: [],
		players: [],
	},
	{
		name: "Server2",
		turn: "White",
		fieldArray: defaultFieldArray,
		stageArray: [],
		messagesArray: [],
		players: [],
	},
	{
		name: "Server3",
		turn: "White",
		fieldArray: defaultFieldArray,
		stageArray: [],
		messagesArray: [],
		players: [],
	},
	{
		name: "Server4",
		turn: "White",
		fieldArray: defaultFieldArray,
		stageArray: [],
		messagesArray: [],
		players: [],
	},
	{
		name: "Server5",
		turn: "White",
		fieldArray: defaultFieldArray,
		stageArray: [],
		messagesArray: [],
		players: [],
	},
];

console.log("restart");

socketIO.on("connection", (socket) => {
	console.log(`⚡: socket ${socket.id} just connected!`);

	socket.on("newUser", (data) => {
		console.log(`⚡newUser Request by socket ${socket.id} with username: ${data.username}`);
		const checkUserSocket = users.find((user) => user.socketID == socket.id);
		if (checkUserSocket == undefined) {
			const checkUserName = users.find((user) => user.username == data.username);
			if (checkUserName == undefined) {
				users.push({ ...data, socketID: socket.id });
				socketIO.to(socket.id).emit("newUserResponse", { username: data.username, accepted: true });
				// socketIO.emit("newUserResponse", users);
				console.log(`⚡newUser Response⚡: user ${data.username}(${socket.id}) added to users list. Users list: users<Array>`);
			} else {
				socketIO.to(socket.id).emit("newUserResponse", { username: data.username, accepted: false });
				console.log(`⚡newUser Response⚡: username ${data.username} already used by socket ${checkUserName.socketID}`);
			}
		} else {
			socketIO.to(socket.id).emit("newUserResponse", { username: data.username, accepted: false });
			console.log(`⚡newUser Response⚡: socket ${socket.id} already used by user ${checkUserSocket.username}`);
		}
	});

	socket.on("oldUser", (data) => {
		console.log(`⚡oldUser Request by socket ${socket.id} with username: ${data.username}`);
		const checkUserSocket = users.find((user) => user.socketID == socket.id);
		if (checkUserSocket == undefined) {
			const checkUserName = users.find((user) => user.username == data.username);
			if (checkUserName == undefined) {
				users.push({ ...data, socketID: socket.id });
				socketIO.to(socket.id).emit("oldUserResponse", { username: data.username, accepted: true });
				// socketIO.emit("newUserResponse", users);
				console.log(`⚡oldUser Response⚡: user ${data.username}(${socket.id}) added to users list. Users list: users<Array>`);
			} else {
				socketIO.to(socket.id).emit("oldUserResponse", { username: data.username, accepted: false });
				console.log(`⚡oldUser Response⚡: username ${data.username} already used by socket ${checkUserName.socketID}`);
			}
		} else {
			socketIO.to(socket.id).emit("oldUserResponse", { username: data.username, accepted: false });
			console.log(`⚡oldUser Response⚡: socket ${socket.id} already used by user ${checkUserSocket.username}`);
		}
	});

	socket.on("getServersArray", (data) => {
		console.log(`⚡getServersArray Request by ${data.username}(${socket.id})`);
		socketIO.to(socket.id).emit("getServersArrayResponse", servers);
	});

	socket.on("joinToServer", (data) => {
		let user = users.find((user) => user.username == data.username);
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				server.players.push({ ...user, team: data.team });
				console.log(`⚡joinToServer Response⚡: ${data.username} joined to ${server.name}`);
				server.players.map((player) => {
					socketIO.to(player.socketID).emit("getServerDataResponse", server);
					let msg = {
						username: "Server",
						text: `${data.username} join to room`,
						id: `${socket.id}-${Date.now()}`,
						date: Date.now(),
						serverName: server.name,
					};
					server.messagesArray.push(msg);
					socketIO.to(player.socketID).emit("messageResponse", msg);
				});
			}
			return server;
		});
		socketIO.emit("getServersArrayResponse", servers);
	});

	socket.on("LeaveFromServer", (data) => {
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				server = { ...server, players: server.players.filter((player) => player.socketID !== socket.id) };
				console.log(`⚡LeaveFromServer Response⚡: ${data.username} leave from ${server.name}`);
				server.players.map((player) => {
					socketIO.to(player.socketID).emit("getServerDataResponse", server);
					let msg = {
						username: "Server",
						text: `${data.username} leave room`,
						id: `${socket.id}-${Date.now()}`,
						date: Date.now(),
						serverName: server.name,
					};
					server.messagesArray.push(msg);
					socketIO.to(player.socketID).emit("messageResponse", msg);
				});
			}
			return server;
		});
		socketIO.emit("getServersArrayResponse", servers);
	});

	socket.on("getServerData", (data) => {
		console.log(`⚡getServerData Request by ${data.username} of server ${data.serverName}`);
		let server = servers.find((server) => server.name == data.serverName);
		socketIO.to(socket.id).emit("getServerDataResponse", server);
	});

	socket.on("updateServerData", (data) => {
		console.log(`⚡updateServerData Request by ${data.username} of server ${data.serverName}`);
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				if (data.fieldArray != undefined) {
					server.fieldArray = data.fieldArray;
				}
				if (data.stageArray != undefined) {
					server.stageArray = [...server.stageArray, data.stageArray];
				}
				if (data.turn != undefined) {
					server.turn = data.turn;
				}
				if (data.players != undefined) {
					server.players = data.players;
				}
				server.players.map((player) => {
					socketIO.to(player.socketID).emit("getServerDataResponse", server);
				});
			}
			return server;
		});
	});

	socket.on("message", (data) => {
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				server.messagesArray.push(data);
			}
			server.players.map((player) => {
				socketIO.to(player.socketID).emit("messageResponse", data);
			});
			return server;
		});
	});

	socket.on("typing", (data) => {
		// console.log(`⚡typing Request by ${data.username} of server ${data.serverName} with text: ${data.text}`);
		servers.map((server) => {
			if (server.name == data.serverName) {
				server.players.map((player) => {
					if (player.username != data.username) {
						socketIO.to(player.socketID).emit("typingResponse", data);
					}
				});
			}
		});
	});

	socket.on("resetServerData", (data) => {
		console.log(`⚡resetServerData Request by ${data.username} of server ${data.serverName}`);
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				server.fieldArray = [...defaultFieldArray];
				server.turn = "White";
				server.stageArray = [];
				server.messagesArray = [];
				server.players.map((player) => {
					socketIO.to(player.socketID).emit("getServerDataResponse", server);
				});
			}
			return server;
		});
	});

	socket.on("disconnect", () => {
		let user = users.find((user) => user.socketID == socket.id);
		if (user == undefined) {
			console.log(`⚡disconnect Response⚡: socket ${socket.id}) disconnected`);
		} else {
			users = users.filter((user) => user.socketID !== socket.id);
			servers = servers.map((server) => {
				server = { ...server, players: server.players.filter((player) => player.socketID !== socket.id) };
				server.players.map((player) => {
					socketIO.to(player.socketID).emit("getServerDataResponse", server);
					let msg = {
						username: "Server",
						text: `${user.username} disconnected`,
						id: `${socket.id}-${Date.now()}`,
						date: Date.now(),
						serverName: server.name,
					};
					server.messagesArray.push(msg);
					socketIO.to(player.socketID).emit("messageResponse", msg);
				});
				return server;
			});
			// socketIO.emit("newUserResponse", users);
			socketIO.emit("getServersArrayResponse", servers);

			console.log(`⚡disconnect Response⚡: user ${user.username}(${socket.id}) disconnected. Users list:`, users);
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
