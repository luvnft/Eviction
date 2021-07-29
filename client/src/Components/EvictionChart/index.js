import React, { useState, useEffect } from 'react';
import {
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
import TextFormatter from '../../utils/TextFormatter';
import { Button } from 'semantic-ui-react';
import CSVExportButton from '../CSVExportButton';
import moment from 'moment';
import numeral from 'numeral';
import Loader from 'react-loader-spinner';
// import SortByDate from '../../utils/SortByDate';
import config from './config';
import utils from './utils';
import './style.css';

const EvictionChart = props => {

  const [caseData, setCaseData] = useState();
  const [csvData, setCSVData] = useState();
  const [timeScale, setTimeScale] = useState('weekly');
  const [brushDomain, setBrushDomain] = useState({});
  const dateField = config.dateField;
  const indicator1 = config.indicator1;
  const indicator2 = config.indicator2;
  const county = props.counties.find(county => 
    county.value.toString().padStart(3, '0') === 
    props.countyFilter.toString().padStart(3,'0')
  );
  
  const handleData = () => {
      const dataArray = utils.dataFormattedForChart(
        props.data,
        dateField,
        props.dateRange.end,
        props.countyFilter,
        timeScale,
        indicator1,
        indicator2,
        props.data2019
      )

      setCaseData(dataArray);
      setBrushDomain({
        start: dataArray[timeScale === 'weekly' 
          ? dataArray.length - 52 
          : dataArray.length - 12][dateField],
        end: dataArray[dataArray.length - 1][dateField]
      })
  };

  const handleCSVData = () => 
    caseData ?
      caseData.map(item => 
        utils.dataObjectForCSV(item, timeScale, dateField, indicator1, indicator2 )
      ) : null;

  useEffect(() => handleData(), [props.countyFilter, timeScale, props.data]);
  useEffect(() => setCSVData(handleCSVData()), [caseData]);

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

    const totalFilings = info[indicator1] && info[indicator2] ? numeral(info[indicator1] + info[indicator2]).format('0,0') : '?';
    const totalAnswers = info[indicator2] ? numeral(info[indicator2]).format('0,0') : '?';
    const answerRate = info[indicator1] && info[indicator2] ? numeral(info[indicator2]/(info[indicator1] + info[indicator2])).format('0.0%') : '?';
    const total2019 = info['Baseline (Total Filings, 2019)'] ? numeral(info['Baseline (Total Filings, 2019)']).format('0,0') : '?';

    return active ?
        <div className='tooltip-content chart-tooltip-content'>
          <div>
            In {props.countyFilter === 999 || props.countyFilter === '999' ? 'the ' : ''} <span className='tooltip-data'>{county.text}</span> {dateInfo}, there were <span className='tooltip-data'>{totalFilings}</span> reported eviction filings of which <span className='tooltip-data'>{totalAnswers} ({answerRate})</span> have been answered. In comparison, there were <span className='tooltip-data'>{total2019}</span> filings for the same duration in 2019.
          </div>

        </div>
    : null;
  }

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
            <Label  position='insideTop'>
              CARES Act Moratorium
            </Label>
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
            y1={0}
          >
            <Label  position='insideTop'>
              CDC Moratorium
            </Label>
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
            minTickGap={!props.smallScreen ? -5 : null}
            tick={{fontSize: props.smallScreen ? 8 : 12}}
            tickFormatter={tick => 
              timeScale === 'monthly' 
                ? moment(tick).format(props.smallScreen ? 'MMM YYYY' : 'MMMM YYYY') 
                : moment(tick).format('M/D/YY')
            }
          />
          <YAxis tickFormatter={tick => numeral(tick).format('0,0')} />
          <Tooltip 
            content={ 
            // ChartTooltip
            <CustomTooltip />
            } 
          />
          <Bar dataKey={indicator2} stackId='a' fill="#a9a9a9" />
          <Bar dataKey={indicator1} stackId='a' fill="#DC1C13" />
          <Line dataKey="Baseline (Total Filings, 2019)" strokeWidth={2} />
          <Legend 
            formatter={(value,entry) =>
                <span style={{fontSize: props.smallScreen ? '10px' : '14px'}}>
                  {value}
                </span> 
            }
          />
          <Brush
            height={20} 
            startIndex={timeScale === 'weekly' 
              ? caseData.length - 52 
              : caseData.length - 12
            }
            tickFormatter={index =>  
              caseData[index][dateField] 
                ? moment(caseData[index][dateField])
                    .format(timeScale === 'weekly' ? 'M/D/YY' : 'MMM YYYY' )
                : ''
            }
            onChange={data => setBrushDomain({
              start: caseData[data.startIndex][dateField],
              end: caseData[data.endIndex][dateField]
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

        {
          ['weekly', 'monthly'].map(button =>
            <Button 
              active={timeScale === button ? true : false}
              onClick={() => setTimeScale(button)}
            >
              {TextFormatter.firstCharToUpper(button)}
            </Button>          
          )
        }
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