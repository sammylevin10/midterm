import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";

function MapDisplay({ location }) {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    }
  }, [location]);

  return (
    <div className="MapDisplay">
      <h1>Good morning, Brooklyn</h1>
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
