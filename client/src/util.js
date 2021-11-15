import API from "./utils/API.js";
import moment from "moment";

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
  handleDateRange(data) {
    const sortByDate = (a, b) => {
      var dateA = new Date(a).getTime();
      var dateB = new Date(b).getTime();
      return dateA > dateB ? 1 : -1;
    };
    const dateArray = new Set([...data.map((item) => item["FilingDate"])]);
    const sortedDates = [...dateArray].sort((a, b) => sortByDate(a, b));
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];
    return { start: startDate, end: endDate };
  },
};
