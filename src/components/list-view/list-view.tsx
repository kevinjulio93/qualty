import { Button, Pagination, Stack, Typography } from '@mui/material';
import React from 'react'
import Search from '../search/search';
import Toast from '../toast/toast';
import LoadingComponent from '../loading/loading';
import { Table, TableCell, TableRow } from '../table/table';
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import './list-view.scss';

interface IListViewProp {
	sectionTitle: string,
	sectionDescription: string,
	createButtonText: string,
	openToast: boolean,
	toastMessage: string,
	toastSeverity: string,
	isLoading: boolean,
	columnHeaders: Array<{ label: string, rowKey: string }>,
	listContent: Array<any>,
	totalPages:number,
	listTitle:string,
	createButton?: any,
	currentPage?: number,
	handleCreatebutton?: () => void,
	hanldeSearchFunction: (param) => void,
	hanldeVoidInputFunction: () => void,
	handleCloseToast: () => void,
	handleEdit: (param) => void,
	handleDelete: (param) => void,
	handlePaginationChange: (param) => void,



}

function ListView(props: IListViewProp) {
	const renderButton = () => {
		return props.createButton || 
		<Button className="btn-create" onClick={() => props.handleCreatebutton()}>
			{props.createButtonText}
		</Button>
	}
	return (
		<div className="users-container">
			<div className="users-container__actions">
				<div className="content-page-title">
					<Typography variant="h5" className="page-header">
						{props.sectionTitle}
					</Typography>
					<span className="page-subtitle">
						{props.sectionDescription}
					</span>
				</div>
				{renderButton()}
			</div>

			<div className="main-center-container">
				<div className="panel-heading">
					{props.listTitle}
					<Search
						label="Buscar Eventos"
						searchFunction={(data) => props.hanldeSearchFunction(data)}
						voidInputFunction={() => props.hanldeVoidInputFunction()}
					/>
					<Toast
						open={props.openToast}
						message={props.toastMessage}
						severity={props.toastSeverity}
						handleClose={() => props.handleCloseToast}
					/>
				</div>
				{props.isLoading ? (
					<LoadingComponent></LoadingComponent>
				) : (
					<>
						<Table>
							<TableRow header>
								{props.columnHeaders.map((column, index) => {
									return (
										<TableCell key={column.label+index}>{column.label}</TableCell>
									)
								})}
							</TableRow>
							{props.listContent.map((row: any) => {
								return (
									<TableRow key={row._id}>
										{
											props.columnHeaders.map((column, index) => {
												return (<TableCell key={column.rowKey+index}>{row[column.rowKey]}</TableCell>)
											})
										}

										<TableCell>
											<Stack direction="row" spacing={2}>
												<EditIcon
													className="action-item-icon action-item-icon-edit"
													onClick={() => props.handleEdit(row)}
												></EditIcon>

												<ClearIcon
													className="action-item-icon action-item-icon-delete"
													onClick={() => props.handleDelete(row)}
												></ClearIcon>
											</Stack>
										</TableCell>
									</TableRow>
								);
							})}
							
						</Table>
						{
								props.listContent.length === 0 &&
								<div className='table-empty-state'>
									<span>No hay registros </span>
								</div>
							}
						<Pagination
							count={props.totalPages}
							onChange={(_,page)=> props.handlePaginationChange(page)}
							page={props.currentPage ?? 1}
						/>
					</>
				)}
			</div>
		</div>
	)
}

export default ListView