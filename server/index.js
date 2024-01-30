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
let fieldArray = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡connection Request⚡: socket ${socket.id} just connected!`);

	// socket.on("message", (data) => {
	// 	socketIO.emit("messageResponse", data);
	// });
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

	socket.on("updateFieldArray", (data) => {
		console.log("⚡updateFieldArray Request⚡");
		fieldArray = data;
		socketIO.emit("updateFieldArrayResponse", data);
		console.log(`⚡updateFieldArray Response⚡: update FieldArray`);
	});

	socket.on("disconnect", () => {
		console.log("⚡disconnect Request⚡");
		let user = users.find((user) => user.socketID == socket.id);
		if (user == undefined) {
			console.log(`⚡disconnect Response⚡: socket ${socket.id}) disconnected`);
		} else {
			users = users.filter((user) => user.socketID !== socket.id);
			socketIO.emit("newUserResponse", users);
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
