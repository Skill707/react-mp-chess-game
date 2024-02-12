import css from "./index.module.scss";
import GameBoard from "../GameBoard/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { setJoinedServerData } from "../../redux/dataSlice";
import Chat from "../Chat/index";
import GameInfo from "../GameInfo/index";

export default function GamePage({ socket, setInGame }) {
	console.log("component GamePage rendered");

	return (
		<div id="GamePage">
			<Chat socket={socket} />
			<GameBoard socket={socket} />
			<GameInfo socket={socket} setInGame={setInGame} />
		</div>
	);
}
