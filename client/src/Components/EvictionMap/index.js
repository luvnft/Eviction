import React, { useState, useEffect } from 'react';
import { 
  Map as LeafletMap, 
  TileLayer, 
  GeoJSON, 
  Tooltip, 
  CircleMarker,
  Popup 
} from 'react-leaflet';
import numeral from 'numeral';
import { Dropdown, Icon, Radio} from 'semantic-ui-react';
import { BarChart, Bar, XAxis, ReferenceArea, Label, YAxis} from 'recharts';
import CSVExportButton from '../CSVExportButton';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import './style.css';

const EvictionMap = props => {

  // console.log(props.buildings);

  const [legendVisble, setLegendVisible] = useState(true);
  const [tractData, setTractData] = useState();
  const [rawTractData, setRawTractData] = useState();
  const [stats, setStats] = useState();
  const [bins, setBins] = useState();
  const [hoverID, setHoverID] = useState();
  const [csvData, setCSVData] = useState();
  const [monthOptions, setMonthOptions] = useState();
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [showBuildings, setShowBuildings] = useState(true);
  const [evictionThreshold, setEvictionThreshold] = useState(50);

  const selectedMeasure = 'Total Filings';
  const buildingScaler = 2

  const colors = 
    selectedMonth !== 'During the Pandemic**'
      ? ["#DC1C13", "#EA4C46", "#F07470", "#F1959B", "#F6BDC0"].reverse()
      : ["#6867da", "#618ee9", "#76afee", "#a2cdee", "#d8e8f0"].reverse();

  // const colors2 = [
  //   '#59fd00',
  //   // '#85fe00',
  //   // '#a6ff00',
  //   '#c3ff00',
  //   '#dcff00',
  //   '#ebf100',
  //   '#f6e400',
  //   '#ffd604',
  //   '#ffb821',
  //   '#ff9b39',
  //   '#ff814d',
  //   '#fb6a5f'
  // ];

  const sortByDate = (a, b) => {
    var dateA = new Date(a['Filing Date']).getTime();
    var dateB = new Date(b['Filing Date']).getTime();
    return dateA > dateB ? 1 : -1;
  }; 

  const getMonthList = () => {
    const monthArray = [];
    props.data
    .sort((a, b) => sortByDate(a, b))
    .forEach(item =>
      !monthArray.includes(moment(item['Filing Date']).format('MMMM YYYY')) ?
        monthArray.push(moment(item['Filing Date']).format('MMMM YYYY'))
        : null
    );
    const monthOptionsArray =
      monthArray
        .filter((month, i) => 
          new Date(props.dateRange.end).getTime() >= new Date(moment(props.dateRange.end).endOf('month').subtract({days: 3})).getTime()
            ? true
            : i < monthArray.length - 1
        )
        .map((month, i) =>
          ({
            text: `${month}`,
            value: month,
            key: month
          })
        );
    monthOptionsArray.push({
      text: 'During the Pandemic**',
      value: 'During the Pandemic**',
      key: 'During the Pandemic**'
    })
    setMonthOptions(monthOptionsArray);
    setSelectedMonth(monthOptionsArray[monthOptionsArray.length - 1].value)
  };

  const createBins = (binningType, binsArray, valueArray, colorArray) => {
    const bins = [];
    binningType === 'quantile' ?
    colorArray.map((color, j) =>
      bins.push({
        top: valueArray[Math.floor(j * valueArray.length / colorArray.length)],
        bottom: valueArray[Math.floor((j + 1) * valueArray.length / colorArray.length) - 1]
      })
    )
    : binningType === 'defined' ?
      binsArray.map((bin, i) =>
        bins.push({
          bottom: i !== 0 ? binsArray[i - 1] : 0,
          top: bin
        })
      )
      : bins.push(null);
    return bins;
  }

    

  const calcStats = data => {
    const valueArray = Object.values(data).filter(a => a > 0).sort((a, b) => a > b ? -1 : 1);
    // console.log(valueArray);
    const max = Math.max(...valueArray);
    const min = Math.min(...valueArray);

    setStats({
      max: max,
      min: min,
      range: max - min
    });

    const bins = createBins(
      'defined', 
      selectedMonth === 'During the Pandemic**' 
        ? [5,20,30,max + 1] 
        : [1,5,10,18],
      valueArray,
      colors
    );
    setBins(bins);
  }

  const handleData = () => {
    const dataObject = {};
    const rawDataObject = {};
    const normalizeData = {};

    [...props.data]
      .filter(item =>
        props.countyFilter !== 999 && props.countyFilter !== '999' ?
          props.countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0')
          : true
      )
      .filter(item =>
        selectedMonth !== 'During the Pandemic**'
          ? moment(item['Filing Date']).format('MMMM YYYY') === selectedMonth
          : new Date(item['Filing Date']) > new Date('4/1/2020')
      )
      .filter(item =>
        selectedMonth === 'During the Pandemic**' && item['COUNTYFP10'] === 121 ? false : true

      )
      .filter(item => 
        props.exclude ?
          props.exclude.counties.includes(item['COUNTYFP10']) &&
          new Date(item['Filing Date']).getTime() > new Date(props.exclude.date).getTime() 
          ? false 
            : true 
            : true
      )
      .map(item =>
        rawDataObject[item['tractID']] = rawDataObject[item['tractID']] ?
          (rawDataObject[item['tractID']] + parseFloat(item[selectedMeasure]))
          : parseFloat(item[selectedMeasure])
      );

    props.normalizeData.map(item => rawDataObject[item['GEOID']] > 0 && item['RentHHs'] ?
      dataObject[item['GEOID']] = rawDataObject[item['GEOID']] * 100 / item['RentHHs']
      : null
    );

    props.normalizeData.map(item => normalizeData[item['GEOID']] = item['RentHHs'])

    calcStats(dataObject);
    setTractData(dataObject);
    setRawTractData(rawDataObject);
  };

  const handleCSVData = () => {
    const dataArray =
      tractData && props.geojson ?
        props.geojson.features
          .filter(feature =>
            props.countyFilter !== 999 && props.countyFilter !== '999' ?
              feature.properties['GEOID'].slice(2, 5) === props.countyFilter.toString().padStart(3, '0') :
              props.counties.includes(feature.properties['GEOID'].slice(2, 5)))
          .filter(feature =>
            rawTractData[feature.properties['GEOID']] &&
            tractData[feature.properties['GEOID']]
          )
          .map(feature =>
            ({
              "TractID": feature.properties['GEOID'],
              "Month": `${selectedMonth}`,
              "Total Eviction Filings": rawTractData[feature.properties['GEOID']],
              "Eviction Filing Rate": Number.parseFloat(tractData[feature.properties['GEOID']] / 100).toPrecision(3)
            })
          ) : null;

    setCSVData(dataArray);
  }

  const countyFIPS = ['13067', '13063', '13089', '13121', '13135']
  const countyBounds = {
    '999': {
      center: [33.77285, -84.33268],
      zoom: 9.8
    },
    '067': {
      center: [33.9132, -84.58030],
      zoom: props.smallScreen ? 10.2 : 11
    },
    '063': {
      center: [33.50533, -84.34112],
      zoom: props.smallScreen ? 10.5 : 11.2
    },
    '121': {
      center: [33.840747, -84.46563],
      zoom: props.smallScreen ? 9.4 : 10
    },
    '135': {
      center: [33.959468, -84.02901],
      zoom: props.smallScreen ? 10 : 10.8
    },
    '089': {
      center: [33.79857, -84.20737],
      zoom: props.smallScreen ? 10.4 : 11
    }
  }

  const CustomTooltip = () => (
    <div className='tooltip-content'>
      <div>
        {selectedMonth !== 'During the Pandemic**' ? 'In ' : ''} <span className='tooltip-data'>{monthOptions.find(month => month.value === selectedMonth).text}</span>
        {/* between <span className='tooltip-data'>{dateRange.start}</span> and <span className='tooltip-data'>{dateRange.end}</span> */}
      </div>
      <div>
        in census tract <span className='tooltip-data'>{hoverID}</span>
      </div>

      <div>
        there {selectedMonth !== 'During the Pandemic**' ? 'were' : 'have been'} <span className='tooltip-data'>{numeral(rawTractData[hoverID]).format('0,0')}</span> total reported eviction filings
        </div>
      <div>
        resulting in an eviction filing rate of <span className='tooltip-data'>{numeral(tractData[hoverID]).format('0.0')}%</span>.
        </div>
    </div>
  );

  const featureStyler = feature => {

    const geoid = feature.properties['GEOID'];
    const value = tractData[geoid];
    let color = null;
    bins.forEach((bin, i) =>
      value < bin.top &&
        value >= bin.bottom ?
        color = colors[i]
        : null
    );

    return ({
      color: color ? color : 'lightgrey',
      weight: 1,
      fillColor: color ? color : 'lightgrey',
      fillOpacity: .65
    })
  };

  const buildingList = () => {
    const array = [];
    props.buildings
      .filter(building => 
        building.filings.filter(filing =>
            moment(filing['filingdate']).valueOf() >= 
            moment('04/01/2020').valueOf()
        ).length >= evictionThreshold
      )
      .forEach(building =>{
        const obj = {
          street: building.street,
          city: building.city,
          zip: building.zip,
          county: building.county,
          tractID: building.tractid,
          'filings since 1/1/2020': building.totalfilings,
          'filings since 4/1/2020': building.pandemicfilings
        };

        building.monthlyfilings.forEach(month =>
          obj[`filings in ${moment(month.date).format('MMM YYYY')}`] = month.count
        )



        // console.log(building) 

        array.push(obj);
      })
    return array;
  }

  useEffect(() => handleData(), [props.countyFilter, selectedMonth]);
  useEffect(() => handleCSVData(), [tractData, props.geojson]);
  useEffect(() => getMonthList(), []);
  return (
    <>
      <LeafletMap
        key={'leaflet-map-' + props.name}
        center={countyBounds[props.countyFilter.toString().padStart(3, '0')].center}
        zoom={countyBounds[props.countyFilter.toString().padStart(3, '0')].zoom}
        maxZoom={18}
        zoomSnap={0.2}
        zoomDelta={0.2}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        // trackResize={true}
      // bounds={null}
      // onViewportChange={e => console.log(e)}
      >
        {props.boundaryGeoJSON ?
          <GeoJSON
            key={'county-boundary' + props.countyFilter}
            data={props.boundaryGeoJSON}
            filter={feature => props.countyFilter !== 999 && props.countyFilter !== '999' ?
              feature.properties['GEOID'] === `13${props.countyFilter.toString().padStart(3, '0')}`
              : countyFIPS.includes(feature.properties['GEOID'])}
          />
          : null
        }
        {props.geojson &&
          tractData &&
          stats ?
          <GeoJSON
            key={`map-layer-${props.name}-${props.countyFilter}-${selectedMonth}`}
            data={props.geojson}
            onAdd={e => e.target.bringToBack()}
            onMouseover={e => e.layer.feature.properties.GEOID 
              ? setHoverID(e.layer.feature.properties.GEOID) 
              : null
            }
            onMouseout={() => setHoverID()}
            onClick={e => e.layer.feature.properties.GEOID 
              ? setHoverID(e.layer.feature.properties.GEOID) 
              : setHoverID()
            }
            filter={feature => props.countyFilter !== 999 && props.countyFilter !== '999' ?
              feature.properties['GEOID'].slice(2, 5) === props.countyFilter.toString().padStart(3, '0') :
              props.counties.includes(feature.properties['GEOID'].slice(2, 5))}
            style={feature => featureStyler(feature)}>
            <Tooltip interactive>
              {
                tractData[hoverID] ? <CustomTooltip /> : <h5>No Data</h5>
              }
            </Tooltip>

          </GeoJSON>
          : <div style={{ zIndex: '99999', color: '#609580', position: 'absolute', bottom: '35vh', width: '100%', textAlign: 'center' }}>
            {/* <h2>Layers Loading...</h2> */}
            <Loader id='loader-box' color='#DC1C13' type='Circles' />
          </div>
        }
        {
          showBuildings
          ? props.buildings
            .filter(building => 
              building.filings.filter(filing =>
                  moment(filing['filingdate']).valueOf() >= 
                  moment('04/01/2020').valueOf()
              ).length >= evictionThreshold
            )
            .map(building => { 
              const monthlyFilings = building.monthlyfilings.map(item =>
                ({  
                  date: moment(item.date).valueOf(),
                  count: item.count
                }))
              // const pandemicRatio = building.pandemicratio;
              return <CircleMarker
                key={`building-${building._id}-${props.countyFilter}`}
                center={[building.latitude, building.longitude]}
                radius={Math.sqrt(building.totalfilings/ Math.PI) * buildingScaler}
                // radius={100}
                color={'rgb(191, 253, 0)'}
                // color={pandemicRatio 
                //   ? colors2[Math.floor((colors2.length - 1) * pandemicRatio)]
                //   : 'lighgrey'}
                fillOpacity={.6}
                weight={1.5}
                
              >
                <Popup>
                  <h5>
                    {building.street.toLowerCase()
                      .split(' ')
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(' ')}
                  </h5>
                  <div>
                    {building.city.toLowerCase()
                      .split(' ')
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(' ')}, GA {building.zip}
                  </div>
                  { 
                    monthlyFilings[0]
                      ? <div className='building-popup-chart'>
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
                              date: moment(item.date).valueOf(),
                              count: item.count
                            }))
                          }
                        >

                          <ReferenceArea 
                            x1={moment('04/01/2020').valueOf()}
                            x2={moment('7/01/2020').valueOf()}
                          >
                            <Label  position='top'>CARES</Label>   
                          </ReferenceArea>
                          <ReferenceArea x1={moment('08/01/2020').valueOf()}>
                            <Label  position='top'>CDC</Label>   
                          </ReferenceArea>
                          <Bar dataKey='count' fill={'red'} />
                          <YAxis width={25}/>
                          <XAxis 
                            dataKey='date' 
                            type='category'
                            scale='time'
                            domain={[
                              moment('1/1/2020').valueOf(),
                              moment(props.dateRange.end).startOf('month').valueOf()
                            ]}
                            tickFormatter={tick => moment(tick).format('M/YY')}
                          />

                        </BarChart>

                      </div>
                      : null
                  
                  }
                  <div className='building-popup-summary'>
                  <span className='building-popup-value'>
                    {building.totalfilings}
                  </span> eviction filings since 1/1/2020 
                  </div>
                  <div className='building-popup-summary'>
                    <span className='building-popup-value'>{
                      building.filings.filter(filing =>
                        moment(filing['filingdate']).valueOf() >= 
                        moment('04/01/2020').valueOf()

                      ).length
                    }
                    </span> eviction filings during the COVID-19 pandemic**
                  </div>
                  {/* <div className='building-popup-summary'>
                  <span className='building-popup-value'>
                    {numeral(pandemicRatio).format('0%')}
                  </span> of the eviction filings in this building since 1/1/2020 where during the pandemic.
                  </div> */}
                  {
                    building.county === '121'
                      ? <div className='popup-data-warning'>
                          <b>***WARNING***</b>
                          <br />
                          <em>
                          The totals for buildings in Fulton County likely represent a significant undercount due to the lack of building-level data since 9/15/2020.  
                          </em>
                        </div>
                      : null
                  }
                  
                </Popup>

              </CircleMarker>
            })
          : null
        }
        <TileLayer
          key={'tile-layer'}
          attribution={'&copy <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'}
          url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'}


        />


      </LeafletMap>

      {legendVisble && props.smallScreen ?
        <div
          id='legend-close-icon'
          onClick={() => setLegendVisible(false)}
        >
          <Icon
            // size='small'
            inverted
            name='close'
          />
        </div> : null

      }
      {
        <div id='building-toggle'>
          <Radio 
          // label='Show Buildings***'
          toggle
          checked={showBuildings}
          onChange={() => setShowBuildings(!showBuildings)} 
          />
          <div className='building-toggle-label'>
            Show Buildings
          </div>
          { showBuildings
          ? <>
              <div className='building-toggle-sublabel'>
                with <Dropdown 
                  inline
                  style={{
                    fontSize: '1.6em',
                    fontWeight: '700'
                  }}
                  value={evictionThreshold}
                  options={[10, 50, 100].map(option =>
                    ({
                      text: option,
                      value: option,
                      key: `threshold-option-${option}`
                    })
                  )}
                  onChange={(e, data) => setEvictionThreshold(data.value)}
                /> 
                or more eviction filings during the COVID-19 pandemic**
              </div>

              {/* <div id='building-symbology-box-label'>
                Filings per building      
              </div>   */}
              <div id='building-symbology-box'>

                {
                  [
                    10,
                    50, 
                    100,
                    200
                  ]
                    // .reverse()
                    // .filter(bin => bin >= evictionThreshold)
                    .map((bin, i) =>
                      <div>
                        <div 
                          style={{
                            width: 2 * Math.sqrt(bin / Math.PI) * buildingScaler,
                            height: 2 * Math.sqrt(bin / Math.PI) * buildingScaler,
                            border: '2px solid rgb(191, 253, 0)',
                            backgroundColor: 'rgba(191, 253, 0, .5)'
                          }}
                          className='building-symbology'
                        />
                        <div>
                          {bin}
                        </div>
                      </div>
                    )
                }
              </div>
            </>
          : null
        }

        </div>
      }
      {legendVisble ?
        <div className='legend'>
          <div id='legend-header'>
            <h3>Eviction Filing Rate*</h3>
          </div>
          <div id='month-selector'>

            {props.smallScreen ?

              <select value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
              >
                {monthOptions ? monthOptions.map(month =>
                  <option
                    key={month.text} value={month.value} id={`option-${month.text}`}>
                    {month.text}</option>
                ) : null}
              </select> :

              <Dropdown
                style={{ float: 'center' }}
                // selection
                inline
                // fluid
                placeholder="Select Month"
                value={selectedMonth}
                options={monthOptions}
                onChange={(e, data) => setSelectedMonth(data.value)}
              />
            }
          </div>
          <div id='symbol-container'>
            <div id='symbol-column'>
              {
                [...colors]
                  .reverse()
                  .map(color =>
                    <div
                      key={`legend-symbol-${color}`}
                      className='legend-symbol'
                      style={{ backgroundColor: color }}
                    />
                  )
              }
              <div
                className='legend-symbol'
                style={{ backgroundColor: 'lightgrey' }}
              />
            </div>
            <div id='symbol-labels'>
              {
                bins ?
                  [...bins]
                    .reverse()
                    .map(bin =>
                      <div
                        key={`legend-label-${bin.bottom}-to-${bin.top}`}
                        className='legend-label'>
                        {`${numeral(bin.bottom).format('0,0')}${bin.bottom === 0 ? '.1' : ''}% to < ${numeral(bin.top).format('0,0')}%`}
                      </div>
                    )
                  : null
              }
              <div className='legend-label'>
                No Data
              </div>

            </div>

          </div>
          <div id='legend-footer'>
            <p><span>*</span>calculated by dividing total filings by the number of renter-occupied housing units</p>
            <p><span>**</span>From 4/1/2020 to the most current update, with the exception of Fulton County where building- and census tract-level data has been unavailable since 9/15/2020.</p>
 
          </div>

        </div> : null
      }
      {!legendVisble && props.smallScreen ?
        <div id='legend-icon'>
          <Icon
            name='list alternate outline'
            size='huge'
            onClick={() => setLegendVisible(true)}
          />
        </div> : null
      }
      {
        csvData ?
          <div id='map-data-export-button'>
            <CSVExportButton
              smallScreen={props.smallScreen}
              csvTitle={
                `Title: ${selectedMonth} Eviction Filings by Census Tracts in ${props.countyInfo.find(item => item.key === props.countyFilter.toString().padStart(3, '0')).text} as of ${props.dateRange ? moment(props.dateRange.end).format('M/D/YYYY') : null}`
                + '\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker'
              }
              csvFilename={`Eviction-Filings-by-Census-Tract-${selectedMonth}-2020-${props.countyInfo.find(item => item.key === props.countyFilter.toString().padStart(3, '0')).text}`}
              data={csvData}
              // data={props.data.filter(item => 

              // )}
              content={'Census Tract Data'}
            />
          </div>
          : null
      }
      {
        props.buildings.filter(building => 
          building.filings.filter(filing =>
              moment(filing['filingdate']).valueOf() >= 
              moment('04/01/2020').valueOf()
          ).length >= evictionThreshold
        )[0] && 
        !props.smallScreen 
          ? <div id='map-building-list-export-button'>
              <CSVExportButton
                // smallScreen={props.smallScreen}
                csvTitle={
                  `Title: List of Buildings in ${props.countyInfo.find(item => item.key === props.countyFilter.toString().padStart(3, '0')).text} with ${evictionThreshold} or eviction filings since 4/1/2020 (as of ${props.dateRange ? moment(props.dateRange.end).format('M/D/YYYY') : null})`
                  + '\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker'
                }
                csvFilename={`ATL-Eviction-Tracker-Builings-List-${evictionThreshold}-plus-filings-${props.countyInfo.find(item => item.key === props.countyFilter.toString().padStart(3, '0')).text}`}
                data={buildingList()}
                // data={props.data.filter(item => 

                // )}
                content={'Building Data'}
              />
            </div>
          : null
      }
    </>
  )
}


export default EvictionMap;