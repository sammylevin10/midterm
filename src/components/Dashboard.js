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
  const [maskData, setMaskData] = useState(0);
  const [covidData, setCovidData] = useState(0);
  const [status, setStatus] = useState({
    mask: 0.5,
    covid: 0.5,
    fire: 0.5,
  });
  const [phrase, setPhrase] = useState("");

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
          setMaskData(probability);
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

  useEffect(() => {
    console.log(fireLikelihood, maskData, covidData);
    // Handle maskData to generate status.mask
    let maskStatus = (maskData / 100) * 2;
    // Handle covidData to generate status.covid
    const baseline = 2817; //The average number of cumulative covid cases per US county
    let covidStatus = (0.5 * covidData) / baseline;
    // Handle fireLikehood to generate status.fire
    let fireStatus = 0.5;
    if (fireLikelihood == "Unlikely") {
      fireStatus = 0;
    } else if (fireLikelihood == "Somewhat Unlikely") {
      fireStatus = 0.33;
    } else if (fireLikelihood == "Somewhat Likely") {
      fireStatus = 0.67;
    } else if (fireLikelihood == "Likely") {
      fireStatus = 1;
    } else {
      fireStatus = 0;
    }
    setStatus({
      mask: clamp(maskStatus, 0, 1),
      covid: clamp(covidStatus, 0, 1),
      fire: fireStatus,
    });
    console.log(status);
  }, [maskData, covidData, fireLikelihood]);

  // Helper function to prevent statuses from exceeding 1.0
  function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  useEffect(() => {
    console.log("status changed");
    let sumStatus = status.covid + status.mask + status.fire;
    if (0 <= sumStatus && sumStatus < 1) {
      setPhrase("Looks like you can head out today!");
    } else if (1 <= sumStatus && sumStatus < 2) {
      setPhrase("Hmmm... might be be worth staying indoors today");
    } else if (2 <= sumStatus && sumStatus <= 3) {
      setPhrase("Please, for the love of God, don't leave your home.");
    }
    console.log(phrase);
  }, [status]);

  return (
    <div className="Dashboard">
      <h1>{phrase}</h1>
      <div className="DataBlocks">
        <DataBlock
          text={"Probability of unmasked encounter"}
          data={maskData.toString() + "%"}
          color={184}
          myStatus={status.mask}
          link={
            "https://www.nytimes.com/interactive/2020/07/17/upshot/coronavirus-face-mask-map.html"
          }
        />

        <DataBlock
          text={"Cumulative COVID cases in your county"}
          data={covidData}
          myStatus={status.covid}
          color={114}
          link={
            "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html"
          }
        />
        <DataBlock
          text={"Probability of local wildfire today"}
          data={fireLikelihood}
          color={0}
          myStatus={status.fire}
          link={"https://www.getambee.com/api/fire"}
        />
      </div>
    </div>
  );
}

export default Dashboard;
