import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
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

import LoadingButton from '@mui/lab/LoadingButton';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../classes'
import styles from '../styles';


import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import useStyles from '../styles';


function Preface({ site }) {

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


    const [scanOpen, setScanOpen] = React.useState(false);
    const [scanResult, setScanResult] = React.useState(null);

    function handleScan() {

        setScanOpen(true);
        const videoElem = document.getElementById('camera-video');
        const scanner = new QrScanner(videoElem, result => setScanResult(result.data), { highlightScanRegion: true, highlightCodeOutline: true, });

        scanner.start(); 
    }


    if(scanResult) {
        window.location.href = scanResult;
        return null;
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
                    <Container className={classes.prefaceCardGrid} maxWidth="sm">
                    <Card className={classes.prefaceCard}>
                        <CardMedia
                            className={scanOpen ? classes.Hidden : classes.prefaceCardMedia}
                            image={site+"/assets/mitsuki_logo_black.jpg"}
                            title="Image title"
                        />
                            <CardContent className={classes.prefaceCardContent}>
                                <StyledEngineProvider injectFirst>
                                    <ThemeProvider theme={theme}>
                                        <Typography className={scanOpen ? classes.Hidden : classes.Visible} variant="h3" align="center" color="textPrimary" gutterBottom>
                                            Mitsuki DIX30
                                        </Typography>
                                        <Typography className={scanOpen ? classes.Hidden : classes.Visible} variant="h5" align="center" color="textSecondary" gutterBottom>
                                            Menu à volonté
                                        </Typography>
                                        <Typography variant="h4" align="center" color="textPrimary" gutterBottom>
                                            Scannez le code QR pour commander.
                                        </Typography>
                                    </ThemeProvider>
                                </StyledEngineProvider>
                            </CardContent>
                            <CardMedia component="video" className={scanOpen ? classes.prefaceCameraContent : classes.Hidden} id="camera-video" />
                            <CardActions>
                                    <LoadingButton loading={scanOpen} loadingIndicator="..." variant="contained" onClick={() => handleScan()} endIcon={<PhotoCameraIcon />} fullWidth>
                                        Scanner avec la caméra
                                    </LoadingButton>
                            </CardActions>
                    </Card>
                    </Container>
                </div>
            </main>
        </>;
}

export default Preface;