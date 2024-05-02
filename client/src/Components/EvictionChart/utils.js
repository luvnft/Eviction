import moment from 'moment';

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
      timeScale === 'weekly'
        ? 'Week of'
        : timeScale === 'monthly'
          ? 'Month'
          : 'Filing Date';

    return {
      [timeLabel]: moment(item[dateField], 'MM/DD/YYYY').format(
        timeScale === 'monthly' ? 'MMMM YYYY' : 'M/D/YYYY'
      ),
      'Total Filings': item[totalFilingsIndicator],
      'Answered Filings': item[answeredFilingsIndicator],
      'Answer Rate':
        item[answeredFilingsIndicator] / item[totalFilingsIndicator],
      'Baseline (Total Filings, 2019)': item[baselineIndicator]
    };
  },
  filterDataToEndOfLastWeek: (key, endDate) =>
    new Date(key).getTime() <=
    new Date(moment(endDate, 'MM/DD/YYYY').endOf('week')).getTime(),
  filterDataToEndOfLastFullMonth: (key, endDate) =>
    new Date(endDate).getTime() <
    new Date(
      moment(endDate, 'MM/DD/YYYY').endOf('month').subtract({ days: 2 })
    ).getTime()
      ? new Date(key).getTime() !==
        new Date(moment(endDate, 'MM/DD/YYYY').startOf('month')).getTime()
      : true,
  referenceAreaDate: ({ timeScale, brushDomainDate, config, county, type }) => {
    const configDate =
      config[timeScale]['byCounty'] && config[timeScale]['byCounty'][county]
        ? config[timeScale]['byCounty'][county][type]
        : config[timeScale][type];

    const useConfigDate =
      type === 'start'
        ? new Date(brushDomainDate).getTime() < new Date(configDate).getTime()
        : type === 'end'
          ? new Date(brushDomainDate).getTime() > new Date(configDate).getTime()
          : false;

    return useConfigDate ? configDate : null;
  },
  getStartIndex: ({chartData, dateField, brushDomain, timeScale}) => {
    let index = null;
    console.log({chartData, dateField, brushDomain, timeScale})

    chartData.forEach((obj, i) => {
      if (obj?.[dateField] === brushDomain?.start) {
        index = i
      }
    })

    console.log(index)

    return index || timeScale === 'weekly' 
    ? chartData?.length - 12
    : chartData?.length - 12

  }
};