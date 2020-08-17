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
import './style.css';
import { csv } from 'd3';

const csvData = '../../Test-data/test-data.csv';

const EvictionChart = (props) => {

  const [caseData, setCaseData] = useState([]);

  useEffect(() => {
    csv(csvData).then((data) => {
      console.log(data);
    }).catch(err => console.log(err))
  }, []);

  

  // console.log(Data);
  // Data.map(() => {

  // })

  const data = [
    {
      fileDate: 'Page A',
      open: 4000,
      closed: 2400,
      amt: 2400,
    },
    {
      fileDate: 'Page B',
      open: 3000,
      closed: 1398,
      amt: 2210,
    },
    {
      fileDate: 'Page C',
      open: 2000,
      closed: 9800,
      amt: 2290,
    },
    {
      fileDate: 'Page D',
      open: 2780,
      closed: 3908,
      amt: 2000,
    },
    {
      fileDate: 'Page E',
      open: 1890,
      closed: 4800,
      amt: 2181,
    },
    {
      fileDate: 'Page F',
      open: 2390,
      closed: 3800,
      amt: 2500,
    },
    {
      fileDate: 'Page G',
      open: 3490,
      closed: 4300,
      amt: 2100,
    },
  ];

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
        data={data}
        margin={{
          top: 40,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fileDate" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        <Legend />
        <Bar dataKey="open" stackId="a" fill="#8884d8" />
        <Bar dataKey="closed" stackId="a" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EvictionChart;
