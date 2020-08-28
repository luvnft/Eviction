import React, { useState, useEffect } from 'react';
// import { Radio } from 'semantic-ui-react';
import EvictionMap from './Components/EvictionMap';
import EvictionChart from './Components/EvictionChart';
import { Dropdown } from 'semantic-ui-react';

import API from './utils/API.js';
import ARClogo from './logos/ARC_logo.png';
import Fedlogo from './logos/FedLogo2.PNG';
import CSPAVlogo from './logos/CSPAV_logo.jpg';
import './App.css';

const App = () => {

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    const [ geoJSON, setGeoJSON ] = useState();
    const [ boundaryGeoJSON, setBoundaryGeoJSON ] = useState();
    const [ vizView, setVizView ] = useState('map');
    const data = require('./Test-data/EvictionFilingsByTract.json');
    const normalizeData = require('./Test-data/RentHHsByTract.json');
    const [countyFilter, setCountyFilter] = useState(999);
    const countyBoundary = require('./Test-data/countyboundaries.json');
      
    const getTractGeoJSON = () => {

        const url = `https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel='Tract' AND PlanningRegion='Atlanta Regional Commission'&SR=4326&outFields=GEOID&f=geojson`
        
        // `https://opendata.arcgis.com/datasets/2e73cc4a02a441ba968e6a63a8b526f5_56.geojson`;


        API.getData(url)
            .then(res => setGeoJSON(res.data))
            .catch(err => console.error(err))
    };

    // const getCountyGeoJSON = () => {
    //     const url = `https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel='County' AND PlanningRegion='Atlanta Regional Commission'&SR=4326&outFields=GEOID&f=geojson`
        
    //     // `https://opendata.arcgis.com/datasets/2e73cc4a02a441ba968e6a63a8b526f5_56.geojson`;


    //     API.getData(url)
    //         .then(res => setBoundaryGeoJSON(res.data))
    //         .catch(err => console.error(err))
    // }

    const countyOptions = [
        { key: '999', text: '5-County Region', value: 999 },
        { key: '063', text: 'Clayton County', value: 63 },
        { key: '067', text: 'Cobb County', value: 67 },
        { key: '089', text: 'Dekalb County', value: 89 },
        { key: '121', text: 'Fulton County', value: 121 },
        { key: '135', text: 'Gwinnett County', value: 135 },
    
      ];
    
    useEffect(() => getTractGeoJSON(), []);
    useEffect(() => setBoundaryGeoJSON(countyBoundary), []);  

    return (
        <div id='eviction-tracker'>
            <div id='header'>
                <h1>ATLANTA REGION EVICTION TRACKER</h1>
                <div id='county-dropdown-container'>
                    <Dropdown
                        // className="icon chart-dropdown"
                        placeholder="Filter by County"
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
                        CHART
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
                            boundaryGeoJSON={boundaryGeoJSON}
                            countyFilter={countyFilter}
                            counties={countyOptions.map(county => county.key)}                          
                        /> 
                    : vizView === 'chart' && data ?
                    <EvictionChart 
                        countyFilter={countyFilter}
                        data={data}
                        counties={countyOptions}/> : null
                }
            </div>
            <div id='footer'>
                <div id='footer-text'>Developed in partnership by</div>
                <div id='footer-logos'>
                    <div id='left-logo'>
                    <img src={Fedlogo} alt='Fed-logo'/>
                    </div>
                    <div id='center-logo'>
                    <img src={ARClogo} alt='ARC-logo'/>
                    </div>
                    <div id='right-logo'>
                    <img src={CSPAVlogo} alt='CSPAV-logo'/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;