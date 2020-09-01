import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import numeral from 'numeral';
import { Dropdown, Icon } from 'semantic-ui-react';

// import * as turf from '@turf/turf';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import './style.css';

const EvictionMap = props => {

    const [legendVisble, setLegendVisible] = useState(true);
    
    const [tractData, setTractData] = useState();
    const [rawTractData, setRawTractData] = useState();
    const [stats, setStats] = useState();
    const [bins, setBins] = useState();
    const [hoverID, setHoverID] = useState();
    // const [dateRange, setDateRange] = useState();
    // const [bounds, setBounds] = useState();
    const colors = ["#DC1C13", "#EA4C46", "#F07470", "#F1959B",  "#F6BDC0"].reverse();

    // const sortByDate = (a, b) => {
    //     var dateA = new Date(a).getTime();
    //     var dateB = new Date(b).getTime();
    //     return dateA > dateB ? 1 : -1;
    // };

    // const countyBoundary = props.boundaryGeoJSON ?
    //     props.boundaryGeoJSON.features.map(feature =>
    //         turf.polygonToLine(feature)) : null;

    // console.log(JSON.stringify(props.boundaryGeoJSON));
   


    const [ monthOptions, setMonthOptions ] = useState();
    const [ selectedMonth, setSelectedMonth ] = useState('January')

    const getMonthList = () => {
        const monthArray = [];
        props.data.map(item => 
            !monthArray.includes(moment(item['File.Date']).format('MMMM')) ? 
                monthArray.push(moment(item['File.Date']).format('MMMM'))
            : null
        );
        const monthOptionsArray = monthArray.map(month =>
            ({
                text: `${month} ${2020}`,
                value: month,
                key: month
            })
        );
        setMonthOptions(monthOptionsArray);
    }
    
    // Create function to setStats({max: value, min: value, range: value})
    const calcStats = data => {
        const valueArray = Object.values(data).filter(a => a > 0).sort((a,b) => a > b ? -1 : 1);
        // console.log(valueArray);
        const max = Math.max(...valueArray);
        const min = Math.min(...valueArray);
        const bins = [];

        setStats({
            max: max,
            min: min,
            range: max - min
        });

        const createBins = (binningType, binsArray) => 
            binningType === 'quantile' ?
                colors.map((color,j) =>
                bins.push({
                    top: valueArray[Math.floor(j * valueArray.length/colors.length)],
                    bottom: valueArray[Math.floor((j + 1) * valueArray.length/colors.length) - 1]
                })
            )
            : binningType === 'defined' ?
                binsArray.map((bin,i) => 
                    bins.push({
                        bottom: i !== 0 ? binsArray[i - 1] : 0,
                        top: bin
                    })
                ) 
            : null

        createBins('defined', [1, 2, 5, 10, 18]);
        // createBins('quantile')
        setBins(bins);
        // console.log(bins);
    }

    const handleData = () => {
        const dataObject = {};
        const rawDataObject = {};
        const normalizeData = {};

        props.data
            // .filter(item =>
            //     props.countyFilter !== 999 ? 
            //     props.countyFilter === item['COUNTYFP10'] 
            //     : true
            // )
            .filter(item => 
                moment(item['File.Date']).format('MMMM') === selectedMonth
            )
            .map(item =>
                rawDataObject[item['tractID']] = rawDataObject[item['tractID']] ?
                    (rawDataObject[item['tractID']] + parseFloat(item['Total Filings']))
                    : parseFloat(item['Total Filings'])
            );

        props.normalizeData.map(item => rawDataObject[item['GEOID']] > 0 && item['RentHHs'] ?
            dataObject[item['GEOID']] = rawDataObject[item['GEOID']] * 100 / item['RentHHs']
            : null
        );

        props.normalizeData.map(item => normalizeData[item['GEOID']] = item['RentHHs'])


        calcStats(dataObject);
        setTractData(dataObject);
        setRawTractData(rawDataObject);
    };

    // const handleDateRange = () => {
    //     const dateArray = new Set([...props.data.map(item => item['File.Date'])]);
    //     const sortedDates = [...dateArray].sort((a,b) => sortByDate(a,b))
    //     // console.log(dateArray);
    //     // console.log(sortedDates);
    //     const startDate = sortedDates[0];
    //     const endDate = sortedDates[sortedDates.length -1];
    //     setDateRange({start: startDate, end: endDate});
    // }

    const countyFIPS = ['13067', '13063', '13089', '13121', '13135']
    const countyBounds = {
        '999': {
            center: [33.77285,-84.33268],
            zoom: 9.8
        },
        '067': {
            center: [33.9132,-84.58030],
            zoom: props.smallScreen ? 10.2 : 11
        },
        '063': {
            center: [33.50533,-84.34112],
            zoom: props.smallScreen ? 10.5 : 11.2
        },
        '121': {
            center: [33.840747,-84.46563],
            zoom: props.smallScreen ? 9.4 : 10
        },
        '135': {
            center: [33.959468,-84.02901],
            zoom: props.smallScreen ? 10 : 10.8
        },
        '089': {
            center: [33.79857,-84.20737],
            zoom: props.smallScreen ? 10.4 : 11
        }
    }

    const CustomTooltip = () => (
        <div className='tooltip-content'>
        <div>
            In <span className='tooltip-data'>{selectedMonth} 2020</span>
            {/* between <span className='tooltip-data'>{dateRange.start}</span> and <span className='tooltip-data'>{dateRange.end}</span> */}
        </div>
        <div>
            in census tract <span className='tooltip-data'>{hoverID}</span>
        </div> 

        <div>
            there were <span className='tooltip-data'>{numeral(rawTractData[hoverID]).format('0,0')}</span> total reported eviction filings
        </div>
        <div>
            resulting in an eviction filing rate of <span className='tooltip-data'>{numeral(tractData[hoverID]).format('0.0')}%</span>.
        </div>




    </div>
    );

    // const Legend = () => (
       
    // );

    const featureStyler = feature => {
                        
        const geoid = feature.properties['GEOID'];
        const value = tractData[geoid];
        let color = null;
        bins.forEach((bin, i) =>
            value < bin.top && 
            value >= bin.bottom ? 
                color = colors[i]
            : null
        );

        return ({
            color: color ? color : null,
            weight: value ? 1 : 0,
            fillColor: color ? color : 'lightgrey',
            fillOpacity: color ? .7 : .2
        })    
    };

    useEffect(() => { handleData() }, [props.countyFilter, selectedMonth]);
    // useEffect(() => { handleDateRange() }, []);

    // console.log(props.boundaryGeoJSON);
    useEffect(() => getMonthList(), []);
    // console.log(monthOptions);
    // console.log(bins);

    return (
        <>
        <LeafletMap
            key={'leaflet-map-' + props.name}
            center={countyBounds[props.countyFilter.toString().padStart(3, '0')].center}
            zoom={countyBounds[props.countyFilter.toString().padStart(3, '0')].zoom}
            maxZoom={18}
            zoomSnap={0.2}
            zoomDelta={0.2}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            // bounds={null}
            // onViewportChange={e => console.log(e)}
        >
            {  props.boundaryGeoJSON ?
                <GeoJSON
                key={'county-boundary' + props.countyFilter }
                data={props.boundaryGeoJSON}
                filter={feature => props.countyFilter !== 999 && props.countyFilter !== '999' ?
                        feature.properties['GEOID'] === `13${props.countyFilter.toString().padStart(3, '0')}`
                        : countyFIPS.includes(feature.properties['GEOID']) }
                />
                : null
            }
            {  props.geojson && 
               tractData && 
               stats ?
                <GeoJSON
                    key={'map-layer-' + props.name + props.countyFilter + selectedMonth}
                    data={props.geojson}
                    onAdd={e => e.target.bringToBack()}
                    onMouseover={e => e.layer.feature ? setHoverID(e.layer.feature.properties.GEOID) : null}
                    onMouseout={() => setHoverID()}
                    onMouseDown={e => e.layer.feature ? setHoverID(e.layer.feature.properties.GEOID) : null}
                    filter={feature => props.countyFilter !== 999 && props.countyFilter !== '999' ? 
                        feature.properties['GEOID'].slice(2,5) === props.countyFilter.toString().padStart(3, '0') :
                        props.counties.includes(feature.properties['GEOID'].slice(2,5))}
                    style={feature => featureStyler(feature)}> 
                    <Tooltip>
                        <CustomTooltip />
                    </Tooltip>

                </GeoJSON>
                : <div style={{zIndex: '99999', color: '#609580', position: 'absolute', bottom: '35vh', width: '100%', textAlign: 'center'}}>
                    {/* <h2>Layers Loading...</h2> */}
                        <Loader id='loader-box' color='#DC1C13' type='Circles' />
                    </div>
            }
            <TileLayer
                key={'tile-layer'}
                attribution={'&copy <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'}
                url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'}


            />  
            
            
        </LeafletMap>

        { legendVisble && props.smallScreen ?
            <div 
                id='legend-close-icon'
                onClick={() => setLegendVisible(false)}
            >
                <Icon
                    // size='small'
                    inverted 
                    name='close'
                />
            </div> : null

        }
        { legendVisble ?
            <div className='legend'>
                <div id='legend-header'>
                    <h3>Eviction Filing Rate</h3>
                </div>
                <div id='month-selector'>

                    { props.smallScreen ?

                        <select value={selectedMonth} 
                            onChange={e => setSelectedMonth(e.target.value)}
                        >
                            {monthOptions ? monthOptions.map(month => 
                                <option 
                                key={month.text} value={month.value} id={`option-${month.text}`}>
                                    {month.text}</option>    
                            ) : null}
                        </select> :

                        <Dropdown
                            style={{float: 'center'}} 
                            // selection
                            inline
                            // fluid
                            placeholder="Select Month"
                            value={selectedMonth}
                            options={monthOptions}
                            onChange={(e, data) => setSelectedMonth(data.value)}
                        />
                    }
                </div>
                <div id='symbol-container'>
                    <div id='symbol-column'>
                        {
                            [...colors]
                                .reverse()    
                                .map(color =>
                                    <div className='legend-symbol' style={{backgroundColor: color}}/>
                                )
                        }                        
                    </div>
                    <div id='symbol-labels'>
                        {
                            bins ?
                                [...bins]
                                .reverse()
                                .map(bin =>
                                    <div className='legend-label'>
                                        {`${numeral(bin.bottom).format('0,0')}% to < ${numeral(bin.top).format('0,0')}%`}
                                    </div>
                                )
                            : null
                        }

                    </div>
                </div>

            </div> : null 
        }
        {   !legendVisble && props.smallScreen ?
            <div id='legend-icon'>
                <Icon 
                    name='list alternate outline' 
                    size='huge'
                    onClick={() => setLegendVisible(true)}
                />
            </div> : null
        }   
     </>
    )
}


export default EvictionMap;