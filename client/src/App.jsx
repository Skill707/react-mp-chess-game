import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/index";
import Navbar from "./components/Navbar";
import Game from "./pages/Game/index";

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<>
				<Navbar />
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
				element: <Game />,
			},
		],
	},
	{
		path: "*",
		element: <h1>Not found</h1>,
	},
]);

export default function App() {
	console.log("App rendered");
	return <RouterProvider router={router} />;
}
