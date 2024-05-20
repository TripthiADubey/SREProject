import React from "react";
import { BrowserRouter as Router,Route, Routes } from "react-router-dom";
import "./App.css";
import Minions from "./pages/Minions";
import NavBar from "./components/Navbar";
import MinionDetail from "./components/MinionDetail";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <>
      <NavBar />
      <div className="app__mainContainer">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/minions" element={<Minions />} />
          <Route path="/minion/:node/:minionName" element={<MinionDetail />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
