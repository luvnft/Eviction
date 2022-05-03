import React from 'react';
import { Table } from 'semantic-ui-react';

const ApiDocBody = props => {
	return (
		<>
			<h2>{props.endpoint}</h2>

			<p>{props.description}</p>

			<h3>API Call</h3>
			<p>{props.apiCall}</p>

			<h3>Parameters</h3>
			<Table className="doc-table">
				<Table.Body>
					{props.tableData.map(item => (
						<Table.Row key={`${item.param}-row`}>
							<Table.Cell>{item.param}</Table.Cell>
							<Table.Cell>{item.permission}</Table.Cell>
							<Table.Cell>{item.description}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>

			<h3>Sample Request</h3>
			<p>{props.sampleRequest}</p>

			{props.requestKey ? (
				<>
					<h3>Request API Key</h3>
					<p>{props.requestKey}</p>
				</>
			) : null}

			{props.note ? (
				<>
					<h3>Note</h3>
					<p>{props.note}</p>
				</>
			) : null}
		</>
	);
};

export default ApiDocBody;