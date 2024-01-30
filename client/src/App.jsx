import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/index";
import Navbar from "./components/Navbar";
import Game from "./pages/Game/index";
import socketIO from "socket.io-client";
import { useSelector } from "react-redux";

export default function App() {
	console.log("App rendered");

	const loggedUser = useSelector((state) => state.data.loggedUser);

	if (loggedUser != null) {
		var socket = socketIO.connect("https://chess-game-server.glitch.me");
		// http://localhost:4000
		// https://chess-game-server.glitch.me
	}

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<>
					<Navbar socket={socket} />
					<Outlet />
				</>
			),
			children: [
				{
					index: true,
					element: <Home />,
				},
				{
					path: "game",
					element: <Game socket={socket} />,
				},
			],
		},
		{
			path: "*",
			element: <h1>Not found</h1>,
		},
	]);

	return <RouterProvider router={router} />;
}
