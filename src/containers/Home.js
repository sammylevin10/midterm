import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import MapDisplay from "../components/MapDisplay";
import Dashboard from "../components/Dashboard";

function Home() {
  return (
    <div>
      <Header />
      <div className="Home">
        <MapDisplay />
        <Dashboard />
      </div>
    </div>
  );
}

export default Home;
