import moment from "moment";
import SortByDate from "../../utils/SortByDate";

export default {
  dataObjectForCSV: (propObj) => {
    const timeLabel =
      propObj.timeScale === "weekly"
        ? "Week of"
        : propObj.timeScale === "monthly"
        ? "Month"
        : "Filing Date";
    return {
      [timeLabel]: moment(propObj.item[propObj.dateField]).format(
        propObj.timeScale === "monthly" ? "MMMM YYYY" : "M/D/YYYY"
      ),
      [propObj.indicator1]:
        propObj.item[propObj.indicator1] + propObj.item[propObj.indicator2],
      [propObj.indicator2]: propObj.item[propObj.indicator2],
      "Answer Rate":
        propObj.item[propObj.indicator2] /
        (propObj.item[propObj.indicator1] + propObj.item[propObj.indicator2]),
      "Baseline (Total Filings, 2019)":
        propObj.item["Baseline (Total Filings, 2019)"],
    };
  },
  filterDataToEndOfLastWeek: (key, endDate) =>
    new Date(key).getTime() <=
    new Date(moment(endDate).endOf("week")).getTime(),
  filterDataToEndOfLastFullMonth: (key, endDate) =>
    new Date(endDate).getTime() <
    new Date(moment(endDate).endOf("month").subtract({ days: 2 })).getTime()
      ? new Date(key).getTime() !==
        new Date(moment(endDate).startOf("month")).getTime()
      : true,

  dataFormattedForChart: (propObj) => {
    const dataObject = {};

    propObj.data
      .sort((a, b) => SortByDate(a, b, propObj.dateField))
      .filter((item) =>
        propObj.countyFilter !== 999 && propObj.countyFilter !== "999"
          ? propObj.countyFilter === item["COUNTYFP10"] ||
            propObj.countyFilter.toString().padStart(3, "0") ===
              item["COUNTYFP10"].toString().padStart(3, "0")
          : true
      )
      .forEach((item) => {
        const key =
          propObj.timeScale === "daily"
            ? moment(item[propObj.dateField]).format("M/D/YY")
            : propObj.timeScale === "weekly"
            ? moment(item[propObj.dateField]).startOf("week")
            : propObj.timeScale === "monthly"
            ? moment(item[propObj.dateField]).startOf("month")
            : null;

        dataObject[key] = { ...dataObject[key] };

        dataObject[key]["current"] = dataObject[key]["current"]
          ? dataObject[key]["current"] + parseFloat(item[propObj.indicator1])
          : parseFloat(item[propObj.indicator1]);

        dataObject[key]["answered"] = dataObject[key]["answered"]
          ? dataObject[key]["answered"] + parseFloat(item[propObj.indicator2])
          : parseFloat(item[propObj.indicator2]);
      });

    propObj.comparisonData
      .filter((item) =>
        propObj.countyFilter !== 999 && propObj.countyFilter !== "999"
          ? propObj.countyFilter === item["COUNTYFP10"] ||
            propObj.countyFilter.toString().padStart(3, "0") ===
              item["COUNTYFP10"].toString().padStart(3, "0")
          : true
      )
      .forEach((item) => {
        const key = item[propObj.dateField]
          ? propObj.timeScale === "daily"
            ? moment(item[propObj.dateField]).format("M/D/YY")
            : propObj.timeScale === "weekly"
            ? moment(item[propObj.dateField])
                .add(1, "y")
                .subtract(2, "d")
                .startOf("week")
            : propObj.timeScale === "monthly"
            ? moment(item[propObj.dateField]).add(1, "y").startOf("month")
            : null
          : null;

        dataObject[key] = { ...dataObject[key] };

        dataObject[key]["historic"] = dataObject[key]["historic"]
          ? dataObject[key]["historic"] + parseFloat(item[propObj.indicator1])
          : parseFloat(item[propObj.indicator1]);
      });

    propObj.comparisonData
      .filter((item) =>
        propObj.countyFilter !== 999 && propObj.countyFilter !== "999"
          ? propObj.countyFilter === item["COUNTYFP10"] ||
            propObj.countyFilter.toString().padStart(3, "0") ===
              item["COUNTYFP10"].toString().padStart(3, "0")
          : true
      )
      .forEach((item) => {
        const key = item[propObj.dateField]
          ? propObj.timeScale === "daily"
            ? moment(item[propObj.dateField]).format("M/D/YY")
            : propObj.timeScale === "weekly"
            ? moment(item[propObj.dateField])
                .add(2, "y")
                .subtract(4, "d")
                .startOf("week")
            : propObj.timeScale === "monthly"
            ? moment(item[propObj.dateField]).add(2, "y").startOf("month")
            : null
          : null;

        dataObject[key] = { ...dataObject[key] };

        dataObject[key]["historic"] = dataObject[key]["historic"]
          ? dataObject[key]["historic"] + parseFloat(item[propObj.indicator1])
          : parseFloat(item[propObj.indicator1]);
      });

    const dataArray = Object.entries(dataObject)
      .filter(
        ([key, value]) =>
          new Date(key).getTime() <=
          new Date(moment(propObj.endDate).endOf("week")).getTime()

        // this.filterDataToEndOfLastWeek(key, endDate)
      )
      .filter(([key, value]) =>
        propObj.timeScale === "monthly" &&
        //  ? this.filterDataToEndOfLastFullMonth(key, endDate)
        //  : true
        new Date(propObj.endDate).getTime() <
          new Date(
            moment(propObj.endDate).endOf("month").subtract({ days: 2 })
          ).getTime()
          ? new Date(key).getTime() !==
            new Date(moment(propObj.endDate).startOf("month")).getTime()
          : true
      )
      .map(([key, value]) => ({
        "Filing Date": moment(key).format("MM/DD/YYYY"),
        [propObj.indicator1]: value.current - value.answered || null,
        "Baseline (Total Filings, 2019)": value.historic,
        [propObj.indicator2]: value.answered || null,
      }));
    return dataArray;
  },

  referenceAreaStart: (timeScale, brushDomainStart, config) =>
    timeScale === "weekly"
      ? new Date(brushDomainStart).getTime() <
        new Date(config.weekly.start).getTime()
        ? config.weekly.start
        : null
      : new Date(brushDomainStart).getTime() <
        new Date(config.monthly.start).getTime()
      ? config.monthly.start
      : null,
  referenceAreaEnd: (timeScale, brushDomainEnd, config) =>
    timeScale === "weekly"
      ? new Date(brushDomainEnd).getTime() >
        new Date(config.weekly.end).getTime()
        ? config.weekly.end
        : null
      : new Date(brushDomainEnd).getTime() >
        new Date(config.monthly.end).getTime()
      ? config.monthly.end
      : null,
};
