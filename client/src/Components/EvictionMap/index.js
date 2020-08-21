import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON } from 'react-leaflet';
import colormap from 'colormap';
import { csv } from 'd3';
import './style.css';
import moment from 'moment';
import { Icon } from 'semantic-ui-react';
import numeral from 'numeral';



const EvictionMap = props => {

    const devData = require('../../TEST-DATA/AllCountyEvictionCaseFilings-as-of-8-14-20.csv')
    const [tractData, setTractData] = useState();
    const [stats, setStats] = useState();
    const [legendOpen, setLegendOpen] = useState(true);
    // const [selectedPlace, setSelectedPlace] = useState();
    // const [dashboard, setDashboard] = useState(false)


    const [startDate, setStartDate] = useState('07-19-2020');
    const [endDate, setEndDate] = useState("");
    const [bins, setBins] = useState();

    
    const colors = ["#0c3383", "#0a7ab1", "#4a9d96", "#cbc74e",  "#d91e1e"]


    // Create function to setStats({max: value, min: value, range: value})
    const calcStats = data => {
        // console.log(Object.entries(data))
        const valueArray = Object.values(data);
        console.log(valueArray);
        const max = Math.max(...valueArray);
        const min = Math.min(...valueArray);
        setStats({
            max: max,
            min: min,
            range: max - min
        });

        const binSize = (max - min)/colors.length;
        console.log(binSize);

        const bins = [];

        for (let j = 1; j <= colors.length; j++) {
            bins.push({
                bottom: binSize * (j - 1) + min,
                top: binSize * j + min
            })
        }

        setBins(bins);
        // const legendBreaks = 
        // const statsObj = {...stats}
        // Object.entries(data).map(([key, value]) => {
        //     console.log(value)
        //     const minNum = (value <= stats.min) ? value : stats.min;
        //     const maxNum = (value >= stats.max) ? value : stats.max;
        //     setStats({ ...stats, max: maxNum, min: minNum, range: (maxNum - minNum) })
        //     console.log("MAX: " + maxNum + "    MIN: " + minNum)
        // })
        // console.log(stats)
    }

    const handleData = () =>
        csv(devData)
            .then(data => {
                const dataObject = {};
                data
                    // Build Filter on start and end date using MomentJS
                    // .filter(item => {
                    //    const date = moment(item["File.Date"]).format("MM-DD-YYYY");     
                    //    console.log(date)
                    //     let start = moment(date).isBefore(startDate, 'day')  ? date : startDate;
                    //     let end = moment(date).isAfter(endDate, 'day')  ? date : endDate;
                        
                    //     setStartDate(start)
                    //     setEndDate(end)
                    // })
                    .map(item =>
                        dataObject[item['tractID']] = dataObject[item['tractID']] ?
                            dataObject[item['tractID']] + parseFloat(item['Count'])
                            : parseFloat(item['Count']));


                // const dataArray = Object.entries(dataObject).map(([key,value]) => ({
                // "Tract": key,
                // "Count" : value
                // }));

                // console.log(dataArray);
                calcStats(dataObject);
                console.log(dataObject);

                setTractData(dataObject);
            })
            .catch(err => err ? console.log(err) : null)


    useEffect(() => { handleData() }, [startDate, endDate])
    // console.log(stats);


    // console.log(stats);


    // console.log(tractData)

    
    // colormap({
    //     colormap: 'portland',
    //     nshades: 72,
    //     format: 'hex',
    //     alpha: 1
    // });

    console.log(colors);

    // console.log(props.geojson);



    // console.log(colors);

    return (
        // <div id="mapid" style={{ height: "600px" }}>
        <LeafletMap
            key={'leaflet-map-' + props.name}
            center={[33.8, -84.4]}
            zoom={9}
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
                    filter={feature => feature.properties['PLNG_REGIO'] !== 'NON-ARC'}
                    style={feature => {

                        const maxValue = stats.max;
                        const minValue = stats.min;
                        const geoid = feature.properties['GEOID10'];
                        const value = tractData[geoid]
                        const distFromMin = value - minValue;
                        const range = stats.range;
                        const binningRatio = distFromMin / range;
                        const numberOfBins = 5;

                        // console.log(feature.properties);
                        // console.log(value);
                        // console.log(stats);
                        // console.log(geoid);

                        const color = value ? colors[Math.floor(binningRatio * numberOfBins)] : 'lightgrey';

                        return ({
                            color: value ? 'black' : null,
                            weight: value ? 1 : 0,
                            fillColor: value ? color : 'lightgrey',
                            fillOpacity: value ? .8 : 0
                    })
                }}
                />
                : null
            }

            {
                legendOpen ?


                    <div
                        className='legend'

                    >
                        <div id='symbol-column'>
                            {
                                colors
                                    .reverse()    
                                    .map(color =>
                                        <div className='legend-symbol' style={{backgroundColor: color}}/>
                                    )
                            }                        
                        </div>
                        <div id='symbol-labels'>
                            {
                                bins ?
                                    bins
                                    .reverse()
                                    .map(bin =>
                                        <div className='legend-label'>
                                            {`${bin.bottom} to < ${bin.top}`}
                                        </div>
                                    )
                                : null
                            }

                        </div>

                        {/* <div
                            id='left-legend'
                            className='legend'>
                        
                            <div className='symbol-row'>
                                {
                                    legendBreaks.map(value => {
                                        const radius = Math.sqrt(value / 3.141592653589793);

                                        // console.log(radius)
                                        return (
                                            <div className='symbol-box'>
                                                <div
                                                    style={{
                                                        height: `${radius * 2 * pageSizeRatio}px`,
                                                        width: `${Math.sqrt(value / 3.141592653589793) * 2 * pageSizeRatio}px`,
                                                        
                                                        border: 'solid black 1px',
                                                        float: 'right',
                                                        backgroundColor: 'rgba(0,0,255,0.1)'

                                                    }}
                                                />
                                            </div>)
                                    })
                                }
                            </div>

                        </div>
                        <div
                            id='center-legend'
                            className='legend'>
                            <div>
                            <div className='label-row'>
                                Evictions
                            </div>
                            </div>
                            <div className='symbol-row'>
                                {
                                    legendBreaks.map(value =>
                                        <div
                                            style={{
                                                paddingTop: `${10 * pageSizeRatio}px`
                                            }}
                                            className='value-box'>
                                            {numeral(value).format('0,0')}
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div
                            id='right-legend'
                            className='legend'
                        >
                           

                        </div> */}

                    </div>

                    : null
            }
            

            


            <TileLayer
                key={'tile-layer'}
                attribution={'&copy <a href="http://osm.org/copyright">OpenStreetMap contributors</a>'}
                url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'}

            />
        </LeafletMap>
        // </div>
    )
}


export default EvictionMap;