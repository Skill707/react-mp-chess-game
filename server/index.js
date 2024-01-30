const express = require("express");
const app = express();
const cors = require("cors");
const { log } = require("console");
const http = require("http").Server(app);
const PORT = 4000;
const socketIO = require("socket.io")(http, {
	cors: {
		origin: "https://chattest-client.vercel.app",
		// https://chattest-client.vercel.app
		// http://localhost:5173
	},
});

app.use(cors());
let users = [];

socketIO.on("connection", (socket) => {
	console.log(`⚡: id ${socket.id} just connected!`);

	// socket.on("message", (data) => {
	// 	socketIO.emit("messageResponse", data);
	// });
	// socket.on("typing", (data) => socket.broadcast.emit("typingResponse", data));

	socket.on("checkNewUsername", (data) => {
		console.log("checkNewUsername!");
		const check = users.find((user) => user.username == data.username);
		if (check == undefined) {
			console.log(`username ${data.username} accepted`);
			socketIO.emit("checkNewUsernameResponse", { username: data.username, accepted: true });
		} else {
			console.log(`username ${data.username} rejected`);
			socketIO.emit("checkNewUsernameResponse", { username: data.username, accepted: false });
		}
	});

	socket.on("newUser", (data) => {
		console.log("newUser!");
		const check = users.find((user) => user.socketID == socket.id);
		if (check == undefined) {
			users.push({ ...data, socketID: socket.id });
			console.log(`⚡: ${data.username}(${socket.id}) added to users list`);
			socketIO.emit("newUserResponse", users);
			console.log("newUser - users list: ", users);
		}
	});

	socket.on("disconnect", () => {
		let user = users.find((user) => user.socketID == socket.id);
		if (user == undefined) {
			console.log(`🔥: socket ${socket.id}) disconnected`);
		} else {
			console.log(`🔥: user ${user.username} (${socket.id}) disconnected`);
			users = users.filter((user) => user.socketID !== socket.id);
			socketIO.emit("newUserResponse", users);
			console.log("disconnect - users list: ", users);
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
