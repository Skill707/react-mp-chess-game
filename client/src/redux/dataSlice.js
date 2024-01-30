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
		fieldArray: null,
		stageArray: [],
		selectedBox: null,
	},
	reducers: {
		editFieldArray: (state, action) => {
			state.fieldArray = action.payload;
		},
		addToStageArray: (state, action) => {
			state.stageArray = [...state.stageArray, action.payload];
		},
		select: (state, action) => {
			state.selectedBox = action.payload;
		},
		setLoggedUser: (state, action) => {
			state.loggedUser = action.payload;
		},
	},
});

export const { select, editFieldArray, addToStageArray, setLoggedUser } = dataSlice.actions;

export default dataSlice.reducer;
