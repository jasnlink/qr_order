import React, { useState, useEffect } from 'react';
import Axios from 'axios';


import { 	Typography, 
 			Button,
 			ButtonGroup,
 			TextField,
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
 			Menu,
 			MenuItem,
 			AppBar,
 			Toolbar,
 			Table,
 			TableHead,
 			TableBody,
 			TableContainer,
 			TableCell,
 			TableRow,
 			FormControl,
 			Select,
 			InputLabel   } from '@material-ui/core';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../../styles';


function AdminTimeManager({ curStep, handleStep }) {


	//Apply css styles from styles.js
	const classes = useStyles();

	//Auto responsive font sizes by viewport
	let theme = createMuiTheme();
	theme = responsiveFontSizes(theme);



	let [timeGroupList, setTimeGroupList] = React.useState();
	let [isTimeGroupListLoading, setIsTimeGroupListLoading] = React.useState(true);

	//fetch time groups
	useEffect(()=> {
		Axios.get("http://192.46.223.124:3001/api/fetch/timegroup")
		.then((response) => {
			setTimeGroupList(response.data);
			setIsTimeGroupListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	//time group selection
	let [selTimeGroupID, setSelTimeGroupID] = React.useState(null);
	let [selTimeGroupName, setSelTimeGroupName] = React.useState('');

	let [fromTime, setFromTime] = React.useState('');
	let [toTime, setToTime] = React.useState('');

	function handleSelTimeGroup(timeGroupID, timeGroupName, from, to) {
		if(timeGroupID !== selTimeGroupID) {

			setSelTimeGroupID(timeGroupID);
			setSelTimeGroupName(timeGroupName);
			setFromTime(from);
			setToTime(to);

		}
	}

	//days of the week selection
	let [selDays, setSelDays] = React.useState([]);

	const handleSelDays = (event: React.MouseEvent<HTMLElement>, newDays: string[]) => {
		if(newDays.length) {
			setSelDays(newDays);
		}
	};


	//state var to hold selected categories response data
	let [categoriesData, setCategoriesData] = React.useState([]);
	//state var to hold selected days
	let [timeData, setTimeData] = React.useState([]);
	let [isTimeDataLoading, setIsTimeDataLoading] = React.useState(true);

	//fetch time data (selected days) from selected timegroup
	useEffect(()=> {
		Axios.post("http://192.46.223.124:3001/api/fetch/timedata", {
				selTimeGroupID: selTimeGroupID,
			})
		.then((response) => {
			setTimeData(response.data);
			setIsTimeDataLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});

		//fetch selected categories from time group
		Axios.post("http://192.46.223.124:3001/api/fetch/timecategories", {
				selTimeGroupID: selTimeGroupID,
			})
		.then((response) => {
			setCategoriesData(response.data);
			console.log(categoriesData);
		})
		.catch((e) => {
       		console.log("error ", e)});



	}, [selTimeGroupID]);


	//selected categories
	let [selCategories, setSelCategories] = React.useState([]);

	//category list from database to populate select list
	let [categoryList, setCategoryList] = React.useState([]);
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);

	//populate days array with data
	useEffect(()=> {
		if(timeData.length) {
			//temp array to store selected days
			let daysData = [];
			//add each row of days as string from db into temp array
			timeData.map((time) => (daysData.push(time.day.toString())));
			//set the state var to value of temp array
			setSelDays(daysData);
			//fetch category list to populate select list
			Axios.get("http://192.46.223.124:3001/api/fetch/categories")
			.then((response) => {
				setCategoryList(response.data);
				setIsCategoryListLoading(false);
				console.log("fetched");
			})
			.catch((e) => {
	       		console.log("error ", e)});

		} else {
			//set selected days to empty if nothing from db
			setSelDays([]);
		}
	}, [timeData]);


	

	//populate selected categories from time group
	useEffect(()=> {
		if(categoriesData.length) {
			//temp array to store selected categories
			let catData = [];
			//add each row of category_id from db into temp array
			categoriesData.map((category) => (catData.push(category.category_id)));
			//set the state var value to temp array
			setSelCategories(catData);
		} else {
			//set selected categories to empty if nothing from db
			setSelCategories([]);
		}
	}, [categoriesData]);
	
	//selected categories in select menu
	function handleSelCategories(event) {
		setSelCategories(event.target.value);
	}

	//save changes to database
	function handleSaveChanges() {
		if(selTimeGroupID) {
			//format times to hh:mm:ss
			let insertFromTime = fromTime+":00";
			let insertToTime = toTime+":00";

			Axios.post("http://192.46.223.124:3001/api/save/timegroup", {
					selTimeGroupID: selTimeGroupID,
					fromTime: insertFromTime,
					toTime: insertToTime,
					selDays: selDays,
					selCategories: selCategories
				})
			.then((response) => {
				setSelTimeGroupID(null);
				setSelTimeGroupName('');
				setFromTime('');
				setToTime('');
				setTimeGroupList(response.data);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}
	}

	let [showAddTimeGroup, setShowAddTimeGroup] = React.useState(null);

	function handleAddTimeGroupButton() {

		if(showAddTimeGroup === null) {
			setShowAddTimeGroup(1);
		}
		if(showAddTimeGroup === 1) {
			setShowAddTimeGroup(null);
			setNewTimeGroupName('');
		}
	}

	let [newTimeGroupName, setNewTimeGroupName] = React.useState('');

	function handleAddTimeGroup() {

		if(newTimeGroupName) {
			Axios.post("http://192.46.223.124:3001/api/add/timegroup", {
						newTimeGroupName: newTimeGroupName,
					})
				.then((response) => {
					setSelTimeGroupID(null);
					setSelTimeGroupName('');
					setFromTime('');
					setToTime('');
					setTimeGroupList(response.data);

					setShowAddTimeGroup(null);
					setNewTimeGroupName('');
				})
				.catch((e) => {
		       		console.log("error ", e)});
		}
	}

	let [showEditTimeGroup, setShowEditTimeGroup] = React.useState(null);

	function handleEditTimeGroupButton() {

		if(showEditTimeGroup === null) {
			setNewTimeGroupName(selTimeGroupName);
			setShowEditTimeGroup(1);
		}
		if(showEditTimeGroup === 1) {
			setShowEditTimeGroup(null);
			setNewTimeGroupName('');
		}
	}
	
	function handleEditTimeGroup() {
		if(newTimeGroupName) {
			Axios.post("http://192.46.223.124:3001/api/edit/timegroup", {
					selTimeGroupID: selTimeGroupID,
					newTimeGroupName: newTimeGroupName,
				})
			.then((response) => {
				setSelTimeGroupID(null);
				setSelTimeGroupName('');
				setFromTime('');
				setToTime('');
				setTimeGroupList(response.data);

				setShowEditTimeGroup(null);
				setNewTimeGroupName('');
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}
	}
	function handleDeleteTimeGroup() {
		if(selTimeGroupID) {
			Axios.post("http://192.46.223.124:3001/api/delete/timegroup", {
					selTimeGroupID: selTimeGroupID,
				})
			.then((response) => {
				setSelTimeGroupID(null);
				setSelTimeGroupName('');
				setFromTime('');
				setToTime('');
				setTimeGroupList(response.data);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}
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
		<Grid container direction="row">
				<Grid item xs={2} className={classes.adminTimeGroupListContainer}>
					<Container className={classes.adminTimeGroupCardGrid} maxWidth="md">
							{isTimeGroupListLoading && (

								<Typography>loading...</Typography>

							)}
							{!isTimeGroupListLoading && (

								<Grid container direction="column" spacing={2}>
								{timeGroupList.map((timegroup, index) => (
									<Grid item key={index}>
										<Card className={classes.Card}>
											<CardActionArea onClick={() => handleSelTimeGroup(timegroup.time_group_id, timegroup.time_group_name, timegroup.from_time, timegroup.to_time)}>
												<Grid className={classes.adminTimeGroupCard} container alignItems="center" justify="space-around">
													<Grid item>
														<Typography variant="subtitle2" color="textPrimary">
															{timegroup.time_group_name}
														</Typography>
													</Grid>
												</Grid>
											</CardActionArea>
										</Card>
									</Grid>
								))}
								</Grid>

							)}
					</Container>
				</Grid>
				<Grid item xs={6} className={classes.adminTimeGroupListContainer}>

						<Container className={classes.adminTimeManagerCardGrid} maxWidth="md">	
							{isTimeDataLoading && [ selTimeGroupID && [ !showAddTimeGroup && [ !showEditTimeGroup &&   (

								<Typography>loading...</Typography>

							)]]]}
							{!isTimeDataLoading && [ selTimeGroupID && [ !showAddTimeGroup && [ !showEditTimeGroup &&   (						
								<Grid container direction="column" spacing={2}>
									<Grid item>
										<Card className={classes.adminTimeManagerCard}>
										<Typography variant="h5">
											{selTimeGroupName} Schedule
										</Typography>
											<ToggleButtonGroup value={selDays} onChange={handleSelDays} className={classes.adminTimeManagerButtonGroup}>
											    <ToggleButton value="1">Mon</ToggleButton>
											    <ToggleButton value="2">Tue</ToggleButton>
											    <ToggleButton value="3">Wed</ToggleButton>
											    <ToggleButton value="4">Thu</ToggleButton>
											    <ToggleButton value="5">Fri</ToggleButton>
											    <ToggleButton value="6">Sat</ToggleButton>
											    <ToggleButton value="0">Sun</ToggleButton>
										    </ToggleButtonGroup>
										    <Grid container direction="row" spacing={4} className={classes.adminTimeManagerTimeBlock}>
										    	<Grid item>
										    		<Grid container direction="column">
										    			<Grid item>
											    			<Typography variant="subtitle2">
											    				Start Time
											    			</Typography>
										    			</Grid>
										    			<Grid item>
											    			<TextField type="time" variant="filled" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
										    			</Grid>
										    		</Grid>
										    	</Grid>
										    	<Grid item>
										    		<Grid container direction="column">
										    			<Grid item>
											    			<Typography variant="subtitle2">
											    				End Time
											    			</Typography>
										    			</Grid>
										    			<Grid item>
											    			<TextField type="time" variant="filled" value={toTime} onChange={(e) => setToTime(e.target.value)} />
										    			</Grid>
										    		</Grid>
										    	</Grid>
										    </Grid>
										    <Divider />
										    <Grid item className={classes.adminTimeManagerAppliedCategories}>
											    <Typography variant="h6">
											    	Applied Categories
											    </Typography>
											    <FormControl className={classes.adminTimeManagerSelect}>
											    	<InputLabel>Categories</InputLabel>
													<Select
														multiple 
														value={selCategories}
														onChange={handleSelCategories}
														variant="filled"
													>
														{categoryList.map((category, index) => (
												            <MenuItem key={index} value={category.category_id}>
												              {category.category_name}
												            </MenuItem>
												          ))}
													</Select>
												</FormControl>
											</Grid>
										</Card>
									</Grid>
								</Grid>
							)]]]}
						</Container>

				</Grid>
				<Grid item xs={4}>
					<Paper elevation={1}>
						<Container maxWidth={false} className={classes.adminNavigationContainer}>
							<List>
								<ListItem>
									<Typography variant="h5" color="textPrimary" align="center">
										Time Manager
									</Typography>
								</ListItem>
								<Divider />
							{!showAddTimeGroup && [ !showEditTimeGroup && (
								<>
								<ListItem button disabled={selTimeGroupID === null} onClick={() => handleSaveChanges()}>
									<ListItemText primary="Save Changes"/>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleAddTimeGroupButton()}>
									<ListItemText primary="Add New Time Group"/>
								</ListItem>
								<ListItem button disabled={selTimeGroupID === null} onClick={() => handleEditTimeGroupButton()}>
									<ListItemText primary="Change Time Group Name"/>
								</ListItem>
								<ListItem button disabled={selTimeGroupID === null} onClick={() => handleDeleteTimeGroup()}>
									<ListItemText primary="Remove Time Group"/>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleStep(1000)}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
							)]}
							{showAddTimeGroup && [ !showEditTimeGroup &&  (
								<>
								<ListItem>
									<Grid container spacing={2} alignItems="flex-start" justify="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
										<Grid item>
											<Typography variant="h5">
												Add New Timegroup
											</Typography>
										</Grid>
										<Grid item>
											<TextField 
												id="timegroup" 
												label="Timegroup Name"
												onChange={(e) => {setNewTimeGroupName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={newTimeGroupName} 
											/>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" disabled={newTimeGroupName === ''} onClick={() => handleAddTimeGroup()}>
												Add Timegroup
											</Button>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleAddTimeGroupButton()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
							)]}
							{!showAddTimeGroup && [ showEditTimeGroup &&  (
								<>
								<ListItem>
									<Grid container spacing={2} alignItems="flex-start" justify="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
										<Grid item>
											<Typography variant="h5">
												Change Timegroup Name
											</Typography>
										</Grid>
										<Grid item>
											<TextField 
												id="timegroup" 
												label="Timegroup Name"
												onChange={(e) => {setNewTimeGroupName(e.target.value)}} 
												variant="filled" 
												fullWidth
												value={newTimeGroupName} 
											/>
										</Grid>
										<Grid item>
											<Button variant="contained" color="primary" disabled={newTimeGroupName === ''} onClick={() => handleEditTimeGroup()}>
												Change Name
											</Button>
										</Grid>
									</Grid>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleEditTimeGroupButton()}>
									<ListItemText primary="Go Back"/>
								</ListItem>
								</>
							)]}
							</List>
						</Container>
					</Paper>
				</Grid>
		</Grid>
		</main>

</>
		)
}

export default AdminTimeManager;