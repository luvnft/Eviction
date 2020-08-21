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
import { Dropdown, Button, Container } from 'semantic-ui-react';
import { csv } from 'd3';
import moment from 'moment';
import API from '../../utils/API';
// STYLESHEET
import './style.css';
// CSV TEST-DATA IMPORT


const EvictionChart = props => {

    // console.log(props.data);

// function to sort by date;
    const sortByDate = (a, b) => {
        var dateA = new Date(a['File.Date']).getTime();
        var dateB = new Date(b['File.Date']).getTime();
        return dateA > dateB ? 1 : -1;
    };
  // case data for csv test cases;
  const [caseData, setCaseData] = useState();
  const [countyFilter, setCountyFilter] = useState(63);
  const [timeScale, setTimeScale] = useState('daily');
  // const [selectedCounties, setSelectedCounties] = useState([63]);
  console.log('countyFilter: ', countyFilter);

  useEffect(() => {
    // csv(csvData)
    //   .then((data) => {
        // console.log('data: ', data);
        const dataObject = {};

        // date array
        let getDateArray = (start, end) => {

          let arr = new Array(),
            dt = new Date(start),
            ed = new Date(end);

          console.log(dt);

          while (dt <= ed) {
            arr.push(new Date(dt));
            dt.setDate(dt.getDate() + 1);
          }

          console.log(arr)

          return arr;

        }

        getDateArray("2020-01-01", "2020-08-14").map(date => 
            timeScale === 'daily' ? 
              dataObject[moment(date).format('M/D/YY')] = 0
            : null
          );
        
        // console.log(props.data);  

        props.data
          .sort((a, b) => sortByDate(a, b))
          .filter(item =>
            countyFilter === item['COUNTYFP10'])
          .map(item => {
            const key = timeScale === 'daily' ? 
                item['File.Date'] 
              : timeScale === 'weekly' ?
                moment(item['File.Date']).week() 
              : timeScale === 'monthly' ?
                moment(item['File.Date']).format('MMM') 
            : null;

            // item['Count'] !== '' ?
            dataObject[key] = dataObject[key] ?
              dataObject[key] + parseFloat(item['Count'])
              : parseFloat(item['Count']);
          });

        // console.log(dataObject);
        // const dataArray = 
        const dataArray = Object.entries(dataObject).map(([key, value]) =>
          ({
            "File.Date": key,
            "Count": value
          })
        );

        console.log(dataArray);
        setCaseData(dataArray);
    //   })
    //   .catch((err) => console.log(err))
  }, [countyFilter, timeScale]);

  // console.log(`caseData: ${caseData}`);

  const countyOptions = [
    { key: '063', text: 'Clayton County', value: 63 },
    { key: '067', text: 'Cobb County', value: 67 },
    { key: '089', text: 'Dekalb County', value: 89 },
    { key: '121', text: 'Fulton County', value: 121 },
    { key: '135', text: 'Gwinnett County', value: 135 },
  ];

  return (
    <>
      <Dropdown
        className="icon chart-dropdown"
        placeholder="County Options"
        fluid
        // multiple
        selection
        value={countyFilter}
        options={countyOptions}
        onChange={(e, data) => setCountyFilter(data.value)}
      />

      <ResponsiveContainer
        className="chart-responsive-container"
        width="95%"
        height="85%"
      >
        <BarChart
          className="barChart"
          data={caseData}
          margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="File.Date" />
          {/* <XAxis dataKey="Month" /> */}
          <YAxis dataKey="Count"/>
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
          {/* <Legend /> */}
          <Bar dataKey="Count" stackId="a" fill="#8884d8" />
          {/* <Bar dataKey="tractID" stackId="a" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>

      <Container className="button-group-container">
        <Button.Group className="button-group">
          <Button 
            active={timeScale === 'daily' ? true : false}
            onClick={() => setTimeScale('daily')}
          >Daily</Button>
          <Button 
            active={timeScale === 'weekly' ? true : false}
            onClick={() => setTimeScale('weekly')}

          >Weekly</Button>
          <Button 
            active={timeScale === 'monthly' ? true : false}
            onClick={() => setTimeScale('monthly')}

          >Monthly</Button>
        </Button.Group>
      </Container>
    </>
  );
};

export default EvictionChart;
