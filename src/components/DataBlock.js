import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function DataBlock() {
  // These are states, or variables referenced by the JSX
  const fireData = useState(null);

  // This occurs when the page loads
  useEffect(() => {
    axios
      // Get request from an address
      // ?lat=48.397&lng=-116.089&x-api-key=${process.env.REACT_APP_FIRE_KEY}
      .get(
        `api.ambeedata.com/latest/fire?q={"lat": 48.397, "lng": -116.089, "x-api-key": "${process.env.REACT_APP_FIRE_KEY}"`
      )
      .then(function (response) {
        // handle success
        const fireData = response.data;
        // setWeatherData(weather);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  console.log("Fire Data", fireData);

  return (
    <div className="DataBlock">
      <p className="DataBlock-Label">Probability of non mask encounter</p>
      <h3 className="DataBlock-Data">50%</h3>
    </div>
  );
}

export default DataBlock;
