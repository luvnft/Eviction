import React, { useState, useEffect } from "react";
import EvictionMap from "./Components/EvictionMap";
import EvictionChart from "./Components/EvictionChart";
import Footer from "./Components/Footer/index.js";
import Header from "./Components/Header/index.js";
import Modal from "./Components/Modal/index.js";
import { Icon } from "semantic-ui-react";
import API from "./utils/API.js";
import Loader from "react-loader-spinner";
import util from "./util";
import config from "./config";
import "./App.css";

const App = () => {
  const data2019 = require("./Data/EvictionFilingsByCounty2019.json");
  const normalizeData = require("./Data/RentHHsByTract.json");
  const countyBoundary = require("./Data/countyboundaries.json");
  const vh = window.innerHeight * 0.01;
  const smallScreen = window.innerWidth < 850;
  const [geoJSON, setGeoJSON] = useState();
  // const [boundaryGeoJSON, setBoundaryGeoJSON] = useState();
  const [content, setContent] = useState();
  const [data, setData] = useState();
  const [vizView, setVizView] = useState("map");
  const [countyFilter, setCountyFilter] = useState(999);
  const [modalStatus, setModalStatus] = useState(true);
  const [dateRange, setDateRange] = useState();
  const [buildings, setBuildings] = useState();
  const [mapData, setMapData] = useState();
  const [chartDataWeekly, setChartDataWeekly] = useState();
  const [chartDataMonthly, setChartDataMonthly] = useState();
  const countyOptions = config.countyOptions;


  const handleData =  () => {
    // API.getData("./tractbymonth")
    //   .then(res => {
    //     setMapData(res);
    //     setDateRange(util.handleDateRange(res));
    //   })
    //   .catch(err => 
    //     console.log('error on gettting tract by month', err));
    API.getData("./content")
      .then(res => 
        setContent(res[0]))
      .catch(err => 
        console.log('error getting content',err));
    // API.getData("./buildings")
    //   .then(res => 
    //     setBuildings(res))
    //   .catch(err => 
    //     console.log('error getting buildings',err));
    // API.getData(config.geoURL)
    //   .then(res => 
    //     setGeoJSON(res))
    //   .catch(err => 
    //     console.log('error getting geojsons',err));
    API.getData("./countyweekly")
      .then(res => 
        setChartDataWeekly(res))
      .catch(err => 
        console.log('error getting county weekly',err));
    API.getData("./countymonthly")
      .then(res => 
        setChartDataMonthly(res))
      .catch(err => 
        console.log('error getting county monthly',err));
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    handleData();
    // setBoundaryGeoJSON(countyBoundary);
  }, []);

  return content ? (
    <div id="eviction-tracker">
      {modalStatus ? (
        <Modal content={content} setModalStatus={setModalStatus} />
      ) : null}

      <Header
        countyFilter={countyFilter}
        setCountyFilter={setCountyFilter}
        countyOptions={countyOptions}
        vizView={vizView}
        setVizView={setVizView}
        smallScreen={smallScreen}
      />

      <div id="viz-box">
        { vizView === "map"
          // data && 
          // buildings && 
          // dateRange &&
          // mapData
          ? <EvictionMap
              key={`eviction-map`}
              smallScreen={smallScreen}
              // data={data}
              // mapData={mapData.filter(tract => countyFilter.toString().padStart(3, "0") !== "999"
              //   ? countyFilter.toString().padStart(3, "0") ===
              //     tract.CountyID.toString().padStart(3, "0")
              //   : true)
              // }
              // buildings={buildings.filter((building) =>
              //   countyFilter.toString().padStart(3, "0") !== "999"
              //     ? countyFilter.toString().padStart(3, "0") ===
              //       building.county.toString().padStart(3, "0")
              //     : true
              // )}
              normalizeData={normalizeData}
              // dateRange={dateRange}
              name={"evictionMap"}
              // geojson={geoJSON}
              boundaryGeoJSON={countyBoundary}
              countyFilter={countyFilter.toString().padStart(3, "0")}
              counties={countyOptions.map((county) => county.key)}
              countyInfo={countyOptions}
              // exclude={content.config ? content.config.exclude : null}
            />
          : vizView === "chart" && data && dateRange ? (
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
          <div style={config.loaderStyle}>
            <h1>{vizView === "map" ? "Map is" : "Chart is"} Loading...</h1>
            <Loader
              id="loader-box"
              color={config.loaderStyle.color}
              type={config.loaderStyle.type}
            />
          </div>
        )}
      </div>
      <Footer dateRange={dateRange} />
      <div id="info-icon" onClick={() => setModalStatus(true)}>
        <Icon name="question circle" size="big" />
      </div>
    </div>
  ) : (
    <div style={config.loaderStyle}>
      <h1>Atlanta Eviction Tracker is Loading...</h1>
      <Loader
        id="loader-box"
        color={config.loaderStyle.color}
        type={config.loaderStyle.type}
      />
    </div>
  );
};

export default App;
