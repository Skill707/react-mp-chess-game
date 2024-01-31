import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/index";
import Navbar from "./components/Navbar";
import Game from "./pages/Game/index";
import socketIO from "socket.io-client";
import { useSelector } from "react-redux";
import ServersPage from "./pages/ServersPage";

export default function App() {
	console.log("App rendered");

	const socket = socketIO("https://chess-game-server.glitch.me", { autoConnect: false });
	// http://localhost:4000
	// https://chess-game-server.glitch.me

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
					element: <Home socket={socket} />,
				},
				{
					path: "servers",
					element: <ServersPage socket={socket} />,
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
