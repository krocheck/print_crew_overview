import {
	initializeBlock,
	Button,
	useBase,
	useRecords,
	Box,
	CellRenderer,
} from '@airtable/blocks/ui';
import React from 'react';
import printWithoutElementsWithClass from './print_without_elements_with_class';

function PrintRecordsApp() {
	return (
		<div>
			<Toolbar />
			<Box margin={3}>
				<Report />
			</Box>
		</div>
	);
}

function Toolbar() {
	return (
		<Box className="print-hide" padding={2} borderBottom="thick" display="flex">
			<Button
				onClick={() => {
					printWithoutElementsWithClass('print-hide');
				}}
				marginLeft={2}
			>
				Print
			</Button>
		</Box>
	);
}

function Report() {
	const base = useBase();
	const table = base.getTableByName('Documentation');
	const view = table.getViewByNameIfExists('Crew Overview');
	const records = useRecords(view);

	return (
		<div>
			<Box marginY={3}>
				<Header/>
				{records.map(record => {
					// Render a check or an x depending on if the artist is on display or not.
					const isRowIncluded = record.getCellValue('Include');
					
					return (
						(isRowIncluded ? (
							<div style={{breakInside: 'avoid'}}>
								<p style={{fontWeight: 'bold', fontSize: 'larger', textDecoration: 'underline'}}>{record.getCellValue('Name')}</p>
								<NotesRenderer
									table = {table}
									fieldName = {"Notes Before Data"}
									record = {record}
								/>
								<DataRenderer
									fieldName = {"Data Hint"}
									record = {record}
								/>
								<NotesRenderer
									table = {table}
									fieldName = {"Notes After Data"}
									record = {record}
								/>
							</div>) : "")
					);
				})}
			</Box>
		</div>
	);
}

function Header() {
	const base = useBase();
	const table = base.getTableByName('Overview');
	const view = table.getViewByNameIfExists('Data');
	const records = useRecords(view);
	const record = records[0];
	const startDate = new Date(record.getCellValueAsString('Start Date'))
	const endDate = new Date(record.getCellValueAsString('End Date'))
	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	return (
		<div>
			<img src="https://trimarq.com/wp-content/uploads/2017/04/New_TriMarq_big.png" width="25%" style={{float:'left', paddingRight: '20px'}}/>
			<h2>
				{record.getCellValue('Event')}
				<br />
				{monthNames[startDate.getMonth()]} {startDate.getDate()} - {startDate.getMonth() != endDate.getMonth() ? monthNames[endDate.getMonth()] : ''} {endDate.getDate()}{', ' + record.getCellValueAsString('Venue City, State')}
			</h2>
		</div>
	);
}

function DataRenderer({fieldName, record}) {
	const value = record.getCellValueAsString(fieldName);
	let out = '';

	switch(value) {
		case 'CrewContacts' :
			out = <FourColumnTableRenderer
				tableName={'Crew & Contacts'}
				viewName={'Crew Contacts'}
				column1Heading={'Name'}
				column1Cell={'Name'}
				column2Heading={'Role'}
				column2Cell={'Role'}
				column3Heading={'Phone'}
				column3Cell={'Phone'}
				column4Heading={'Email'}
				column4Cell={'Email'}
			/>
			break;
		case 'DestinationFlights':
			out = <FourColumnTableRenderer
				tableName={'Crew & Contacts'}
				viewName={'Destination Flights'}
				column1Heading={'Arrival Time'}
				column1Cell={'Local Arrival Time (Destination Flight)'}
				column2Heading={'Airport'}
				column2Cell={'Arrival Airport (Destination Flight)'}
				column3Heading={'Person'}
				column3Cell={'Name'}
				column4Heading={'Flight'}
				column4Cell={'Flight # (Destination Flight)'}
			/>
			break;
		case 'HotelConfirmations':
			out = <FourColumnTableRenderer
				tableName={'Crew & Contacts'}
				viewName={'Crew Hotel'}
				column1Heading={'Name'}
				column1Cell={'Name'}
				column2Heading={'Check In'}
				column2Cell={'Check In (Hotel)'}
				column3Heading={'Check Out'}
				column3Cell={'Check Out (Hotel)'}
				column4Heading={'Confirmation #'}
				column4Cell={'Confirmation # (Hotel)'}
			/>
			break;
		case 'ReturnFlights':
			out = <FourColumnTableRenderer
				tableName={'Crew & Contacts'}
				viewName={'Return Flights'}
				column1Heading={'Departure Time'}
				column1Cell={'Local Departure Time (Return Flight)'}
				column2Heading={'Airport'}
				column2Cell={'Arrival Airport (Return Flight)'}
				column3Heading={'Person'}
				column3Cell={'Name'}
				column4Heading={'Flight'}
				column4Cell={'Flight # (Return Flight)'}
			/>
			break;
		case 'ScheduleOverview':
			break;
		case 'VenueAddress' :
			out = <VenueAddressRenderer/>
			break;
	}

	return out;
}

function FourColumnTableRenderer({tableName, viewName, column1Heading, column1Cell, column2Heading, column2Cell, column3Heading, column3Cell, column4Heading, column4Cell}) {
	const base = useBase();
	const table = base.getTableByName(tableName);
	const view = table.getViewByNameIfExists(viewName);
	const records = useRecords(view);

	return (
		<table style={{borderCollapse: 'collapse', margin: '0 10px 10px 10px'}}>
			<thead>
				<tr>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
						{column1Heading}
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
						{column2Heading}
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
						{column3Heading}
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
						{column4Heading}
					</td>
				</tr>
			</thead>
			<tbody>
			{records.map(record => {
				return (
					<tr key={record.id} style={{borderTop: '2px solid #ddd'}}>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString(column1Cell)}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString(column2Cell)}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString(column3Cell)}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString(column4Cell)}</td>
					</tr>
				);
			})}
			</tbody>
		</table>
	);
}

function NotesRenderer({table, fieldName, record}) {
	const field = table.getFieldByName(fieldName);
	const value = record.getCellValue(fieldName);
	const isNotesData = (value != '\n' && value != '' && value !== null)

	return (
		(isNotesData ? (
		<div>
			<CellRenderer field={field} record={record} />
		</div>) : "")
	);
}

function VenueAddressRenderer() {
	const base = useBase();
	const table = base.getTableByName('Overview');
	const view = table.getViewByNameIfExists('Data');
	const records = useRecords(view);
	const record = records[0];

	return (
		<div>
			{record.getCellValue('Venue Name')}
			<br />
			{record.getCellValue('Venue Address')}
			<br />
			{record.getCellValue('Venue City, State')} {record.getCellValue('Venue Zip')}
		</div>
	);
}

initializeBlock(() => <PrintRecordsApp />);
