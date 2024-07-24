import React from "react";
import { useDrag } from "react-dnd";
import Draggable from "react-draggable";

function Drib({ id, url }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <Draggable>
      <img ref={drag} src={url} key={id} className="rounded-lg" />
    </Draggable>
  );
}

export default Drib;
