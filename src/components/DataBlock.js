import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function DataBlock({ text, data, link, myStatus, color }) {
  let hue = (1 - myStatus) * 114;
  let divStyle = {
    backgroundColor: `hsl(${hue}, 80%, 85%)`,
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
