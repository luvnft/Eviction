import React, { useState, useEffect } from 'react';
import {
  // BarChart,
  Bar,
  ComposedChart,
  Line,
  // Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from 'semantic-ui-react';
import CSVExportButton from '../CSVExportButton';
import moment from 'moment';
import numeral from 'numeral';
import Loader from 'react-loader-spinner';

// STYLESHEET
import './style.css';
// CSV TEST-DATA IMPORT


const EvictionChart = props => {

  const sortByDate = (a, b) => {
    var dateA = new Date(a['Filing Date']).getTime();
    var dateB = new Date(b['Filing Date']).getTime();
    return dateA > dateB ? 1 : -1;
  };  

  const [caseData, setCaseData] = useState();
  const [csvData, setCSVData] = useState();
  const [timeScale, setTimeScale] = useState('weekly');
  
  const handleData = () => {
        const dataObject = {};

        props.data
          .sort((a, b) => sortByDate(a, b))
          .filter(item =>
            props.countyFilter !== 999 && 
            props.countyFilter !== '999' ? 
              props.countyFilter === item['COUNTYFP10'] || 
              props.countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0') 
            : true
          )
          .forEach(item => {
            const key = timeScale === 'daily' ? 
                moment(item['Filing Date']).format('M/D/YY') 
              : timeScale === 'weekly' ?
                // moment(item['Filing Date']).isoWeek()
                moment(item['Filing Date']).startOf('week')
              : timeScale === 'monthly' ?
                moment(item['Filing Date']).startOf('month') 
            : null;

            dataObject[key] = {...dataObject[key]}

            dataObject[key]['current'] = dataObject[key]['current'] 
              ? dataObject[key]['current'] + parseFloat(item['Total Filings'])
              : parseFloat(item['Total Filings']);
          });

        props.data2019
          .filter(item =>
            props.countyFilter !== 999 && 
            props.countyFilter !== '999' ? 
              props.countyFilter === item['COUNTYFP10'] || 
              props.countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0') 
            : true
          )
          .forEach(item => {
              const key = item['Filing Date'] ? timeScale === 'daily' ? 
                  moment(item['Filing Date']).format('M/D/YY')
                : timeScale === 'weekly' ?
                  // moment(item['Filing Date']).isoWeek()
                  moment(item['Filing Date']).add(1, 'y').subtract(2, 'd').startOf('week')
                : timeScale === 'monthly' ?
                  moment(item['Filing Date']).add(1, 'y').startOf('month') 
              : null : null;

              // console.log(item);

              dataObject[key] = {...dataObject[key]}

              dataObject[key]['historic'] = dataObject[key]['historic'] ?
              dataObject[key]['historic'] + parseFloat(item['Total Filings'])
              : parseFloat(item['Total Filings']);
            })

        props.data2019
          .filter(item =>
            props.countyFilter !== 999 && 
            props.countyFilter !== '999' ? 
              props.countyFilter === item['COUNTYFP10'] || 
              props.countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0') 
            : true
          )
          .forEach(item => {
              const key = item['Filing Date'] ? timeScale === 'daily' ? 
                  moment(item['Filing Date']).format('M/D/YY')
                : timeScale === 'weekly' ?
                  // moment(item['Filing Date']).isoWeek()
                  moment(item['Filing Date']).add(2, 'y').subtract(4, 'd').startOf('week')
                : timeScale === 'monthly' ?
                  moment(item['Filing Date']).add(2, 'y').startOf('month') 
              : null : null;

            // console.log(item);

            dataObject[key] = {...dataObject[key]}

            dataObject[key]['historic'] = dataObject[key]['historic'] ?
            dataObject[key]['historic'] + parseFloat(item['Total Filings'])
            : parseFloat(item['Total Filings']);
          })


        
            const dataArray = Object.entries(dataObject)
        .filter(([key, value]) => 
          new Date(key).getTime() <= new Date(moment(props.dateRange.end).endOf('week')).getTime()
        )
        .filter(([key, value]) => timeScale === 'monthly' && 
          new Date(props.dateRange.end).getTime() < new Date(moment(props.dateRange.end).endOf('month')).getTime() ?
          new Date(key).getTime() < new Date(moment(props.dateRange.end).startOf('month')).getTime() : true
        )
        .map(([key, value]) =>
          ({
            "Filing Date": key,
            "Total Filings": value.current,
            "Total Filings 2019" : value.historic
          })
        );
        setCaseData(dataArray);
  };

  const timeLabel = 
    timeScale === 'weekly' ? 
    "Week of" 
    : timeScale === 'monthly' ?
      "Month"
      : "Filing Date"

  const handleCSVData = () => 

    caseData ?
      caseData.map(item => 
        ({
          [timeLabel]: moment(item['Filing Date']).format(timeScale === 'monthly' ? 'MMMM YYYY' : 'M/D/YYYY'),
          "Total Filings": item["Total Filings"],
          "Total Filings 2019" : item["Total Filings 2019"]
        })
      ) : null;

  // console.log(csvData);


  useEffect(() => handleData(), [props.countyFilter, timeScale, props.data]);
  useEffect(() => setCSVData(handleCSVData()), [caseData]);

  const county = props.counties.find(county => county.value.toString().padStart(3, '0') === props.countyFilter.toString().padStart(3,'0'));


  const CustomTooltip = ({ active, payload, label }) => {
    // console.log(payload);
    const dateInfo = timeScale === 'weekly' ? 
      <div>
        between <span className='tooltip-data'>{moment(label).format('M/D/YY')}</span> and <span className='tooltip-data'>{moment(label).endOf('week').format('M/D/YY')}</span> 
      </div> : timeScale === 'monthly' ?
        <div>
          in <span className='tooltip-data'>{moment(label).format('MMMM YYYY')}</span>  
        </div> : timeScale === 'daily' ?
          <div>
            on <span className='tooltip-data'>{moment(label).format('dddd, MMMM Do YYYY')}</span>  
          </div> : null;
    return active ?
        <div className='tooltip-content chart-tooltip-content'>
          <div>
            In {props.countyFilter === 999 || props.countyFilter === '999' ? 'the ' : ''} <span className='tooltip-data'>{county.text}</span>
          </div>
          {dateInfo}
          <div>
            there were <span className='tooltip-data'>{payload[0] && payload[1] ? numeral(payload[0].value).format('0,0') : '?'}</span> reported eviction filings
          </div>
          <div>
            compared to <span className='tooltip-data'>{payload[0] && payload[1] ? numeral(payload[1].value).format('0,0') : numeral(payload[0].value).format('0,0')}</span> for the same duration in 2019.
          </div>

        </div>
    : null;
  }
  // console.log(caseData);

  // const CustomLegendText = (value, entry) => {
  //   console.log(value, entry)
  //   return <span style={{fontSize: '14px'}}>{value}</span>
  // }
// const CustomTick = obj => <em>{moment(obj.tick).format('M/D')}</em>


  return (
    <>
      {/* <Dropdown
        className="icon chart-dropdown"
        placeholder="County Options"
        fluid
        // multiple
        selection
        value={countyFilter}
        options={countyOptions}
        onChange={(e, data) => setCountyFilter(data.value)}
      /> */}
      {caseData ?

      <ResponsiveContainer
        className="chart-responsive-container"
        width="95%"
        height="85%"
      >
        <ComposedChart
          className="barChart"
          data={caseData}
          margin={{
            top: 30,
            right: props.smallScreen ? 30 : 20,
            left: 10,
            bottom: 30,
          }}
        > 
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={"Filing Date"}
            angle={ timeScale === 'weekly' || 
              timeScale === 'daily' ||
              props.smallScreen
                ? -45 
                : null
            } 
            textAnchor={timeScale === 'weekly' || 
              timeScale === 'daily' ||
              props.smallScreen
                ? 'end' 
                : 'middle'
            }
            // scale={'time'}
            // type={'number'}
            minTickGap={!props.smallScreen ? -5 : null}
            tick={{fontSize: props.smallScreen ? 10 : 12}}
            tickFormatter={tick => 
              timeScale === 'monthly' ? 
                moment(tick).format(props.smallScreen ? 'MMM YYYY' : 'MMMM YYYY') 
              // : <CustomTick />
                : moment(tick).format('M/D/YY')
            }
          />
          {/* <XAxis dataKey="Month" /> */}
          <YAxis
            tickFormatter={tick => numeral(tick).format('0,0')}
          />
          {/* <Brush /> */}
          <Tooltip 
            content={ <CustomTooltip />}
          />
          <Bar dataKey="Total Filings" fill="#DC1C13" />
          <Line 
            dataKey="Total Filings 2019"
            strokeWidth={2} 
            // fill="#DC1C13"
            // dot={false}
            // strokeDasharray={'5 5'}
            // legendType='circle' 
          />
          {/* <Bar dataKey="tractID" stackId="a" fill="#82ca9d" /> */}  
          <Legend 
            formatter={(value,entry) =>
              props.smallScreen ?
                <span style={{fontSize: '14px'}}>{value}</span> 
              : value
            }
          />

        </ComposedChart>
        

      </ResponsiveContainer>
       : <div style={{zIndex: '99999', color: '#DC1C13', position: 'absolute', bottom: '50vh', width: '100%', textAlign: 'center'}}>
          <h1>Chart is Loading...</h1>
          <Loader id='loader-box' color='#DC1C13' type='Circles' />
       </div>
      }

      <div className="button-group-container">
        <Button.Group className="button-group">
          {/* <Button 
            active={timeScale === 'daily' ? true : false}
            onClick={() => setTimeScale('daily')}
          >Daily</Button> */}
          <Button 
            active={timeScale === 'weekly' ? true : false}
            onClick={() => setTimeScale('weekly')}

          >Weekly</Button>
          <Button 
            active={timeScale === 'monthly' ? true : false}
            onClick={() => setTimeScale('monthly')}

          >Monthly</Button>
        </Button.Group>
      </div>
      {
            csvData ?
                <div id={props.smallScreen ? 'chart-data-export-button-mobile' : 'chart-data-export-button'}>
                    <CSVExportButton
                        smallScreen={props.smallScreen} 
                        csvTitle={
                          `Title: ${timeScale.charAt(0).toUpperCase()}${timeScale.slice(1)} Eviction Filings for ${county.text} as of ${props.dateRange ? moment(props.dateRange.end).format('M/D/YYYY') : null}`
                          + '\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker'
                        }
                        csvFilename={`${timeScale.charAt(0).toUpperCase()}${timeScale.slice(1)}-Eviction-Filings-${county.text.toUpperCase()}`}
                        data={csvData}
                        content={'Download Data'}
                    />
                </div>
            : null
        } 

    </>
  );
};

export default EvictionChart;
