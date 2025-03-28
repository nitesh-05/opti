import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const TestModal = () => {
  const [show, setShow] = useState(false);
  
  return (
    <>
      <Button onClick={() => setShow(true)}>Open Modal</Button>
      <Modal show={show} onHide={() => setShow(false)} style={{ zIndex: 1050 }}>
        <Modal.Header closeButton>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>Hello World!</Modal.Body>
      </Modal>
    </>
  );
};

export default TestModal;
