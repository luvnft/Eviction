export default {
  dateField: 'Filing Date',
  indicator1: 'Total Filings',
  indicator2: 'Answered Filings',
  dimensions: {
    width: '95%',
    height: '90%',
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
        end: '08/01/2021',
      },
      monthly:  {
        start: '09/01/2020',
        end: '08/01/2021',
      }
    }
    
  ]
}