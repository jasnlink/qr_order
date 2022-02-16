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
            CircularProgress,
            Backdrop   } from '@mui/material';


import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../classes'
import styles from '../styles';


function OrderHistory({ step, setStep, setCurOrderID, curTableID, curOrderTime, setCurOrderTime }) {

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
  		setCurOrderID(curOrder);
  		setStep(step+1);
  		setCurOrderTime(curTime);
  	}

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);


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
                        <Grid item xs={4}>
                            <IconButton onClick={() => setStep(1)} color="inherit" size="large">
                                <ArrowBackIosSharpIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="h6">
                                Vos commandes
                            </Typography>
                        </Grid>
                      </Grid>
                </Toolbar>
            </AppBar>
            <Container className={classes.cartCardGrid} maxWidth="md">
                <Grid container direction="column" spacing={2}>
                {isOrderListLoading && (

                    <Backdrop open={true} sx={{ color: '#fff' }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                )}
                {!isOrderListLoading && [ orderList.length === 0 && (

                            <Typography>Aucune commande placée...</Typography>

                )]}
                {!isOrderListLoading && [ orderList.length > 0 && (
                <>
                {orderList.map((order, index) => (
                    <Grid item key={index}>
                        <Card className={classes.Card}>
                            <Grid className={classes.historyCard} container alignItems="center" justifyContent="space-around">
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


        </>;

}


export default OrderHistory;