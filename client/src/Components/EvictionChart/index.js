import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ResponsiveContainer,
} from 'recharts';
import { Dropdown } from 'semantic-ui-react';
import { csv } from 'd3';
// STYLESHEET
import './style.css';
// CSV TEST-DATA IMPORT
const csvData = require('../../Test-data/test-data.csv');

const EvictionChart = (props) => {
  // case data for csv test cases;
  const [caseData, setCaseData] = useState([]);
  // filter options;
  const [chartFilter, setChartFilter] = useState('ALL');
  console.log('chartFilter: ', chartFilter);

  useEffect(() => {
    csv(csvData)
      .then((data) => {
        // console.log('data: ', data);
        setCaseData(data);
      })
      .catch((err) => console.log(err));
  }, []);


  const applyFilter = (props) => {
    switch (chartFilter) {
      case "All" :
        caseData.filter()
      case "DAILY":
      case "MONTHLY":
    }
  }

  return (
    <>
      <Dropdown
        text="Filter"
        icon="filter"
        floating
        labeled
        button
        className="icon chart-dropdown"
      >
        <Dropdown.Menu>
          <Dropdown.Header icon="filter" content="Filter by date selection" />
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              setChartFilter('DAILY');
            }}
          >
            DAILY
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setChartFilter('MONTHLY');
            }}
          >
            MONTHLY
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setChartFilter('ALL');
            }}
          >
            ALL DATA
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ResponsiveContainer
        className="chart-responsive-container"
        width="95%"
        height="90%"
      >
        <BarChart
          className="barChart"
          width={1200}
          height={750}
          data={caseData}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="FILE DATE" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />

          <Legend />

          <Bar dataKey="OPEN" stackId="a" fill="#8884d8" />
          <Bar dataKey="CLOSED" stackId="a" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default EvictionChart;
