import { Button, Container } from "@mui/material";
import css from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../redux/dataSlice";
import { IoIosLogOut } from "react-icons/io";

export default function Navbar({ socket }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loggedUser = useSelector((state) => state.data.loggedUser);

	return (
		<header>
			<Container className={css.Navbar}>
				<div>
					<h2>Chess online</h2>
				</div>
				{loggedUser != null && (
					<div>
						<Button
							color="primary"
							variant="contained"
							onClick={() => {
								socket.disconnect();
								localStorage.clear("ChessGameUserName");
								dispatch(setLoggedUser(null));
								navigate("/");
							}}
						>
							<span>{loggedUser}</span> <IoIosLogOut />
						</Button>
					</div>
				)}
			</Container>
		</header>
	);
}
