import React, { useState, useEffect } from 'react';
// import { Radio } from 'semantic-ui-react';
import EvictionMap from './Components/EvictionMap';
import EvictionChart from './Components/EvictionChart';
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import API from './utils/API.js';
import ARClogo from './logos/ARC_logo.png';
import Fedlogo from './logos/FedLogo2.PNG';
// import CSPAVlogo from './logos/CSPAV_logo.jpg';
import './App.css';

const App = () => {

    const team = require('./Data/team.json');
    const sources = require('./Data/sources.json');
    const data = require('./Data/EvictionFilingsByTract.json');
    const data2019 = require('./Data/EvictionFilingsByCounty2019.json');
    const normalizeData = require('./Data/RentHHsByTract.json');
    const countyBoundary = require('./Data/countyboundaries.json');

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const smallScreen = window.innerWidth < 850


    const [ geoJSON, setGeoJSON ] = useState();
    const [ boundaryGeoJSON, setBoundaryGeoJSON ] = useState();
    const [ vizView, setVizView ] = useState('map');
    const [countyFilter, setCountyFilter] = useState(999);
    const [modalStatus, setModalStatus] = useState(true);
    const [dateRange, setDateRange] = useState();
      
    const getTractGeoJSON = () => {

        const url = `https://services1.arcgis.com/Ug5xGQbHsD8zuZzM/arcgis/rest/services/ACS2018AllGeo/FeatureServer/0/query?where=SumLevel='Tract' AND PlanningRegion='Atlanta Regional Commission'&SR=4326&outFields=GEOID&f=geojson`
        
        // `https://opendata.arcgis.com/datasets/2e73cc4a02a441ba968e6a63a8b526f5_56.geojson`;


        API.getData(url)
            .then(res => setGeoJSON(res.data))
            .catch(err => console.error(err))
    };

    const AboutContent = {
        Mission: () => (
            <div className='about-content-section'>
                <h2 className='about-content-section-heading'>Mission</h2>
                <p>
                    The purpose of this project is to leverage the complementary technological skill, expertise, and organizational resources of the partnering organizations to create a database of eviction filings with the purpose of informing and improving the ability of Metro Atlanta policymakers, Non-government Organizations, service providers, tenant organizers, and government entities to understand and respond to eviction-related housing instability, particularly in the context of the COVID-19 pandemic. In addtion, the intent of this project is to provide access to eviction filings data for research, practice, and policy purposes beyond the immediate threat of COVID-19. This partnership behind this project will collectively work to create the technology necessary to assemble the database of filings and make the filing information available to stakeholders in an understandable, accessible, secure, and responsible manner.
                </p>
            </div>
        ),
        Team: () => (
            <div className='about-content-section'>
                <h2 className='about-content-section-heading'>Team</h2>
                <div id='about-team'>
                    <div className='team-member-grid-row'>
                        {
                            team.map(member =>
                                member.name ?
                                    <div className='about-team-member'>
                                        <div className='about-team-member-role'>
                                            {member.role}
                                        </div> 
                                        <div className='about-team-member-name'>
                                            {member.name}
                                        </div>
                                    {
                                        member.info.map(info =>
                                            <div className='about-team-member-info'>
                                                {info.title ? 
                                                    <div className='about-team-member-title'>
                                                        {info.title}
                                                    </div> : null}
                                                {info.department ? 
                                                    <div className='about-team-member-department'>  
                                                        {info.department}
                                                    </div> : null}
                                                {info.institution ? 
                                                    <div className='about-team-member-institution'> 
                                                        {info.institution}
                                                    </div> : null}
                                            </div>
                                        )
                                    }
                                </div>
                                : null
                            )
                        }
                    </div>
                </div>
            </div>
        ),
        Data: () => (
            <div className='about-content-section'>
                <h2 className='about-content-section-heading'>About The Data</h2>
                <p>
                    This data captures formal evictions activity in the metro Atlanta area as it is reflected in county court websites. This data does NOT reflect the number of rental households that undergo forced moves. Research has found that forced moves due to illegal evictions and informal evictions are far larger than the number of tenants displaced through the legal, formal eviction process. While eviction or dispossessory filings are evidence of housing instability, and constitute a negative event for tenants in and of themselves, they are not equivalent to displacement of a tenant. It is difficult to know whether a tenant leaves during a formal eviction process or at what stage of the process this occurs. Eviction filings initiate the process of eviction and are distinct from a "writ of possession" which grants a landlord the legal right to remove a tenant.
                </p>
                <p>
                    This data is parsed once a week from magistrate’s courts in Clayton, Cobb, DeKalb, Fulton and Gwinnett counties. Once the evictions case data is captured, each case is geocoded based on the defendant's address and the case events are analyzed to identify associated actions. Due to misssing, incorrect, or difficult to parse addresses, approximately 1% of all filings are excluded from mapped totals.  Analysis of case actions is done with an algorithm that is under development. For this reason, estimates of these actions are currently not included in the aggregated data presented in this tool.  These estimates will, however, likely be included in future versions once the algorithm is complete and sufficiently validated.
                </p>

            </div>        
        ),
        Sources: sourceProps => (
            <div className='about-content-section'>
            <h2 className='about-content-section-heading'>{sourceProps.type} Sources</h2>
            <ul id='about-content-source-list'>
            {
                sources ?
                    sources
                        .filter(source => source.type === sourceProps.type)
                        .map((source, i) =>
                        <li className={'about-content-section-source'}>
                            {source.name} 
                            { 
                                source.url ? 
                                    <a 
                                        key={`source-link-${i}`}    
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                    >
                                        <Icon key={`source-link-icon-${i}`} name='external alternate'/>
                                    </a>
                               : null
                            }
                            {
                                source.note ?
                                    <ul className='about-content-source-note'>
                                        <li>
                                            <em>{source.note}</em>
                                        </li>
                                    </ul>

                                : null
                            }
                        </li>
                    )
                : null
            }
            </ul>

        </div>
        )
    }

    const countyOptions = [
        { key: '999', text: '5-County Region', value: 999 },
        { key: '063', text: 'Clayton County', value: 63 },
        { key: '067', text: 'Cobb County', value: 67 },
        { key: '089', text: 'Dekalb County', value: 89 },
        { key: '121', text: 'Fulton County', value: 121 },
        { key: '135', text: 'Gwinnett County', value: 135 },
    
      ];

    

    const handleDateRange = () => {

        const sortByDate = (a, b) => {
            var dateA = new Date(a).getTime();
            var dateB = new Date(b).getTime();
            return dateA > dateB ? 1 : -1;
         };
        const dateArray = new Set([...data.map(item => item['File.Date'])]);
        const sortedDates = [...dateArray].sort((a,b) => sortByDate(a,b))
        // console.log(dateArray);
        // console.log(sortedDates);
        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length -1];
        setDateRange({start: startDate, end: endDate});
    }
    
    useEffect(() => getTractGeoJSON(), []);
    useEffect(() => setBoundaryGeoJSON(countyBoundary), []);
    useEffect(() => handleDateRange(), []);  

    return (
        <div id='eviction-tracker'>
            {
                modalStatus ? 
                    <div id='modal'>
                        <div id='modal-content'>
                            <div id='modal-heading'>
                                <div id='welcome'>Welcome to the</div>
                                <h1>
                                    ATLANTA REGION
                                </h1>
                                <h1>
                                    EVICTION TRACKER
                                </h1>                                
                            </div>

                            <div id='modal-body'>
                                <AboutContent.Mission />
                                <AboutContent.Data />
                                <AboutContent.Team />
                                <AboutContent.Sources type={'Court Record Data'} />
                                <AboutContent.Sources type={'Other Data'} />
                                
                            </div>
                            <div id='modal-footer'>
                                <Button onClick={() => setModalStatus(false)}>OK</Button>
                            </div>
                        </div>

                    </div> 
                : null
            }
            <div id='header'>

                <h1>ATLANTA REGION EVICTION TRACKER</h1>
                <div id='county-dropdown-container'>

                { smallScreen ?

                    <select value={countyFilter} 
                        onChange={e => setCountyFilter(e.target.value)}
                    >
                        {countyOptions ? countyOptions.map(county => 
                            <option 
                            key={county.text} value={county.value} id={`option-${county.text}`}>
                                {county.text}</option>    
                        ) : null}
                    </select> :

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
                }               
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
                        <h3>MAP</h3>
                    </div> 
                    <div 
                        className='viz-tab' 
                        id={vizView === 'chart' ? 'active-viz-tab' : null}
                        onClick={() => setVizView('chart')}

                    >
                        <h3>CHART</h3>
                        
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
                            smallScreen={smallScreen}
                            data={data}
                            normalizeData={normalizeData}
                            dateRange={dateRange}
                            name={'evictionMap'}
                            geojson={geoJSON}
                            boundaryGeoJSON={boundaryGeoJSON}
                            countyFilter={countyFilter}
                            counties={countyOptions.map(county => county.key)}
                            countyInfo={countyOptions}                          
                        /> 
                    : vizView === 'chart' && data ?
                    <EvictionChart
                        smallScreen={smallScreen}
                        dateRange={dateRange}
                        data2019={data2019} 
                        countyFilter={countyFilter}
                        data={data}
                        counties={countyOptions}/> : null
                }
            </div>
            <div id='footer'>
                <div id='footer-text'>Developed by</div>
                <div id='footer-logos'>
                    <div id='left-logo'>
                    <img src={Fedlogo} alt='Fed-logo'/>
                    </div>
                    <div id='center-logo'>
                    <img src={ARClogo} alt='ARC-logo'/>
                    </div>
                    <div id='right-logo'>
                    {/* <img src={CSPAVlogo} alt='CSPAV-logo'/> */}
                        <p>in partnership with Georgia Tech's</p>
                        <p className='partner-names'>
                            School of City and Regional Planning (SCaRP) and 
                        </p>
                        <p className='partner-names'>
                            Center for Spatial Analysis and Visualization (CSPAV) 
                        </p>
                    </div>
                </div>
                <p>Current as of {dateRange ? moment(dateRange.end).format('M/D/YYYY'): null}
                </p>
                
            </div>
            <div 
                id='info-icon'
                onClick={() => setModalStatus(true)}
            >
                    <Icon name='question circle' size='big'/>
            </div>
        </div>
    );
}

export default App;