import css from "./index.module.scss";
import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";

const validationSchema = yup.object({
	text: yup.string("Enter your text").required("Text is required"),
});

export default function Chat({ socket, loggedUser, roomData }) {
	const [typingStatus, setTypingStatus] = useState("");
	const lastMessageRef = useRef(null);
	const [messagesArray, setMessagesArray] = useState(roomData.messagesArray);

	console.log("Компонент Chat обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		socket.emit("getMainChat", { userName: loggedUser.name });

		console.log("Компонент Chat отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент Chat размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	const formik = useFormik({
		initialValues: {
			text: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values, action) => {
			action.resetForm();
			socket.emit("message", {
				id: `${socket.id}-${Date.now()}`,
				userName: loggedUser.name,
				roomName: roomData.name,
				text: values.text,
				date: Date.now(),
			});
		},
	});

	useEffect(() => {
		socket.on("messageResponse", (data) => setMessagesArray([...messagesArray, data]));
		// socket.on("getMainChatResponse", (data) => setMessagesArray([...messagesArray, data]));
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
							<div
								key={`${item.text}-${item.id}-${Math.random() * 999}`}
								className={item.userName == loggedUser.name ? css.PlayerMessage : item.userName == "Server" ? css.ServerMessage : css.OpponentMessage}
							>
								<div>
									<p>{item.text}</p>
									<p>{moment(item.date).fromNow()}</p>
								</div>
							</div>
						);
					})}
				<div className={css.IsTyping} ref={lastMessageRef}>
					<p>{typingStatus}</p>
				</div>
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
						socket.emit("typing", {
							userName: loggedUser.name,
							roomName: roomData.name,
							text: `${loggedUser.name} is typing`,
						});
					}}
					onBlur={() => {
						formik.handleBlur;
						socket.emit("typing", {
							userName: loggedUser.name,
							roomName: roomData.name,
							text: ``,
						});
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
