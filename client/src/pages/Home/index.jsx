import { Button, Container, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import css from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../redux/dataSlice";

const validationSchema = yup.object({
	username: yup.string("Enter your username").required("Username is required"),
});

export default function Home({ socket }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);

	const formik = useFormik({
		initialValues: {
			username: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values, action) => {
			action.resetForm();
			socket.connect();
			socket.emit("checkNewUsername", { username: values.username });
		},
	});

	useEffect(() => {

		if (loggedUser != null) {
			navigate("/servers")
		}

		socket.on("checkNewUsernameResponse", (data) => {
			console.log("🚀 ~ checkNewUsernameResponse: ", data);
			if (data.accepted == true) {
				localStorage.setItem("ChessGameUserName", JSON.stringify(data.username));
				dispatch(setLoggedUser(data.username));
				socket.emit("newUser", { username: data.username });
				navigate("/servers");
			} else {
				Swal.fire("Username already used!");
			}
		});
	}, [socket]);

	return (
		<section>
			<Container className={css.LoginSection}>
				<form onSubmit={formik.handleSubmit} className={css.Form}>
					<p>Please enter username to play</p>
					<TextField
						fullWidth
						id="username"
						name="username"
						label="Username"
						value={formik.values.username}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={formik.touched.username && Boolean(formik.errors.username)}
						helperText={formik.touched.username && formik.errors.username}
					/>
					<Button color="primary" variant="contained" fullWidth type="submit">
						Continue
					</Button>
				</form>
			</Container>
		</section>
	);
}
