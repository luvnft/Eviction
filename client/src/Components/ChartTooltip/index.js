import React from "react";
import numeral from "numeral";
import util from "./util";

export default ({ active, payload, label }, propObj) => {
  const info = payload[0] ? payload[0].payload : {};
  const dateInfo = util.dateInfo({
    timeScale: propObj.timeScale,
    label: label,
  });
  const totalFilings =
    info[propObj.indicator1] && info[propObj.indicator2]
      ? numeral(info[propObj.indicator1] + info[propObj.indicator2]).format(
          "0,0"
        )
      : "?";
  const totalAnswers = info[propObj.indicator2]
    ? numeral(info[propObj.indicator2]).format("0,0")
    : "?";
  const answerRate =
    info[propObj.indicator1] && info[propObj.indicator2]
      ? numeral(
          info[propObj.indicator2] /
            (info[propObj.indicator1] + info[propObj.indicator2])
        ).format("0.0%")
      : "?";
  const total2019 = info["Baseline (Total Filings, 2019)"]
    ? numeral(info["Baseline (Total Filings, 2019)"]).format("0,0")
    : "?";

  return active ? (
    <div className="tooltip-content chart-tooltip-content">
      <div>
        In{" "}
        {propObj.countyFilter === 999 || propObj.countyFilter === "999"
          ? "the "
          : ""}{" "}
        <span className="tooltip-data">{propObj.county.text}</span> {dateInfo},
        there were <span className="tooltip-data">{totalFilings}</span> reported
        eviction filings of which{" "}
        <span className="tooltip-data">
          {totalAnswers} ({answerRate})
        </span>{" "}
        have been answered. In comparison, there were{" "}
        <span className="tooltip-data">{total2019}</span> filings for the same
        duration in 2019.
      </div>
    </div>
  ) : null;
};
