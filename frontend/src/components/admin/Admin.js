import React, { useState, useEffect } from 'react';
import Axios from 'axios';


import { 	Typography, 
 			Button,
 			Chip, 
 			Card, 
 			CardActions, 
 			CardContent,
 			CardActionArea, 
 			CardMedia, 
 			CssBaseline,
 			Divider, 
 			Grid,  
 			Container,
 			Fab,
 			IconButton,
 			Drawer,
 			Paper,
 			List,
 			ListItem,
 			ListItemText,
 			Dialog,
 			DialogTitle,
 			DialogContent,
 			DialogContentText,
 			DialogActions,
 			FormControl,
 			FormControlLabel,
 			Checkbox,
 			TextField,
 			InputLabel,
 			Menu,
 			MenuItem,
 			AppBar,
 			Toolbar,
 			Table,
 			TableHead,
 			TableBody,
 			TableContainer,
 			TableCell,
 			TableRow   } from '@material-ui/core';


import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../../styles';



function Admin({ curStep, handleStep, selTableID, handleTableID, selTableNumber, handleTableNumber, selTableOccupied, handleTableOccupied }) {



	//Apply css styles from styles.js
	const classes = useStyles();

	//Auto responsive font sizes by viewport
	let theme = createMuiTheme();
	theme = responsiveFontSizes(theme);


	let [tableList, setTableList] = React.useState();
	let [isListLoading, setIsListLoading] = React.useState(true);
	//fetch tables
	useEffect(()=> {
		Axios.get("http://192.46.223.124:3001/api/fetch/tables")
		.then((response) => {
			setTableList(response.data);
			setIsListLoading(false);
			console.log("fetched");
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	let [selTableAdultCount, setSelTableAdultCount] = React.useState(null);
	let [selTableChildCount, setSelTableChildCount] = React.useState(null);

	//handle table selection
	function handleSelTable(id, number, occupied, adult, child, enter) {

		handleTableID(id);
		handleTableNumber(number);
		handleTableOccupied(occupied);
		setIsEnterPressed(enter);
		setSelTableAdultCount(adult);
		setSelTableChildCount(child);

	}

	let [openSeatDialog, setOpenSeatDialog] = React.useState(false);

	let [seatTableAdultCount, setSeatTableAdultCount] = React.useState(0);
	let [seatTableChildCount, setSeatTableChildCount] = React.useState(0);

	function handleOccupyButton() {
		setOpenSeatDialog(true);
	}
	function handleCloseSeatDialog() {
		setOpenSeatDialog(false);
		setSeatTableAdultCount(0);
		setSeatTableChildCount(0);
		setAdultSeatKeyPadNumber([]);
		setChildSeatKeyPadNumber([]);
	}

	//toggled seated and unseated
	function handleOccupyTable() {

		if(selTableID && selTableOccupied === 0 && seatTableAdultCount && seatTableAdultCount > 0) {

			handleTableOccupied(1);
			if(seatTableChildCount.length === 0) {
				setSeatTableChildCount(0);
			}
			Axios.post("http://192.46.223.124:3001/api/occupy/table", {
				selTableID: selTableID,
				selTableNumber: selTableNumber,
				seatTableAdultCount: seatTableAdultCount,
				seatTableChildCount: seatTableChildCount,
			})
			.then((response) => {
				setTableList(response.data);
				handleCloseSeatDialog();

			})
			.catch((e) => {
	       		console.log("error ", e)});

			
		}

		if(selTableID && selTableOccupied === 1) {

			handleTableOccupied(0);

			Axios.post("http://192.46.223.124:3001/api/unoccupy/table", {
				selTableID: selTableID,
			})
			.then((response) => {
				setTableList(response.data);

			})
			.catch((e) => {
	       		console.log("error ", e)});

			
		}

	}


	//delete table
	function handleDeleteTable() {
		if(selTableID) {

			Axios.post("http://192.46.223.124:3001/api/delete/table", {
				selTableID: selTableID,
			})
			.then((response) => {
				//update category list with fresh data
				setTableList(response.data);
				//reset selection
				handleSelTable(null, null, null, 0, 0, 0);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	};


	let [seatBoxFocus, setSeatBoxFocus] = React.useState(null);	
	let [adultSeatKeyPadNumber, setAdultSeatKeyPadNumber] = React.useState([]);
	let [childSeatKeyPadNumber, setChildSeatKeyPadNumber] = React.useState([]);

	//Handle keypad press, update keypad state if less than 3 digits
	function handleSeatNum(event, num) {
		if(adultSeatKeyPadNumber.length < 3 && seatBoxFocus === 0) {
			setAdultSeatKeyPadNumber(adultSeatKeyPadNumber => [...adultSeatKeyPadNumber, num]);
		}
		if(childSeatKeyPadNumber.length < 3 && seatBoxFocus === 1) {
			setChildSeatKeyPadNumber(childSeatKeyPadNumber => [...childSeatKeyPadNumber, num]);
		}
		console.log(seatTableChildCount);
	}
	//listen for keypad state change
	useEffect(() => {

			setSeatTableAdultCount(adultSeatKeyPadNumber.join(''));

	}, [adultSeatKeyPadNumber]);

	//listen for keypad state change
	useEffect(() => {

			setSeatTableChildCount(childSeatKeyPadNumber.join(''));

	}, [childSeatKeyPadNumber]);


	//Erase last number in keypad state
	function handleSeatBackSpace(event) {
		//If no number in state, do nothing
		if(adultSeatKeyPadNumber.length > 0 && seatBoxFocus === 0) {
			//Shallow copy of keypad state
			let tempPadNum = adultSeatKeyPadNumber;
			//Set keypad state with .slice() array; start at pos 0, end at -1 which is the last item
			setAdultSeatKeyPadNumber(tempPadNum.slice(0, -1));
		}
		//If no number in state, do nothing
		if(childSeatKeyPadNumber.length > 0 && seatBoxFocus === 1) {
			//Shallow copy of keypad state
			let tempPadNum = childSeatKeyPadNumber;
			//Set keypad state with .slice() array; start at pos 0, end at -1 which is the last item
			setChildSeatKeyPadNumber(tempPadNum.slice(0, -1));
		}

		return null;
	}




	//Keypad state variable
	let [padNum, setPadNum] = React.useState([]);

	//Handle keypad press, update keypad state if less than 3 digits
	function handlePadNum(event, num) {
		if(padNum.length < 3) {
			setPadNum(padNum => [...padNum, num]);
		} else {
			return null
		}
	}
	//Display keypad state in digits
	function DisplayPadNum() {
		//If no number in state, display nothing
		if(padNum.length > 0) {
			//Shallow copy of keypad state
			let dispNum = padNum;
			return (
				//Join array into digits
				dispNum.join('')
				)
		} else {
			return null
		}
	}
	//Erase last number in keypad state
	function handleBackSpace(event) {
		//If no number in state, do nothing
		if(padNum.length > 0) {
			//Shallow copy of keypad state
			let tempPadNum = padNum;
			//Set keypad state with .slice() array; start at pos 0, end at -1 which is the last item
			setPadNum(tempPadNum.slice(0, -1));
		} else {
			return null
		}
	}

	//state var to keep track if enter key was pressed on keypad
	let [isEnterPressed, setIsEnterPressed] = React.useState(0);
	//Handle enter key, set selected table to entered number
	function handleEnter (event) {

		//update enter key state
		setIsEnterPressed(1);
		//If no number in state, do nothing
		if(padNum.length > 0) {
			//Shallow copy of keypad state
			let dispNum = padNum;
			//Set selected table to joined array into digits
			handleTableNumber(dispNum.join(''));
			
			//Reset keypad state after setting table
			return (
				setPadNum([])
				)
		} else {
			return null
		}
	}
	//listen to see if selTableNumber changed
	useEffect(() => {

		//check that enter key was pressed on num pad
		if(isEnterPressed === 1) {
			//try to find table
			Axios.post("http://192.46.223.124:3001/api/find/table", {
				selTableNumber: selTableNumber,
			})
			.then((response) => {
				//if table found
				if(response.data.length === 1) {

					const foundTable = (response.data[0]);
					//select found table
					handleSelTable	(
										foundTable.table_id, 
										selTableNumber, 
										foundTable.occupied, 
										0
									);
					return;
				} 
				//if table not found
				if(response.data.length === 0) {
					//add table number as new table
					Axios.post("http://192.46.223.124:3001/api/add/table", {
						selTableNumber: selTableNumber,
					})
					.then((response) => {
						//get last inserted row
						var lastInsertRow = response.data;
						//select newly added table
						handleSelTable	(
										lastInsertRow.insertId, 
										selTableNumber, 
										0,
										0

									);

						Axios.get("http://192.46.223.124:3001/api/fetch/tables")
						.then((response) => {
							setTableList(response.data);
							setIsListLoading(false);
							console.log("fetched");
						})
						.catch((e) => {
				       		console.log("error ", e)});

					})
					.catch((e) => {
			       		console.log("error ", e)});

					return;
					
				}


			})
			.catch((e) => {
	       		console.log("error ", e)});

		}
		//if enter key was not pressed on keyepad, do nothing
		if(isEnterPressed === 0) {
			return;
		}

	}, [selTableNumber]);


	

	function handleTest() {
		Axios.get("http://192.46.223.124:3001/api/do/test")
		.then((response) => {
			console.log('yes');
		})
		.catch((e) => {
       		console.log("error ", e)});
	}
	function handlePrinterList() {
		Axios.get("http://192.46.223.124:3001/api/do/printerslist")
		.then((response) => {
			console.log('yes');
		})
		.catch((e) => {
       		console.log("error ", e)});
	}


	return (
<>	
		<CssBaseline />
		<main>
		<AppBar position="fixed">
					<Toolbar variant="dense">
						<Grid
							justify="space-between"
							alignItems="center"
							container
						>
							<Grid item>
								<Typography variant="h6">
				  					Table Manager
				  				</Typography>
							</Grid>
			              </Grid>
					</Toolbar>
				</AppBar>
				<Dialog open={openSeatDialog} onClose={handleCloseSeatDialog}>
					<DialogTitle>Seat Cover Number</DialogTitle>
					<DialogContent>
						<FormControl fullWidth>
							<TextField 
								autoFocus
								variant="filled"
								type="number"
								fullWidth
								margin="dense"
								label="Adults"
								value={seatTableAdultCount}
								InputProps={{
						        	readOnly: true,
						        }}
						        onFocus={() => setSeatBoxFocus(0)}												
							/>
							<TextField 
								variant="filled"
								type="number"
								label="Children"
								fullWidth
								margin="dense"
								value={seatTableChildCount}
								InputProps={{
						        	readOnly: true,
						        }}
						        onFocus={() => setSeatBoxFocus(1)}												
							/>
						</FormControl>
						<Grid container direction="row">
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 1)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													1
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 2)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													2
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 3)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													3
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>

							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 4)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													4
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 5)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													5
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 6)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													6
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>

							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 7)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													7
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 8)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													8
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 9)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													9
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>

							<Grid item xs={4}>
								<Card className={classes.adminSeatKeyPad} square>
									<CardContent>
										<Typography variant="h6" align="center">
											
										</Typography>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card square>
									<CardActionArea onClick={(event) => handleSeatNum(event, 0)}>
											<CardContent>
												<Typography variant="h6" color="textPrimary" align="center">
													0
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
							<Grid item xs={4}>
								<Card className={classes.adminKeyPadBackSpace} square>
									<CardActionArea onClick={(event) => handleSeatBackSpace(event)}>
											<CardContent>
												<Typography variant="h6" color="error" align="center">
													DEL
												</Typography>
											</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" color="default" onClick={() => handleCloseSeatDialog()}>
							Cancel
						</Button>
						<Button variant="contained" color="primary" disabled={seatTableAdultCount === '' || seatTableAdultCount <= 0} onClick={() => handleOccupyTable()}>
							Submit
						</Button>
					</DialogActions>
				</Dialog>
					<Grid container direction="row">
						<Grid item xs={8}>
							<Container maxWidth={false}>
							{isListLoading && (

								<Typography>loading...</Typography>

							)}
							{!isListLoading && (
								<Grid container spacing={2} className={classes.adminTablesCardGrid}>
								{tableList.map((table, index) => (
								<>
									<Grid key={index} item xs={3}>
									{table.occupied === 1 && (
										<Card className={classes.adminTablesCardSeated} square>
										<CardActionArea onClick={() => handleSelTable(table.table_id, table.table_number, table.occupied, table.adult_count, table.child_count, 0)}>
												<CardContent>
													<Grid container direction="column">
														<Grid item>
															<Typography variant="h6" color="textPrimary">
																{table.table_number}
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="subtitle2" color="textPrimary">
																Seated
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="subtitle1" color="textPrimary">
																{table.adult_count} a : {table.child_count} c
															</Typography>
														</Grid>
													</Grid>
												</CardContent>
										</CardActionArea>
										</Card>
									)}
									{table.occupied === 0 && (
										<Card className={classes.adminTablesCardAvailable} square>
										<CardActionArea onClick={() => handleSelTable(table.table_id, table.table_number, table.occupied, table.adult_count, table.child_count, 0)}>
												<CardContent>
													<Grid container direction="column">
														<Grid item>
															<Typography variant="h6" color="textPrimary">
																{table.table_number}
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="subtitle2" color="textPrimary">
																Available
															</Typography>
														</Grid>
														<Grid item>
															<Typography variant="subtitle1" color="textPrimary">
																---
															</Typography>
														</Grid>
													</Grid>
												</CardContent>
										</CardActionArea>
										</Card>
									)}
									</Grid>
								</>
								))}
									
								</Grid>
							)}
							</Container>
						</Grid>
						<Grid item xs={4}>
						<Paper elevation={1}>
							<Container maxWidth={false} className={classes.adminNavigationContainer}>
							{selTableID !== null && (

									<List>
										<ListItem>
											<Typography variant="h5" color="textPrimary" align="center">
												Table {selTableNumber}
											</Typography>
										</ListItem>
										<Divider />
										{selTableOccupied === 1 && (
										   	<ListItem button onClick={() => handleOccupyTable()}>
										   		<ListItemText primary="Close Table" />
										   	</ListItem>
										)}
										{selTableOccupied === 0 && (
										    <ListItem button onClick={() => handleOccupyButton()}>
										    	<ListItemText primary="Seat Table" />
										    </ListItem>
										)}
										<ListItem disabled={selTableOccupied === 0} button>
											<ListItemText primary="Print QR Code" />
										</ListItem>
										<ListItem button disabled={selTableOccupied === 0} onClick={() => handleStep(1001)}>
											<ListItemText primary="View Orders" />
										</ListItem>
										<ListItem button onClick={() => handleDeleteTable()}>
											<ListItemText primary="Remove Table" />
										</ListItem>
										<Divider />
										<ListItem button onClick={() => handleSelTable(null, null, null, 0)}>
											<ListItemText primary="Go Back" />
										</ListItem>
									</List>

								)}
							{selTableID === null && (
								<>
								<Grid container direction="column" justify="space-around" className={classes.adminNavigationGridColumn}>
									<Grid item className={classes.adminNavigationTitle}>
										<Typography variant="h4" color="textPrimary" align="center">
											Table number
										</Typography>
									</Grid>
									<Grid item>
										<Card square>
											<CardContent>
												<Typography className={classes.adminKeyPadDisplay} variant="h5" color="textPrimary" align="center">
													<DisplayPadNum />
												</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid item>
										<Grid container direction="row">
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 1)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	1
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 2)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	2
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 3)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	3
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>

											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 4)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	4
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 5)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	5
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 6)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	6
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>

											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 7)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	7
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 8)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	8
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 9)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	9
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>

											<Grid item xs={4}>
												<Card className={classes.adminKeyPadBackSpace} square>
													<CardActionArea onClick={(event) => handleBackSpace(event)}>
															<CardContent>
																<Typography variant="h6" color="error" align="center">
																	DEL
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square>
													<CardActionArea onClick={(event) => handlePadNum(event, 0)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center">
																	0
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
											<Grid item xs={4}>
												<Card square className={classes.adminKeyPadEnterKey}>
													<CardActionArea onClick={(event) => handleEnter(event)}>
															<CardContent>
																<Typography variant="h6" color="textPrimary" align="center" className={classes.adminKeyPadEnterText}>
																	ENTER
																</Typography>
															</CardContent>
													</CardActionArea>
												</Card>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<List>
									<Divider />
									<ListItem button onClick={() => handleStep(1010)}>
										<ListItemText primary="Category Manager" />
									</ListItem>
									<ListItem button onClick={() => handleStep(1020)}>
										<ListItemText primary="Menu Manager" />
									</ListItem>
									<ListItem button onClick={() => handleStep(1030)}>
										<ListItemText primary="Time Manager" />
									</ListItem>
									<ListItem button onClick={() => handleTest()}>
										<ListItemText primary="test" />
									</ListItem>
									<ListItem button onClick={() => handlePrinterList()}>
										<ListItemText primary="List Printers" />
									</ListItem>
								</List>
								</>
							)}

							</Container>
							</Paper>
						</Grid>
					</Grid>
			</main>
	</>

		)

}

export default Admin;