import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

function DataBlock({ text, data }) {
  return (
    <div className="DataBlock">
      <p className="DataBlock-Label">{text}</p>
      <h3 className="DataBlock-Data">{data}</h3>
    </div>
  );
}

export default DataBlock;
