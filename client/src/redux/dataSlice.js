import { createSlice } from "@reduxjs/toolkit";

function GetUserFromLS() {
	let result = null;

	const LSloggedUser = JSON.parse(localStorage.getItem("ChessGameUserName"));
	const SSloggedUser = JSON.parse(sessionStorage.getItem("ChessGameUserName"));
	if (SSloggedUser) result = SSloggedUser;
	else if (LSloggedUser) result = LSloggedUser;

	return result;
}

export const dataSlice = createSlice({
	name: "data",
	initialState: {
		loggedUser: GetUserFromLS(),
		selectedBox: null,
		playerTeam: "null",
		joinedServerData: null,
	},
	reducers: {
		setLoggedUser: (state, action) => {
			state.loggedUser = action.payload;
		},
		setPlayerTeam: (state, action) => {
			state.playerTeam = action.payload;
		},
		select: (state, action) => {
			state.selectedBox = action.payload;
		},
		setJoinedServerData: (state, action) => {
			state.joinedServerData = action.payload;
		},
		editFieldArray: (state, action) => {
			state.joinedServerData = { ...state.joinedServerData, fieldArray: action.payload };
		},
		addToStageArray: (state, action) => {
			let { stageArray } = state.joinedServerData;
			state.joinedServerData = { ...state.joinedServerData, stageArray: [...stageArray, action.payload] };
		},
		setCurrentTurn: (state, action) => {
			state.joinedServerData = { ...state.joinedServerData, turn: action.payload };
		},
	},
});

export const { select, editFieldArray, addToStageArray, setLoggedUser, setCurrentTurn, setJoinedServerData, setPlayerTeam } = dataSlice.actions;

export default dataSlice.reducer;
