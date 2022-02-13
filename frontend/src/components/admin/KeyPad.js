


/* 		###################### Keypad entry Component ######################

		This is the keypad entry system for entering table numbers, people count, etc.

		---

		A Custom keypad is needed because resorting to the tablet keyboard is too disruptive to the workflow of the worker.

		##################################################################
 */



import React, { useState, useEffect } from 'react';


import { 	Typography,  
 			Card, 
 			CardActions, 
 			CardContent,
 			CardActionArea,  
 			CssBaseline, 
 			Grid     } from '@mui/material';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';




 function KeyPad ({ handlePadNum, handleBackSpace, handleEnter, usage }) {


 	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	const keypadConstruct = [1, 2, 3, 4 ,5 ,6, 7, 8, 9]

	return (

	    <Grid container direction="row">

	        {keypadConstruct.map((key, index) => (

	        	<Grid item xs={4}>
	                <Card square>
	                    <CardActionArea onClick={(event) => handlePadNum(event, key)}>
	                            <CardContent>
	                                <Typography variant="h6" color="textPrimary" align="center">
	                                    {key}
	                                </Typography>
	                            </CardContent>
	                    </CardActionArea>
	                </Card>
	            </Grid>

	        	))}
	            <Grid item xs={4}>
	                <Card className={classes.adminKeyPadBackSpace} square>
	                    <CardActionArea onClick={(event) => handleBackSpace(event)}>
	                            <CardContent>
	                                <Typography variant="h6" color="error" align="center">
	                                    DEL
	                                </Typography>
	                            </CardContent>
	                    </CardActionArea>
	                </Card>
	            </Grid>
	            <Grid item xs={4}>
	                <Card square>
	                    <CardActionArea onClick={(event) => handlePadNum(event, 0)}>
	                            <CardContent>
	                                <Typography variant="h6" color="textPrimary" align="center">
	                                    0
	                                </Typography>
	                            </CardContent>
	                    </CardActionArea>
	                </Card>
	            </Grid>
	            {usage === "table" &&
	            	<Grid item xs={4}>
		                <Card square className={classes.adminKeyPadEnterKey}>
		                    <CardActionArea onClick={(event) => handleEnter(event)} disabled>
		                            <CardContent>
		                                <Typography variant="h6" color="textPrimary" align="center" className={classes.adminKeyPadEnterText}>
		                                    ENTER
		                                </Typography>
		                            </CardContent>
		                    </CardActionArea>
		                </Card>
	            	</Grid>
	        	}
	        	{usage === "seat" &&
	            	<Grid item xs={4}>
		                <Card className={classes.adminSeatKeyPad} square>
		                    <CardActionArea disabled>
		                            <CardContent>
		                                <Typography variant="h6" align="center">
                                                
                                        </Typography>
		                            </CardContent>
		                    </CardActionArea>
		                </Card>
	            	</Grid>
	        	}
	            
	        </Grid>

		)

 }

 export default KeyPad;