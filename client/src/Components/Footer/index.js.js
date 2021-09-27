import React from "react";
import moment from "moment";
import config from "./config";
import "./style.css";

const Footer = (dateRange) => {
  return (
    <div id="footer">
      <div id="footer-text">Developed by</div>
      <div id="footer-logos">
        <div id="left-logo">
          <img src={config.logos.fed} alt="Fed-logo" />
        </div>
        <div id="center-logo">
          <img src={config.logos.arc} alt="ARC-logo" />
        </div>
        <div id="right-logo">
          <p className="partner-names">
            in partnership with Georgia Tech's <br />
            School of City and Regional Planning (SCaRP) and
          </p>
          <p className="partner-names">
            Center for Spatial Planning Analytics and Visualization (CSPAV)
          </p>
        </div>
      </div>
      <div>
        Current as of{" "}
        {dateRange ? moment(dateRange.end).format("MMMM Do, YYYY") : null}
      </div>
    </div>
  );
};

export default Footer;
