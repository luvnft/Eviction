import moment from "moment";

export default {
  handleCSVData({
    geojson,
    counties,
    countyFilter,
    tractData,
    rawTractData,
    selectedMonth
  }) {
    const dataArray =
      tractData && geojson
        ? geojson.features
          .filter((feature) =>
            countyFilter !== 999 && countyFilter !== "999"
              ? feature.properties["GEOID"].slice(2, 5) ===
              countyFilter.toString().padStart(3, "0")
              : counties.includes(
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
  handleData({
    normalizeData,
    data,
    selectedMonth,
    selectedMeasure,
    tractDenominator
  }) {
    const dataObject = {};
    const rawDataObject = {};
  
    [...data].forEach(item =>
      Object.entries(item[selectedMeasure])
        .filter(([key, val]) =>
          selectedMonth !== 'During the Pandemic'
            ? key === selectedMonth
            : key === 'During the Pandemic'
        )
        .forEach(([key, val]) => (rawDataObject[item.TractID] = parseFloat(val)))
    );
  
    normalizeData.forEach(item => {
      if (rawDataObject[item['GEOID']] > 0 && item[tractDenominator] > 0) {
        dataObject[item['GEOID']] =
          (rawDataObject[item['GEOID']] * 100) / item[tractDenominator];
      }
    });
  
    return { dataObject: dataObject, rawDataObject: rawDataObject };
  },
  buildingList({ buildings, evictionThreshold, TextFormatter}) {
    const array = [];
    buildings
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
  featureStyler({ feature, tractData, bins, colors, hoverID }) {
    const geoid = feature.properties["GEOID"];
    const value = tractData[geoid];
    let color = null;

    bins.forEach((bin, i) =>
      value < bin.top && value >= bin.bottom
        ? (color = colors[i])
        : null
    );

    return {
      color: color || "lightgrey",
      weight: hoverID === geoid ? 0 : 1,
      fillColor: color || "lightgrey",
      fillOpacity: hoverID === geoid ? .1 : .8,
    };
  },
  createBins({ binningType, binsArray, valueArray, colorArray }) {
    const bins = [];
    binningType === "quantile"
      ? colorArray.map((color, j) =>
        bins.push({
          top: valueArray[
            Math.floor(
              (j * valueArray.length) / colorArray.length
            )
          ],
          bottom:
            valueArray[
            Math.floor(
              ((j + 1) * valueArray.length) /
              colorArray.length
            ) - 1
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
  calcStats({ dataObject, selectedMonth, colors }) {
    const valueArray = Object.values(dataObject)
      .filter((a) => a > 0)
      .sort((a, b) => (a > b ? -1 : 1));
    const max = Math.max(...valueArray);
    const min = Math.min(...valueArray);
    const bins = this.createBins({
      binningType: "defined",
      binsArray:
        selectedMonth === "During the Pandemic"
          ? [10, 25, 50, max + 1]
          : [1, 5, 10, max > 15 ? max : 15],
      valueArray: valueArray,
      colorArray: colors,
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
