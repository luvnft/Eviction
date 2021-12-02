export default {
  countyFIPS: ["13067", "13063", "13089", "13121", "13135"],
  countyBounds: (smallScreen) => ({
    999: {
      center: [33.77285, -84.33268],
      zoom: 9.8,
    },
    "067": {
      center: [33.9132, -84.5803],
      zoom: smallScreen ? 10.2 : 11,
    },
    "063": {
      center: [33.50533, -84.34112],
      zoom: smallScreen ? 10.5 : 11.2,
    },
    121: {
      center: [33.840747, -84.46563],
      zoom: smallScreen ? 9.4 : 10,
    },
    135: {
      center: [33.959468, -84.02901],
      zoom: smallScreen ? 10 : 10.8,
    },
    "089": {
      center: [33.79857, -84.20737],
      zoom: smallScreen ? 10.4 : 11,
    },
  }),
  monthlyColorMap: [
    "#6867da",
    "#618ee9",
    "#a2cdee",
    "#d8e8f0",
  ].reverse(),
  pandemicColorMap: [
    "#DC1C13",
    "#EA4C46",
    "#F1959B",
    "#F6BDC0",
  ].reverse(),
  buildingColorMap: [
    "#59fd00",
    "#85fe00",
    "#a6ff00",
    "#c3ff00",
    "#dcff00",
    "#ebf100",
    "#f6e400",
    "#ffd604",
    "#ffb821",
    "#ff9b39",
    "#ff814d",
    "#fb6a5f",
  ],
  buildingScaler: 2,
  // tractNumerator: "TotalFilings",
  tractNumerator: "FilingsByMonth",
  tractDenominator: "RentHHs",
  // dateField: "FilingMonth",
  loaderStyle: {
    zIndex: "99999",
    color: "#609580",
    position: "absolute",
    bottom: "35vh",
    width: "100%",
    textAlign: "center",
    type: "Circles",
  },
  tileLayer: {
    attribution:
      '&copy <a href="http://osm.org/copyright">OpenStreetMap contributors</a>',
    url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
  },
  dropdownStyle: {
    fontSize: "1.6em",
    fontWeight: "700",
  },
  buildingSymbologyColor: {
    border: "2px solid rgb(191, 253, 0)",
    backgroundColor: "rgba(191, 253, 0, .5)",
  },
};
