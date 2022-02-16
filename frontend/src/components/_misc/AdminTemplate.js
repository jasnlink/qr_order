import React, { useState } from 'react';


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
import useStyles from '../../styles';


function AdminAddTable({ step, setStep }) {


		//Apply css styles from styles.js
	const classes = useStyles();

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
                        </Container>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper elevation={1}>
                            <Container maxWidth={false} className={classes.adminNavigationContainer}>
                            </Container>
                        </Paper>
                    </Grid>
            </Grid>
            </main>

    </>;
}

export default AdminAddTable;