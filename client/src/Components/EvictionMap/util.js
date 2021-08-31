import moment from "moment";

export default {
  handleCSVData(props, tractData, rawTractData, selectedMonth) {
    const dataArray =
      tractData && props.geojson
        ? props.geojson.features
            .filter((feature) =>
              props.countyFilter !== 999 && props.countyFilter !== "999"
                ? feature.properties["GEOID"].slice(2, 5) ===
                  props.countyFilter.toString().padStart(3, "0")
                : props.counties.includes(
                    feature.properties["GEOID"].slice(2, 5)
                  )
            )
            .filter(
              (feature) =>
                rawTractData[feature.properties["GEOID"]] &&
                tractData[feature.properties["GEOID"]]
            )
            .map((feature) => ({
              TractID: feature.properties["GEOID"],
              Month: `${selectedMonth}`,
              "Total Eviction Filings":
                rawTractData[feature.properties["GEOID"]],
              "Eviction Filing Rate": Number.parseFloat(
                tractData[feature.properties["GEOID"]] / 100
              ).toPrecision(3),
            }))
        : null;

    return dataArray;
  },
  handleData(props, selectedMonth, selectedMeasure) {
    const dataObject = {};
    const rawDataObject = {};
    const normalizeData = {};

    [...props.data]
      .filter((item) =>
        props.countyFilter !== 999 && props.countyFilter !== "999"
          ? props.countyFilter.toString().padStart(3, "0") ===
            item["COUNTYFP10"].toString().padStart(3, "0")
          : true
      )
      .filter((item) =>
        selectedMonth !== "During the Pandemic**"
          ? moment(item["Filing Date"]).format("MMMM YYYY") === selectedMonth
          : new Date(item["Filing Date"]) > new Date("4/1/2020")
      )
      .filter((item) =>
        selectedMonth === "During the Pandemic**" && item["COUNTYFP10"] === 121
          ? false
          : true
      )
      .filter((item) =>
        props.exclude
          ? props.exclude.counties.includes(item["COUNTYFP10"]) &&
            new Date(item["Filing Date"]).getTime() >
              new Date(props.exclude.date).getTime()
            ? false
            : true
          : true
      )
      .map(
        (item) =>
          (rawDataObject[item["tractID"]] = rawDataObject[item["tractID"]]
            ? rawDataObject[item["tractID"]] + parseFloat(item[selectedMeasure])
            : parseFloat(item[selectedMeasure]))
      );

    props.normalizeData.map((item) =>
      rawDataObject[item["GEOID"]] > 0 && item["RentHHs"]
        ? (dataObject[item["GEOID"]] =
            (rawDataObject[item["GEOID"]] * 100) / item["RentHHs"])
        : null
    );

    props.normalizeData.map(
      (item) => (normalizeData[item["GEOID"]] = item["RentHHs"])
    );

    return { dataObject: dataObject, rawDataObject: rawDataObject };
  },
  getMonthList(props, SortByDate, dateField) {
    const monthArray = [];
    props.data
      .sort((a, b) => SortByDate(a, b, dateField))
      .forEach((item) =>
        !monthArray.includes(moment(item[dateField]).format("MMMM YYYY"))
          ? monthArray.push(moment(item[dateField]).format("MMMM YYYY"))
          : null
      );
    const monthOptionsArray = monthArray
      .filter((month, i) =>
        new Date(props.dateRange.end).getTime() >=
        new Date(
          moment(props.dateRange.end).endOf("month").subtract({ days: 3 })
        ).getTime()
          ? true
          : i < monthArray.length - 1
      )
      .map((month, i) => ({
        text: `${month}`,
        value: month,
        key: month,
      }));
    monthOptionsArray.push({
      text: "During the Pandemic**",
      value: "During the Pandemic**",
      key: "During the Pandemic**",
    });

    return {
      monthOptionsArray: monthOptionsArray,
      selectedMonth: monthOptionsArray[monthOptionsArray.length - 1].value,
    };
  },
  buildingList(props, evictionThreshold, TextFormatter) {
    const array = [];
    props.buildings
      .filter(
        (building) =>
          building.filings.filter(
            (filing) =>
              moment(filing["filingdate"]).valueOf() >=
              moment("04/01/2020").valueOf()
          ).length >= evictionThreshold
      )
      .forEach((building) => {
        const obj = {
          Street: TextFormatter.firstCharToUpper(building.street),
          City: TextFormatter.firstCharToUpper(building.city),
          Zip: building.zip,
          countyFIPS: building.county,
          tractID: building.tractid,
          "Filings since 1/1/2020": building.totalfilings,
          "Filings since 4/1/2020": building.pandemicfilings,
        };

        building.monthlyfilings.forEach(
          (month) =>
            (obj[`Filings in ${moment(month.date).format("MMM YYYY")}`] =
              month.count)
        );

        array.push(obj);
      });
    return array;
  },
  featureStyler(feature, tractData, bins, colors) {
    const geoid = feature.properties["GEOID"];
    const value = tractData[geoid];
    let color = null;
    bins.forEach((bin, i) =>
      value < bin.top && value >= bin.bottom ? (color = colors[i]) : null
    );

    return {
      color: color ? color : "lightgrey",
      weight: 1,
      fillColor: color ? color : "lightgrey",
      fillOpacity: 0.65,
    };
  },
  createBins(binningType, binsArray, valueArray, colorArray) {
    const bins = [];
    binningType === "quantile"
      ? colorArray.map((color, j) =>
          bins.push({
            top: valueArray[
              Math.floor((j * valueArray.length) / colorArray.length)
            ],
            bottom:
              valueArray[
                Math.floor(((j + 1) * valueArray.length) / colorArray.length) -
                  1
              ],
          })
        )
      : binningType === "defined"
      ? binsArray.map((bin, i) =>
          bins.push({
            bottom: i !== 0 ? binsArray[i - 1] : 0,
            top: bin,
          })
        )
      : bins.push(null);
    return bins;
  },
  calcStats(data, selectedMonth, colors) {
    const valueArray = Object.values(data)
      .filter((a) => a > 0)
      .sort((a, b) => (a > b ? -1 : 1));
    // console.log(valueArray);
    const max = Math.max(...valueArray);
    const min = Math.min(...valueArray);
    const bins = this.createBins(
      "defined",
      selectedMonth === "During the Pandemic**"
        ? [5, 20, 30, max + 1]
        : [1, 5, 10, 18],
      valueArray,
      colors
    );
    return {
      statsObj: {
        max: max,
        min: min,
        range: max - min,
      },
      bins: bins,
    };
  },
};
