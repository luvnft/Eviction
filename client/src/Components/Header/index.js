import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "semantic-ui-react";
import "./style.css";

const Header = (props) => {
  return (
    <div id="header">
      {/* API Docs Link */}
      {/* <Link className="api-link" to="/api" aria-label="api-documentation">API</Link> */}
      <h1>ATLANTA REGION EVICTION TRACKER</h1>
      <div id="county-dropdown-container">
        {props.smallScreen ? (
          <select
            value={props.countyFilter}
            onChange={(e) => props.setCountyFilter(e.target.value)}
          >
            {props.countyOptions
              ? props.countyOptions.map((county) => (
                  <option
                    key={county.text}
                    value={county.value}
                    id={`option-${county.text}`}
                  >
                    {county.text}
                  </option>
                ))
              : null}
          </select>
        ) : (
          <Dropdown
            placeholder="Filter by County"
            fluid
            selection
            value={props.countyFilter}
            options={props.countyOptions}
            onChange={(e, data) => props.setCountyFilter(data.value)}
          />
        )}
      </div>
      <div id="viz-toggle">
        <div
          className="viz-tab"
          id={props.vizView === "map" ? "active-viz-tab" : null}
          onClick={() => props.setVizView("map")}
        >
          <h3>MAP</h3>
        </div>
        <div
          className="viz-tab"
          id={props.vizView === "chart" ? "active-viz-tab" : null}
          onClick={() => props.setVizView("chart")}
        >
          <h3>CHART</h3>
        </div>
      </div>
    </div>
  );
};

export default Header;
