import React from "react";
import { useDrag } from "react-dnd";

function DraggablePicture({ id, url }) {
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
      width="300px"
      style={{
        border: isDragging ? "5px solid #FF5F00" : "0px",
        transition: "border-color 0.2s ease-out", // Optional: smooth transition for border color change
        cursor: isDragging ? "grabbing" : "grab", // Cursor style when dragging
      }}
      className="rounded-lg"
      alt="No image found"
    />
  );
}

export default DraggablePicture;
