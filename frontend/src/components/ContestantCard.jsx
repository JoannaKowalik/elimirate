import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import photo from "../images/CardQueen.jpg";
function ContestantCard({ contName }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Details
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{contName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={photo} rounded height={200} width={500} thumbnail />
          {""}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis
            sem ut leo pulvinar efficitur. Vestibulum eu euismod erat. Aenean
            egestas faucibus maximus. Nam tempor, diam sollicitudin tristique
            aliquam, dui turpis aliquam felis, sed lobortis velit nulla sit amet
            enim. Sed dapibus a odio sed porta. 
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ContestantCard;
