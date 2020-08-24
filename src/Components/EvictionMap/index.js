import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON } from 'react-leaflet';
import numeral from 'numeral';
import moment from 'moment';
import Loader from 'react-loader-spinner';

import './style.css';
// import { color } from 'd3';


const EvictionMap = props => {

    const [tractData, setTractData] = useState();
    const [stats, setStats] = useState();
    const [bins, setBins] = useState();
    const colors = ["#DC1C13", "#EA4C46", "#F07470", "#F1959B",  "#F6BDC0"].reverse();

    // console.log(props.geojson);

    // const [ monthOptions, setMonthOptions ] = useState();

    // const getMonthList = () => {
    //     const monthArray = [];
    //     props.data.map(item => 
    //         !monthArray.includes(moment(item['File.Date']).format('MMMM')) ? 
    //             monthArray.push(moment(item['File.Date']).format('MMMM'))
    //         : null
    //     );
    //     setMonthOptions(monthArray);
    // }
    
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



        createBins('defined', [5, 10, 15, 30, 50]);


   

        setBins(bins);
        // console.log(bins);
    }

    const handleData = () => {
        const dataObject = {};
        const normalizeData = {};

        props.data
            .filter(item =>
                props.countyFilter !== 999 ? 
                props.countyFilter === item['COUNTYFP10'] 
                : true
            )
            // .filter()
            .map(item =>
                dataObject[item['tractID']] = dataObject[item['tractID']] ?
                    (dataObject[item['tractID']] + parseFloat(item['Total Filings']))
                    : parseFloat(item['Total Filings'])
            );

        props.normalizeData.map(item => dataObject[item['GEOID']] > 0 && item['RentHHs'] ?
            dataObject[item['GEOID']] = dataObject[item['GEOID']] * 100 / item['RentHHs']
            : null
        );

        props.normalizeData.map(item => normalizeData[item['GEOID']] = item['RentHHs'])


        calcStats(dataObject);
        setTractData(dataObject);
        // setNormalizeData(normalizeData);
        // console.log(dataObject);
    }

    useEffect(() => { handleData() }, [props.countyFilter]);
    // useEffect(() => getMonthList(), []);
    // console.log(monthOptions);
    // console.log(bins);

    return (
        <LeafletMap
            key={'leaflet-map-' + props.name}
            center={[33.8, -84.4]}
            zoom={10}
            maxZoom={18}
            attributionControl={true}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
        >
            {  props.geojson && 
               tractData && 
               stats ?
                <GeoJSON
                    key={'map-layer-' + props.name}
                    data={props.geojson}
                    // filter={feature => feature.properties['PLNG_REGIO'] !== 'NON-ARC'}
                    style={feature => {
                        
                        const geoid = feature.properties['GEOID'];
                        // const normalizer = normalizeData[geoid];
                        const value = tractData[geoid];
                        // console.log(`${geoid}: ${value}`)
                        // console.log(value);
                        let color = null;
                        bins.forEach((bin, i) =>
                            value < bin.top && 
                            value > bin.bottom ? 
                                color = colors[i]
                            : null
                        );

                        // console.log(value);
                        // console.log(normalizer);
                        // console.log(geoid);

                        return ({
                            color: color ? color : null,
                            weight: value ? 1 : 0,
                            fillColor: color ? color : 'lightgrey',
                            fillOpacity: color ? .7 : 0
                    })
                }}
                />
                : <div style={{zIndex: '99999', color: '#609580', position: 'absolute', bottom: '50%', width: '100%', textAlign: 'center'}}>
                    <h2>Layers Loading...</h2>
                        <Loader id='loader-box' color='#609580' type='Circles' />
                    </div>
            }

            <TileLayer
                key={'tile-layer'}
                attribution={'&copy <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'}
                url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'}

            />                
            <div className='legend'>
                <div id='legend-header'>
                    <h3>Eviction Filing Rate</h3>
                </div>
                <div id='symbol-container'>

                <div id='symbol-column'>
                    {
                        colors
                            // .reverse()    
                            .map(color =>
                                <div className='legend-symbol' style={{backgroundColor: color}}/>
                            )
                    }                        
                </div>
                <div id='symbol-labels'>
                    {
                        bins ?
                            bins
                            // .reverse()
                            .map(bin =>
                                <div className='legend-label'>
                                    {`${numeral(bin.bottom).format('0,0')}% to < ${numeral(bin.top).format('0,0')}%`}
                                </div>
                            )
                        : null
                    }

                </div>
                </div>

            </div>
        </LeafletMap>
    )
}


export default EvictionMap;