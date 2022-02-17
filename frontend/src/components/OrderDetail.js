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
 			TableRow,
            CircularProgress,
            Backdrop   } from '@mui/material';


import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../classes'
import styles from '../styles';


function OrderDetail({ site, step, setStep, curOrderID, curOrderTime }) {

	
	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [inOrderList, setInOrderList] = React.useState();
	let [isInOrderListLoading, setIsInOrderListLoading] = React.useState(true);
	//fetch in order items
	useEffect(()=> {
		Axios.post(site+"/api/fetch/in_order", {
			curOrderID: curOrderID,
		})
		.then((response) => {
			setInOrderList(response.data);
			setIsInOrderListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);



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
                            <IconButton onClick={() => setStep(step-1)} color="inherit" size="large">
                                <ArrowBackIosSharpIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography variant="h6">
                                Commande #{curOrderID}
                            </Typography>
                        </Grid>
                      </Grid>
                </Toolbar>
            </AppBar>
            <Container className={classes.orderDetailsCardGrid} maxWidth="sm">
                <Card>
                    <CardContent>
                    {isInOrderListLoading && (

                    <Backdrop open={true} sx={{ color: '#fff' }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    )}
                    {!isInOrderListLoading && (
                    <>
                        <Grid container justifyContent="space-between">
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
        </>;
}
export default OrderDetail;