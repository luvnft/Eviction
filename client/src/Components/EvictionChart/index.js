import React, { useState, useEffect } from "react";
import {
  Bar,
  ComposedChart,
  Line,
  Area,
  ReferenceArea,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import TextFormatter from "../../utils/TextFormatter";
import { Button } from "semantic-ui-react";
import CSVExportButton from "../CSVExportButton";
import ChartTooltip from "../ChartTooltip";
import moment from "moment";
import numeral from "numeral";
import Loader from "react-loader-spinner";
import config from "./config";
import utils from "./utils";
import SortByDate from "../../utils/SortByDate";

import "./style.css";

export default (props) => {
  const county = props.county;
  const dateField = config.dateField;
  const indicator1 = config.indicator1;
  const indicator2 = config.indicator2;
  const [chartData, setChartData] = useState();
  const [csvData, setCSVData] = useState();
  const [timeScale, setTimeScale] = useState(config.initTimescale);
  const [brushDomain, setBrushDomain] = useState({});

  useEffect(() => {
    const dataArray = timeScale === 'weekly' 
        ? props.chartDataWeekly.sort((a, b) => SortByDate(a, b, 'FilingWeek'))
        : props.chartDataMonthly.sort((a, b) => SortByDate(a, b, 'FilingMonth'));
    // console.log(dataArray);
    const dataForCSV = dataArray.map((item) =>
      utils.dataObjectForCSV({
        item: item,
        timeScale: timeScale,
        dateField: dateField,
        indicator1: indicator1,
        indicator2: indicator2,
      })
    );
    const brushConfig = {
      start:
        dataArray[
          timeScale === "weekly" ? dataArray.length - 52 : dataArray.length - 12
        ][dateField],
      end: dataArray[dataArray.length - 1][dateField],
    };
    setChartData(dataArray);
    setCSVData(dataForCSV);
    setBrushDomain(brushConfig);
  }, [props.countyFilter, timeScale, props.chartDataMonthly, props.chartDataWeekly]);

  return (
    <div id="chart-responsive-container">
      {chartData ? (
        <ResponsiveContainer
          width={config.dimensions.width}
          height={config.dimensions.height}
        >
          <ComposedChart
            className="barChart"
            data={chartData}
            margin={
              !props.smallScreen ? config.margins : config.smallScreenMargins
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            {config.referenceAreas.map((referenceArea) => (
              <ReferenceArea
                x1={utils.referenceAreaStart(
                  timeScale,
                  brushDomain.start,
                  referenceArea
                )}
                x2={utils.referenceAreaEnd(
                  timeScale,
                  brushDomain.end,
                  referenceArea
                )}
                y1={0}
              >
                <Label position="insideTop">{referenceArea.label}</Label>
              </ReferenceArea>
            ))}
            <XAxis
              // scale='time'
              height={50}
              dataKey={timeScale === 'weekly' ? 'FilingWeek' : 'FilingMonth'}
              angle={
                timeScale === "weekly" ||
                timeScale === "daily" ||
                props.smallScreen
                  ? -45
                  : null
              }
              textAnchor={
                timeScale === "weekly" ||
                timeScale === "daily" ||
                props.smallScreen
                  ? "end"
                  : "middle"
              }
              minTickGap={!props.smallScreen ? -5 : null}
              tick={{ fontSize: props.smallScreen ? 8 : 12 }}
              tickFormatter={(tick) =>
                timeScale === "monthly"
                  ? moment(tick).format(
                      props.smallScreen ? "MMM YYYY" : "MMMM YYYY"
                    )
                  : moment(tick).format("M/D/YY")
              }
            />
            <YAxis 
            
            tickFormatter={(tick) => numeral(tick).format("0,0")} />
            <Tooltip
              content={(obj) =>
                ChartTooltip(obj, {
                  timeScale: timeScale,
                  indicator1: indicator1,
                  indicator2: indicator2,
                  countyFilter: props.countyFilter,
                  county: county,
                })
              }
            />
            <Bar dataKey={'TotalFilings'} stackId="a" fill="#a9a9a9" />
            <Bar dataKey={'AnsweredFilings'} stackId="a" fill="#DC1C13" />
            {/* <Line dataKey="Baseline (Total Filings, 2019)" strokeWidth={2} /> */}
            <Legend
              formatter={(value, entry) => (
                <span style={{ fontSize: props.smallScreen ? "10px" : "14px" }}>
                  {value}
                </span>
              )}
            />
            <Brush
              height={20}
              startIndex={
                timeScale === "weekly"
                  ? chartData.length - 52
                  : chartData.length - 12
              }
              tickFormatter={(index) =>
                chartData[index][dateField]
                  ? moment(chartData[index][dateField]).format(
                      timeScale === "weekly" ? "M/D/YY" : "MMM YYYY"
                    )
                  : ""
              }
              onChange={(data) =>
                setBrushDomain({
                  start: chartData[data.startIndex][dateField],
                  end: chartData[data.endIndex][dateField],
                })
              }
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div style={config.loaderStyle}>
          <h1>Chart is Loading...</h1>
          <Loader
            id="loader-box"
            color={config.loaderStyle.color}
            type={config.loaderStyle.type}
          />
        </div>
      )}

      <div className="button-group-container">
        <Button.Group className="button-group">
          {["weekly", "monthly"].map((button) => (
            <Button
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
            props.smallScreen
              ? "chart-data-export-button-mobile"
              : "chart-data-export-button"
          }
        >
          <CSVExportButton
            smallScreen={props.smallScreen}
            csvTitle={
              `Title: ${timeScale.charAt(0).toUpperCase()}${timeScale.slice(
                1
              )} Eviction Filings for ${county.text} as of ${
                props.dateRange
                  ? moment(props.dateRange.end).format("M/D/YYYY")
                  : null
              }` +
              "\nSource: Atlanta Region Eviction Tracker - https://metroatlhousing.org/atlanta-region-eviction-tracker"
            }
            csvFilename={`${timeScale.charAt(0).toUpperCase()}${timeScale.slice(
              1
            )}-Eviction-Filings-${county.text.toUpperCase()}`}
            data={csvData}
            content={`${timeScale
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")} Filing Data`}
          />
        </div>
      ) : null}
    </div>
  );
};
