import API from "./utils/API.js";
import moment from "moment";

const dateField = 'FilingWeek';

export default {
  getEvictionData() {
    const array = [];
    return API.getData(
      "https://evictions.design.gatech.edu/rest/atlanta_metro_area_tracts?select=id,filedate,tractid,countyfp10,totalfilings,totalansweredfilings"
    )
      .then((res) => {
        res
          .filter(
            (item) =>
              new Date(item.filedate).getTime() >=
                new Date("1/1/2020").getTime() &&
              new Date(item.filedate).getTime() < moment().day(0)
          )
          .forEach((item) =>
            array.push({
              "Filing Date": item.filedate,
              tractID: parseInt(item.tractid),
              COUNTYFP10: parseInt(item.countyfp10),
              "Total Filings": parseInt(item.totalfilings),
              "Answered Filings": parseInt(item.totalansweredfilings),
            })
          );
        return {
          array: array,
          dateRange: this.handleDateRange(array),
        };
      })
      .catch((err) => console.error(err));
  },
  handleDates(data) {
    const sortByDate = (a, b) => {
      // console.log(a);
      var dateA = new Date(a).getTime();
      var dateB = new Date(b).getTime();
      return dateA > dateB ? 1 : -1;
    };
  
    const dateArray = [];
  
    data.forEach(item => {
      dateArray.push(item[dateField])
      // Object.value(item[dateField]).forEach(date => {
      //   if (!dateArray.includes(date) && date !== pandemicKey)
      //     dateArray.push(date);
      // });
    });
  
    const sortedDates = [...dateArray].filter(date => 
        new Date(date).getTime() >= new Date('01/01/2020').getTime()
      ).sort((a, b) => sortByDate(a, b));
    const sortedMonths = [...new Set(sortedDates.map(date => moment(date).startOf('month').format('MM/DD/YYYY')))]
    const start = sortedDates[0];
    const end = moment(sortedDates[sortedDates.length - 1]).endOf('week');
  
  
    const monthsArr = [];
    
    sortedMonths
      // .filter((month, i) => 
      //   new Date(end).getTime() > new Date(moment(end).endOf('month').subtract({days: 3})).getTime()
      //     ? true
      //     : i < sortedMonths.length - 1
      // )
      .forEach(date => {
      const dateText = moment(date).format('MMMM YYYY');
  
      monthsArr.push({
        text: dateText,
        value: date,
        key: `month-option-${date}`
      });
    });

    monthsArr.push({
      text: 'During the Pandemic**',
      value: 'During the Pandemic',
      key: `month-option-During the Pandemic`
    });

  
    return { start, end, monthsArr };
  }  
};
