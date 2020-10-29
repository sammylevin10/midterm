import React, { useState, useEffect } from "react";
import axios from "axios";
import DataBlock from "../components/DataBlock";
import Geocode from "react-geocode";
import CovidJSON from "./data/CovidJSON";
import MaskJSON from "./data/MaskJSON";

function Dashboard({ location }) {
  // Location-based state variables
  const [center, setCenter] = useState(null);
  const [zip, setZip] = useState(null);

  // Data state variables
  const [maskData, setMaskData] = useState(0);
  const [covidData, setCovidData] = useState(0);
  const [fireData, setFireData] = useState("Loading...");

  // Status state variables
  // Status is an object of key value pairs
  // Each key represents a DataBlock
  // Each value ranges from 0-1 where 0=safe and 1=danger
  // The status state variable is referenced for DataBlock backgroundColor and the Dashboard phrase
  const [status, setStatus] = useState({
    mask: 0.5,
    covid: 0.5,
    fire: 0.5,
  });
  const [phrase, setPhrase] = useState("");

  // When the location prop changes...
  useEffect(() => {
    if (location) {
      // Set the center state variable
      setCenter({ lat: location.latitude, lng: location.longitude });
      // Using React Geocode, set the ZIP code state variable
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

  // When the center prop changes...
  useEffect(() => {
    if (center != null) {
      axios
        // Request data from the Ambee Fire API
        .get(
          `https://api.ambeedata.com/latest/fire?lat=${center.lat}&lng=${center.lng}`,
          {
            headers: { "x-api-key": process.env.REACT_APP_MAPS_KEY },
          }
        )
        // Set the fireData state variable to a likelihood phrase dependent on distance to closest fire
        .then(function (response) {
          if (response.data.message == "No active fire data found") {
            setFireData("Unlikely");
          } else {
            let distance = response.data.data[0].distance;
            if (0 < distance && distance <= 30) {
              setFireData("Likely");
            } else if (30 < distance && distance <= 100) {
              setFireData("Somewhat Likely");
            } else if (100 < distance) {
              setFireData("Somewhat Unlikely");
            }
          }
        })
        .catch(function (error) {
          console.log("error", error);
        });
    }
  }, [center]);

  // When the ZIP code changes...
  useEffect(() => {
    if (zip != null) {
      // Parse each JSON in the data folder to find the ZIP code and corresponding data
      let len1 = Object.keys(MaskJSON).length;
      for (let i = 0; i < len1; i++) {
        if (MaskJSON[i].ZIP == zip) {
          let probability = (1 - MaskJSON[i].ALWAYS) * 100;
          setMaskData(probability);
        }
      }
      let len2 = Object.keys(CovidJSON).length;
      for (let i = 0; i < len2; i++) {
        if (CovidJSON[i].ZIP == zip) {
          setCovidData(CovidJSON[i].CASES);
        }
      }
    }
  }, [zip]);

  useEffect(() => {
    // Handle maskData to generate status.mask
    let maskStatus = (maskData / 100) * 2;
    // Handle covidData to generate status.covid
    const baseline = 2817; //The average number of cumulative covid cases per US county
    let covidStatus = (0.5 * covidData) / baseline;
    // Handle fireLikehood to generate status.fire
    let fireStatus = 0.5;
    if (fireData == "Unlikely") {
      fireStatus = 0;
    } else if (fireData == "Somewhat Unlikely") {
      fireStatus = 0.33;
    } else if (fireData == "Somewhat Likely") {
      fireStatus = 0.67;
    } else if (fireData == "Likely") {
      fireStatus = 1;
    } else {
      fireStatus = 0;
    }
    setStatus({
      mask: clamp(maskStatus, 0, 1),
      covid: clamp(covidStatus, 0, 1),
      fire: fireStatus,
    });
  }, [maskData, covidData, fireData]);

  // Helper function to bound status values by the domain 0-->1
  function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  // When the status changes...
  useEffect(() => {
    // Sum the statuses, and set a Dashboard phrase accordingly
    let sumStatus = status.covid + status.mask + status.fire;
    if (0 <= sumStatus && sumStatus < 1) {
      setPhrase("Looks like you can head out today!");
    } else if (1 <= sumStatus && sumStatus < 2) {
      setPhrase("Hmmm... might be be worth staying indoors today.");
    } else if (2 <= sumStatus && sumStatus <= 3) {
      setPhrase("Please, for the love of God, don't leave your home.");
    }
  }, [status]);

  return (
    <div className="Dashboard">
      <h1>{phrase}</h1>
      <div className="DataBlocks">
        {/* Mask DataBlock */}
        <DataBlock
          text={"Probability of unmasked encounter"}
          data={maskData.toString() + "%"}
          myStatus={status.mask}
          link={
            "https://www.nytimes.com/interactive/2020/07/17/upshot/coronavirus-face-mask-map.html"
          }
        />
        {/* COVID DataBlock */}
        <DataBlock
          text={"Cumulative COVID cases in your county"}
          data={covidData}
          myStatus={status.covid}
          link={
            "https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html"
          }
        />
        {/* Fire DataBlock */}
        <DataBlock
          text={"Probability of local wildfire today"}
          data={fireData}
          myStatus={status.fire}
          link={"https://www.getambee.com/api/fire"}
        />
      </div>
    </div>
  );
}

export default Dashboard;
