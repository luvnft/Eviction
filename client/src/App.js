import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Radio } from 'semantic-ui-react';
import EvictionMap from './Components/EvictionMap';
import EvictionChart from './Components/EvictionChart';
import './App.css'

const App = () => {
    const [ data, setData ] = useState();
    const [ geoJSONs, setGeoJSONs ] = useState();
    const [ vizView, setVizView ] = useState('map');

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
                    vizView === 'map' ?
                        <EvictionMap/> 
                    : <EvictionChart/>
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