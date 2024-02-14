import GameBoard from "../GameBoard/index";
import Chat from "../Chat/index";
import GameInfo from "../GameInfo/index";

export default function GamePage({ socket, setInGame }) {
	console.log("COMPONENT GAMEPAGE rendering...");

	return (
		<div id="GamePage">
			<Chat socket={socket} />
			<GameBoard socket={socket} />
			<GameInfo socket={socket} setInGame={setInGame} />
		</div>
	);
}
