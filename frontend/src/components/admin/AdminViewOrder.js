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
 			TableRow   } from '@mui/material';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';


function AdminViewOrder({ site, step, setStep, adminCurTableID, adminCurOrderID, adminCurOrderTime }) {

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
			curOrderID: adminCurOrderID,
		})
		.then((response) => {
			setInOrderList(response.data);
			setIsInOrderListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);


    function handlePrintOrder() {
        if(adminCurOrderID) {
            Axios.post(site+"/api/print/order", {
            adminCurOrderID: adminCurOrderID,
        })
        .then((response) => {
            return;
        })
        .catch((e) => {
            console.log("error ", e)});
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
                            <Container className={classes.adminOrderDetailsCardGrid} maxWidth="md">
                                <Card>
                                    <CardContent className={classes.adminOrderCardContent}>
                                    {isInOrderListLoading && (

                                    <Typography>loading...</Typography>

                                    )}
                                    {!isInOrderListLoading && (
                                    <>
                                        <Grid container justifyContent="space-between">
                                            <Grid item className={classes.adminOrderDetailsCardTitle}>
                                                <Typography variant="h6" color="textPrimary">
                                                    Order #{adminCurOrderID}
                                                </Typography>
                                            </Grid>
                                            <Grid item className={classes.adminOrderDetailsCardTitle}>
                                                <Typography variant="h6" color="textPrimary">
                                                    {adminCurOrderTime}
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
                        </Container>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper elevation={1}>
                            <Container maxWidth={false} className={classes.adminNavigationContainer}>
                                <List>
                                    <>
                                    <ListItem>
                                        <Typography variant="h5" color="textPrimary" align="center">
                                            Order #{adminCurOrderID}
                                        </Typography>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button>
                                        <ListItemText primary="Print Order" onClick={() => handlePrintOrder()}/>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => setStep(step-1)}>
                                        <ListItemText primary="Go Back" />
                                    </ListItem>
                                    </>
                                </List>
                            </Container>
                        </Paper>
                    </Grid>
                </Grid>
            </main>
    </>;
}

export default AdminViewOrder;