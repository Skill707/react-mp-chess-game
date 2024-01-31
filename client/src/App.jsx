import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/index";
import Navbar from "./components/Navbar";
import Game from "./pages/Game/index";
import socketIO from "socket.io-client";
import ServersPage from "./pages/ServersPage";

export default function App() {
	console.log("App rendered");

	const socket = socketIO("http://localhost:4000", { autoConnect: false });
	// http://localhost:4000
	// https://chess-game-server.glitch.me

	const router = createBrowserRouter([
		{
			path: "/",
			element: (
				<div className="orientation">
					<Navbar socket={socket} />
					<Outlet />
				</div>
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
