import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataBlock from "../components/DataBlock";

function Dashboard({ location }) {
  const [fireData, setFireData] = useState(null);
  const [fireLikelihood, setFireLikelihood] = useState(null);
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    }
  }, [location]);

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
          console.log("response", response);
          setFireData(response);
          if (response.data.message == "No active fire data found") {
            console.log("Couldn't find data!");
            setFireLikelihood("Unlikely");
          } else {
            let distance = response.data.data[0].distance;
            if (0 < distance && distance <= 30) {
              setFireLikelihood("Likely");
            } else if (30 < distance && distance <= 100) {
              setFireLikelihood("Somewhat Likely");
            } else if (100 < distance) {
              setFireLikelihood("Somewhat Unlikely");
            }
          }
          if (fireLikelihood !== null) {
            console.log("fireLikelihood", fireLikelihood);
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    }
  }, [center]);

  return (
    <div className="Dashboard">
      <h1>Hmmmm... might be best to stay inside today.</h1>
      <div className="DataBlocks">
        <DataBlock text={"Probability of unmasked encounter"} data={1} />
        <DataBlock text={"Probability of COVID encounter"} data={2} />
        {fireLikelihood !== null && (
          <DataBlock
            text={"Probability of local wildfire today"}
            data={fireLikelihood}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
