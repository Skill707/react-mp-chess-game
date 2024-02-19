import css from "./index.module.scss";
import { useEffect, useState } from "react";
import moment from "moment";

export default function UsersList({ socket, loggedUser }) {
	const [usersArray, setUsersArray] = useState([]);

	console.log("Компонент UsersList обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент UsersList отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент UsersList размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	useEffect(() => {
		socket.emit("getUsers", { userName: loggedUser.name });
	}, [loggedUser.accepted]);

	useEffect(() => {
		socket.on("getUsersResponse", (data) => setUsersArray(data));
	}, [socket, loggedUser.accepted]);

	return (
		<div className={css.UsersList} id="UsersList">
			{usersArray &&
				usersArray.map((user) => {
					return (
						<div key={`${user.name}-${user.id}`} className={css.PlayerMessage}>
							<div>
								<p>{user.name}</p>
								<p>room: {user.room}</p>
							</div>
						</div>
					);
				})}
		</div>
	);
}
