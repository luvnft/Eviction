import moment from 'moment';
import SortByDate from '../../utils/SortByDate';

export default {
  dataObjectForCSV : (item, timeScale, dateField, indicator1, indicator2) => {
    const timeLabel = 
      timeScale === 'weekly' ? 
      "Week of" 
      : timeScale === 'monthly' ?
        "Month"
        : "Filing Date";
    return ({
      [timeLabel]: moment(item[dateField])
        .format(timeScale === 'monthly' 
          ? 'MMMM YYYY' 
          : 'M/D/YYYY'),
      [indicator1]: item[indicator1] + 
        item[indicator2],
      [indicator2]: item[indicator2],
      "Answer Rate": item[indicator2]/(item[indicator1] + 
        item[indicator2]),
      "Baseline (Total Filings, 2019)" : item["Baseline (Total Filings, 2019)"]
    })
  },
  filterDataToEndOfLastWeek: (key, endDate) => 
    new Date(key).getTime() <= new Date(moment(endDate).endOf('week')).getTime(),
  filterDataToEndOfLastFullMonth: (key, endDate) =>
    new Date(endDate).getTime() < 
    new Date(moment(endDate)
      .endOf('month')
      .subtract({days: 2}))
      .getTime()
        ? new Date(key).getTime() !== new Date(moment(endDate).startOf('month')).getTime()  
        : true,
  dataFormattedForChart: (data, dateField, endDate, countyFilter, timeScale, indicator1, indicator2, comparisonData) => {
    const dataObject = {};
    data.sort((a, b) => SortByDate(a, b, dateField))
      .filter(item =>
        countyFilter !== 999 && 
        countyFilter !== '999' ? 
          countyFilter === item['COUNTYFP10'] || 
          countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0') 
        : true
      )
      .forEach(item => {
        const key = timeScale === 'daily' 
          ? moment(item[dateField]).format('M/D/YY') 
          : timeScale === 'weekly'
            ? moment(item[dateField]).startOf('week')
            : timeScale === 'monthly' 
              ? moment(item[dateField]).startOf('month') 
              : null;

        dataObject[key] = {...dataObject[key]}

        dataObject[key]['current'] = dataObject[key]['current'] 
          ? dataObject[key]['current'] + parseFloat(item[indicator1])
          : parseFloat(item[indicator1]);  
          
        dataObject[key]['answered'] = dataObject[key]['answered'] 
          ? dataObject[key]['answered'] + parseFloat(item[indicator2])
          : parseFloat(item[indicator2]); 

      });

    comparisonData
      .filter(item =>
        countyFilter !== 999 && 
        countyFilter !== '999' ? 
          countyFilter === item['COUNTYFP10'] || 
          countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0') 
        : true
      )
      .forEach(item => {
        const key = item[dateField] 
          ? timeScale === 'daily' 
            ? moment(item[dateField]).format('M/D/YY')
            : timeScale === 'weekly' 
              ? moment(item[dateField]).add(1, 'y').subtract(2, 'd').startOf('week')
              : timeScale === 'monthly' 
                ? moment(item[dateField]).add(1, 'y').startOf('month') 
                : null 
          : null;

        dataObject[key] = {...dataObject[key]}

        dataObject[key]['historic'] = dataObject[key]['historic'] ?
        dataObject[key]['historic'] + parseFloat(item[indicator1])
        : parseFloat(item[indicator1]);
      })

    comparisonData
      .filter(item =>
        countyFilter !== 999 && 
        countyFilter !== '999' ? 
          countyFilter === item['COUNTYFP10'] || 
          countyFilter.toString().padStart(3, '0') === item['COUNTYFP10'].toString().padStart(3, '0') 
        : true
      )
      .forEach(item => {
          const key = item[dateField] ? timeScale === 'daily' ? 
              moment(item[dateField]).format('M/D/YY')
            : timeScale === 'weekly' ?
              moment(item[dateField]).add(2, 'y').subtract(4, 'd').startOf('week')
            : timeScale === 'monthly' ?
              moment(item[dateField]).add(2, 'y').startOf('month') 
          : null : null;

        dataObject[key] = {...dataObject[key]}

        dataObject[key]['historic'] = dataObject[key]['historic'] ?
        dataObject[key]['historic'] + parseFloat(item[indicator1])
        : parseFloat(item[indicator1]);
      })

  const dataArray = Object.entries(dataObject)
    .filter(([key, value]) => 
      new Date(key).getTime() <= new Date(moment(endDate).endOf('week')).getTime(),

      // this.filterDataToEndOfLastWeek(key, endDate)
    )
    .filter(([key, value]) => 
      // timeScale === 'monthly'
      //  ? this.filterDataToEndOfLastFullMonth(key, endDate)
      //  : true
      new Date(endDate).getTime() < 
      new Date(moment(endDate)
        .endOf('month')
        .subtract({days: 2}))
        .getTime()
          ? new Date(key).getTime() !== new Date(moment(endDate).startOf('month')).getTime()  
          : true
  
    )
    .map(([key, value]) =>
      ({
        "Filing Date": moment(key).format('MM/DD/YYYY'),
        [indicator1]: (value.current - value.answered) || null,
        "Baseline (Total Filings, 2019)" : value.historic ,
        [indicator2]: value.answered || null
      })
    );
    return dataArray
  }
}