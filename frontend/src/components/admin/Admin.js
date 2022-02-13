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
 			TableRow   } from '@mui/material';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';

import KeyPad from './KeyPad';



function Admin({ curStep, handleStep, selTableID, handleTableID, selTableNumber, handleTableNumber, selTableOccupied, handleTableOccupied }) {



	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [tableBrackets, setTableBrackets] = React.useState()	
	let [tableList, setTableList] = React.useState();
	let [isListLoading, setIsListLoading] = React.useState(true);
	//fetch tables
	useEffect(()=> {
		Axios.get("http://192.46.223.124/api/fetch/tables")
		.then((response) => {
			setTableList(response.data);
			tableRanger(response.data)
				.then((res) => {
					setIsListLoading(false);
					console.log("fetched");	
				})
				.catch((e) => {
       				console.log("error ", e)});
					

		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	//create brackets of 10s for table number groups
	function tableRanger(data) {
		//create new Set (array that contains only unique values) 
		//iterate through table list and add to set
		const brackets = [...new Set(data.map(item => item.table_number - (item.table_number % 10)))];
		setTableBrackets(brackets);

		return new Promise((resolve, reject) => {
		    resolve(brackets);
		  });
	}

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
			Axios.post("http://192.46.223.124/api/occupy/table", {
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

			Axios.post("http://192.46.223.124/api/unoccupy/table", {
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

			Axios.post("http://192.46.223.124/api/delete/table", {
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
			Axios.post("http://192.46.223.124/api/find/table", {
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
					Axios.post("http://192.46.223.124/api/add/table", {
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

						Axios.get("http://192.46.223.124/api/fetch/tables")
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
		Axios.get("http://192.46.223.124/api/do/test")
		.then((response) => {
			console.log('yes');
		})
		.catch((e) => {
       		console.log("error ", e)});
	}
	function handlePrinterList() {
		Axios.get("http://192.46.223.124/api/do/printerslist")
		.then((response) => {
			console.log('yes');
		})
		.catch((e) => {
       		console.log("error ", e)});
	}


	return <>	
            <CssBaseline />
            <main>
            <AppBar position="fixed">
                        <Toolbar variant="dense">
                            <Grid
                                justifyContent="space-between"
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
                        <DialogTitle>How many to be seated?</DialogTitle>
                        <DialogContent>
                            <FormControl fullWidth>
                                <TextField 
                                    autoFocus
                                    variant="filled"
                                    type="number"
                                    fullWidth
                                    margin="dense"
                                    label="Number of adults"
                                    value={seatTableAdultCount}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    onFocus={() => setSeatBoxFocus(0)}												
                                />
                                <TextField 
                                    variant="filled"
                                    type="number"
                                    label="Number of children"
                                    fullWidth
                                    margin="dense"
                                    value={seatTableChildCount}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    onFocus={() => setSeatBoxFocus(1)}												
                                />
                            </FormControl>
                            <KeyPad 
                            	handlePadNum={handleSeatNum} 
                            	handleBackSpace={handleSeatBackSpace} 
                            	handleEnter
                            	usage="seat"
                        	  />
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => handleCloseSeatDialog()}>
                                Cancel
                            </Button>
                            <Button variant="contained" color="primary" disabled={seatTableAdultCount === '' || seatTableAdultCount <= 0} onClick={() => handleOccupyTable()}>
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                        <Grid container direction="row">
                            <Grid item xs={8}>
                                <Container maxWidth={false} className={classes.adminTablesCardGridContainer}>
                                {isListLoading && (

                                    <Typography>loading...</Typography>

                                )}
                                {!isListLoading && (
                                    <>
                                    <Grid container spacing={2} direction="row" className={classes.adminTablesCardGrid}>
                                    {tableBrackets.map((bracket, index) => (

                                        <Grid container spacing={2} xs={12} className={classes.adminTablesBracketsGrid}>
                                        <>
                                    
                                        {tableList.map((table, index) => (
                                        <>
                                        {bracket <= table.table_number && [ bracket+9 >= table.table_number && (
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
                                                                                {table.adult_count} adults
                                                                            </Typography>
                                                                    {(() => {
                                                                  if (table.child_count) {
                                                                    return (
                                                                            <Typography variant="subtitle1" color="textPrimary">
                                                                                {table.child_count} children
                                                                            </Typography>

                                                                            )
                                                                  } else {
                                                                    return (
                                                                            <Typography variant="subtitle1" color="textPrimary">
                                                                                ---
                                                                            </Typography>
                                                                            )
                                                                  }
                                                                })()}
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
                                            )]}
                                        </>
                                        ))}
                                    
                                    </>
                                        </Grid>
                                        
                                    ))}

                                    </Grid>

                                    </>
                                    
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
                                    <Grid container direction="column" justifyContent="space-around" className={classes.adminNavigationGridColumn}>
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
                                            <KeyPad 
                                            	handlePadNum={handlePadNum} 
                                            	handleBackSpace={handleBackSpace} 
                                            	handleEnter={handleEnter}
                                            	usage="table"
                                            	  />
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
        </>;

}

export default Admin;