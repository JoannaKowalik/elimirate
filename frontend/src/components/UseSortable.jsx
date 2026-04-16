//code from:https://dndkit.com/legacy/presets/sortable/overview/
//try again: https://dndkit.com/concepts/sortable/
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableItem } from "./SortableItem";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function UseSortable(props) {
  const [items, setItems] = useState(props.items);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <Row key={item.id}>
            <Col>
              <h3>{index + 1}</h3>
              <SortableItem key={item.id} id={item.id} name={item.name} />
            </Col>
          </Row>
        ))}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex); //arrayMove comes ftom dnd-kit

        if (props.onDrag) {
          props.onDrag(newItems);
        }

        return newItems;
      });
    }
  }
}

export default UseSortable;
/*import React, { useState } from "react";
import { SortableItem } from "./SortableItem";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//import { useSortable } from "@dnd-kit/react/sortable";

function UseSortable({items: initialItems, id, index, onDrag}) {
  //const { ref } = useSortable({ id, index });
  const [items, setItems] = useState(initialItems);

  return (
    <div >
      {items.map((item, index) => (
        <Row key={item.id}>
          <Col>
            <h3>{index + 1}</h3>
            <SortableItem key={item.id} id={item.id} name={item.name} />
          </Col>
        </Row>
      ))}
    </div>
  );
}


export default UseSortable;*/