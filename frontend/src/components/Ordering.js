import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import { 	Typography,
            Badge, 
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
            ListSubheader,
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
            Backdrop    } from '@mui/material';


import LoadingButton from '@mui/lab/LoadingButton';

import Image from 'material-ui-image';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircleSharp';
import AddCircleIcon from '@mui/icons-material/AddCircleSharp';
import TranslateSharpIcon from '@mui/icons-material/TranslateSharp';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../classes'
import styles from '../styles';


function Ordering({ site, step, setStep, cart, setCart }) {


	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [categoryList, setCategoryList] = React.useState([]);
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.post(site+"/api/fetch/timed_categories")
		.then((response) => {
			setCategoryList(response.data);
			setSelectedCat(response.data[0].category_id);
            setSelectedCatName(response.data[0].category_name);
			setIsCategoryListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e);
       		alert(e.response.data);
       	});
	}, []);


	
	//Drawer open/close state
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [dialogOpen, setDialogOpen] = React.useState(false);

    //Adding to cart loading state
    const [loadingAddToCart, setLoadingAddToCart] = React.useState(false);


	//Currently selected item variables, to add to cart
	const [selectedID, setSelectedID] = React.useState("");
	const [selectedName, setSelectedName] = React.useState("");
	const [selectedDesc, setSelectedDesc] = React.useState("");
	const [selectedImg, setSelectedImg] = React.useState("");
	const [selectedQuantity, setSelectedQuantity] = React.useState(1);
	//Currently selected category state variable
	const [selectedCat, setSelectedCat] = React.useState(1);
    const [selectedCatName, setSelectedCatName] = React.useState('');

	//Toggle drawer open/close state
	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	}
	//Toggle menu item dialog open state
	const openDialog = (event, id, name, desc, img) => {

		setDialogOpen(true);

		setSelectedID(id);
		setSelectedName(name);
		setSelectedDesc(desc);
		setSelectedImg(img);
		setSelectedQuantity(1);
	}
	//Toggle menu item dialog close state
	const closeDialog = () => {

		setDialogOpen(false);

		setSelectedID("");
		setSelectedName("");
		setSelectedDesc("");
		setSelectedImg("");
		setSelectedQuantity(1);
	}
	//Increment and decrement chosen item quantity
	const handleIncrement = () => {
		setSelectedQuantity(selectedQuantity+1);
	}
	const handleDecrement = () => {
		setSelectedQuantity(selectedQuantity-1);
	}

	//Add selected item to cart state and reset the selected item states
	const handleAddToCart = () => {

        setLoadingAddToCart(true);

        const promise = new Promise ((resolve, reject) => {
            let selectedItem = {
            itemID : selectedID,
            itemName : selectedName,
            itemImg : selectedImg,
            itemQty : selectedQuantity,
            };
            setCart(cart => [...cart, selectedItem])
            resolve(cart);
        })

        promise.then((res) => {
            setLoadingAddToCart(false);
            closeDialog();
        });

		

	}
	//Reset cart and go back 1 step
	function handleResetCart () {
		let initialCartState = [];
		setCart(initialCartState);
		setStep(step-1);
	}

	const handleSelectCategory = (event, nodeIds, nodeName) => {
		setSelectedCat(nodeIds);
        setSelectedCatName(nodeName);
		toggleDrawer();
	};


	let [itemList, setItemList] = React.useState([]);
	let [isItemListLoading, setIsItemListLoading] = React.useState(true);
	//fetch items
	useEffect(()=> {
		Axios.post(site+"/api/fetch/items", {
			selCategoryID: selectedCat,
		})
		.then((response) => {
			setItemList(response.data);
			setIsItemListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, [selectedCat]);




	return ( 
	<StyledEngineProvider injectFirst>
	<>
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
                            <IconButton onClick={() => handleResetCart()} color="inherit" size="large">
                                <HomeIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6">
                                {selectedCatName}
                            </Typography>
                        </Grid>
                        <Grid item>
                              <IconButton
                                  onClick={() => setStep(step+1)} 
                                  color="inherit"
                                  edge="end"
                                  size="small">
                                <Badge badgeContent={cart.length} color="error" showZero>
                                    <ShoppingCartIcon />
                                </Badge>
                              </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        <Container className={classes.menuCardGrid} maxWidth="md">
        
            <Grid container spacing={0} alignItems="stretch">
            {isItemListLoading && (

                <Backdrop open={true} sx={{ color: '#fff' }}>
                    <CircularProgress color="inherit" />
                </Backdrop>

            )}
            {!isItemListLoading && (
            <>
            {itemList.map((item, index) => (
                
                <Grid component={Card} key={index} item xs={4} className={classes.menuCard} variant="outlined" elevation={0} square >
                    <CardActionArea onClick={(event) => openDialog(event, item.item_id, item.item_name, item.item_desc, item.item_img_url)}>
                        <CardMedia
                            className={classes.menuCardMedia}
                            image={item.item_img_url}
                            title="Image title"
                            />
                            <CardContent className={classes.menuCardContent}>
                            <StyledEngineProvider injectFirst>
                                <ThemeProvider theme={theme}>
                                    <Typography variant="subtitle2" color="textPrimary">
                                        {item.item_name}
                                    </Typography>
                                </ThemeProvider>
                            </StyledEngineProvider>
                            </CardContent>
                    </CardActionArea>
                </Grid>
                
                ))}
                </>
                )}
                
            </Grid>
        </Container>
        <Fab color="primary" aria-label="add" className={classes.fab} onClick={toggleDrawer}>
            <MenuIcon />
        </Fab>
        <Drawer classes={{ paper: classes.paper, }} anchor="bottom" open={drawerOpen} onClose={toggleDrawer}>
            <List className={classes.orderingDrawerCategoryList}>
                <ListSubheader sx={{ padding: 0 }}>
                    <Typography variant="h5" className={classes.orderingDrawerCategoryListTitle}>
                        Cat??gories
                    </Typography>
                    <Divider />
                </ListSubheader>
                
                {isCategoryListLoading && (

                    <Backdrop open={true} sx={{ color: '#fff' }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                )}
                {!isCategoryListLoading && (
                <>
                {categoryList.map((category, index) => 
                    (
                        <ListItem 
                            button 
                            key={index} 
                            onClick={(event) => handleSelectCategory(event, category.category_id, category.category_name)} 
                            selected={selectedCat === category.category_id}
                        >
                            <ListItemText primary={category.category_name} className={classes.PrimaryText} />
                        </ListItem>
                    
                    )
                )}
                </>
                )}
            </List>
            <AppBar position="fixed" className={classes.orderingDrawerBar}>
                <Toolbar>
                    <Grid 	
                        container 
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item>
                            <Button onClick={() => setStep(step+1)} 
                                    variant="contained" 
                                    color="primary">
                                        Voir le panier
                            </Button>
                        </Grid>
                        <Grid item>
                            <IconButton onClick={toggleDrawer} size="large">
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Drawer>
        <style jsx global>{`.MuiDialogContent-root{padding:0 !important;}`}
        </style>
        <Dialog className={classes.dialogBox} open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
            <IconButton className={classes.closeDialogButton} onClick={closeDialog}>
                <CloseIcon />
            </IconButton>
            <Image 
                className={classes.dialogMedia}
                src={selectedImg}
                aspectRatio={(1/1)}
                disableSpinner
                animationDuration={10}
            />				
            <DialogContent className={classes.dialogContent}>
                <DialogTitle className={classes.dialogTitle}>
                    {selectedName}
                </DialogTitle>
                <DialogContentText className={classes.dialogText}>
                    {selectedDesc}
                </DialogContentText>
            </DialogContent>
            <Divider />
                <DialogActions>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <IconButton
                                onClick={handleDecrement}
                                disabled={selectedQuantity < 2}
                                size="large"
                                className={classes.dialogAjust}
                                sx={{ color: '#1976d2' }}
                            >
                                <RemoveCircleIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Chip label={selectedQuantity} />						
                        </Grid>
                        <Grid item>
                            <IconButton 
                            	onClick={handleIncrement} 
                            	size="large" 
                            	className={classes.dialogAdjust}
                            >
                                <AddCircleIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogActions>
                <DialogActions>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <LoadingButton 
                                variant="contained" 
                                className={classes.dialogAddCartButton} 
                                color="primary" 
                                onClick={handleAddToCart} 
                                loading={loadingAddToCart} 
                                loadingIndicator="Ajouter..."
                                fullWidth
                                >
                                Ajouter
                            </LoadingButton>
                        </Grid>
                    </Grid>
                </DialogActions>
        </Dialog>
    </main>
    </>
    </StyledEngineProvider>
    )
}

export default Ordering;