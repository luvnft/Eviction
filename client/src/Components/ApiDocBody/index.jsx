import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

const ApiDocBody = ({
  endpoint,
  description,
  apiCall,
  tableData,
  sampleRequest,
  requestKey,
  note
}) => {
  return (
    <>
      <h2>{endpoint}</h2>

      <p>{description}</p>

      <h3>API Call</h3>
      <p>{apiCall}</p>

      <h3>Parameters</h3>
      <Table className='doc-table'>
        <Table.Body>
          {tableData.map(item => (
            <Table.Row key={`${item.param}-row`}>
              <Table.Cell>{item.param}</Table.Cell>
              <Table.Cell>{item.permission}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <h3>Sample Request</h3>
      <p>{sampleRequest}</p>

      {requestKey ? (
        <>
          <h3>Request API Key</h3>
          <p>{requestKey}</p>
        </>
      ) : null}

      {note ? (
        <>
          <h3>Note</h3>
          <p>{note}</p>
        </>
      ) : null}
    </>
  );
};

ApiDocBody.propTypes = {
  endpoint: PropTypes.string,
  description: PropTypes.string,
  apiCall: PropTypes.string,
  tableData: PropTypes.array,
  sampleRequest: PropTypes.string,
  requestKey: PropTypes.string,
  note: PropTypes.string
};

export default ApiDocBody;