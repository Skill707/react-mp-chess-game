import { useSelector } from "react-redux";
import css from "./index.module.scss";
import LinearProgress from "@mui/material/LinearProgress";

export default function LoadingModal({ openLoadingModal, socketConnected, loggedUser }) {
	console.log("component LoadingModal rendering...");
	const userAccepted = useSelector((state) => state.data.userAccepted);
	const joinedServerData = useSelector((state) => state.data.joinedServerData);

	return (
		<>
			{openLoadingModal ? (
				<div className={css.Modal}>
					<div>
						<LinearProgress />
					</div>
					<div>
						<h4>loggedUser: {JSON.stringify(loggedUser)}</h4>
						<h4>socketConnected: {JSON.stringify(socketConnected)}</h4>
						<h4>userAccepted: {JSON.stringify(userAccepted)}</h4>
						<h4>joinedServerData.name: {joinedServerData?.name}</h4>
					</div>
				</div>
			) : null}
		</>
	);
}