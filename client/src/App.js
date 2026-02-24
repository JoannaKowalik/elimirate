import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Create from "./components/Create";
import Predictions from "./components/Predictions";
import Room from "./components/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/room" element={<Room />} />
        <Route path="/predictions" element={<Predictions />} />
      </Routes>
    </Router>
  );
}

export default App;
