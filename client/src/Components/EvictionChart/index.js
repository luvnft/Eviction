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
import { csv } from 'd3';
// stylesheet
import './style.css';

const csvData = require('../../Test-data/test-data.csv');

const EvictionChart = (props) => {
  const [caseData, setCaseData] = useState([]);

  useEffect(() => {
    csv(csvData)
      .then((data) => {
        // console.log('data: ', data);
        setCaseData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <ResponsiveContainer
      className="chart-responsive-container"
      width="95%"
      height="100%"
    >
      <BarChart
        className="barChart"
        width={1200}
        height={750}
        data={caseData}
        margin={{
          top: 40,
          right: 30,
          left: 20,
          bottom: 20,
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
  );
};

export default EvictionChart;
