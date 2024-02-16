import React from "react";
import { useDroppable } from "@dnd-kit/core";
import css from "./index.module.scss";
export default function Droppable(props) {
	const { isOver, setNodeRef } = useDroppable({
		id: props.id,
		data: props.field,
	});
	const style = {
		color: isOver ? "green" : undefined,
	};

	return (
		<>
			{props.enabled ? (
				<div ref={setNodeRef} style={style} className={css.Droppable}>
					{props.children}
				</div>
			) : (
				<div className={css.Droppable}>{props.children}</div>
			)}
		</>
	);
}
