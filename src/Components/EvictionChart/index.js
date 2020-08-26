import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  // Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Button } from 'semantic-ui-react';
import moment from 'moment';
import numeral from 'numeral';
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
  // const [countyFilter, setCountyFilter] = useState(63);
  const [timeScale, setTimeScale] = useState('weekly');
  // const [selectedCounties, setSelectedCounties] = useState([63]);
  // console.log('countyFilter: ', countyFilter);

  useEffect(() => {
    // csv(csvData)
    //   .then((data) => {
        // console.log('data: ', data);
        const dataObject = {};

        // date array
        // let getDateArray = (start, end) => {

        //   let arr = [],
        //     dt = new Date(start),
        //     ed = new Date(end);

        //   // console.log(dt);

        //   while (dt <= ed) {
        //     arr.push(new Date(dt));
        //     dt.setDate(dt.getDate() + 1);
        //   }

        //   // console.log(arr)

        //   return arr;

        // }

        // getDateArray("2020-01-01", "2020-08-14").map(date => 
        //     timeScale === 'daily' ? 
        //       dataObject[moment(date).format('M/D/YY')] = 0
        //     : null
        //   );
        
        props.data
          .sort((a, b) => sortByDate(a, b))
          .filter(item =>
            props.countyFilter !== 999 ? 
              props.countyFilter === item['COUNTYFP10'] 
            : true)
          .map(item => {
            const key = timeScale === 'daily' ? 
                item['File.Date'] 
              : timeScale === 'weekly' ?
                moment(item['File.Date']).startOf('week')
              : timeScale === 'monthly' ?
                moment(item['File.Date']).startOf('month') 
            : null;

            dataObject[key] = dataObject[key] ?
              dataObject[key] + parseFloat(item['Total Filings'])
              : parseFloat(item['Total Filings']);
          });

        const dataArray = Object.entries(dataObject).map(([key, value]) =>
          ({
            "File.Date": key,
            "Total Filings": value
          })
        );
        setCaseData(dataArray);
  }, [props.countyFilter, timeScale]);

  // console.log(`caseData: ${caseData}`);

  // const countyOptions = [
  //   { key: '999', text: 'All Five Counties', value: 999 },
  //   { key: '063', text: 'Clayton County', value: 63 },
  //   { key: '067', text: 'Cobb County', value: 67 },
  //   { key: '089', text: 'Dekalb County', value: 89 },
  //   { key: '121', text: 'Fulton County', value: 121 },
  //   { key: '135', text: 'Gwinnett County', value: 135 },

  // ];

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
          <XAxis 
            dataKey="File.Date"
            angle={ timeScale === 'weekly' ? -45 : null} 
            textAnchor={"end"}
            type={'category'}
            tickFormatter={tick => timeScale === 'monthly' ? moment(tick).format('MMM') : moment(tick).format('M/D')}
          />
          {/* <XAxis dataKey="Month" /> */}
          <YAxis/>
          {/* <Brush /> */}
          <Tooltip 
            labelFormatter={label => timeScale === 'weekly' ? `Between ${moment(label).format('M/D/YY')} and ${moment(label).endOf('week').format('M/D/YY')}...` : `In ${moment(label).format('MMMM YYYY')}...`}
            formatter={(value,name) => [`there were ${numeral(value).format('0,0')} total eviction filings`,]}
          />
          {/* <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" /> */}
          <Legend />
          <Bar dataKey="Total Filings" fill="#DC1C13" />
          {/* <Bar dataKey="tractID" stackId="a" fill="#82ca9d" /> */}
        </BarChart>
      </ResponsiveContainer>

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

    </>
  );
};

export default EvictionChart;
