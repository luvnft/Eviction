import React from 'react';
import PropTypes from 'prop-types';
import { ExportToCsv } from 'export-to-csv';
import { Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import './style.css';

const CSVExportButton = ({
  content,
  csvFilename,
  csvTitle,
  csvHeaders,
  data,
  smallScreen
}) => {
  const title = csvTitle ? csvTitle : null;
  const filename = csvFilename ? csvFilename : `download-${moment().format()}`;
  const headers = csvHeaders ? csvHeaders : null;
  const dataArray = data ? Object.values(data) : null;
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    filename: filename,
    showTitle: true,
    showLabels: true,
    title: title,
    useTextFile: false,
    useKeysAsHeaders: headers ? false : true,
    headers: headers
  };
  const csvExporter = new ExportToCsv(csvOptions);

  return dataArray ? (
    !smallScreen ? (
      <Button
        id='csv-button'
        color={'black'}
        onClick={() =>
          dataArray
            ? csvExporter.generateCsv(dataArray)
            : console.log('No Data for CSV Button')
        }
      >
        <Icon id='csv-button' name='download' /> {content}
      </Button>
    ) : (
      <Icon
        id='csv-button'
        name='download'
        onClick={
          dataArray
            ? () => csvExporter.generateCsv(dataArray)
            : console.log('No Data for CSV Button')
        }
      />
    )
  ) : null;
};

CSVExportButton.propTypes = {
  content: PropTypes.string,
  csvFilename: PropTypes.string,
  csvTitle: PropTypes.string,
  csvHeaders: PropTypes.array,
  data: PropTypes.array,
  smallScreen: PropTypes.bool
};

export default CSVExportButton;
