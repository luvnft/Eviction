export default {
  countyOptions: [
    { key: '999', text: '5-County Region', value: 999 },
    { key: '063', text: 'Clayton County', value: 63 },
    { key: '067', text: 'Cobb County', value: 67 },
    { key: '089', text: 'Dekalb County', value: 89 },
    { key: '121', text: 'Fulton County', value: 121 },
    { key: '135', text: 'Gwinnett County', value: 135 }
  ],
  loaderStyle: {
    zIndex: '99999',
    color: '#DC1C13',
    position: 'absolute',
    bottom: '50vh',
    width: '100%',
    textAlign: 'center',
    type: 'Circles'
  },
  geoURL:
    'https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel=\'Tract\' AND PlanningRegion=\'Atlanta Regional Commission\'&SR=4326&outFields=GEOID&f=geojson'
};
