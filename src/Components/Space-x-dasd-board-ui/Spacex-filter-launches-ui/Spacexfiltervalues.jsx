import React from "react";
import "./spacexfiltervalues.css";

const Spacexfiltervalues = (props) => {
  const onfilteredValueChanged = (e) => {
    props.filterValueSelected(e.target.value);
    // console.log(e.target.value)
  };
  return (
    <div className="filteredoptionvalues">
      <select name="y" id="available" onChange={onfilteredValueChanged}>
        <option name="hrki" value="all">
          All launches
        </option>
        <option value="upcoming">Upcoming launches</option>
        <option value="success">Successful launches</option>
        <option value="failure">Failed launches</option>
      </select>
    </div>
  );
};

export default Spacexfiltervalues;
