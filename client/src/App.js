import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Radio } from 'semantic-ui-react';
import EvictionMap from './Components/EvictionMap';
import EvictionChart from './Components/EvictionChart';
// import ColorRamp from './Components/ColorRamp'
import API from './utils/API.js';
import './App.css'

const App = () => {


    // const [ data, setData ] = useState();
    const [ geoJSONs, setGeoJSONs ] = useState();
    const [ vizView, setVizView ] = useState('chart');

    const data = require('./TEST-DATA/EvictionFilingsByTract.json');


  
    const style = {
        colormap: 'density',
        nshades: 72,
        opacity: .7
    }
    
    const getGeoJSON = () => {
        const counties = [
            '063',
            '067',
            '089',
            '121',
            '135'
        ]

        // const countyOptions = [
        //     { key: '063', text: 'Clayton County', value: '63' },
        //     { key: '067', text: 'Cobb County', value: '67' },
        //     { key: '089', text: 'Dekalb County', value: '89' },
        //     { key: '121', text: 'Fulton County', value: '121' },
        //     { key: '135', text: 'Gwinnett County', value: '135' },
        //   ];

        const url = `https://opendata.arcgis.com/datasets/2e73cc4a02a441ba968e6a63a8b526f5_56.geojson`;

        API.getData(url)
            .then(res => setGeoJSONs(res.data))
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
                            style={style} 
                            data={data}
                            // year={year}
                            // data={data1}
                            name={'evictionMap'}
                            // minvalue={minValue}
                            // maxvalue={maxValue}
                            // mapbounds={mapBounds}
                            // setMapBounds={setMapBounds}
                            geojson={geoJSONs}                           
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