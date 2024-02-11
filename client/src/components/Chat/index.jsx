import css from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import moment from "moment";

const validationSchema = yup.object({
	text: yup.string("Enter your text").required("Text is required"),
});

export default function Chat({ socket }) {
	const [typingStatus, setTypingStatus] = useState("");
	const lastMessageRef = useRef(null);
	const loggedUser = useSelector((state) => state.data.loggedUser);
	const playerTeam = useSelector((state) => state.data.playerTeam);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);
	const [messagesArray, setMessagesArray] = useState(joinedServerData.messagesArray);
	let enemyTeam;
	if (playerTeam == "Black") {
		enemyTeam = "White";
	} else {
		enemyTeam = "Black";
	}

	let enemy = joinedServerData.players.find((u) => u.team == enemyTeam);

	const formik = useFormik({
		initialValues: {
			text: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values, action) => {
			action.resetForm();
			socket.emit("message", {
				username: loggedUser,
				text: values.text,
				id: `${socket.id}-${Date.now()}`,
				date: Date.now(),
				serverName: joinedServerData.name,
			});
		},
	});

	useEffect(() => {
		socket.on("messageResponse", (data) => setMessagesArray([...messagesArray, data]));
	}, [socket, messagesArray]);

	useEffect(() => {
		socket.on("typingResponse", (data) => setTypingStatus(data.text));
	}, [socket]);

	useEffect(() => {
		// 👇️ scroll to bottom every time messages change
		lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesArray]);

	return (
		<div className={css.Chat} id="GameChat">
			<div className={css.Messages}>
				{messagesArray &&
					messagesArray.map((item) => {
						return (
							<div key={item.id} className={item.username == loggedUser ? css.PlayerMessage : item.username == enemy?.username ? css.OpponentMessage : css.ServerMessage}>
								<div>
									<p>{item.text}</p>
									<p>{moment(item.date).fromNow()}</p>
								</div>
							</div>
						);
					})}
				<div className={css.IsTyping}>
					<p>{typingStatus}</p>
				</div>
				<div ref={lastMessageRef} />
			</div>
			<form onSubmit={formik.handleSubmit} className={css.Form}>
				<TextField
					fullWidth
					id="text"
					name="text"
					label="Text"
					value={formik.values.text}
					onChange={formik.handleChange}
					onKeyDown={() => {
						if (enemy != undefined) {
							console.log(enemy);
							socket.emit("typing", {
								username: loggedUser,
								text: `${loggedUser} is typing`,
								serverName: joinedServerData.name,
							});
						}
					}}
					onBlur={() => {
						formik.handleBlur;
						if (enemy != undefined) {
							socket.emit("typing", {
								username: loggedUser,
								text: ``,
								serverName: joinedServerData.name,
							});
						}
					}}
					error={formik.touched.text && Boolean(formik.errors.text)}
					helperText={formik.touched.text && formik.errors.text}
				/>
				<Button color="primary" variant="outlined" type="submit">
					Send
				</Button>
			</form>
		</div>
	);
}
