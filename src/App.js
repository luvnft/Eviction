import React, { useState, useEffect } from 'react';
// import { Radio } from 'semantic-ui-react';
import EvictionMap from './Components/EvictionMap';
import EvictionChart from './Components/EvictionChart';
import { Dropdown } from 'semantic-ui-react';

import API from './utils/API.js';
import './App.css';

const App = () => {

    const [ geoJSON, setGeoJSON ] = useState();
    const [ vizView, setVizView ] = useState('map');
    const data = require('./Test-data/EvictionFilingsByTract.json');
    const normalizeData = require('./Test-data/RentHHsByTract.json');
    const [countyFilter, setCountyFilter] = useState(999);

      
    const getGeoJSON = () => {

        const url = `https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel='Tract' AND PlanningRegion='Atlanta Regional Commission'&SR=4326&outFields=GEOID&f=geojson`
        
        // `https://opendata.arcgis.com/datasets/2e73cc4a02a441ba968e6a63a8b526f5_56.geojson`;


        API.getData(url)
            .then(res => setGeoJSON(res.data))
            .catch(err => console.error(err))
    };

    const countyOptions = [
        { key: '999', text: 'All Five Counties', value: 999 },
        { key: '063', text: 'Clayton County', value: 63 },
        { key: '067', text: 'Cobb County', value: 67 },
        { key: '089', text: 'Dekalb County', value: 89 },
        { key: '121', text: 'Fulton County', value: 121 },
        { key: '135', text: 'Gwinnett County', value: 135 },
    
      ];


    useEffect(() => getGeoJSON(), []);  

    return (
        <div id='eviction-tracker'>
            <div id='header'>
                <h1>ATLANTA REGION EVICTION TRACKER</h1>
                <div id='county-dropdown-container'>
                    <Dropdown
                        className="icon chart-dropdown"
                        placeholder="County Options"
                        fluid
                        // multiple
                        selection
                        value={countyFilter}
                        options={countyOptions}
                        onChange={(e, data) => setCountyFilter(data.value)}
                    />                
                </div>

                <div id='viz-toggle'>
                    {/* <Button.Group className="button-group">
                        <Button 
                            active={vizView === 'map' ? true : false}
                            onClick={() => setVizView('map')}
                        ><h3>
                            Map
                        </h3></Button>
                        <Button 
                            active={vizView === 'chart' ? true : false}
                            onClick={() => setVizView('chart')}

                        >Chart</Button>
                    </Button.Group> */}
                    <div
                        className='viz-tab' 
                        id={vizView === 'map' ? 'active-viz-tab' : null}
                        onClick={() => setVizView('map')}
                    >
                        MAP
                    </div> 
                    <div 
                        className='viz-tab' 
                        id={vizView === 'chart' ? 'active-viz-tab' : null}
                        onClick={() => setVizView('chart')}

                    >
                        Chart
                    </div>                  

                    {/* MAP 
                    <Radio
                        style={{
                            margin: '0 5px 0 5px'
                        }} 
                        toggle 
                        checked={vizView !== 'map'} 
                        onChange={() => setVizView(vizView === 'map' ? 'chart' : 'map')} /> 
                    CHART */}
                </div>
                
            </div>
            <div id='viz-box'>
                {
                    vizView === 'map' && data ?
                        <EvictionMap
                            data={data}
                            normalizeData={normalizeData}
                            name={'evictionMap'}
                            geojson={geoJSON}
                            countyFilter={countyFilter}                           
                        /> 
                    : vizView === 'chart' && data ?
                    <EvictionChart 
                        countyFilter={countyFilter}
                        data={data}/> : null
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