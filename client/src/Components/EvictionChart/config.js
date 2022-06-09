export default {
  // dateField: "FilingDate",
  totalFilingsKey: "TotalFilings",
  answeredFilingsKey: "AnsweredFilings",
  baselineKey: "BaselineFilings",
  dimensions: {
    width: "95%",
    height: "90%",
  },
  margins: {
    top: 40,
    right: 60,
    left: 80,
    bottom: 30,
  },
  smallScreenMargins: {
    top: 40,
    right: 40,
    left: 40,
    bottom: 30,
  },
  referenceAreas: [
    {
      label: 'CARES Act Moratorium',
      weekly: {
        start: '03/29/2020',
        end: '07/26/2020',
      },
      monthly:  {
        start: '04/01/2020',
        end: '08/01/2020'
      }
    },
    {
      label: 'CDC Moratorium',
      weekly: {
        start: '08/30/2020',
        end: '08/29/2021',
      },
      monthly:  {
        start: '09/01/2020',
        end: '09/01/2021',
      }
    },
    {
      label: 'Answer counts preliminary',
      size: '.8em',
      color: 'lightblue',
      weekly: {
        start: '11/07/2021',
        // end: '11/14/2021',
      },
      // monthly:  {
      //   start: '10/01/2021',
      //   end: '11/01/2021',
      // }
    }    
  ],
  loaderStyle: {
    zIndex: "99999",
    color: "#DC1C13",
    position: "absolute",
    bottom: "50vh",
    width: "100%",
    textAlign: "center",
    type: "Circles",
  },
  initTimescale: "monthly",
};
