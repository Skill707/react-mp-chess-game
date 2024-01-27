import { Container } from "@mui/material";
import GameBoard from "./components/GameBoard";
import StageBoard from "./components/StageBoard";

export default function App() {
	return (
		<Container>
			<GameBoard />
			<hr style={{ margin: "20px" }} />
			<StageBoard />
		</Container>
	);
}
