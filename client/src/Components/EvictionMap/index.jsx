import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer as LeafletMap,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup
} from 'react-leaflet';
import numeral from 'numeral';
import { Dropdown, Icon, Radio } from 'semantic-ui-react';
import { BarChart, Bar, XAxis, ReferenceArea, Label, YAxis } from 'recharts';
import CSVExportButton from '../CSVExportButton';
import moment from 'moment';
import { Circles } from 'react-loader-spinner';
import TextFormatter from '../../utils/TextFormatter';
import config from './config';
import MapTooltip from '../MapTooltip';
import util from './util';
import './style.css';

const EvictionMap = ({
  smallScreen,
  mapData,
  countyFilter,
  normalizeData,
  geojson,
  counties,
  countyInfo,
  dateRange,
  monthOptions,
  name,
  boundaryGeoJSON,
  buildings
}) => {
  const [legendVisible, setLegendVisible] = useState(true);
  const [tractData, setTractData] = useState();
  const [rawTractData, setRawTractData] = useState();
  const [stats, setStats] = useState();
  const [bins, setBins] = useState();
  const [clickID, setClickID] = useState();
  const [hoverID, setHoverID] = useState();
  const [selectedMonth, setSelectedMonth] = useState(
    monthOptions[monthOptions.length - 1].value
  );
  const [showBuildings, setShowBuildings] = useState(true);
  const [evictionThreshold, setEvictionThreshold] = useState(100);

  const {
    tractNumerator: selectedMeasure,
    tractDenominator,
    buildingScaler,
    monthlyColorMap,
    pandemicColorMap,
    countyFIPS,
    countyBounds
  } = config;

  const colors =
    selectedMonth !== 'During the Pandemic'
      ? monthlyColorMap
      : pandemicColorMap;

  const sortedData = util.handleData({
    data: mapData,
    normalizeData: normalizeData || {},
    selectedMonth,
    selectedMeasure,
    tractDenominator
  });

  const currentStats = util.calcStats({
    dataObject: sortedData.dataObject,
    selectedMonth: selectedMonth,
    colors: colors
  });

  useEffect(() => {
    setTractData(sortedData.dataObject);
    setRawTractData(sortedData.rawDataObject);
    setStats(currentStats.statsObj);
    setBins(currentStats.bins);
  }, [countyFilter, selectedMonth]);

  return (
    <>
      <LeafletMap
        key={'leaflet-map-' + name + countyFilter}
        center={countyBounds(smallScreen)[countyFilter].center}
        zoom={countyBounds(smallScreen)[countyFilter].zoom}
        maxZoom={18}
        zoomSnap={0.2}
        zoomDelta={0.2}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
      >
        <TileLayer
          key={'tile-layer'}
          attribution={config.tileLayer.attribution}
          url={config.tileLayer.url}
        />
        {boundaryGeoJSON ? (
          <GeoJSON
            key={'county-boundary' + countyFilter}
            data={boundaryGeoJSON}
            filter={feature =>
              countyFilter !== 999 && countyFilter !== '999'
                ? feature.properties['GEOID'] === `13${countyFilter}`
                : countyFIPS.includes(feature.properties['GEOID'])
            }
          />
        ) : null}
        {geojson && tractData && stats ? (
          <GeoJSON
            key={`map-layer-${name}-${countyFilter}-${selectedMonth}-${hoverID}`}
            data={geojson}
            eventHandlers={{
              add: e => e.target.bringToBack(),
              mouseover: e =>
                e.propagatedFrom.feature.properties.GEOID
                  ? setHoverID(e.propagatedFrom.feature.properties.GEOID)
                  : setHoverID(),
              mouseout: e => {
                e.target.closePopup();
                setClickID();
                setHoverID();
              },
              click: e =>
                e.propagatedFrom.feature.properties.GEOID
                  ? setClickID(e.propagatedFrom.feature.properties.GEOID)
                  : setClickID()
            }}
            filter={feature =>
              countyFilter !== 999 && countyFilter !== '999'
                ? feature.properties['GEOID'].slice(2, 5) === countyFilter
                : counties.includes(feature.properties['GEOID'].slice(2, 5))
            }
            style={feature =>
              feature.properties['GEOID'] === hoverID
                ? {
                  fillOpacity: 0.1
                }
                : util.featureStyler({
                  feature: feature,
                  tractData: tractData,
                  bins: bins,
                  colors: colors,
                  hoverID: hoverID
                })
            }
          >
            <Popup interactive>
              {clickID && tractData[clickID] ? (
                MapTooltip({
                  selectedMonth: selectedMonth,
                  monthOptions: monthOptions,
                  clickID: clickID,
                  tractData: tractData,
                  rawTractData: rawTractData
                })
              ) : (
                <h5>No Data</h5>
              )}
            </Popup>
          </GeoJSON>
        ) : (
          <div className='spinner-container' style={config.loaderStyle}>
            <Circles
              id='loader-box'
              color={config.loaderStyle.color}
              type={config.loaderStyle.type}
            />
          </div>
        )}
        {buildings[0] && showBuildings && dateRange
          ? buildings
            .filter(building => building.pandemicfilings >= evictionThreshold)
            .map(building => {
              const monthlyFilings = building.monthlyfilings?.map(item => ({
                date: item.date,
                count: item.count
              }));
              return (
                <CircleMarker
                  key={`building-${building._id}-${countyFilter}`}
                  center={[building.latitude, building.longitude]}
                  radius={
                    Math.sqrt(building.totalfilings / Math.PI) *
                    buildingScaler
                  }
                  color={'rgb(191, 253, 0)'}
                  fillOpacity={0.6}
                  weight={1.5}
                >
                  <Popup>
                    <h5>{TextFormatter.firstCharToUpper(building.street)}</h5>
                    <div>
                      {TextFormatter.firstCharToUpper(building.city)}, GA{' '}
                      {building.zip}
                    </div>
                    {monthlyFilings?.[0]
                      ? (
                        <div className='building-popup-chart'>
                          <BarChart
                            width={220}
                            height={100}
                            margin={{
                              top: 25,
                              right: 0,
                              left: 0,
                              bottom: 0
                            }}
                            data={monthlyFilings.map(item => ({
                              date: moment(new Date(item.date)).valueOf(),
                              count: item.count
                            }))}
                          >
                            <ReferenceArea
                              x1={moment(new Date('04/01/2020')).valueOf()}
                              x2={moment(new Date('09/01/2021')).valueOf()}
                            >
                              <Label position='top'>Moratoria</Label>
                            </ReferenceArea>
                            {/* <ReferenceArea
                              x1={moment(new Date('08/01/2020')).valueOf()}
                              x2={moment(new Date('09/01/2021')).valueOf()}
                            >
                              <Label position='top'>CDC</Label>
                            </ReferenceArea> */}
                            <Bar dataKey='count' fill={'red'} />
                            <YAxis width={25} />
                            <XAxis
                              dataKey='date'
                              type='category'
                              // scale='time'
                              domain={[
                                moment(new Date('1/1/2020')).valueOf(),
                                moment(new Date(dateRange.end)).startOf('month').valueOf()
                              ]}
                              tickFormatter={tick =>
                                moment(tick).format('M/YY')
                              }
                            />
                          </BarChart>
                        </div>
                      ) : null}
                    {/* <div className='building-popup-summary'>
                      <span className='building-popup-value'>
                        {building.totalfilings}
                      </span>{' '}
                      eviction filings since 1/1/2020
                    </div>
                    <div className='building-popup-summary'>
                      <span className='building-popup-value'>
                        {
                          building.pandemicfilings
                        }
                      </span>{' '}
                      eviction filings during the COVID-19 pandemic**
                    </div> */}
                    {building.county === '121' ? (
                      <div className='popup-data-warning'>
                        <b>***WARNING***</b>
                        <br />
                        <em>
                          The totals for buildings in Fulton County likely
                          represent a significant undercount due to the lack
                          of building-level data since 9/15/2020.
                        </em>
                      </div>
                    ) : null}
                  </Popup>
                </CircleMarker>
              );
            })
          : null}
      </LeafletMap>

      {legendVisible && smallScreen ? (
        <div id='legend-close-icon' onClick={() => setLegendVisible(false)}>
          <Icon inverted name='close' />
        </div>
      ) : null}
      {buildings[0]
        ? <div id='building-toggle'>
          <Radio
            toggle
            checked={showBuildings}
            onChange={() => setShowBuildings(!showBuildings)}
          />
          <div className='building-toggle-label'>Show Buildings</div>
          {showBuildings ? (
            <>
              <div className='building-toggle-sublabel'>
                with{' '}
                <Dropdown
                  inline
                  style={config.dropdownStyle}
                  value={evictionThreshold}
                  options={[100, 250, 500].map(option => ({
                    text: option,
                    value: option,
                    key: `threshold-option-${option}`
                  }))}
                  onChange={(e, data) => setEvictionThreshold(data.value)}
                />
                or more eviction filings since 4/1/2020.
              </div>
              <div id='building-symbology-box'>
                {[100, 250, 500].map((bin, i) => (
                  <div key={`bin-${bin}-${i}`}>
                    <div
                      className='building-symbology'
                      style={{
                        width: 2 * Math.sqrt(bin / Math.PI) * buildingScaler,
                        height: 2 * Math.sqrt(bin / Math.PI) * buildingScaler,
                        border: config.buildingSymbologyColor.border,
                        backgroundColor:
                          config.buildingSymbologyColor.backgroundColor
                      }}
                    />
                    <div>{bin}</div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
        : null
      }
      {legendVisible ? (
        <div className='legend'>
          <div id='legend-header'>
            <h3>Eviction Filing Rate*</h3>
          </div>
          <div id='month-selector'>
            {smallScreen ? (
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
              >
                {monthOptions
                  ? monthOptions.map(month => (
                    <option
                      key={month.text}
                      value={month.value}
                      id={`option-${month.text}`}
                    >
                      {month.text}
                    </option>
                  ))
                  : null}
              </select>
            ) : (
              <Dropdown
                style={{ float: 'center' }}
                inline
                placeholder='Select Month'
                value={selectedMonth}
                options={monthOptions}
                onChange={(e, data) => setSelectedMonth(data.value)}
              />
            )}
          </div>
          <div id='symbol-container'>
            <div id='symbol-column'>
              {[...colors].reverse().map(color => (
                <div
                  key={`legend-symbol-${color}`}
                  className='legend-symbol'
                  style={{ backgroundColor: color }}
                />
              ))}
              <div
                className='legend-symbol'
                style={{ backgroundColor: 'lightgrey' }}
              />
            </div>
            <div id='symbol-labels'>
              {bins
                ? [...bins].reverse().map(bin => (
                  <div
                    key={`legend-label-${bin.bottom}-to-${bin.top}`}
                    className='legend-label'
                  >
                    {`${numeral(bin.bottom).format('0,0')}${bin.bottom === 0 ? '.1' : ''}% to < ${numeral(bin.top).format('0,0')}%`}
                  </div>
                ))
                : null}
              <div className='legend-label'>No Data</div>
            </div>
          </div>
          <div id='legend-footer'>
            <p>
              <span>*</span>calculated by dividing total filings by the number
              of renter-occupied housing units
            </p>
            {/* <p>
              <span>**</span>4/1/2020 to the most current update
            </p> */}
          </div>
        </div>
      ) : null}
      {!legendVisible && smallScreen ? (
        <div id='legend-icon'>
          <Icon
            name='list alternate outline'
            size='huge'
            onClick={() => setLegendVisible(true)}
          />
        </div>
      ) : null}
      <div id='map-data-export-button'>
        <CSVExportButton
          smallScreen={smallScreen}
          csvTitle={
            `Title: ${selectedMonth} Eviction Filings by Census Tracts in ${countyInfo.find(item => item.key === countyFilter).text
            } as of ${dateRange ? moment(dateRange.end).format('M/D/YYYY') : null
            }` +
            '\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker'
          }
          csvFilename={`Eviction-Filings-by-Census-Tract-${selectedMonth}-2020-${countyInfo.find(item => item.key === countyFilter).text}`}
          data={util.handleCSVData({
            geojson: geojson,
            counties: counties,
            countyFilter: countyFilter,
            tractData: tractData,
            rawTractData: rawTractData,
            selectedMonth: selectedMonth
          })}
          content={'Census Tract Data'}
        />
      </div>
      {buildings[0] && !smallScreen ? (
        <div id='map-building-list-export-button'>
          <CSVExportButton
            csvTitle={
              `Title: List of Buildings in ${countyInfo.find(item => item.key === countyFilter).text
              } with ${evictionThreshold} or more eviction filings since 4/1/2020 (as of ${dateRange ? moment(dateRange.end).format('M/D/YYYY') : null
              })` +
              '\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker'
            }
            csvFilename={`ATL-Eviction-Tracker-Buildings-List-${evictionThreshold}-plus-filings-${countyInfo.find(item => item.key === countyFilter).text}`}
            data={util.buildingList({
              buildings: buildings,
              evictionThreshold: evictionThreshold,
              TextFormatter: TextFormatter
            })}
            content={'Building Data'}
          />
        </div>
      ) : null}
    </>
  );
};

EvictionMap.propTypes = {
  smallScreen: PropTypes.bool,
  mapData: PropTypes.array,
  countyFilter: PropTypes.string,
  normalizeData: PropTypes.array,
  geojson: PropTypes.object,
  counties: PropTypes.array,
  countyInfo: PropTypes.array,
  dateRange: PropTypes.object,
  monthOptions: PropTypes.array,
  name: PropTypes.string,
  boundaryGeoJSON: PropTypes.array,
  buildings: PropTypes.array
};

export default EvictionMap;