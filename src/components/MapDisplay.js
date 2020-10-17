import React from "react";
import { Link } from "react-router-dom";
import MapContainer from "../components/MapContainer";

function MapDisplay() {
  return (
    <div className="MapDisplay">
      <h1>Good morning, Brooklyn</h1>
      <div className="Map-Interface">
        <MapContainer />
      </div>
    </div>
  );
}

export default MapDisplay;
