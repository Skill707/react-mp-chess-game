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
		fieldArray: [
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
		],
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
