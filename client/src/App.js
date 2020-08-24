import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import { Radio } from 'semantic-ui-react';
import EvictionMap from './Components/EvictionMap';
import EvictionChart from './Components/EvictionChart';
// import ColorRamp from './Components/ColorRamp'
import API from './utils/API.js';
import './App.css';


const App = () => {


    // const [ data, setData ] = useState();
    const [ geoJSON, setGeoJSON ] = useState();
    const [ vizView, setVizView ] = useState('chart');
    const data = require('./Test-data/EvictionFilingsByTract.json');
    const normalizeData = require('./Test-data/RentHHsByTract.json');
  
    // const style = {
    //     colormap: 'density',
    //     nshades: 72,
    //     opacity: .7
    // }
    
    const getGeoJSON = () => {

        const url = `https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel='Tract' AND PlanningRegion='Atlanta Regional Commission'&SR=4326&outFields=GEOID&f=geojson`
        
        // `https://opendata.arcgis.com/datasets/2e73cc4a02a441ba968e6a63a8b526f5_56.geojson`;


        API.getData(url)
            .then(res => setGeoJSON(res.data))
            .catch(err => console.error(err))
    };


useEffect(() => getGeoJSON(), []);  

    return (
        <div id='eviction-tracker'>
            <div id='header'>
                <h1>ATLANTA EVICTION TRACKER</h1>
                <h5>
                    MAP 
                    <Radio
                        style={{
                            margin: '0 5px 0 5px'
                        }} 
                        toggle 
                        checked={vizView !== 'map'} 
                        onChange={() => setVizView(vizView === 'map' ? 'chart' : 'map')} /> 
                    CHART
                </h5>
            </div>
            <div id='viz-box'>
                {
                    vizView === 'map' && data ?
                    // <div style={{textAlign: 'center', height: '100vh'}}>
                    //   <div id='map-container'>  
                        <EvictionMap
                            // style={style} 
                            data={data}
                            normalizeData={normalizeData}
                            // year={year}
                            // data={data1}
                            name={'evictionMap'}
                            // minvalue={minValue}
                            // maxvalue={maxValue}
                            // mapbounds={mapBounds}
                            // setMapBounds={setMapBounds}
                            geojson={geoJSON}                           
                        /> 
                    //         <div style={{height: '3%', textAlign: 'center'}}>
                    //     <h1>Evictions</h1>
                    // </div>
            // </div>
            // </div>
                    : vizView === 'chart' && data ?
                    <EvictionChart data={data}/> : null
                }


            </div>
            <div id='footer'>
                <h5>Developed in partnership by</h5>
                <h5>The Atlanta Regional Commission | The Atlanta Federal Reserve Bank | Georgia Institute of Technology</h5>
            </div>
        </div>
    );
}

export default App;