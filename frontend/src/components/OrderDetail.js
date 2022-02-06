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
 			Toolbar,
 			Table,
 			TableHead,
 			TableBody,
 			TableContainer,
 			TableCell,
 			TableRow   } from '@material-ui/core';


import TranslateSharpIcon from '@material-ui/icons/TranslateSharp';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../styles';


function OrderDetail({ curStep, handleStep, selOrder, curOrderTime }) {

	
	//Menu open and close handling
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

  	const handleMenu = (event) => {
    	setAnchorEl(event.currentTarget);
  	};

  	const handleClose = () => {
    	setAnchorEl(null);
  	};

	//Apply css styles from styles.js
	const classes = useStyles();

	//Auto responsive font sizes by viewport
	let theme = createMuiTheme();
	theme = responsiveFontSizes(theme);

	let [inOrderList, setInOrderList] = React.useState();
	let [isInOrderListLoading, setIsInOrderListLoading] = React.useState(true);
	//fetch in order items
	useEffect(()=> {
		Axios.post("http://192.46.223.124/api/fetch/in_order", {
			selOrder: selOrder,
		})
		.then((response) => {
			setInOrderList(response.data);
			setIsInOrderListLoading(false);
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
								<IconButton onClick={() => handleStep(curStep-1)} color="inherit">
									<ArrowBackIosSharpIcon />
								</IconButton>
							</Grid>
							<Grid item>
								<Typography variant="h6">
				  					Commande #{selOrder}
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
				<Container className={classes.orderDetailsCardGrid} maxWidth="sm">
					<Card>
						<CardContent>
						{isInOrderListLoading && (

								<Typography>loading...</Typography>

						)}
						{!isInOrderListLoading && (
						<>
							<Grid container justify="space-between">
								<Grid item className={classes.orderDetailsCardTitle}>
									<Typography variant="h6" color="textPrimary">
										Votre commande
									</Typography>
								</Grid>
								<Grid item className={classes.orderDetailsCardTitle}>
									<Typography variant="h6" color="textPrimary">
										{curOrderTime}
									</Typography>
								</Grid>
							</Grid>
							<Divider />
							<TableContainer>
								<Table>
									<TableBody>
										{inOrderList.map((item, index) => (
											<TableRow key={index}>
												<TableCell>{index+1}.</TableCell>
												<TableCell align="right"><Chip label={item.quantity} /></TableCell>												
												<TableCell>{item.item_name}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</>
						)}
						</CardContent>
					</Card>
				</Container>
			</main>
			</>
		)
}
export default OrderDetail;