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
		movesArray: [],
		players: [],
	},
	{
		name: "Server2",
		turn: "White",
		fieldArray: defaultFieldArray,
		stageArray: [],
		movesArray: [],
		players: [],
	},
];

socketIO.on("connection", (socket) => {
	console.log(`⚡connection Request⚡: socket ${socket.id} just connected!`);

	// socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

	socket.on("checkNewUsername", (data) => {
		console.log("⚡checkNewUsername Request⚡");
		const check = users.find((user) => user.username == data.username);
		if (check == undefined) {
			socketIO.emit("checkNewUsernameResponse", { username: data.username, accepted: true });
			console.log(`⚡checkNewUsername Response⚡: username ${data.username} accepted`);
		} else {
			socketIO.emit("checkNewUsernameResponse", { username: data.username, accepted: false });
			console.log(`⚡checkNewUsername Response⚡: username ${data.username} rejected`);
		}
	});

	socket.on("newUser", (data) => {
		console.log("⚡newUser Request⚡");
		const check = users.find((user) => user.socketID == socket.id);
		if (check == undefined) {
			users.push({ ...data, socketID: socket.id });
			socketIO.emit("newUserResponse", users);
			console.log(`⚡checkNewUsername Response⚡: user ${data.username}(${socket.id}) added to users list`, users);
		} else {
			console.log(`⚡checkNewUsername Response⚡: user ${data.username}(${socket.id}) already exist. Users list`, users);
		}
	});

	socket.on("getServersArray", (data) => {
		console.log("⚡getServersArray Request⚡");
		socketIO.emit("getServersArrayResponse", servers);
		console.log(`⚡getServersArray Response⚡: `);
	});

	socket.on("joinToServer", (data) => {
		console.log("⚡joinToServer Request⚡");
		let user = users.find((user) => user.username == data.username);
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				server.players.push({ ...user, team: data.team });
				console.log(`⚡joinToServer Response⚡: ${data.username} joined to ${server.name}`);
			}
			return server;
		});
		socketIO.emit("getServersArrayResponse", servers);
	});

	socket.on("getServerData", (data) => {
		console.log("⚡getServerData Request⚡: ", data);
		let server = servers.find((server) => server.name == data.serverName);
		socketIO.emit("getServerDataResponse", server);
		console.log(`⚡getServerData Response⚡: `, server);
	});

	socket.on("updateServerData", (data) => {
		console.log("⚡updateServerData Request⚡", data);
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
				socketIO.emit("getServerDataResponse", server);
			}
			return server;
		});
	});

	socket.on("resetServerData", (data) => {
		console.log("⚡resetServerData Request⚡", data);
		servers = servers.map((server) => {
			if (server.name == data.serverName) {
				server.fieldArray = [...defaultFieldArray];
				server.turn = "White";
				server.stageArray = [];
				server.movesArray = [];
				socketIO.emit("getServerDataResponse", server);
			}
			return server;
		});
	});

	socket.on("disconnect", () => {
		console.log("⚡disconnect Request⚡");
		let user = users.find((user) => user.socketID == socket.id);
		if (user == undefined) {
			console.log(`⚡disconnect Response⚡: socket ${socket.id}) disconnected`);
		} else {
			users = users.filter((user) => user.socketID !== socket.id);
			servers = servers.map((server) => {
				return { ...server, players: server.players.filter((player) => player.socketID !== socket.id) };
			});
			socketIO.emit("newUserResponse", users);
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
