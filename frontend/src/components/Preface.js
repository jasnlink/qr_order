import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";
import QrScanner from 'qr-scanner';


import { 	Typography, 
 			Button, 
 			Card, 
 			CardActions, 
 			CardContent, 
 			CardMedia, 
 			CssBaseline, 
 			Grid,  
 			Container,
 			AppBar,
 			Toolbar,
 			IconButton,
 			MenuItem,
 			Menu,
 			Dialog   } from '@mui/material';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../classes'
import styles from '../styles';


import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';

import useStyles from '../styles';


function Preface({ step, setStep }) {

	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	//Menu open and close handling
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

  	const handleMenu = (event) => {
    	setAnchorEl(event.currentTarget);
  	};

  	const handleClose = () => {
    	setAnchorEl(null);
  	};

    function handleScan() {

        const videoElem = document.getElementById('camera-video');
        const scanner = new QrScanner(videoElem, result => console.log('decoded qr code:', result));
        scanner.start();
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
                            Commande en ligne
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
                              size="large">
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
                <div className={classes.container}>
                    <Container className={classes.welcomeCardGrid} maxWidth="sm">
                    <Card className={classes.welcomeCard}>
                        <CardMedia
                            className={classes.welcomeCardMedia}
                            image="http://192.46.223.124/assets/mitsuki_logo_black.jpg"
                            title="Image title"
                        />
                            <CardContent className={classes.welcomeCardContent}>
                                <StyledEngineProvider injectFirst>
                                    <ThemeProvider theme={theme}>
                                        <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
                                            Mitsuki DIX30
                                        </Typography>
                                        <Typography variant="h5" align="center" color="textSecondary">
                                            Menu à volonté
                                        </Typography>
                                        <Typography variant="h3" align="center" color="textPrimary" gutterBottom>
                                            Scannez le code QR!
                                        </Typography>
                                        <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                                            Vous n'avez pas de table assignée.
                                        </Typography>
                                        <CardMedia component="video" className={classes.qrmedia} id="camera-video" />
                                    </ThemeProvider>
                                </StyledEngineProvider>
                            </CardContent>
                            <CardActions>
                                    <Button onClick={() => handleScan()}>
                                        Scanner avec la caméra
                                    </Button>
                            </CardActions>
                    </Card>
                    </Container>
                </div>
                <Dialog maxWidth="xs" fullWidth>
                </Dialog>
                
            </main>
        </>;
}

export default Preface;