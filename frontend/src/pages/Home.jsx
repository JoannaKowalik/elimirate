import React from "react";
import Button from "react-bootstrap/esm/Button";
import Image from "react-bootstrap/esm/Image";

function Home() {
  return (
    <div className="d-flex flex-column my-auto justify-content-center vh-100 background1">
      <h1>Welcome to ElimiRATE!</h1>
      <div className="d-flex flex-row gap-3 mt-3">
        <Button href="/create">Create a Room</Button>

        <Button href="/login">Go to Room</Button>
      </div>
    </div>
  );
}

export default Home;
