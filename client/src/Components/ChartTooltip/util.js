import React from "react";
import moment from "moment";

export default {
  dateInfo(propObj) {
    return propObj.timeScale === "weekly" ? (
      <span>
        between{" "}
        <span className="tooltip-data">
          {moment(propObj.label).format("M/D/YY")}
        </span>{" "}
        and{" "}
        <span className="tooltip-data">
          {moment(propObj.label).endOf("week").format("M/D/YY")}
        </span>
      </span>
    ) : propObj.timeScale === "monthly" ? (
      <span>
        in{" "}
        <span className="tooltip-data">
          {moment(propObj.label).format("MMMM YYYY")}
        </span>
      </span>
    ) : propObj.timeScale === "daily" ? (
      <span>
        on{" "}
        <span className="tooltip-data">
          {moment(propObj.label).format("dddd, MMMM Do YYYY")}
        </span>
      </span>
    ) : null;
  },
};
