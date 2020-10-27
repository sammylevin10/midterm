import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
function FireData({ location }) {
  // These are states, or variables referenced by the JSX
  const [fireData, setFireData] = useState(null);
  // This occurs when the page loads
  useEffect(() => {
    axios
      // Get request from an address
      // ?lat=48.397&lng=-116.089&x-api-key=${process.env.REACT_APP_FIRE_KEY}
      .get("https://api.ambeedata.com/latest/fire?lat=45&lng=45", {
        headers: { "x-api-key": "NB1khSjQqj7L1NuTzdXog9gAuxwFPww3ZrXaXDm6" },
      })
      .then(function (response) {
        // handle success
        console.log("response", response);
        setFireData(response);
        // console.log("response", response);
      })
      .catch(function (error) {
        // handle error
        console.log("error", error);
      });
  }, [location]);
  // console.log("Fire Data", fireData);
  // if (!fireData) return null;
  // return <DataBlock text={fireData.whatever} percentage={fireData.percent} />;
}
export default FireData;
