import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Bar,
  ComposedChart,
  Line,
  // Area,
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
import ChartTooltip from '../ChartTooltip';
import moment from 'moment';
import numeral from 'numeral';
import { Circles } from 'react-loader-spinner';
import config from './config';
import utils from './utils';
import SortByDate from '../../utils/SortByDate';

import './style.css';

const EvictionChart = ({
  county,
  chartDataWeekly,
  chartDataMonthly,
  dateRange,
  countyFilter,
  smallScreen,
  referenceAreas
}) => {
  const [chartData, setChartData] = useState();
  const [csvData, setCSVData] = useState();
  const [timeScale, setTimeScale] = useState(config.initTimescale);
  const [brushDomain, setBrushDomain] = useState({});

  const dateField = timeScale === 'weekly' ? 'FilingWeek' : 'FilingMonth';

  const addBarDifferenceField = arr =>
    arr?.map(item => ({
      ...item,
      BarDifference: item.TotalFilings - item.AnsweredFilings
    }));

  useEffect(() => {
    const dataArray =
      timeScale === 'weekly'
        ? chartDataWeekly?.sort((a, b) => SortByDate(a, b, 'FilingWeek'))
        : chartDataMonthly?.sort((a, b) => SortByDate(a, b, 'FilingMonth'));
    // .filter((month, i) =>
    //   new Date(dateRange.end).getTime() > new Date(moment(dateRange.end).endOf('month').subtract({days: 3})).getTime()
    //     ? true
    //     : i < chartDataMonthly.length - 1
    // );

    const dataForCSV = dataArray.map(item =>
      utils.dataObjectForCSV({
        item: item,
        timeScale: timeScale,
        dateField: dateField,
        totalFilingsIndicator: config.totalFilingsKey,
        answeredFilingsIndicator: config.answeredFilingsKey,
        baselineIndicator: config.baselineKey
      })
    );
    const brushConfig = {
      start:
        dataArray?.[
          timeScale === 'weekly' ? dataArray.length - 52 : dataArray.length - 12
        ][dateField],
      end: dataArray?.[dataArray.length - 1][dateField]
    };

    setChartData(addBarDifferenceField(dataArray));
    setCSVData(dataForCSV);
    setBrushDomain(brushConfig);
  }, [
    countyFilter, 
    timeScale, 
    chartDataMonthly, 
    chartDataWeekly
  ]);

  return (
    <div id='chart-responsive-container'>
      {chartData ? (
        <ResponsiveContainer
          width={config.dimensions.width}
          height={config.dimensions.height}
        >
          <ComposedChart
            className='barChart'
            data={chartData}
            margin={!smallScreen ? config.margins : config.smallScreenMargins}
          >
            <CartesianGrid strokeDasharray='3 3' />
            {referenceAreas
              ? referenceAreas.map(referenceArea =>
                (timeScale === 'weekly' && referenceArea.weekly) ||
                  (timeScale === 'monthly' && referenceArea.monthly) ? (
                    <ReferenceArea
                      key={`${referenceArea.label}-ref-area`}
                      x1={utils.referenceAreaDate({
                        type: 'start',
                        timeScale: timeScale,
                        brushDomainDate: brushDomain.start,
                        config: referenceArea,
                        county: county.key
                      })}
                      x2={utils.referenceAreaDate({
                        type: 'end',
                        timeScale: timeScale,
                        brushDomainDate: brushDomain.end,
                        config: referenceArea,
                        county: county.key
                      })}
                      y1={0}
                      fill={referenceArea.color}
                    >
                      <Label position='insideTop' fontSize={referenceArea.size}>
                        {referenceArea.label}
                      </Label>
                    </ReferenceArea>
                  ) : null
              )
              : null}
            <XAxis
              // scale='time'
              height={50}
              dataKey={timeScale === 'weekly' ? 'FilingWeek' : 'FilingMonth'}
              angle={
                timeScale === 'weekly' || timeScale === 'daily' || smallScreen
                  ? -45
                  : null
              }
              textAnchor={
                timeScale === 'weekly' || timeScale === 'daily' || smallScreen
                  ? 'end'
                  : 'middle'
              }
              minTickGap={!smallScreen ? -5 : null}
              tick={{ fontSize: smallScreen ? 8 : 12 }}
              tickFormatter={tick =>
                timeScale === 'monthly'
                  ? moment(tick).format(smallScreen ? 'MMM YYYY' : 'MMMM YYYY')
                  : moment(tick).format('M/D/YY')
              }
            />
            <YAxis tickFormatter={tick => numeral(tick).format('0,0')} />
            <Tooltip
              content={obj =>
                ChartTooltip(obj, {
                  timeScale: timeScale,
                  totalFilingsIndicator: config.totalFilingsKey,
                  answeredFilingsIndicator: config.answeredFilingsKey,
                  baselineIndicator: config.baselineKey,
                  countyFilter: countyFilter,
                  county: county
                })
              }
            />

            <Bar
              dataKey={'AnsweredFilings'}
              name='Answered Filings'
              stackId='a'
              fill='#a9a9a9'
            />

            <Bar
              dataKey={'BarDifference'}
              name='Total Filings'
              stackId='a'
              fill='#DC1C13'
            />

            <Line
              dataKey='BaselineFilings'
              name='Baseline (Total Filings, 2019)'
              strokeWidth={2}
            />

            <Legend
              formatter={value => (
                <span style={{ fontSize: smallScreen ? '10px' : '14px' }}>
                  {value}
                </span>
              )}
            />
            <Brush
              height={20}
              travellerWidth={smallScreen ? 15 : 10}
              startIndex={
                timeScale === 'weekly'
                  ? chartData?.length - 52
                  : chartData?.length - 12
              }
              tickFormatter={index =>
                chartData?.[index][dateField]
                  ? moment(chartData?.[index][dateField]).format(
                    timeScale === 'weekly' ? 'M/D/YY' : 'MMM YYYY'
                  )
                  : ''
              }
              onChange={data =>{
                // console.log(chartData[data.startIndex][dateField]);
                setBrushDomain({
                  start: chartData?.[data.startIndex][dateField],
                  end: chartData?.[data.endIndex][dateField]
                })}
              }
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className='spinner-container' style={config.loaderStyle}>
          <h1>Chart is Loading...</h1>
          <Circles
            id='loader-box'
            color={config.loaderStyle.color}
            type={config.loaderStyle.type}
          />
        </div>
      )}

      <div className='button-group-container'>
        <Button.Group className='button-group'>
          {['weekly', 'monthly'].map(button => (
            <Button
              key={`${button}-btn`}
              active={timeScale === button ? true : false}
              onClick={() => setTimeScale(button)}
            >
              {TextFormatter.firstCharToUpper(button)}
            </Button>
          ))}
        </Button.Group>
      </div>
      {csvData ? (
        <div
          id={
            smallScreen
              ? 'chart-data-export-button-mobile'
              : 'chart-data-export-button'
          }
        >
          <CSVExportButton
            smallScreen={smallScreen}
            csvTitle={
              `Title: ${timeScale.charAt(0).toUpperCase()}${timeScale.slice(
                1
              )} Eviction Filings for ${county.text} as of ${
                dateRange ? moment(dateRange.end).format('M/D/YYYY') : null
              }` +
              '\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker'
            }
            csvFilename={`${timeScale.charAt(0).toUpperCase()}${timeScale.slice(
              1
            )}-Eviction-Filings-${county.text.toUpperCase()}`}
            data={csvData}
            content={`${timeScale
              .toLowerCase()
              .split(' ')
              .map(s => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ')} Filing Data`}
          />
        </div>
      ) : null}
    </div>
  );
};

EvictionChart.propTypes = {
  county: PropTypes.object,
  chartDataWeekly: PropTypes.array,
  chartDataMonthly: PropTypes.array,
  dateRange: PropTypes.object,
  countyFilter: PropTypes.number,
  smallScreen: PropTypes.bool,
  referenceAreas: PropTypes.array
};

export default EvictionChart;