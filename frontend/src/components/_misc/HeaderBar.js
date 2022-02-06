import React from 'react';

import { 	Typography,
 			AppBar,  
 			CssBaseline, 
 			Grid, 
 			Toolbar, 
 			Container, 
 			IconButton, 
 			Menu, 
 			MenuItem } from '@material-ui/core';

 import TranslateSharpIcon from '@material-ui/icons/TranslateSharp';
 import MenuIcon from '@material-ui/icons/Menu';
 import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';


import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

import useStyles from '../styles';

function CurrentTitle(props) {

  	switch(props.curStep) {

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



function HeaderBar({ curStep, handleStep }) {

	const classes = useStyles();
	let theme = createMuiTheme();
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
							justify="space-between"
							alignItems="center"
							container
						
							
							
						>
					{curStep !== 1 && (
						<IconButton onClick={() => handleStep(curStep-1)} color="inherit">
							<ArrowBackIosSharpIcon />
						</IconButton>
					)}
						<Grid item>
							<CurrentTitle curStep={curStep} />
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
				                <MenuItem onClick={handleClose}>English</MenuItem>
				                <MenuItem onClick={handleClose}>Français</MenuItem>
				              </Menu>
				              </Grid>
			              </Grid>
					</Toolbar>
				</AppBar>
			)


}

export default HeaderBar;