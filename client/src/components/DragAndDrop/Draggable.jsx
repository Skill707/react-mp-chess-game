import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function Draggable(props) {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: props.id,
		data: props.field,
	});
	let invert = 1;
	if (props.field.piece != null) if (props.field.piece.team == "Black") invert = -1;

	const style = transform
		? {
				transform: `translate3d(${transform.x * invert}px, ${transform.y * invert}px, 0)`,
		  }
		: undefined;

	return (
		<>
			{props.enabled ? (
				<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
					{props.children}
				</div>
			) : (
				props.children
			)}
		</>
	);
}
