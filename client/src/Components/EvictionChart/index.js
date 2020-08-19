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
import { Dropdown, Button } from 'semantic-ui-react';
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

  const countyOptions = [
    { key: '063', text: 'Clayton County', value: '63' },
    { key: '067', text: 'Cobb County', value: '67' },
    { key: '089', text: 'Dekalb County', value: '89' },
    { key: '121', text: 'Fulton County', value: '121' },
    { key: '135', text: 'Gwinnett County', value: '135' },
  ];

  return (
    <>
      {/* <Dropdown
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
              setChartFilter('DAILY DATA');
            }}
          >
            DAILY DATA
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setChartFilter('MONTHLY DATA');
            }}
          >
            MONTHLY DATA
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setChartFilter('ALL DATA');
            }}
          ></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}

      <Dropdown
        className="icon chart-dropdown"
        placeholder="County Options"
        fluid
        multiple
        selection
        options={countyOptions}
      />

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
      <Button.Group className="button-group">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </Button.Group>
    </>
  );
};

export default EvictionChart;
