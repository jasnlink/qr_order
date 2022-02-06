import React, { useState } from 'react';
import Axios from 'axios';

import { 	Avatar,
			Chip,
			Divider,
			Typography, 
 			Button,
 			Card, 
 			CardActions, 
 			CardContent,
 			CardActionArea, 
 			CardMedia, 
 			CssBaseline,
 			Grid, 
 			IconButton,
 			Container,
 			AppBar,
 			Toolbar,
 			Menu,
 			MenuItem,
 			Dialog,
 			DialogContent   } from '@material-ui/core';

import Image from 'material-ui-image';
import { palette } from '@material-ui/system';

import RemoveCircleSharpIcon from '@material-ui/icons/RemoveCircleSharp';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import TranslateSharpIcon from '@material-ui/icons/TranslateSharp';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';


import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../styles';



function PlaceOrder({ curStep, handleStep, curTableID, cartContent, handleCart }) {


	//Menu open and close handling
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
  	const handleMenu = (event) => {
    	setAnchorEl(event.currentTarget);
  	};
  	const handleClose = () => {
    	setAnchorEl(null);
  	};

	//Place order success dialog open/close state
	let [placeOpen, setPlaceOpen] = React.useState(false);
	//Toggle place order dialog open state
	function openPlaceDialog() {
		setPlaceOpen(true);
	}
	//Toggle place order dialog close state
	const closePlaceDialog = () => {
		setPlaceOpen(false);
		handleCart([]);
		handleStep(1);
	}

	let [orderNumber, setOrderNumber] = React.useState(null);
	function handlePlaceOrder() {	

		Axios.post("http://192.46.223.124:3001/api/place/order", {
			curTableID: curTableID,
			cartContent: cartContent,
		})
		.then((response) => {
			openPlaceDialog();
			setOrderNumber(response.data);
		})
		.catch((e) => {
       		console.log("error ", e);
       		alert(e.response.data);
       	});
	}

	function OrderTime() {
		let d = new Date();
		let time = d.getHours() + ':' + d.getMinutes();
		return (

			<Typography variant="h5" color="textPrimary">
				{time}
			</Typography>

			)
	}

  	//Styling functions
	const classes = useStyles();
	//Responsive text styles
	let theme = createMuiTheme();
	theme = responsiveFontSizes(theme);

	//Increment cart item
	function handleIncrement(event, id) {
		//Create a shallow copy of the array
		let tempCartContent = [...cartContent];
		//Create a shallow copy of the item in the array to be updated
		let incrementedItem = {...tempCartContent[id]};
		//Update item
		incrementedItem.itemQty =  incrementedItem.itemQty+1;
		//Update array with new item
		tempCartContent[id] = incrementedItem;
		//Replace cart state array with new updated array
		handleCart(tempCartContent);
	}

	//Decrement or delete cart item
	function handleDecrement(event, id) {
		let tempCartContent = [...cartContent];
		let decrementedItem = {...tempCartContent[id]};
		//Check item quantity if last one
		if(decrementedItem.itemQty === 1) {
			//Search array for the item and filter it out from array
			//Replace current copy of cart with new filtered array
			let cleanTempCartContent = tempCartContent.filter((item, index) => index !== id);
			handleCart(cleanTempCartContent);
		} else {
			decrementedItem.itemQty =  decrementedItem.itemQty-1;
			tempCartContent[id] = decrementedItem;
			handleCart(tempCartContent);
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
							<IconButton onClick={() => handleStep(curStep-1)} color="inherit">
								<ArrowBackIosSharpIcon />
							</IconButton>
						</Grid>
						<Grid item>
							<Typography variant="h6">
			  					Panier
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
				<Grid container direction="column" spacing={1}>
				{cartContent.map((cart, index) => (
					<Grid item key={index}>
						<Card className={classes.cartCard}>
							<Grid container alignItems="center" justify="space-between">
								<Grid item>
									<Avatar className={classes.cartMedia} src={cart.itemImg} variant="rounded" />
								</Grid>
								<Grid item>
									<Typography variant="subtitle2" color="textPrimary">
										{cart.itemName}
									</Typography>
								</Grid>
								<Grid item>
									<CardActions>
										<Chip label={cart.itemQty} />
										<Grid container direction="column">
											<Grid item>
												<IconButton
													color="primary" 
													onClick={(event) => handleIncrement(event, index)}
												>
													<AddCircleSharpIcon />
												</IconButton>
											</Grid>
											<Grid item>
												<IconButton 
													color="primary" 
													onClick={(event) => handleDecrement(event, index)}
												>
													<RemoveCircleSharpIcon />
												</IconButton>
											</Grid>
										</Grid>
									</CardActions>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				))}
				</Grid>
			</Container>
			<AppBar color="default" className={classes.cartNav} position="fixed">
				<Toolbar>
				<Grid container justify="center">
					<Button className={classes.cartButton} disabled={cartContent.length === 0} onClick={() => handlePlaceOrder()} variant="contained" color="primary" >
						Passer la commande
					</Button>
				</Grid>
				</Toolbar>
			</AppBar>


			<Dialog open={placeOpen} onClose={closePlaceDialog} maxWidth="sm" disableBackdropClick={true}>
			<DialogContent className={classes.cartDialog}>
				<Grid container direction="column" justify="center" alignItems="center" spacing={2}>
					<Grid item className={classes.cartDialogIcon}>
						<CheckCircleSharpIcon style={{fontSize: '84px', color: 'green'}} />
					</Grid>
					<Grid item>
						<Typography variant="h6" color="textPrimary">
							#{orderNumber}
						</Typography>
					</Grid>
					<Grid item>
						<Typography variant="h4" color="textPrimary">
							Envoyé
						</Typography>
					</Grid>
					<Grid item>
						<OrderTime />
					</Grid>
					<Grid item>
						<Button onClick={closePlaceDialog} variant="contained" color="primary" className={classes.cartDialogButton}>
							Suivant
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
			</Dialog>
			</main>
		</>

		)
}

export default PlaceOrder;