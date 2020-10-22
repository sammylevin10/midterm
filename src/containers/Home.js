import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MapDisplay from "../components/MapDisplay";
import Dashboard from "../components/Dashboard";
import Geolocation from "../components/Geolocation";
import { geolocated } from "react-geolocated";

function Home(props) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (props) {
      setLocation(props.coords);
    }
  }, [props]);

  return (
    <div>
      <Header />
      <div className="Home">
        <MapDisplay location={location} />
        <Dashboard />
        <Geolocation />
      </div>
    </div>
  );
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Home);
