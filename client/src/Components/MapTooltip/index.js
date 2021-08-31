import React from "react";
import numeral from "numeral";

const MapTooltip = (
  selectedMonth,
  monthOptions,
  hoverID,
  tractData,
  rawTractData
) => (
  <div className="tooltip-content">
    <div>
      {selectedMonth !== "During the Pandemic**" ? "In " : ""}{" "}
      <span className="tooltip-data">
        {monthOptions.find((month) => month.value === selectedMonth).text}
      </span>
    </div>
    <div>
      in census tract <span className="tooltip-data">{hoverID}</span>
    </div>

    <div>
      there {selectedMonth !== "During the Pandemic**" ? "were" : "have been"}{" "}
      <span className="tooltip-data">
        {numeral(rawTractData[hoverID]).format("0,0")}
      </span>{" "}
      total reported eviction filings
    </div>
    <div>
      resulting in an eviction filing rate of{" "}
      <span className="tooltip-data">
        {numeral(tractData[hoverID]).format("0.0")}%
      </span>
      .
    </div>
  </div>
);

export default MapTooltip;
