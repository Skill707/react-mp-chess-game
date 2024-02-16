const defaultFieldArray = require("./defaultFieldArray.js");

const rooms_count = 5;

const room = {
	name: "Room",
	turn: "White",
	fieldArray: defaultFieldArray,
	fieldLastUpdateTime: Date.now(),
	stageArray: [],
	messagesArray: [],
	players: [],
	mated: undefined,
	winner: undefined,
	gameTimer: 0,
	lastUpdateTime: Date.now(),
};

let roomsArray = [];

for (let index = 0; index < rooms_count; index++) {
	roomsArray.push({ ...room, name: `Room ${index+1}` });
}

module.exports = roomsArray;
