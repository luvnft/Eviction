import React from "react";
import { ExportToCsv } from "export-to-csv";
import { Button, Icon } from "semantic-ui-react";
import moment from "moment";
import "./style.css";

const CSVExportButton = (props) => {
  const csvTitle = props.csvTitle ? props.csvTitle : null;
  const csvFilename = props.csvFilename
    ? props.csvFilename
    : `download-${moment().format()}`;
  const csvHeaders = props.csvHeaders ? props.csvHeaders : null;
  const data = props.data ? Object.values(props.data) : null;
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    filename: csvFilename,
    showTitle: true,
    showLabels: true,
    title: csvTitle,
    useTextFile: false,
    useKeysAsHeaders: csvHeaders ? false : true,
    headers: csvHeaders,
  };
  const csvExporter = new ExportToCsv(csvOptions);

  return props.data ? (
    !props.smallScreen ? (
      <Button
        id="csv-button"
        color={"black"}
        onClick={() =>
          data
            ? csvExporter.generateCsv(data)
            : console.log("No Data for CSV Button")
        }
      >
        <Icon id="csv-button" name="download" /> {props.content}
      </Button>
    ) : (
      <Icon
        id="csv-button"
        name="download"
        onClick={
          data
            ? () => csvExporter.generateCsv(data)
            : console.log("No Data for CSV Button")
        }
      />
    )
  ) : null;
};

export default CSVExportButton;
