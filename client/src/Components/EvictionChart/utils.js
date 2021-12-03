import moment from "moment";

export default {
  dataObjectForCSV: ({
    item,
    timeScale,
    dateField,
    totalFilingsIndicator,
    answeredFilingsIndicator,
    baselineIndicator
  }) => {
    const timeLabel =
      timeScale === "weekly"
        ? "Week of"
        : timeScale === "monthly"
        ? "Month"
        : "Filing Date";

    return {
      [timeLabel]: moment(item[dateField]).format(
        timeScale === "monthly" ? "MMMM YYYY" : "M/D/YYYY"
      ),
      "Total Filings": item[totalFilingsIndicator],
      "Answered Filings": item[answeredFilingsIndicator],
      "Answer Rate":
        item[answeredFilingsIndicator] / item[totalFilingsIndicator],
      "Baseline (Total Filings, 2019)":
        item[baselineIndicator],
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
