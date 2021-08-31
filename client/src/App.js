import React, { useState, useEffect } from "react";
import EvictionMap from "./Components/EvictionMap";
import EvictionChart from "./Components/EvictionChart";
import { Dropdown, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import API from "./utils/API.js";
import Loader from "react-loader-spinner";
import util from "./util";
import "./App.css";
// import { use } from 'passport';

const App = () => {
  const data2019 = require("./Data/EvictionFilingsByCounty2019.json");
  const normalizeData = require("./Data/RentHHsByTract.json");
  const countyBoundary = require("./Data/countyboundaries.json");
  const vh = window.innerHeight * 0.01;
  const smallScreen = window.innerWidth < 850;

  const [geoJSON, setGeoJSON] = useState();
  const [boundaryGeoJSON, setBoundaryGeoJSON] = useState();
  const [content, setContent] = useState();
  const [data, setData] = useState();
  const [vizView, setVizView] = useState("map");
  const [countyFilter, setCountyFilter] = useState(999);
  const [modalStatus, setModalStatus] = useState(true);
  const [dateRange, setDateRange] = useState();
  const [buildings, setBuildings] = useState();

  document.documentElement.style.setProperty("--vh", `${vh}px`);

  const getTractGeoJSON = () => {
    const url = `https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel='Tract' AND PlanningRegion='Atlanta Regional Commission'&SR=4326&outFields=GEOID&f=geojson`;

    API.getData(url)
      .then((res) => setGeoJSON(res.data))
      .catch((err) => console.error(err));
  };

  const handleDateRange = (data) => {
    const sortByDate = (a, b) => {
      var dateA = new Date(a).getTime();
      var dateB = new Date(b).getTime();
      return dateA > dateB ? 1 : -1;
    };
    const dateArray = new Set([...data.map((item) => item["Filing Date"])]);
    const sortedDates = [...dateArray].sort((a, b) => sortByDate(a, b));
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    setDateRange({ start: startDate, end: endDate });
  };

  const getContent = () =>
    API.getData("./content")
      .then((res) => res.data[0])
      .catch((err) => console.error(err));

  const getEvictionData = () => {
    const array = [];
    API.getData(
      "https://evictions.design.gatech.edu/rest/atlanta_metro_area_tracts?select=id,filedate,tractid,countyfp10,totalfilings,totalansweredfilings"
    )
      .then((res) => {
        res.data
          .filter(
            (item) =>
              new Date(item.filedate).getTime() >=
                new Date("1/1/2020").getTime() &&
              new Date(item.filedate).getTime() < moment().day(0)
          )
          .forEach((item) =>
            array.push({
              "Filing Date": item.filedate,
              tractID: parseInt(item.tractid),
              COUNTYFP10: parseInt(item.countyfp10),
              "Total Filings": parseInt(item.totalfilings),
              "Answered Filings": parseInt(item.totalansweredfilings),
            })
          );
        setData(array);
        const currentDateRange = handleDateRange(array);
        setDateRange(currentDateRange);
      })
      .catch((err) => console.error(err));
  };

  const countyOptions = [
    { key: "999", text: "5-County Region", value: 999 },
    { key: "063", text: "Clayton County", value: 63 },
    { key: "067", text: "Cobb County", value: 67 },
    { key: "089", text: "Dekalb County", value: 89 },
    { key: "121", text: "Fulton County", value: 121 },
    { key: "135", text: "Gwinnett County", value: 135 },
  ];
  useEffect(() => {
    const asyncWrapper = async () => {
      const evictionData = await util.getEvictionData();
      setData(evictionData.array);
      setDateRange(evictionData.dateRange);
      console.log(evictionData.dateRange);
      const currentContent = await getContent();
      console.log(currentContent);
      setContent(currentContent);
      console.log(dateRange);
    };
    asyncWrapper();
  }, []);

  useEffect(() => {
    getTractGeoJSON();
    const buildingInfo = util.getMFBuildingInfo();
    setBuildings(buildingInfo);
    setBoundaryGeoJSON(countyBoundary);
  }, []);
  return content ? (
    <div id="eviction-tracker">
      {modalStatus ? (
        <div id="modal">
          <div id="modal-content">
            <div id="modal-heading">
              <div id="welcome">Welcome to the</div>
              <h1>ATLANTA REGION</h1>
              <h1>EVICTION TRACKER</h1>
            </div>

            <div id="modal-body">
              {content ? (
                <>
                  {content.alert ? util.AboutContent.Alert(content) : null}
                  {util.AboutContent.Mission(content)}
                  {util.AboutContent.Data(content)}
                  {util.AboutContent.Team(content)}
                  {util.AboutContent.Resources(content)}
                  {util.AboutContent.Citations(content)}
                  {util.AboutContent.DataRequest(content)}
                  {util.AboutContent.Sources("Court Record Data", content)}
                  {util.AboutContent.Sources("Other Data", content)}
                </>
              ) : (
                <div
                  style={{
                    zIndex: "99999",
                    color: "#DC1C13",
                    position: "absolute",
                    bottom: "50vh",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <h1>Loading...</h1>
                  <Loader id="loader-box" color="#DC1C13" type="Circles" />
                </div>
              )}
            </div>
            <div id="modal-footer">
              <Button onClick={() => setModalStatus(false)}>OK</Button>
            </div>
          </div>
        </div>
      ) : null}
      <div id="header">
        <h1>ATLANTA REGION EVICTION TRACKER</h1>
        <div id="county-dropdown-container">
          {smallScreen ? (
            <select
              value={countyFilter}
              onChange={(e) => setCountyFilter(e.target.value)}
            >
              {countyOptions
                ? countyOptions.map((county) => (
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
              value={countyFilter}
              options={countyOptions}
              onChange={(e, data) => setCountyFilter(data.value)}
            />
          )}
        </div>
        <div id="viz-toggle">
          <div
            className="viz-tab"
            id={vizView === "map" ? "active-viz-tab" : null}
            onClick={() => setVizView("map")}
          >
            <h3>MAP</h3>
          </div>
          <div
            className="viz-tab"
            id={vizView === "chart" ? "active-viz-tab" : null}
            onClick={() => setVizView("chart")}
          >
            <h3>CHART</h3>
          </div>
        </div>
      </div>
      <div id="viz-box">
        {vizView === "map" && data && buildings ? (
          <EvictionMap
            key={`eviction-map`}
            smallScreen={smallScreen}
            data={data}
            buildings={buildings.filter((building) =>
              countyFilter.toString().padStart(3, "0") !== "999"
                ? countyFilter.toString().padStart(3, "0") ===
                  building.county.toString().padStart(3, "0")
                : true
            )}
            normalizeData={normalizeData}
            dateRange={dateRange}
            name={"evictionMap"}
            geojson={geoJSON}
            boundaryGeoJSON={boundaryGeoJSON}
            countyFilter={countyFilter}
            counties={countyOptions.map((county) => county.key)}
            countyInfo={countyOptions}
            exclude={content.config ? content.config.exclude : null}
          />
        ) : vizView === "chart" && data && dateRange ? (
          <EvictionChart
            smallScreen={smallScreen}
            dateRange={dateRange}
            data2019={data2019}
            countyFilter={countyFilter}
            data={data}
            county={countyOptions.find(
              (county) =>
                county.value.toString().padStart(3, "0") ===
                countyFilter.toString().padStart(3, "0")
            )}
            counties={countyOptions}
          />
        ) : (
          <div
            style={{
              zIndex: "99999",
              color: "#DC1C13",
              position: "absolute",
              bottom: "50vh",
              width: "100%",
              textAlign: "center",
            }}
          >
            <h1>{vizView === "map" ? "Map is" : "Chart is"} Loading...</h1>
            <Loader id="loader-box" color="#DC1C13" type="Circles" />
          </div>
        )}
      </div>
      <div id="footer">
        <div id="footer-text">Developed by</div>
        <div id="footer-logos">
          <div id="left-logo">
            <img
              src={
                "https://www.frbatlanta.org/~/media/Images/frba_line_logo.png"
              }
              alt="Fed-logo"
            />
          </div>
          <div id="center-logo">
            <img
              src={
                "https://atlantaregional.org/wp-content/uploads/arc-logo-webinar.png"
              }
              alt="ARC-logo"
            />
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
      <div id="info-icon" onClick={() => setModalStatus(true)}>
        <Icon name="question circle" size="big" />
      </div>
    </div>
  ) : (
    <div
      style={{
        zIndex: "99999",
        color: "#DC1C13",
        position: "absolute",
        bottom: "50vh",
        width: "100%",
        textAlign: "center",
      }}
    >
      <h1>Atlanta Eviction Tracker is Loading...</h1>
      <Loader id="loader-box" color="#DC1C13" type="Circles" />
    </div>
  );
};

export default App;
