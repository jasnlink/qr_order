import React from 'react';

import { 	Typography,
 			AppBar,  
 			CssBaseline, 
 			Grid, 
 			Toolbar, 
 			Container, 
 			IconButton, 
 			Menu, 
 			MenuItem } from '@mui/material';

 import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
 import MenuIcon from '@mui/icons-material/Menu';
 import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useStyles from '../styles';

function CurrentTitle(props) {

  	switch(props.step) {

  		case 1:
  		return (
  				<Typography variant="h6">
  					Commande en ligne
  				</Typography>
  			)
  		case 2:
  		return (
  				<Typography variant="h6">
  					Menu
  				</Typography>
  			)
  		case 3:
  		return (
  				<Typography variant="h6">
  					Panier
  				</Typography>
  			)


  	}
  		
  		
}



function HeaderBar({ step, setStep }) {

	const classes = useStyles();
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


	return (
        <AppBar position="fixed">
            <Toolbar variant="dense">
                <Grid
                    justifyContent="space-between"
                    alignItems="center"
                    container
                
                    
                    
                >
            {step !== 1 && (
                <IconButton onClick={() => setStep(step-1)} color="inherit" size="large">
                    <ArrowBackIosSharpIcon />
                </IconButton>
            )}
                <Grid item>
                    <CurrentTitle step={step} />
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
                        <MenuItem onClick={handleClose}>English</MenuItem>
                        <MenuItem onClick={handleClose}>Français</MenuItem>
                      </Menu>
                      </Grid>
                  </Grid>
            </Toolbar>
        </AppBar>
    );


}

export default HeaderBar;