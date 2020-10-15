import React from "react";
import { Link } from "react-router-dom";
import DataBlock from "../components/DataBlock";

function Dashboard() {
  return (
    <div className="Dashboard">
      <h1>Hmmmm... might be best to stay inside today.</h1>
      <div className="DataBlocks">
        <DataBlock />
        <DataBlock />
        <DataBlock />
      </div>
    </div>
  );
}

export default Dashboard;
