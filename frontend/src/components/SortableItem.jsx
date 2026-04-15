//https://dndkit.com/legacy/presets/sortable/use-sortable/

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "react-bootstrap/Image";
import photo from "../images/CardQueen.jpg";
import "../styles.css";
import ContestantCard from "./ContestantCard";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    touchAction: "none",
  };

  return (
    <div style={style} ref={setNodeRef} {...attributes} className="sortable-item">
      <Row className="align-items-center sortable-item">
        <Col>
          <div {...listeners} className="sortable-item">
            <Image src={photo} rounded height={100} width={100} thumbnail />
            {props.name}{" "}
          </div>
        </Col>
        <Col>
          <ContestantCard contName={props.name} />
        </Col>
      </Row>
    </div>
  );
}
