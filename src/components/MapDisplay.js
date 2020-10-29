import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import Geocode from "react-geocode";

function MapDisplay({ location }) {
  const [center, setCenter] = useState(null);
  const [neighborhood, setNeighborhood] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);

  // When location changes...
  useEffect(() => {
    // Set the center state variable
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    }
    // Determine the neighborhood using React Geocode and set its corresponding state variable
    // The neighborhood is referenced in the MapDisplay phrase
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
    // Determine the time of day and set the beginning of the MapDisplay phrase
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
      {/* MapDisplay phrase */}
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
              // Custom styling for the map, set to the color scheme of the website
              options={{
                styles: require(`../components/MapStyle.json`),
              }}
            ></GoogleMapReact>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapDisplay;
