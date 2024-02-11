import { Button, Fade, Modal, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import css from "./index.module.scss";
import { useDispatch } from "react-redux";
import { setLoggedUser, setUserAccepted } from "../../redux/dataSlice";
import Swal from "sweetalert2";

const validationSchema = yup.object({
	username: yup.string("Enter your username").required("Username is required"),
});

export default function LoginFormModal({ socket, openLoginFormModal, setOpenLoginFormModal }) {
	console.log("component LoginFormModal rendering...");
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			username: "",
		},
		validationSchema: validationSchema,
		onSubmit: (values, action) => {
			action.resetForm();
			socket.emit("newUser", { username: values.username });
			socket.on("newUserResponse", (data) => {
				console.log("HomePage: newUserResponse: ", data);
				if (data.accepted == true) {
					localStorage.setItem("ChessGameUserName", JSON.stringify(data.username));
					dispatch(setLoggedUser(data.username));
					dispatch(setUserAccepted(true));
					setOpenLoginFormModal(false);
				} else {
					Swal.fire("User already connected!");
				}
			});
		},
	});

	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={openLoginFormModal}
			closeAfterTransition
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
			className={css.Modal}
		>
			<Fade in={openLoginFormModal}>
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
			</Fade>
		</Modal>
	);
}
