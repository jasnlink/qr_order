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

import Image from 'material-ui-image';

import AddIcon from '@material-ui/icons/Add';
import CloseSharpIcon from '@material-ui/icons/CloseSharp';
import RemoveCircleSharpIcon from '@material-ui/icons/RemoveCircleSharp';
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import TranslateSharpIcon from '@material-ui/icons/TranslateSharp';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import useStyles from '../styles';


function Ordering({ curStep, handleStep, cartContent, handleCart }) {


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

	let [categoryList, setCategoryList] = React.useState([]);
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.post("http://192.46.223.124/api/fetch/timed_categories")
		.then((response) => {
			setCategoryList(response.data);
			setSelectedCat(response.data[0].category_id);
			setIsCategoryListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e);
       		alert(e.response.data);
       	});
	}, []);


	
	//Drawer open/close state
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);


	//Currently selected item variables, to add to cart
	const [selectedID, setSelectedID] = React.useState("");
	const [selectedName, setSelectedName] = React.useState("");
	const [selectedDesc, setSelectedDesc] = React.useState("");
	const [selectedImg, setSelectedImg] = React.useState("");
	const [selectedQuantity, setSelectedQuantity] = React.useState(1);
	//Currently selected category state variable
	const [selectedCat, setSelectedCat] = React.useState(1);

	//Toggle drawer open/close state
	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	}
	//Toggle menu item dialog open state
	const openDialog = (event, id, name, desc, img) => {

		setDialogOpen(true);

		setSelectedID(id);
		setSelectedName(name);
		setSelectedDesc(desc);
		setSelectedImg(img);
		setSelectedQuantity(1);
	}
	//Toggle menu item dialog close state
	const closeDialog = () => {

		setDialogOpen(false);

		setSelectedID("");
		setSelectedName("");
		setSelectedDesc("");
		setSelectedImg("");
		setSelectedQuantity(1);
	}
	//Increment and decrement chosen item quantity
	const handleIncrement = () => {
		setSelectedQuantity(selectedQuantity+1);
	}
	const handleDecrement = () => {
		setSelectedQuantity(selectedQuantity-1);
	}

	//Add selected item to cart state and reset the selected item states
	const handleAddToCart = () => {

		let selectedItem = {
			itemID : selectedID,
			itemName : selectedName,
			itemImg : selectedImg,
			itemQty : selectedQuantity,
		};
		handleCart(cartContent => [...cartContent, selectedItem]);
		closeDialog();
	}
	//Reset cart and go back 1 step
	function handleResetCart () {
		let initialCartState = [];
		handleCart(initialCartState);
		handleStep(curStep-1);
	}

	const handleSelectCategory = (event, nodeIds) => {
		setSelectedCat(nodeIds);
		toggleDrawer();
	};


	let [itemList, setItemList] = React.useState([]);
	let [isItemListLoading, setIsItemListLoading] = React.useState(true);
	//fetch items
	useEffect(()=> {
		Axios.post("http://192.46.223.124/api/fetch/items", {
			selCategoryID: selectedCat,
		})
		.then((response) => {
			setItemList(response.data);
			setIsItemListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, [selectedCat]);




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
							<IconButton onClick={() => handleResetCart()} color="inherit">
								<ArrowBackIosSharpIcon />
							</IconButton>
						</Grid>
						<Grid item>
							<Typography variant="h6">
			  					Menu
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
			<Container className={classes.menuCardGrid} maxWidth="md">
			
				<Grid container spacing={0}>
				{isItemListLoading && (

					<Typography>loading...</Typography>

				)}
				{!isItemListLoading && (
				<>
				{itemList.map((item, index) => (
					
					<Grid key={index} item xs={4} sm={4} md={4}>
						<Card className={classes.menuCard} variant="outlined" elevation={0} square >
						<CardActionArea onClick={(event) => openDialog(event, item.item_id, item.item_name, item.item_desc, item.item_img_url)}>
							<CardMedia
								className={classes.menuCardMedia}
								image={item.item_img_url}
								title="Image title"
								/>
								<CardContent className={classes.menuCardContent}>
								<ThemeProvider theme={theme}>
									<Typography variant="subtitle2" color="textPrimary">
										{item.item_name}
									</Typography>
								</ThemeProvider>
								</CardContent>
						</CardActionArea>
						</Card>
					</Grid>
	      			
					))}
		      		</>
		      		)}
					
				</Grid>
			</Container>
			<Fab color="primary" aria-label="add" className={classes.fab} onClick={toggleDrawer}>
	        	<AddIcon />
	      	</Fab>
	      	<Drawer classes={{ paper: classes.paper, }} anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
	      		<List className={classes.orderingDrawerCategoryList}>
	      			<ListItem>
	      				<Typography variant="h6">
	      					Catégories
	      				</Typography>
	      			</ListItem>
	      			<Divider />
	      			{isCategoryListLoading && (

						<Typography>loading...</Typography>

					)}
					{!isCategoryListLoading && (
					<>
	      			{categoryList.map((category, index) => 
		      			(
		      				<ListItem 
		      					button 
		      					key={index} 
		      					onClick={(event) => handleSelectCategory(event, category.category_id)} 
		      					selected={selectedCat === category.category_id}
		      				>
		      					<ListItemText primary={category.category_name} className={classes.PrimaryText} />
		      				</ListItem>
		      			
		      			)
		      		)}
		      		</>
		      		)}
	      		</List>
	      		<AppBar position="fixed" className={classes.orderingDrawerBar}>
      				<Toolbar>
			      		<Grid 	
			      			container 
			      			direction="row"
	  						justify="space-between"
	  						alignItems="center"
	  					>
			      			<Grid item>
				      			<Button onClick={() => handleStep(curStep+1)} 
				      					variant="contained" 
				      					color="primary">
				      						Voir le panier
				      			</Button>
			      			</Grid>
			      			<Grid item>
			      				<IconButton onClick={toggleDrawer}>
									<CloseSharpIcon />
								</IconButton>
			      			</Grid>
			      		</Grid>
		      		</Toolbar>
	      		</AppBar>
	      	</Drawer>
	      	<style jsx global>{`.MuiDialogContent-root{padding:0 !important;}`}
	      	</style>
	      	<Dialog className={classes.dialogBox} open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
				<Image 
					className={classes.dialogMedia}
					src={selectedImg}
					aspectRatio={(1/1)}
					disableSpinner
					animationDuration={10}
				/>				
				<DialogContent className={classes.dialogContent}>
					<DialogTitle className={classes.dialogTitle}>
						{selectedName}
					</DialogTitle>
					<DialogContentText className={classes.dialogText}>
						{selectedDesc}
					</DialogContentText>
				</DialogContent>
				<Divider />
					<DialogActions>
						<Grid container spacing={2} justify="center" alignItems="center">
							<Grid item>
								<IconButton 
									color="primary" 
									onClick={handleDecrement} 
									disabled={selectedQuantity < 2}
								>
									<RemoveCircleSharpIcon />
								</IconButton>
							</Grid>
							<Grid item>
								<Chip label={selectedQuantity} />						
							</Grid>
							<Grid item>
								<IconButton 
									color="primary" 
									onClick={handleIncrement}
								>
									<AddCircleSharpIcon />
								</IconButton>
							</Grid>
						</Grid>
					</DialogActions>
					<DialogActions>
						<Grid container justify="center">
							<Grid item>
								<Button className={classes.dialogButton} variant="outlined" color="primary" onClick={closeDialog}>
									Annuler
								</Button>
							</Grid>
							<Grid item>
								<Button variant="contained" color="primary" onClick={handleAddToCart}>
									Ajouter
								</Button>
							</Grid>
						</Grid>
					</DialogActions>
			</Dialog>
		</main>
      	</>
		)
}

export default Ordering;