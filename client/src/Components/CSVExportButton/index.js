import React from 'react';
// import API from '../../utils/API';
import { ExportToCsv } from 'export-to-csv';
// import { Button } from 'semantic-ui-react';
import { Button, Icon } from 'semantic-ui-react';

import moment from 'moment';
import './style.css';


const CSVExportButton = props => {

  const csvTitle = props.csvTitle ? props.csvTitle : null;
  const csvFilename = props.csvFilename ? props.csvFilename : `download-${moment().format()}`;
  const csvHeaders = props.csvHeaders ? props.csvHeaders : null;
    
  const data = props.data ? 
    Object.values(props.data)
    : null;

    console.log(props.data);
        
  

  const csvOptions = 
            { 
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalSeparator: '.',
              filename: csvFilename, 
              showTitle: true,
              showLabels: true,
              title: csvTitle,
              useTextFile: false,
              useKeysAsHeaders: csvHeaders ? false : true,
              headers: csvHeaders
            };

  const csvExporter = new ExportToCsv(csvOptions);

        
  return (
    props.data ?
      !props.smallScreen ?
      <Button
        id='csv-button'
        // inverted
        // name='download'
        // size={props.size ? props.size : 'small'}
        // basic={ props.basic ? props.basic : "false" }
        color={ 'black'}
        // style={{
        //   // padding: '5px',  
        //   margin: props.margin ? props.margin : '10px',
        // //   float: props.float ? props.float : 'left',
        //   borderRadius: props.borderRadius ? props.borderRadius : '5px 5px 0 0',
        //   height: props.height ? props.height : '40px'}}
        onClick={data ? () =>
         
          csvExporter.generateCsv(data) 
          : console.log('No Data for CSV Button')}
      >
        < Icon
          id='csv-button'
          name='download' 
        /> {props.content}
      </Button> : 
            < Icon
            id='csv-button'
            name='download'
            // size={'big'}
            onClick={data ? () =>
             
              csvExporter.generateCsv(data) 
              : console.log('No Data for CSV Button')}
          />
      : null 
  )

};

export default CSVExportButton;