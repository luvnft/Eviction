import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer, GeoJSON } from 'react-leaflet';
import numeral from 'numeral';
import './style.css';
import { color } from 'd3';


const EvictionMap = props => {

    const [tractData, setTractData] = useState();
    // const [normalizeData, setNormalizeData] = useState();
    const [stats, setStats] = useState();
    const [bins, setBins] = useState();
    const colors = ["#0c3383", "#0a7ab1", "#4a9d96", "#cbc74e",  "#d91e1e"].reverse();

    console.log(props.geojson);
    




    // Create function to setStats({max: value, min: value, range: value})
    const calcStats = data => {
        // console.log(Object.entries(data))
        const valueArray = Object.values(data).filter(a => a > 0).sort((a,b) => a > b ? -1 : 1);
        console.log(valueArray);
        const max = Math.max(...valueArray);
        const min = Math.min(...valueArray);
        setStats({
            max: max,
            min: min,
            range: max - min
        });

        // const binSize = (max - min)/colors.length;
        const bins = [];

        

        for (let j = 0; j < colors.length; j++) {
            bins.push({
                top: valueArray[Math.floor(j * valueArray.length/colors.length)],
                bottom: valueArray[Math.floor((j + 1) * valueArray.length/colors.length) - 1]
            })
        }

        setBins(bins);
        console.log(bins);
    }

    const handleData = () => {
        const dataObject = {};
        const normalizeData = {};

        props.data
            // .filter()
            .map(item =>
                dataObject[item['tractID']] = dataObject[item['tractID']] ?
                    (dataObject[item['tractID']] + parseFloat(item['Count']))
                    : parseFloat(item['Count'])
            );

        props.normalizeData.map(item => dataObject[item['GEOID']] > 0 && item['RentHHs'] ?
            dataObject[item['GEOID']] = dataObject[item['GEOID']] * 100 / item['RentHHs']
            : null
        );

        props.normalizeData.map(item => normalizeData[item['GEOID']] = item['RentHHs'])


        calcStats(dataObject);
        setTractData(dataObject);
        // setNormalizeData(normalizeData);
        console.log(dataObject);
    }

    useEffect(() => { handleData() }, []);
    console.log(stats);
    console.log(bins);

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
                            color: value ? 'black' : null,
                            weight: value ? 1 : 0,
                            fillColor: color ? color : 'lightgrey',
                            fillOpacity: color ? .8 : 0
                    })
                }}
                />
                : null
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
                                    {`${numeral(bin.bottom).format('0,0.0')} to < ${numeral(bin.top).format('0,0.0')}`}
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