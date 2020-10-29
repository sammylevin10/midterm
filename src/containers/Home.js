import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import MapDisplay from "../components/MapDisplay";
import Dashboard from "../components/Dashboard";
import { geolocated } from "react-geolocated";
import Footer from "../components/Footer";

function Home(props) {
  const [location, setLocation] = useState(null);

  // When the props passed from geolocated package change,
  // Set the state of location to the coords object of props
  useEffect(() => {
    if (props) {
      setLocation(props.coords);
    }
  }, [props]);

  return (
    <div>
      <Header />
      <div className="Home">
        {/* Coordinates are passed to the MapDisplay and Dashboard components */}
        <MapDisplay location={location} />
        <Dashboard location={location} />
      </div>
      <Footer />
    </div>
  );
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(Home);
