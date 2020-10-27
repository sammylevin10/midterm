import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataBlock from "../components/DataBlock";
import GoogleMapReact from "google-map-react";

function Dashboard({ location }) {
  const [fireData, setFireData] = useState(null);
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    }
  }, [location]);

  // This occurs when the page loads
  useEffect(() => {
    if (center != null) {
      axios
        .get(
          `https://api.ambeedata.com/latest/fire?lat=${center.lat}&lng=${center.lng}`,
          {
            headers: { "x-api-key": process.env.REACT_APP_MAPS_KEY },
          }
        )
        .then(function (response) {
          // handle success
          console.log("response", response);
          // console.log("LOCATION", center);
          // setFireData(response);
          // console.log("response", response);
        })
        .catch(function (error) {
          // handle error
          console.log("error", error);
        });
    }
  }, [center]);

  return (
    <div className="Dashboard">
      <h1>Hmmmm... might be best to stay inside today.</h1>
      <div className="DataBlocks">
        <DataBlock text={"Probability of unmasked encounter"} percentage={1} />
        <DataBlock text={"Probability of COVID encounter"} percentage={2} />
        <DataBlock
          text={"Probability of local wildfire today"}
          percentage={3}
        />
      </div>
    </div>
  );
}

export default Dashboard;
