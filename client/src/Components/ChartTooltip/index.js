import React from "react";
import numeral from "numeral";
import util from "./util";

export default (
	{ active, payload, label },
	{
		timeScale,
		totalFilingsIndicator,
		answeredFilingsIndicator,
		baselineIndicator,
		countyFilter,
		county
	}
) => {
  const info = payload[0] ? payload[0].payload : {};
  const dateInfo = util.dateInfo({
    timeScale: timeScale,
    label: label,
  });
  
  const totalFilings =
    info[totalFilingsIndicator]
      ? numeral(info[totalFilingsIndicator]).format(
          "0,0"
        )
      : "?";

  const totalAnswers = info[answeredFilingsIndicator]
    ? numeral(info[answeredFilingsIndicator]).format("0,0")
    : "?";

  const answerRate =
    info[totalFilingsIndicator] && info[answeredFilingsIndicator]
      ? numeral(
          info[answeredFilingsIndicator] / info[totalFilingsIndicator]
        ).format("0.0%")
      : "?";

  const total2019 = info[baselineIndicator]
    ? numeral(info[baselineIndicator]).format("0,0")
    : "?";

  return active ? (
    <div className="tooltip-content chart-tooltip-content">
      <div>
        In{" "}
        {countyFilter === 999 || countyFilter === "999"
          ? "the "
          : ""}{" "}
        <span className="tooltip-data">{county.text}</span> {dateInfo},
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
