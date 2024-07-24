import React from "react";
import { useDrag } from "react-dnd";
import Draggable from "react-draggable";

function Picture({ id, url }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { id: id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <img
      ref={drag}
      src={url}
      key={id}
      style={{
        border: isDragging ? "5px solid pink" : "0px",
        transition: "width 0.2s ease-out", // Optional: smooth transition
      }}
      className="rounded-lg"
    />
  );
}

export default Picture;
