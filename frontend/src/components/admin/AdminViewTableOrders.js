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


import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';



import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../../styles';


function AdminViewTableOrders({ curStep, handleStep, selTableID, handleTableID, selOrderID, handleOrderID, adminCurTableNumber, adminCurOrderTime, handleOrderTime }) {

	//Apply css styles from styles.js
	const classes = useStyles();

	//Auto responsive font sizes by viewport
	let theme = createMuiTheme();
	theme = responsiveFontSizes(theme);

	function handleGoback() {
		handleOrderID(null)
		return (
			handleStep(curStep-1)
			)
	}
	function handleViewOrder(id, time) {
		handleOrderID(id);
		handleOrderTime(time);
	}

	let [orderList, setOrderList] = React.useState();
	let [isOrderListLoading, setIsOrderListLoading] = React.useState(true);
	//fetch orders
	useEffect(()=> {
		Axios.post("http://192.46.223.124:3001/api/fetch/orders", {
			curTableID: selTableID,
		})
		.then((response) => {
			setOrderList(response.data);
			setIsOrderListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

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
				<Grid item xs={8}>
					<Container maxWidth={false}>
						<Grid container direction="column" spacing={2} className={classes.adminViewTableOrdersCardGrid}>
						{isOrderListLoading && (

								<Typography>loading...</Typography>

						)}
						{!isOrderListLoading && [ orderList.length === 0 && (

								<Typography>No orders placed...</Typography>

						)]}
						{!isOrderListLoading && [ orderList.length > 0 && (
						<>
						{orderList.map((order, index) => (
							<Grid item key={index}>
								<Card className={classes.Card}>
								<CardActionArea onClick={() => handleViewOrder(order.placed_order_id, order.time_placed)}>
									<Grid className={classes.adminViewTableOrdersCard} container alignItems="center" justify="space-around">
										<Grid item>
											<Typography variant="subtitle1" color="textPrimary">
												{index+1}.
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1" color="textPrimary">
												Order #{order.placed_order_id}
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="subtitle1" color="textPrimary">
												{order.time_placed}
											</Typography>
										</Grid>
									</Grid>
								</CardActionArea>
								</Card>
							</Grid>
						))}
						</>
						)]}
						</Grid>
					</Container>
				</Grid>
				<Grid item xs={4}>
					<Paper elevation={1}>
						<Container maxWidth={false} className={classes.adminNavigationContainer}>
							<List>
							{selOrderID === null && (
								<>
								<ListItem>
									<Typography variant="h5" color="textPrimary" align="center">
										Table {adminCurTableNumber}
									</Typography>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleStep(curStep-1)}>
									<ListItemText primary="Go Back" />
								</ListItem>
								</>
							)}
							{selOrderID !== null && (
								<>
								<ListItem>
									<Typography variant="h5" color="textPrimary" align="center">
										Order #{selOrderID}
									</Typography>
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleStep(curStep+1)}>
									<ListItemText primary="View Order" />
								</ListItem>
								<ListItem button>
									<ListItemText primary="Print Order" />
								</ListItem>
								<Divider />
								<ListItem button onClick={() => handleGoback()}>
									<ListItemText primary="Go Back" />
								</ListItem>
								</>
							)}
							</List>
						</Container>
					</Paper>
				</Grid>
			</Grid>
		</main>
</>

	)
}

export default AdminViewTableOrders;