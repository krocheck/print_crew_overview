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
		case 'VenueAddress' :
			out = <VenueAddressRenderer/>
			break;
		case 'CrewContacts' :
			out = <ContactListRenderer/>
			break;
		case 'DestinationFlights':
			out = <DestinationFlightsRenderer/>
			break;
		case 'HotelConfirmations':
			out = <HotelConfirmationsRenderer/>
			break;
		case 'ReturnFlights':
			out = <ReturnFlightsRenderer/>
			break;
		case 'ScheduleOverview':
			break;
	}

	return out;
}

function ContactListRenderer() {
	const base = useBase();
	const table = base.getTableByName('Crew & Contacts');
	const view = table.getViewByNameIfExists('Crew Contacts');
	const records = useRecords(view);

	return (
		<table style={{borderCollapse: 'collapse', margin: '0 10px 10px 10px'}}>
			<thead>
				<tr>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Name
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Role
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Phone
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Email
					</td>
				</tr>
			</thead>
			<tbody>
			{records.map(record => {
				return (
					<tr key={record.id} style={{borderTop: '2px solid #ddd'}}>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Name')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Role')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Phone')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Email')}</td>
					</tr>
				);
			})}
			</tbody>
		</table>
	);
}

function DestinationFlightsRenderer() {
	const base = useBase();
	const table = base.getTableByName('Crew & Contacts');
	const view = table.getViewByNameIfExists('Destination Flights');
	const records = useRecords(view);

	return (
		<table style={{borderCollapse: 'collapse', margin: '0 10px 10px 10px'}}>
			<thead>
				<tr>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Arrival Time
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Airport
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Person
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Flight
					</td>
				</tr>
			</thead>
			<tbody>
			{records.map(record => {
				return (
					<tr key={record.id} style={{borderTop: '2px solid #ddd'}}>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Local Arrival Time (Destination Flight)')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Arrival Airport (Destination Flight)')}</td>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Name')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Flight # (Destination Flight)')}</td>
					</tr>
				);
			})}
			</tbody>
		</table>
	);
}

function HotelConfirmationsRenderer() {
	const base = useBase();
	const table = base.getTableByName('Crew & Contacts');
	const view = table.getViewByNameIfExists('Crew Hotel');
	const records = useRecords(view);

	return (
		<table style={{borderCollapse: 'collapse', margin: '0 10px 10px 10px'}}>
			<thead>
				<tr>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Name
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Check In
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Check Out
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Confirmation #
					</td>
				</tr>
			</thead>
			<tbody>
			{records.map(record => {
				return (
					<tr key={record.id} style={{borderTop: '2px solid #ddd'}}>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Name')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Check In (Hotel)')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Check Out (Hotel)')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Confirmation # (Hotel)')}</td>
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

function ReturnFlightsRenderer() {
	const base = useBase();
	const table = base.getTableByName('Crew & Contacts');
	const view = table.getViewByNameIfExists('Return Flights');
	const records = useRecords(view);

	return (
		<table style={{borderCollapse: 'collapse', margin: '0 10px 10px 10px'}}>
			<thead>
				<tr>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Departure Time
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Airport
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Person
					</td>
					<td style={{textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 'bold', padding: '0 10px'}}>
							Flight
					</td>
				</tr>
			</thead>
			<tbody>
			{records.map(record => {
				return (
					<tr key={record.id} style={{borderTop: '2px solid #ddd'}}>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Local Departure Time (Return Flight)')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Departure Airport (Return Flight)')}</td>
						<td style={{textAlign: 'left', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Name')}</td>
						<td style={{textAlign: 'center', whiteSpace: 'nowrap', padding: '0 10px'}}>{record.getCellValueAsString('Flight # (Return Flight)')}</td>
					</tr>
				);
			})}
			</tbody>
		</table>
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
