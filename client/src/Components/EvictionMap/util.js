import moment from "moment";
import SortByDate from "../../utils/SortByDate";

export default {
  handleCSVData(propObj) {
    const dataArray =
      propObj.tractData && propObj.geojson
        ? propObj.geojson.features
            .filter((feature) =>
              propObj.countyFilter !== 999 && propObj.countyFilter !== "999"
                ? feature.properties["GEOID"].slice(2, 5) ===
                  propObj.countyFilter.toString().padStart(3, "0")
                : propObj.counties.includes(
                    feature.properties["GEOID"].slice(2, 5)
                  )
            )
            .filter(
              (feature) =>
                propObj.rawTractData[feature.properties["GEOID"]] &&
                propObj.tractData[feature.properties["GEOID"]]
            )
            .map((feature) => ({
              TractID: feature.properties["GEOID"],
              Month: `${propObj.selectedMonth}`,
              "Total Eviction Filings":
                propObj.rawTractData[feature.properties["GEOID"]],
              "Eviction Filing Rate": Number.parseFloat(
                propObj.tractData[feature.properties["GEOID"]] / 100
              ).toPrecision(3),
            }))
        : null;

    return dataArray;
  },
  handleData(propObj) {
    const dataObject = {};
    const rawDataObject = {};
    const normalizeData = propObj.normalizeData ? propObj.normalizeData : {};

    [...propObj.data]
      .filter((item) =>
        propObj.countyFilter !== 999 && propObj.countyFilter !== "999"
          ? propObj.countyFilter.toString().padStart(3, "0") ===
            item["COUNTYFP10"].toString().padStart(3, "0")
          : true
      )
      .filter((item) =>
        propObj.selectedMonth !== "During the Pandemic**"
          ? moment(item["Filing Date"]).format("MMMM YYYY") ===
            propObj.selectedMonth
          : new Date(item["Filing Date"]) > new Date("4/1/2020")
      )
      .filter((item) =>
        propObj.selectedMonth === "During the Pandemic**" &&
        item["COUNTYFP10"] === 121
          ? false
          : true
      )
      .filter((item) =>
        propObj.exclude
          ? propObj.exclude.counties.includes(item["COUNTYFP10"]) &&
            new Date(item["Filing Date"]).getTime() >
              new Date(propObj.exclude.date).getTime()
            ? false
            : true
          : true
      )
      .map(
        (item) =>
          (rawDataObject[item["tractID"]] = rawDataObject[item["tractID"]]
            ? rawDataObject[item["tractID"]] +
              parseFloat(item[propObj.selectedMeasure])
            : parseFloat(item[propObj.selectedMeasure]))
      );

    normalizeData.map((item) =>
      rawDataObject[item["GEOID"]] > 0 && item["RentHHs"]
        ? (dataObject[item["GEOID"]] =
            (rawDataObject[item["GEOID"]] * 100) / item["RentHHs"])
        : null
    );

    normalizeData.map(
      (item) => (normalizeData[item["GEOID"]] = item["RentHHs"])
    );

    return { dataObject: dataObject, rawDataObject: rawDataObject };
  },
  getMonthList(propObj) {
    const monthArray = [];
    propObj.data
      .sort((a, b) => SortByDate(a, b, propObj.dateField))
      .forEach((item) =>
        !monthArray.includes(
          moment(item[propObj.dateField]).format("MMMM YYYY")
        )
          ? monthArray.push(moment(item[propObj.dateField]).format("MMMM YYYY"))
          : null
      );
    const monthOptionsArray = monthArray
      .filter((month, i) =>
        new Date(propObj.dateRange.end).getTime() >=
        new Date(
          moment(propObj.dateRange.end).endOf("month").subtract({ days: 3 })
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
  buildingList(propObj) {
    const array = [];
    propObj.buildings
      .filter(
        (building) =>
          building.filings.filter(
            (filing) =>
              moment(filing["filingdate"]).valueOf() >=
              moment("04/01/2020").valueOf()
          ).length >= propObj.evictionThreshold
      )
      .forEach((building) => {
        const obj = {
          Street: propObj.TextFormatter.firstCharToUpper(building.street),
          City: propObj.TextFormatter.firstCharToUpper(building.city),
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
  featureStyler(propObj) {
    const geoid = propObj.feature.properties["GEOID"];
    const value = propObj.tractData[geoid];
    let color = null;
    propObj.bins.forEach((bin, i) =>
      value < bin.top && value >= bin.bottom
        ? (color = propObj.colors[i])
        : null
    );

    return {
      color: color ? color : "lightgrey",
      weight: 1,
      fillColor: color ? color : "lightgrey",
      fillOpacity: 0.65,
    };
  },
  createBins(propObj) {
    const bins = [];
    propObj.binningType === "quantile"
      ? propObj.colorArray.map((color, j) =>
          bins.push({
            top: propObj.valueArray[
              Math.floor(
                (j * propObj.valueArray.length) / propObj.colorArray.length
              )
            ],
            bottom:
              propObj.valueArray[
                Math.floor(
                  ((j + 1) * propObj.valueArray.length) /
                    propObj.colorArray.length
                ) - 1
              ],
          })
        )
      : propObj.binningType === "defined"
      ? propObj.binsArray.map((bin, i) =>
          bins.push({
            bottom: i !== 0 ? propObj.binsArray[i - 1] : 0,
            top: bin,
          })
        )
      : bins.push(null);
    return bins;
  },
  calcStats(propObj) {
    const valueArray = Object.values(propObj.dataObject)
      .filter((a) => a > 0)
      .sort((a, b) => (a > b ? -1 : 1));
    const max = Math.max(...valueArray);
    const min = Math.min(...valueArray);
    const bins = this.createBins({
      binningType: "defined",
      binsArray:
        propObj.selectedMonth === "During the Pandemic**"
          ? [5, 20, 30, max + 1]
          : [1, 5, 10, 18],
      valueArray: valueArray,
      colors: propObj.colors,
    });
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
