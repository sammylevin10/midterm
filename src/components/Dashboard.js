import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataBlock from "../components/DataBlock";
import Geocode from "react-geocode";
import CovidJSON from "./data/CovidJSON";
import MaskJSON from "./data/MaskJSON";

function Dashboard({ location }) {
  const [fireData, setFireData] = useState(null);
  const [fireLikelihood, setFireLikelihood] = useState("Loading...");
  const [center, setCenter] = useState(null);
  const [zip, setZip] = useState(null);
  const [maskData, setMaskData] = useState("Loading...");
  const [covidData, setCovidData] = useState("Loading...");

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
      var len1 = Object.keys(MaskJSON).length;
      for (var i = 0; i < len1; i++) {
        if (MaskJSON[i].ZIP == zip) {
          let probability = (1 - MaskJSON[i].ALWAYS) * 100;
          let percentage = probability.toString() + "%";
          setMaskData(percentage);
        }
      }
      var len2 = Object.keys(CovidJSON).length;
      for (var i = 0; i < len2; i++) {
        if (CovidJSON[i].ZIP == zip) {
          setCovidData(CovidJSON[i].CASES);
        }
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
        {covidData !== null && (
          <DataBlock text={"COVID cases in your county"} data={covidData} />
        )}
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
