import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "react-bootstrap/Image";
import photo from "../images/CardQueen.jpg";
import "../styles.css";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#eee",
    border: "1px solid #ccc",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Image src={photo} rounded height={100} width={100} thumbnail />
      {props.name}{" "}
    </div>
  );
}
