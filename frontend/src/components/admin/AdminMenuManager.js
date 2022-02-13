import React, { useState, useEffect } from 'react';
import Axios from 'axios';


import { 	Typography,
			Avatar, 
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
 			FormControl,
 			InputLabel,
 			Select,
 			AppBar,
 			Toolbar,
 			Table,
 			TableHead,
 			TableBody,
 			TableContainer,
 			TableCell,
 			TableRow,
 			TextField   } from '@mui/material';

import Image from 'material-ui-image'

import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';


function AdminMenuManager({ curStep, handleStep }) {


	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	let [selCategoryID, setSelCategoryID] = React.useState(null);
	let [selCategoryName, setSelCategoryName] = React.useState(null);

	function handleSelectCategory(catID, catName) {

		if(catID !== selCategoryID) {

			setSelCategoryID(catID);
			setIsItemListLoading(true);
			setSelCategoryName(catName);

			if(selItemID) {
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemMedia(null);
				setSelItemDisabled(null);

				//close edit form
				setShowEditItem(null);
			}

		}
		if(catID === selCategoryID) {
			return;
		}

	}

	let [selItemID, setSelItemID] = React.useState(null);
	let [selItemMap, setSelItemMap] = React.useState(null);
	let [selItemOrder, setSelItemOrder] = React.useState(null);
	let [selItemName, setSelItemName] = React.useState('');
	let [selItemDesc, setSelItemDesc] = React.useState('');
	let [selItemKitchenName, setSelItemKitchenName] = React.useState('');
	let [selItemDisabled, setSelItemDisabled] = React.useState(null);
	let [selItemMedia, setSelItemMedia] = React.useState(null);

	function handleSelectItem(itemID, itemDisp, itemOrder, itemName, itemDesc, itemKitchenName, itemMedia, itemDisabled) {

		if(itemID !== selItemID) {

			setSelItemID(itemID);
			setSelItemMap(itemDisp);
			setSelItemOrder(itemOrder);
			setSelItemName(itemName);
			setSelItemDesc(itemDesc);
			setSelItemKitchenName(itemKitchenName);
			setSelItemMedia(itemMedia);
			setSelItemDisabled(itemDisabled);

		}
		if(itemID === selItemID) {
			return;
		}
	}


	let [categoryList, setCategoryList] = React.useState();
	let [isCategoryListLoading, setIsCategoryListLoading] = React.useState(true);

	//fetch categories
	useEffect(()=> {
		Axios.get("http://192.46.223.124/api/fetch/categories")
		.then((response) => {
			setCategoryList(response.data);
			setIsCategoryListLoading(false);
			console.log("fetched categories");
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	let [itemList, setItemList] = React.useState();
	let [isItemListLoading, setIsItemListLoading] = React.useState(false);

	//fetch menu items from selected category
	useEffect(()=> {
		Axios.post("http://192.46.223.124/api/fetch/items", {
				selCategoryID: selCategoryID,
			})
		.then((response) => {
			setItemList(response.data);
			setIsItemListLoading(false);
			console.log("fetched items");
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, [selCategoryID]);


	let [showCreateItem, setShowCreateItem] = React.useState(null);

	function handleAddNewButton() {

		if (showCreateItem === null) {
			setShowCreateItem(1);
		}
		if (showCreateItem === 1) {
			setShowCreateItem(null);
		}
	}

	let [itemName, setItemName] = React.useState('');
	let [itemDesc, setItemDesc] = React.useState('');
	let [itemKitchenName, setItemKitchenName] = React.useState('');
	let [itemMedia, setItemMedia] = React.useState(null);
	//temporary file preview var
	let [itemMediaTempURL, setItemMediaTempURL] = React.useState(null);

	function handleCancelNewItem() {

		//reset form
		setItemName('');
		setItemDesc('');
		setItemKitchenName('');
		setItemMedia(null);
		setItemMediaTempURL(null);

		setShowCreateItem(null);
	}

	function handleAddNewItem() {

		if(selCategoryID && itemName && itemMedia) {
			//use new FormData() method to create a submitted form
			const formData = new FormData();

			//add uploaded image and other form fields to the data
			formData.append('file', itemMedia);
			formData.append('selCategoryID', selCategoryID);
			formData.append('itemName', itemName);
			formData.append('itemDesc', itemDesc);
			formData.append('itemKitchenName', itemKitchenName);

			Axios.post("http://192.46.223.124/api/add/item", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setItemName('');
				setItemDesc('');
				setItemKitchenName('');
				setItemMedia(null);
				setItemMediaTempURL(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			
		}

	}

	const handleFileUpload = e => {

		if(selItemMedia) {
			setSelItemMedia(null);
		}

		//get image to upload
		setItemMedia(e.target.files[0]);
		//create temp url to preview image
		setItemMediaTempURL(URL.createObjectURL(e.target.files[0]));

	}


	let [showEditItem, setShowEditItem] = React.useState(null);

	function handleEditButton() {

		if (showEditItem === null) {
			setShowEditItem(1);
		}
		if (showEditItem === 1) {
			setShowEditItem(null);
		}
	}

	function handleEditItem() {

		//check if all fields are filled
		//if image changed
		if(selCategoryID && selItemID && selItemName && itemMedia) {
			//use new FormData() method to create a submitted form
			const formData = new FormData();

			//add uploaded image and other form fields to the data
			formData.append('file', itemMedia);
			formData.append('selCategoryID', selCategoryID);
			formData.append('selItemID', selItemID);
			formData.append('selItemName', selItemName);
			formData.append('selItemDesc', selItemDesc);
			formData.append('selItemKitchenName', selItemKitchenName);

			Axios.post("http://192.46.223.124/api/edit/item", formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemKitchenName('');
				setSelItemMedia(null);
				setSelItemDisabled(null);

				setItemMedia(null);
				setItemMediaTempURL(null);

				//close edit form
				setShowEditItem(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			
		}
		//check if all fields are filled
		//if image didnt change
		if(selCategoryID && selItemID && selItemName && !itemMedia) {

			Axios.post("http://192.46.223.124/api/edit/item", {
				selCategoryID: selCategoryID,
				selItemID: selItemID,
				selItemName: selItemName,
				selItemDesc: selItemDesc,
				selItemKitchenName: selItemKitchenName,
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemKitchenName('');
				setSelItemMedia(null);
				setSelItemDisabled(null);

				//close edit form
				setShowEditItem(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	}
	function handleCancelEditItem() {

		//reset form
		setSelItemID(null);
		setSelItemMap(null);
		setSelItemOrder(null);
		setSelItemName('');
		setSelItemDesc('');
		setSelItemKitchenName('');
		setSelItemMedia(null);
		setSelItemDisabled(null);

		//close edit form
		setShowEditItem(null);
	}

	//moving item sort item up(1) or down(0)
	function handleMoveItem(direction) {

		//current selected item id and order index
		var currentRowID = selItemID;
		var currentRowOrderID = selItemOrder;

		//check if first item on list trying to move up
		//or if last item on list trying to move down
		const currentRowMapID = selItemMap;
		if(currentRowMapID === 0 && direction === 1 || currentRowMapID === itemList.length-1 && direction === 0) {
			return;
		}

		//setup vars to hold next row info
		var nextRowID;
		var nextRowOrderID;


		if(direction === 1) {
			//get id and order index of row above
			nextRowID = itemList[currentRowMapID-1].item_id;
			nextRowOrderID = itemList[currentRowMapID-1].item_order_index;

			//set order index to row above
			//set item map to row above
			setSelItemOrder(nextRowOrderID);
			setSelItemMap(selItemMap-1);
		}
		if(direction === 0) {
			//get id and order index of row below
			nextRowID = itemList[currentRowMapID+1].item_id;
			nextRowOrderID = itemList[currentRowMapID+1].item_order_index;

			//set order index to row below
			//set item map to row below
			setSelItemOrder(nextRowOrderID);
			setSelItemMap(selItemMap+1);
		}

		//send to backend
		Axios.post("http://192.46.223.124/api/move/item", {
			selCategoryID: selCategoryID,
			currentRowID: currentRowID,
			currentRowOrderID: currentRowOrderID,
			nextRowID: nextRowID,
			nextRowOrderID: nextRowOrderID,
		})
		.then((response) => {
			console.log("moved");
			//update item list with new data
			setItemList(response.data);

		})
		.catch((e) => {
       		console.log("error ", e)});

	};
	let [showMoveItem, setShowMoveItem] = React.useState(null);

	function handleMoveButton() {

		if (showEditItem === null) {
			setShowMoveItem(1);
		}
		if (showEditItem === 1) {
			setShowMoveItem(null);
		}
	}
	function handleCancelMoveItem() {
		//reset form
		setSelItemID(null);
		setSelItemMap(null);
		setSelItemOrder(null);
		setSelItemName('');
		setSelItemDesc('');
		setSelItemKitchenName('');
		setSelItemMedia(null);
		setSelItemDisabled(null);

		//close edit form
		setShowMoveItem(null);
	}

	let [selNewCategoryID, setSelNewCategoryID] = React.useState('');
	let [selNewCategoryName, setSelNewCategoryName] = React.useState('');



	let [showChangeItemCategory, setShowChangeItemCategory] = React.useState(null);
	function handleChangeItemCategoryButton() {

		if (showChangeItemCategory === null) {
			setShowChangeItemCategory(1);
			setSelNewCategoryID(selCategoryID);
		}
		if (showChangeItemCategory === 1) {
			setShowChangeItemCategory(null);
			setSelNewCategoryID('');
		}
	}
	function handleCancelChangeItemCategory() {
		//reset form
		setSelItemID(null);
		setSelItemMap(null);
		setSelItemOrder(null);
		setSelItemName('');
		setSelItemDesc('');
		setSelItemKitchenName('');
		setSelItemMedia(null);
		setSelItemDisabled(null);

		//close form
		setShowChangeItemCategory(null);
	}
	function handleSelNewCategory(catID, catName) {

		setSelNewCategoryID(catID);
		setSelNewCategoryName(catName);

	}
	function handleChangeItemCategory() {

		Axios.post("http://192.46.223.124/api/change/item", {
				selItemID: selItemID,
				selNewCategoryID: selNewCategoryID,
				selCategoryID: selCategoryID
			})
			.then((response) => {
				//update item list with fresh data
				setItemList(response.data);
				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemKitchenName('');
				setSelItemMedia(null);
				setSelItemDisabled(null);

				setSelNewCategoryID('');
				setSelNewCategoryName('');

				//close form
				setShowChangeItemCategory(null);
			})
			.catch((e) => {
		   		console.log("error ", e)});
	}

	//delete item
	function handleDeleteItem() {
		if(selItemID) {

			Axios.post("http://192.46.223.124/api/delete/item", {
				selCategoryID: selCategoryID,
				selItemID: selItemID
			})
			.then((response) => {
				//update category list with fresh data
				setItemList(response.data);

				//reset form
				setSelItemID(null);
				setSelItemMap(null);
				setSelItemOrder(null);
				setSelItemName('');
				setSelItemDesc('');
				setSelItemKitchenName('');
				setSelItemMedia(null);
				setSelItemDisabled(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	}
	//enable or disable item
	function handleToggleItem() {

		var disabled = !selItemDisabled;

		if(selItemID) {

			Axios.post("http://192.46.223.124/api/toggle/item", {
				selCategoryID: selCategoryID,
				selItemID: selItemID,
				disabled: disabled
			})
			.then((response) => {
				setItemList(response.data);
				setSelItemDisabled(!selItemDisabled);
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
                    <Grid item xs={4} className={classes.adminMenuListContainer}>
                            <Container className={classes.adminMenuManagerCategoryCardGrid} maxWidth="md">
                                {isCategoryListLoading && (

                                    <Typography>loading...</Typography>

                                )}
                                {!isCategoryListLoading && (
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <Typography variant="h5" color="textPrimary">
                                                Categories
                                            </Typography>
                                        </Grid>
                                    {categoryList.map((category, index) => (
                                        <Grid item key={index}>
                                            <Card className={classes.Card}>
                                            <CardActionArea onClick={() => handleSelectCategory(category.category_id, category.category_name)}>
                                                <Grid className={classes.adminMenuManagerCategoryCard} container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle2" color="textPrimary">
                                                            {category.category_name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography variant="subtitle2" color="textPrimary">
                                                            {category.disabled === 0 ? ("Enabled") : ("Disabled")}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))}
                                    </Grid>

                                    )}
                            </Container>
                    </Grid>
                    <Grid item xs={4} className={classes.adminMenuListContainer}>
                            <Container className={classes.adminMenuManagerItemCardGrid} maxWidth="md">
                            {isItemListLoading && [ selCategoryID &&

                                <Typography>loading...</Typography>

                            ]}
                            {!isItemListLoading && [ selCategoryID &&
                                <Grid container direction="column" spacing={2}>
                                    <Grid item>
                                        <Typography variant="h5" color="textPrimary">
                                            {selCategoryName}
                                        </Typography>
                                    </Grid>
                                {itemList.map((item, index) => (
                                    <Grid item key={index}>
                                        <Card className={classes.Card}>
                                        <CardActionArea onClick={() => handleSelectItem(item.item_id, index, item.item_order_index, item.item_name, item.item_desc, item.item_kitchen_name, item.item_img_url, item.disabled)}>
                                            <Grid container alignItems="center" justifyContent="space-between" className={classes.adminMenuManagerItemCard}>
                                                <Grid item>
                                                    <Avatar className={classes.adminMenuManagerItemMedia} src={item.item_img_url} variant="rounded" />
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2" color="textPrimary">
                                                        {item.item_name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2" color="textPrimary">
                                                        {item.disabled === 0 ? ("Enabled") : ("Disabled")}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                                </Grid>
                            ]}
                            {!isItemListLoading && [ selCategoryID && [ itemList.length === 0 &&

                                <Typography>Category has no items...</Typography>

                            ]]}
                            </Container>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper elevation={1}>
                            <Container maxWidth={false} className={classes.adminNavigationContainer}>
                                <List>
                                    <ListItem>
                                        <Typography variant="h5" color="textPrimary" align="center">
                                            Menu Manager
                                        </Typography>
                                    </ListItem>
                                    <Divider />
                                    {showCreateItem === null && [  showEditItem === null && [ showMoveItem === null &&  [ showChangeItemCategory === null && (
                                    <>
                                    <ListItem button disabled={selCategoryID === null} onClick={() => handleAddNewButton()}>
                                        <ListItemText primary="Add New Item"/>
                                    </ListItem>
                                    <ListItem button disabled={selItemID === null} onClick={() => handleEditButton()}>
                                        <ListItemText primary="Edit Item"/>
                                    </ListItem>
                                    <ListItem button disabled={selItemID === null} onClick={() => handleMoveButton()}>
                                        <ListItemText primary="Move Item"/>
                                    </ListItem>
                                    <ListItem button disabled={selItemID === null} onClick={() => handleChangeItemCategoryButton()}>
                                        <ListItemText primary="Change Item Category"/>
                                    </ListItem>
                                    <ListItem button disabled={selItemID === null} onClick={() => handleToggleItem()}>
                                        {(() => {
                                          if (selItemDisabled) {
                                            return <ListItemText primary="Enable Item" />;
                                          } else {
                                            return <ListItemText primary="Disable Item" />;
                                          }
                                        })()}
                                    </ListItem>
                                    <ListItem button disabled={selItemID === null} onClick={() => handleDeleteItem()}>
                                        <ListItemText primary="Remove Item"/>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleStep(1000)}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )]]]}
                                    {showCreateItem === 1 && (
                                    <>
                                    <ListItem>
                                        <Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
                                            <Grid item>
                                                <Typography variant="h5">
                                                    Add New Item to {selCategoryName}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <img src={itemMediaTempURL} className={classes.adminMenuManagerItemImage} hidden={!itemMediaTempURL}/>
                                            </Grid>
                                            <Grid item>
                                                    <input
                                                        accept="image/*"
                                                        id="contained-button-file"
                                                        type="file"
                                                        onChange={handleFileUpload}
                                                        hidden
                                                    />
                                                    <label htmlFor="contained-button-file">
                                                      <Button variant="outlined" color="primary" component="span">
                                                        Upload Image
                                                      </Button>
                                                    </label>
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="item-name" 
                                                    label="Item Name"
                                                    onChange={(e) => {setItemName(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={itemName} 
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="item-desc" 
                                                    label="Item Description"
                                                    onChange={(e) => {setItemDesc(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={itemDesc}
                                                    multiline={true}
                                                    rows={6}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="item-kitchen-name" 
                                                    label="Item Kitchen Name"
                                                    onChange={(e) => {setItemKitchenName(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={itemKitchenName}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary" onClick={() => handleAddNewItem()} disabled={itemName === '' || itemMediaTempURL === null}>
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleCancelNewItem()}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )}
                                    {showEditItem === 1 && (
                                    <>
                                    <ListItem>
                                        <Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
                                            <Grid item>
                                                <Typography variant="h5">
                                                    Edit {selItemName}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <img src={selItemMedia} className={classes.adminMenuManagerItemImage} hidden={!selItemMedia}/>
                                            </Grid>
                                            <Grid item>
                                                <img src={itemMediaTempURL} className={classes.adminMenuManagerItemImage} hidden={!itemMediaTempURL}/>
                                            </Grid>
                                            <Grid item>
                                                    <input
                                                        accept="image/*"
                                                        id="contained-button-file"
                                                        type="file"
                                                        onChange={handleFileUpload}
                                                        hidden
                                                    />
                                                    <label htmlFor="contained-button-file">
                                                      <Button variant="outlined" color="primary" component="span">
                                                        Change Image
                                                      </Button>
                                                    </label>
                                            </Grid>
                                            <Divider />
                                            <Grid item>
                                                <TextField 
                                                    id="item-name" 
                                                    label="Item Name"
                                                    onChange={(e) => {setSelItemName(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={selItemName} 
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="item-desc" 
                                                    label="Item Description"
                                                    onChange={(e) => {setSelItemDesc(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={selItemDesc}
                                                    multiline={true}
                                                    rows={6}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="item-kitchen-name" 
                                                    label="Item Kitchen Name"
                                                    onChange={(e) => {setSelItemKitchenName(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={selItemKitchenName}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary" onClick={() => handleEditItem()} disabled={selItemName === ''}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleCancelEditItem()}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )}
                                    {showMoveItem === 1 && (
                                    <>
                                    <ListItem>
                                        <Typography variant="h6">
                                            Move {selItemName}
                                        </Typography>
                                    </ListItem>
                                    <ListItem button onClick={() => handleMoveItem(1)} disabled={selItemMap === 0}>
                                        <ListItemText primary="Move Item Up" />
                                    </ListItem>
                                    <ListItem button onClick={() => handleMoveItem(0)} disabled={selItemMap === itemList.length-1}>
                                        <ListItemText primary="Move Item Down" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleCancelMoveItem()}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )}
                                    {showChangeItemCategory === 1 && (
                                    <>
                                    <ListItem>
                                        <Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
                                            <Grid item>
                                                <Typography variant="h5">
                                                    Change {selItemName} Category
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <FormControl>
                                                    <InputLabel>Category</InputLabel>
                                                        <Select value={selNewCategoryID}>
                                                        {categoryList.map((category, index) => (
                                                            <MenuItem key={index} value={category.category_id} onClick={() => handleSelNewCategory(category.category_id, category.category_name)}>{category.category_name}</MenuItem>
                                                        ))}
                                                        </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary" onClick={() => handleChangeItemCategory()}>
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleCancelChangeItemCategory()}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )}
                                </List>
                            </Container>
                        </Paper>
                    </Grid>
            </Grid>
            </main>

    </>;
}

export default AdminMenuManager;