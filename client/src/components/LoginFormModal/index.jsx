import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import css from "./index.module.scss";
import { useEffect } from "react";
import moment from "moment";
const validationSchema = yup.object({
	username: yup.string("Enter your username").min(3, "Min. 3 letters").max(10, "Max. 10 letters").required("Username is required"),
});

export default function LoginFormModal({ loggedUser, setLoggedUser }) {
	console.log("Компонент LoginFormModal обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент LoginFormModal отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент LoginFormModal размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	const formik = useFormik({
		initialValues: {
			username: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values, action) => {
			action.resetForm();
			setLoggedUser({ ...loggedUser, name: values.username, accepted: false });
		},
	});

	return (
		<div className={css.Modal}>
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
		</div>
	);
}
