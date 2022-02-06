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
 			Toolbar   } from '@material-ui/core';


import TranslateSharpIcon from '@material-ui/icons/TranslateSharp';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../styles';


function OrderHistory({ curStep, handleStep, handleOrder, curTableID, curOrderTime, handleOrderTime }) {

	//Menu open and close handling
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
  	const handleMenu = (event) => {
    	setAnchorEl(event.currentTarget);
  	};
  	const handleClose = () => {
    	setAnchorEl(null);
  	};

  	let [orderList, setOrderList] = React.useState();
	let [isOrderListLoading, setIsOrderListLoading] = React.useState(true);
	//fetch orders
	useEffect(()=> {
		Axios.post("http://192.46.223.124/api/fetch/orders", {
			curTableID: curTableID,
		})
		.then((response) => {
			setOrderList(response.data);
			setIsOrderListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);


  	//Get selected order that we want to look at and go to OrderDetail page
  	function handleViewOrder(event, curOrder, curTime) {
  		handleOrder(curOrder);
  		handleStep(curStep+1);
  		handleOrderTime(curTime);
  	}

	//Apply css styles from styles.js
	const classes = useStyles();

	//Auto responsive font sizes by viewport
	let theme = createMuiTheme();
	theme = responsiveFontSizes(theme);


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
								<IconButton onClick={() => handleStep(1)} color="inherit">
									<ArrowBackIosSharpIcon />
								</IconButton>
							</Grid>
							<Grid item>
								<Typography variant="h6">
				  					Vos commandes
				  				</Typography>
							</Grid>
							<Grid item>
				              <IconButton
				                aria-label="change current language"
				                aria-controls="menu-appbar"
				                aria-haspopup="true"
				                onClick={handleMenu}
				                color="inherit" 
				                edge="end"
				              >
				                <TranslateSharpIcon />
				              </IconButton>
				              <Menu
				                id="menu-appbar"
				                anchorEl={anchorEl}
				                anchorOrigin={{
				                  vertical: 'top',
				                  horizontal: 'right',
				                }}
				                keepMounted
				                transformOrigin={{
				                  vertical: 'top',
				                  horizontal: 'right',
				                }}
				                open={open}
				                onClose={handleClose}
				              >
				                <MenuItem className={classes.PrimaryText} onClick={handleClose}>English</MenuItem>
				                <MenuItem className={classes.PrimaryText} onClick={handleClose}>Français</MenuItem>
				              </Menu>
				              </Grid>
			              </Grid>
					</Toolbar>
				</AppBar>
				<Container className={classes.cartCardGrid} maxWidth="md">
					<Grid container direction="column" spacing={2}>
					{isOrderListLoading && (

								<Typography>loading...</Typography>

					)}
					{!isOrderListLoading && [ orderList.length === 0 && (

								<Typography>Aucune commande placée...</Typography>

					)]}
					{!isOrderListLoading && [ orderList.length > 0 && (
					<>
					{orderList.map((order, index) => (
						<Grid item key={index}>
							<Card className={classes.Card}>
								<Grid className={classes.historyCard} container alignItems="center" justify="space-around">
									<Grid item>
										<Typography variant="subtitle2" color="textPrimary">
											{index+1}.
										</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2" color="textPrimary">
											Commande #{order.placed_order_id}
										</Typography>
									</Grid>
									<Grid item>
										<Typography variant="subtitle2" color="textPrimary">
											{order.time_placed}
										</Typography>
									</Grid>
									<Grid item>
										<CardActions>
											<Button
												variant="contained"
												color="primary"
												onClick={(event) => handleViewOrder(event, order.placed_order_id, order.time_placed)}
											>
												Voir
											</Button>
										</CardActions>
									</Grid>
								</Grid>
							</Card>
						</Grid>
					))}
					</>
					)]}
					</Grid>
				</Container>
				</main>


			</>

		)

}


export default OrderHistory;