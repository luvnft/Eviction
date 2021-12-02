import API from "./utils/API.js";
import moment from "moment";

const dateField = 'FilingsByMonth';

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
      var dateA = new Date(a).getTime();
      var dateB = new Date(b).getTime();
      return dateA > dateB ? 1 : -1;
    };
  
    const pandemicKey = 'During the Pandemic';
    const dateArray = [];
  
    data.forEach(tract => {
      Object.keys(tract[dateField]).forEach(date => {
        if (!dateArray.includes(date) && date !== pandemicKey)
          dateArray.push(date);
      });
    });
  
    const sortedDates = [...dateArray].sort((a, b) => sortByDate(a, b));
    const start = sortedDates[0];
    const end = sortedDates[sortedDates.length - 1];
  
    sortedDates.push(pandemicKey);
  
    const monthsArr = sortedDates.map(date => {
      const dateText =
        date !== pandemicKey ? moment(date).format('MMMM YYYY') : `${date}**`;
  
      return {
        text: dateText,
        value: date,
        key: date
      };
    });
  
    return { start, end, monthsArr };
  }  
};
