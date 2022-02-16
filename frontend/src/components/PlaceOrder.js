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
 			DialogContent   } from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';

import Image from 'material-ui-image';
import { palette } from '@mui/system';

import RemoveCircleSharpIcon from '@mui/icons-material/RemoveCircleSharp';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../classes'
import styles from '../styles';



function PlaceOrder({ step, setStep, curTableID, cart, setCart }) {



	//Place order success dialog open/close state
	let [placeOpen, setPlaceOpen] = React.useState(false);
	//Toggle place order dialog open state
	function openPlaceDialog() {
		setPlaceOpen(true);
	}
	//Toggle place order dialog close state
	const closePlaceDialog = () => {
		setPlaceOpen(false);
		setCart([]);
		setStep(1);
	}

	let [orderNumber, setOrderNumber] = React.useState(null);
    let [loadingPlaceOrder, setLoadingPlaceOrder] = React.useState(false);

	function handlePlaceOrder() {	

        setLoadingPlaceOrder(true);

		Axios.post("http://192.46.223.124/api/place/order", {
			curTableID: curTableID,
			cart: cart,
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
        var time;
        if(d.getMinutes() < 10) {
            time = d.getHours() + ':0' + d.getMinutes();
        }
        else {
            time = d.getHours() + ':' + d.getMinutes();
        }
		return (

			<Typography variant="h5" color="textPrimary">
				{time}
			</Typography>

			)
	}

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	//Increment cart item
	function handleIncrement(event, id) {
		//Create a shallow copy of the array
		let tempCartContent = [...cart];
		//Create a shallow copy of the item in the array to be updated
		let incrementedItem = {...tempCartContent[id]};
		//Update item
		incrementedItem.itemQty =  incrementedItem.itemQty+1;
		//Update array with new item
		tempCartContent[id] = incrementedItem;
		//Replace cart state array with new updated array
		setCart(tempCartContent);
	}

	//Decrement or delete cart item
	function handleDecrement(event, id) {
		let tempCartContent = [...cart];
		let decrementedItem = {...tempCartContent[id]};
		//Check item quantity if last one
		if(decrementedItem.itemQty === 1) {
			//Search array for the item and filter it out from array
			//Replace current copy of cart with new filtered array
			let cleanTempCartContent = tempCartContent.filter((item, index) => index !== id);
			setCart(cleanTempCartContent);
		} else {
			decrementedItem.itemQty =  decrementedItem.itemQty-1;
			tempCartContent[id] = decrementedItem;
			setCart(tempCartContent);
		}
		
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
                        <Grid item xs={5}>
                            <IconButton onClick={() => setStep(step-1)} color="inherit" size="large">
                                <ArrowBackIosSharpIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={7}>
                            <Typography variant="h6">
                                Panier
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        <Container className={classes.cartCardGrid} maxWidth="md">
            <Grid container direction="column" spacing={1}>
            {cart.map((cart, index) => (
                <Grid item key={index}>
                    <Card className={classes.cartCard}>
                        <Grid container alignItems="center" justifyContent="space-between">
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
                                                size="large">
                                                <AddCircleSharpIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <IconButton
                                                color="primary"
                                                onClick={(event) => handleDecrement(event, index)}
                                                size="large">
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
            <Grid container justifyContent="center">
                <LoadingButton 
                    className={classes.cartButton} 
                    disabled={cart.length === 0} onClick={() => handlePlaceOrder()} 
                    variant="contained" 
                    color="primary"
                    loading={loadingPlaceOrder} 
                    loadingIndicator="En cours..."
                    fullWidth
                    >
                    Passer la commande
                </LoadingButton>
            </Grid>
            </Toolbar>
        </AppBar>


        <Dialog open={placeOpen} maxWidth="sm" fullWidth>
        <DialogContent className={classes.cartDialog}>
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
                <Grid item className={classes.cartDialogIcon}>
                    <CheckCircleSharpIcon style={{fontSize: '128px', color: 'green'}} />
                </Grid>
                <Grid item>
                    <Typography variant="h3" color="textPrimary">
                        Envoyé
                    </Typography>
                </Grid>
                <Grid item>
                    <OrderTime />
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={closePlaceDialog} variant="contained" color="primary" className={classes.cartDialogButton} fullWidth>
                        Suivant
                    </Button>
                </Grid>
            </Grid>
        </DialogContent>
        </Dialog>
        </main>
    </>;
}

export default PlaceOrder;