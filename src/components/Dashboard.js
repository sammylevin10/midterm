import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataBlock from "../components/DataBlock";
import Geocode from "react-geocode";
import { readString } from "react-papaparse";
import Papa from "papaparse";
import fs from "fs";
import CovidJSON from "./data/CovidJSON";

function Dashboard({ location }) {
  const [fireData, setFireData] = useState(null);
  const [fireLikelihood, setFireLikelihood] = useState("Loading...");
  const [center, setCenter] = useState(null);
  const [zip, setZip] = useState(null);
  const [maskDataRaw, setMaskDataRaw] = useState(null);
  const [maskData, setMaskData] = useState("Loading...");
  const [covidData, setCovidData] = useState("Loading...");

  // This is a failed attempt to get the csv files
  useEffect(() => {
    async function getData() {
      const response = await fetch("../data/maskdata.csv");
      console.log("RESPONSE", response);
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
      const rows = results.data;
      setMaskDataRaw(rows);
    }
    getData();
    console.log("RAW DATA", maskDataRaw);
  }, []);

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
      console.log("COVID JSON", CovidJSON[0].ZIP);
      const test_csv_1 = `ZIP,NEVER,RARELY,SOMETIMES,FREQUENTLY,ALWAYS
      11201,0.035,0.034,0.058,0.141,0.732
      36051,0.053,0.074,0.134,0.295,0.444
      36578,0.083,0.059,0.098,0.323,0.436`;
      const test_csv_2 = `ZIP,CASES,DEATHS
      11201,263694,23969
      36578,6694,69
      36027,1033,9
      36793,843,14
      35952,1942,25`;
      const read_csv_1 = readString(test_csv_1);
      for (var i = 1; i < read_csv_1.data.length; i++) {
        if (read_csv_1.data[i][0].includes(zip)) {
          setMaskData(read_csv_1.data[i][1]);
        }
      }
      const read_csv_2 = readString(test_csv_2);
      var len = Object.keys(CovidJSON).length;
      // console.log(CovidJSON[0].ZIP);
      for (var i = 0; i < len; i++) {
        if (CovidJSON[i].ZIP == zip) {
          setCovidData(CovidJSON[i].CASES);
        }
      }
    }
  }, [zip, maskDataRaw]);

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
