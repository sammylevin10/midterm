import React from "react";
import MaskImage from "../images/mask.png";
import CovidImage from "../images/covid.png";
import FireImage from "../images/fire.png";

function DataBlock({ text, data, link, myStatus }) {
  // Set a hue that is proportional to status
  // If status is 0, hue is green. If status is 1, hue is red
  let hue = (1 - myStatus) * 114;
  let backgroundImage;
  if (text.includes("mask")) {
    backgroundImage = MaskImage;
  } else if (text.includes("COVID")) {
    backgroundImage = CovidImage;
  } else {
    backgroundImage = FireImage;
  }
  // Create a style object to be passed to the DataBlock, inline
  let divStyle = {
    backgroundColor: `hsl(${hue}, 80%, 85%)`,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: `65%`,
  };

  return (
    <div className="DataBlock" style={divStyle}>
      <a href={link}>
        <p className="DataBlock-Label">{text}</p>
        <h3 className="DataBlock-Data">{data}</h3>
      </a>
    </div>
  );
}

export default DataBlock;
