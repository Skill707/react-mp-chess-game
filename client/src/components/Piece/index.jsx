import css from "./index.module.scss";
import { FaChessBishop } from "react-icons/fa";
import { FaChessKing } from "react-icons/fa";
import { FaChessKnight } from "react-icons/fa";
import { FaChessPawn } from "react-icons/fa";
import { FaChessQueen } from "react-icons/fa";
import { FaChessRook } from "react-icons/fa";

export default function Piece({ piece }) {
	return (
		<div className={css.Item} style={piece?.team == "Black" ? { color: "black" } : { color: "white" }}>
			{piece.type == "Bishop" ? (
				<FaChessBishop />
			) : piece.type == "King" ? (
				<FaChessKing />
			) : piece.type == "Knight" ? (
				<FaChessKnight />
			) : piece.type == "Pawn" ? (
				<FaChessPawn />
			) : piece.type == "Queen" ? (
				<FaChessQueen />
			) : piece.type == "Rook" ? (
				<FaChessRook />
			) : null}
		</div>
	);
}