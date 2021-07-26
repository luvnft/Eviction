import React, { useState, useEffect } from 'react';
import {
  // BarChart,
  Bar,
  ComposedChart,
  Line,
  ReferenceArea,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
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
  const [brushDomain, setBrushDomain] = useState({})
  
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
              
            dataObject[key]['answered'] = dataObject[key]['answered'] 
              ? dataObject[key]['answered'] + parseFloat(item['Answered Filings'])
              : parseFloat(item['Answered Filings']); 

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
            const key = item['Filing Date'] 
              ? timeScale === 'daily' 
                ? moment(item['Filing Date']).format('M/D/YY')
                : timeScale === 'weekly' 
                  ? moment(item['Filing Date']).add(1, 'y').subtract(2, 'd').startOf('week')
                  : timeScale === 'monthly' 
                    ? moment(item['Filing Date']).add(1, 'y').startOf('month') 
                    : null 
              : null;

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

            dataObject[key] = {...dataObject[key]}

            dataObject[key]['historic'] = dataObject[key]['historic'] ?
            dataObject[key]['historic'] + parseFloat(item['Total Filings'])
            : parseFloat(item['Total Filings']);
          })

      const dataArray = Object.entries(dataObject)
        .filter(([key, value]) => 
          new Date(key).getTime() <= new Date(moment(props.dateRange.end).endOf('week')).getTime()
        )
        .filter(([key, value]) => 
          timeScale === 'monthly' &&
          new Date(props.dateRange.end).getTime() < new Date(moment(props.dateRange.end).endOf('month').subtract({days: 2})).getTime()
            ? new Date(key).getTime() !== new Date(moment(props.dateRange.end).startOf('month')).getTime()  
            : true
        )
        .map(([key, value]) =>
          ({
            "Filing Date": moment(key).format('MM/DD/YYYY'),
            "Total Filings": (value.current - value.answered) || null,
            "Baseline (Total Filings, 2019)" : value.historic ,
            "Total Answered Filings": value.answered || null
          })
        );
        setCaseData(dataArray);
        setBrushDomain({
          start: dataArray[timeScale === 'weekly' 
            ? dataArray.length - 52 
            : dataArray.length - 12]['Filing Date'],
          end: dataArray[dataArray.length - 1]['Filing Date']
        })
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
          "Total Filings": item["Total Filings"] + item["Total Answered Filings"],
          "Total Answers": item["Total Answered Filings"],
          "Answer Rate": item["Total Answered Filings"]/(item["Total Filings"] + item["Total Answered Filings"]),
          "Baseline (Total Filings, 2019)" : item["Baseline (Total Filings, 2019)"]
        })
      ) : null;

  // console.log(caseData);


  useEffect(() => handleData(), [props.countyFilter, timeScale, props.data]);
  useEffect(() => setCSVData(handleCSVData()), [caseData]);

  const county = props.counties.find(county => county.value.toString().padStart(3, '0') === props.countyFilter.toString().padStart(3,'0'));


  const CustomTooltip = ({ active, payload, label }) => {
    const info = payload[0] ? payload[0].payload : {}; 
    const dateInfo = timeScale === 'weekly' ? 
      <span>
        between <span className='tooltip-data'>{moment(label).format('M/D/YY')}</span> and <span className='tooltip-data'>{moment(label).endOf('week').format('M/D/YY')}</span> 
      </span> : timeScale === 'monthly' ?
        <span>
          in <span className='tooltip-data'>{moment(label).format('MMMM YYYY')}</span>  
        </span> : timeScale === 'daily' ?
          <span>
            on <span className='tooltip-data'>{moment(label).format('dddd, MMMM Do YYYY')}</span>  
          </span> : null;

    // const totalFilings = payload[0] && payload[1] ? numeral(payload[0].value + payload[1].value).format('0,0') : '?';
    // const totalAnswers = payload[0] ? numeral(payload[0].value).format('0,0') : '?';
    // const answerRate = payload[0] && payload[1] ? numeral(payload[0].value/(payload[0].value + payload[1].value)).format('0.0%') : '?';
    // const total2019 = payload[2] ? numeral(payload[2].value).format('0,0') : '?';

    const totalFilings = info['Total Filings'] && info['Total Answered Filings'] ? numeral(info['Total Filings'] + info['Total Answered Filings']).format('0,0') : '?';
    const totalAnswers = info['Total Answered Filings'] ? numeral(info['Total Answered Filings']).format('0,0') : '?';
    const answerRate = info['Total Filings'] && info['Total Answered Filings'] ? numeral(info['Total Answered Filings']/(info['Total Filings'] + info['Total Answered Filings'])).format('0.0%') : '?';
    const total2019 = info['Baseline (Total Filings, 2019)'] ? numeral(info['Baseline (Total Filings, 2019)']).format('0,0') : '?';

    

    return active ?
        <div className='tooltip-content chart-tooltip-content'>
          <div>
            In {props.countyFilter === 999 || props.countyFilter === '999' ? 'the ' : ''} <span className='tooltip-data'>{county.text}</span> {dateInfo}, there were <span className='tooltip-data'>{totalFilings}</span> reported eviction filings of which <span className='tooltip-data'>{totalAnswers} ({answerRate})</span> have been answered. In comparison, there were <span className='tooltip-data'>{total2019}</span> filings for the same duration in 2019.
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
  // console.log(caseData);
  // console.log(brushDomain);

  // console.log(brushDomain);
  // console.log(caseData);
  return (
    <div id="chart-responsive-container">
      {caseData ?

      <ResponsiveContainer
        width="95%"
        height="90%"
      >
        <ComposedChart
          className="barChart"
          data={caseData}
          margin={{
            top: 40,
            right: props.smallScreen ? 40 : 60,
            left: props.smallScreen ? 40 : 80,
            bottom: 30,
          }}
        > 
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceArea
            x1={timeScale === 'weekly' 
              ? new Date(brushDomain.start).getTime() < new Date('03/29/2020').getTime() 
                ?  '03/29/2020'
                : null
              : new Date(brushDomain.start).getTime() < new Date('04/01/2020').getTime() 
                ? '04/01/2020'
                : null
                            
            } 
            x2={timeScale === 'weekly'
              ? new Date(brushDomain.end).getTime() > new Date('07/26/2020').getTime() 
                ?  '07/26/2020'
                : null
              : new Date(brushDomain.end).getTime() > new Date('08/01/2020').getTime() 
                ?  '08/01/2020'
                : null
            } 
            y1={0}
          >
            <Label  position='insideTop'>CARES Act Moratorium</Label>
          </ReferenceArea>
          <ReferenceArea 
            x1={timeScale === 'weekly' 
              ? new Date(brushDomain.start).getTime() < new Date('08/30/2020').getTime() 
                ? '08/30/2020'
                : null
              : new Date(brushDomain.start).getTime() < new Date('09/01/2020').getTime() 
                ? '09/01/2020'
                : null
            } 
            // x2={

            // }
            y1={0}
          >
            <Label  position='insideTop'>CDC Moratorium</Label>
          </ReferenceArea>
          <XAxis
            height={50} 
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
            tick={{fontSize: props.smallScreen ? 8 : 12}}
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
          <Bar dataKey="Total Answered Filings" stackId='a' fill="#a9a9a9" />

          <Bar dataKey="Total Filings" stackId='a' fill="#DC1C13" />


          <Line 
            dataKey="Baseline (Total Filings, 2019)"
            strokeWidth={2} 
            // fill="#DC1C13"
            // dot={false}
            // strokeDasharray={'5 5'}
            // legendType='circle' 
          />
          {/* <Bar dataKey="tractID" stackId="a" fill="#82ca9d" /> */}  
          <Legend 
            formatter={(value,entry) =>
                <span style={{fontSize: props.smallScreen ? '10px' : '14px'}}>
                  {value}
                </span> 
            }
          />
          <Brush
            // y={10}
            height={20} 
            startIndex={timeScale === 'weekly' 
              ? caseData.length - 52 
              : caseData.length - 12
            }
            tickFormatter={index =>  
              caseData[index]['Filing Date'] 
                ? moment(caseData[index]['Filing Date'])
                    .format(timeScale === 'weekly' ? 'M/D/YY' : 'MMM YYYY' )
                : ''
            }
            onChange={data => setBrushDomain({
              start: caseData[data.startIndex]['Filing Date'],
              end: caseData[data.endIndex]['Filing Date']
            })}
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
                        content={`${timeScale.toLowerCase()
                          .split(' ')
                          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                          .join(' ')} Filing Data`}
                    />
                </div>
            : null
        } 

    </div>
  );
};

export default EvictionChart;