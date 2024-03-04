import React, { useState, useEffect } from 'react';
import EvictionMap from '../EvictionMap/index.jsx';
import EvictionChart from '../EvictionChart/index.jsx';
import Footer from '../Footer/index.jsx';
import Header from '../Header/index.jsx';
import Modal from '../Modal/index.jsx';
import { Icon } from 'semantic-ui-react';
import API from '../../utils/API.js';
import { Circles } from 'react-loader-spinner';
import util from '../../util';
import config from '../../config';
import './style.css';
import normalizeData from '../../Data/RentHHsByTract.json';
import countyBoundary from '../../Data/countyboundaries.json';

const Dashboard = () => {
  const vh = window.innerHeight * 0.01;
  const smallScreen = window.innerWidth < 850;
  const [geoJSON, setGeoJSON] = useState();
  // const [boundaryGeoJSON, setBoundaryGeoJSON] = useState();
  const [content, setContent] = useState();
  // const [data, setData] = useState();
  const [vizView, setVizView] = useState('map');
  const [countyFilter, setCountyFilter] = useState(999);
  const [modalStatus, setModalStatus] = useState(true);
  const [dateRange, setDateRange] = useState();
  const [buildings, setBuildings] = useState();
  const [mapData, setMapData] = useState();
  const [monthOptions, setMonthOptions] = useState();
  const [chartDataWeekly, setChartDataWeekly] = useState();
  const [chartDataMonthly, setChartDataMonthly] = useState();
  const countyOptions = config.countyOptions;

  const handleData = () => {
    API.getData('/content')
    .then(res => setContent(res[0]))
    .catch(err => console.log('error getting content', err));

    API.getData('/rest/tractbymonth')
      .then(res => {
        setMapData(res);
        // const {start, end, monthsArr} = util.handleDates(res);
        // setMonthOptions(monthsArr);
        // setDateRange({start, end});
      })
      .catch(err => console.log('error on getting tract by month', err));
    API.getData('/rest/buildings')
      .then(res => setBuildings(res))
      .catch(err => console.log('error getting buildings', err));
    API.getData(config.geoURL)
      .then(res => setGeoJSON(res))
      .catch(err => console.log('error getting geojsons', err));
    API.getData('/rest/countyweekly')
      .then(res => {
        setChartDataWeekly(res);
        // console.log(res);
        const { start, end, monthsArr } = util.handleDates(res);
        setMonthOptions(monthsArr);
        setDateRange({ start, end });
      })
      .catch(err => console.log('error getting county weekly', err));
    API.getData('/rest/countymonthly')
      .then(res => setChartDataMonthly(res))
      .catch(err => console.log('error getting county monthly', err));
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    handleData();
    // console.log(chartDataMonthly);
  }, []);

  return content ? (
    <div id='eviction-tracker'>
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

      <div id='viz-box'>
        {vizView === 'map' && buildings && dateRange && mapData && geoJSON ? (
          <EvictionMap
            key={'eviction-map'}
            smallScreen={smallScreen}
            mapData={mapData.filter(tract =>
              countyFilter.toString().padStart(3, '0') !== '999'
                ? countyFilter.toString().padStart(3, '0') ===
                  tract.CountyID.toString().padStart(3, '0')
                : true
            )}
            buildings={buildings[0] ? buildings.filter(building =>
              countyFilter.toString().padStart(3, '0') !== '999'
                ? countyFilter.toString().padStart(3, '0') ===
                  building.county.toString().padStart(3, '0')
                : true
            ) : []}
            normalizeData={normalizeData}
            dateRange={dateRange}
            monthOptions={monthOptions}
            name={'evictionMap'}
            geojson={geoJSON}
            boundaryGeoJSON={countyBoundary}
            countyFilter={countyFilter.toString().padStart(3, '0')}
            counties={countyOptions.map(county => county.key)}
            countyInfo={countyOptions}
          />
        ) : vizView === 'chart' &&
          dateRange &&
          chartDataMonthly &&
          chartDataWeekly &&
          content ? (
            <EvictionChart
              referenceAreas={content.config.referenceAreas}
              smallScreen={smallScreen}
              dateRange={dateRange}
              countyFilter={countyFilter}
              chartDataMonthly={chartDataMonthly.filter(
                item =>
                  countyFilter.toString().padStart(3, '0') ===
                  item['CountyID'].toString().padStart(3, '0')
              )}
              chartDataWeekly={chartDataWeekly.filter(
                item =>
                  countyFilter.toString().padStart(3, '0') ===
                  item['CountyID'].toString().padStart(3, '0')
              )}
              county={countyOptions.find(
                county =>
                  county.value.toString().padStart(3, '0') ===
                  countyFilter.toString().padStart(3, '0')
              )}
              counties={countyOptions}
            />
          ) : (
            <div className='spinner-container' style={config.loaderStyle}>
              <h1>{vizView === 'map' ? 'Map is' : 'Chart is'} Loading...</h1>
              <Circles
                id='loader-box'
                color={config.loaderStyle.color}
                type={config.loaderStyle.type}
              />
            </div>
          )}
      </div>
      <Footer dateRange={dateRange} />
      <div id='info-icon' onClick={() => setModalStatus(true)}>
        <Icon name='question circle' size='big' />
      </div>
    </div>
  ) : (
    <div className='spinner-container' style={config.loaderStyle}>
      <h1>Atlanta Eviction Tracker is Loading...</h1>
      <Circles
        id='loader-box'
        color={config.loaderStyle.color}
        type={config.loaderStyle.type}
      />
    </div>
  );
};

export default Dashboard;
