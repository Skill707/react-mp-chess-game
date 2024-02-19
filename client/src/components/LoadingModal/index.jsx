import { useEffect } from "react";
import css from "./index.module.scss";
import moment from "moment";
import { LinearProgress } from "@mui/material";

export default function LoadingModal({ openLoadingModal, loggedUser, connected }) {
	console.log("Компонент LoadingModal обновлён, ", moment().format("h:mm:ss:ms"));
	useEffect(() => {
		console.log("Компонент LoadingModal отрендерен, ", moment().format("h:mm:ss:ms"));
		return () => {
			console.log("Компонент LoadingModal размонтирован, ", moment().format("h:mm:ss:ms"));
		};
	}, []);

	return (
		<>
			{openLoadingModal ? (
				<div className={css.Modal}>
					<div>
						<LinearProgress />
					</div>
					<div>
						<h4>loggedUser: {JSON.stringify(loggedUser)}</h4>
						<h4>socketConnected: {JSON.stringify(connected)}</h4>
					</div>
				</div>
			) : null}
		</>
	);
}
