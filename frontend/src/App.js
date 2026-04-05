import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Create from "./pages/Create";
import Predictions from "./pages/Predictions";
import Room from "./pages/Room";
import Login from "./pages/Login";
import PageNavbar from "./components/Navbar";
import Container from "react-bootstrap/esm/Container";

function App() {
  return (
    <Router>
      <PageNavbar></PageNavbar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/room/:roomCode/players/:playerId" element={<Room />} />
          <Route path="/room/:roomCode/predictions" element={<Predictions />} />

          <Route path="/login" element={<Login />} />
          {/* <Route path="/test" element={<UseSortable />} /> */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
