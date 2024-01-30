import { Button, Container } from "@mui/material";
import css from "./index.module.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ServersPage({ socket }) {
	const [users, setUsers] = useState(null);

	useEffect(() => {
		socket.on("newUserResponse", (data) => {
			setUsers(data);
			console.log("🚀 ~ socket.on ~ data:", data);
		});
	}, [socket]);

	return (
		<section>
			<Container style={{ padding: "40px 20px" }}>
				<TableContainer component={Paper} sx={{ minWidth: 250, maxWidth: 500, margin: "0 auto" }}>
					<Table aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>N#</TableCell>
								<TableCell align="right">Name</TableCell>
								<TableCell align="right">Action</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users &&
								users.map((row) => (
									<TableRow key={row.socketID} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell component="th" scope="row">
											{row.socketID}
										</TableCell>
										<TableCell component="th" scope="row">
											{row.username}
										</TableCell>
										<TableCell component="th" scope="row">
											{row.username}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
		</section>
	);
}
