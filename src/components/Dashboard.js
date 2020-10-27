import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataBlock from "../components/DataBlock";
import Geocode from "react-geocode";
import { readString } from "react-papaparse";
import MaskData from "../components/DataBlock";

function Dashboard({ location }) {
  const [fireData, setFireData] = useState(null);
  const [fireLikelihood, setFireLikelihood] = useState("Loading...");
  const [center, setCenter] = useState(null);
  const [zip, setZip] = useState(null);
  const [maskData, setMaskData] = useState("Loading...");

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
      Geocode.setApiKey(process.env.REACT_APP_MAPS_KEY);
      Geocode.fromLatLng(location.latitude, location.longitude).then(
        (response) => {
          setZip(response.results[0].address_components[7].long_name);
        },
        (error) => {
          console.error(error);
        }
      );
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
          setFireData(response);
          if (response.data.message == "No active fire data found") {
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
        })
        .catch(function (error) {
          console.log("error", error);
        });
    }
  }, [center]);

  useEffect(() => {
    if (zip != null) {
      const test_csv = `ZIP,NEVER,RARELY,SOMETIMES,FREQUENTLY,ALWAYS
      11201,0.035,0.034,0.058,0.141,0.732
      36051,0.053,0.074,0.134,0.295,0.444
      36578,0.083,0.059,0.098,0.323,0.436`;
      const read_csv = readString(test_csv);
      for (var i = 1; i < read_csv.data.length; i++) {
        if (read_csv.data[i][0].includes(zip)) {
          let probability = 100 * (1 - read_csv.data[i][5]);
          let percentage = probability.toString() + "%";
          setMaskData(percentage);
        }
        // console.log(read_csv.data[i][0]);
      }
    }
  }, [zip]);

  return (
    <div className="Dashboard">
      <h1>Hmmmm... might be best to stay inside today.</h1>
      <div className="DataBlocks">
        {maskData !== null && (
          <DataBlock
            text={"Probability of unmasked encounter"}
            data={maskData}
          />
        )}
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
