import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import DataBlock from "../components/DataBlock";
import Geocode from "react-geocode";

function MapDisplay({ location }) {
  const [center, setCenter] = useState(null);
  const [neighborhood, setNeighborhood] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    }
    if (location) {
      Geocode.setApiKey(process.env.REACT_APP_MAPS_KEY);
      Geocode.fromLatLng(location.latitude, location.longitude).then(
        (response) => {
          setNeighborhood(response.results[0].address_components[3].long_name);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    var today = new Date();
    var hour = today.getHours();
    if (hour < 12) {
      setTimeOfDay("Good morning, ");
    } else if (hour < 18) {
      setTimeOfDay("Good afternoon, ");
    } else {
      setTimeOfDay("Good evening, ");
    }
  }, [location]);

  return (
    <div className="MapDisplay">
      <h1>
        {timeOfDay}
        {neighborhood}
      </h1>
      <div className="Map-Container">
        <div className="Map" style={{ height: "100%", width: "100%" }}>
          {center !== null && (
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_KEY }}
              defaultCenter={center}
              defaultZoom={13}
            >
              <p>My Marker</p>
            </GoogleMapReact>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapDisplay;
