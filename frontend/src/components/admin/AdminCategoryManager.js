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
 			TableRow,
 			TextField,
 			FormControl,
 			Select,
 			InputLabel   } from '@mui/material';


import { createTheme, responsiveFontSizes, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import useClasses from '../../classes'
import styles from '../../styles';


function AdminCategoryManager({ curStep, handleStep }) {


	//Apply css styles from styles.js
	const classes = useClasses(styles);

	//Auto responsive font sizes by viewport
	let theme = createTheme();
	theme = responsiveFontSizes(theme);
	

	let [categoryList, setCategoryList] = React.useState();
	let [isListLoading, setIsListLoading] = React.useState(true);
	//fetch categories
	useEffect(()=> {
		Axios.get("http://192.46.223.124/api/fetch/categories")
		.then((response) => {
			setCategoryList(response.data);
			setIsListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);

	let [printerList, setPrinterList] = React.useState();
	let [isPrinterListLoading, setIsPrinterListLoading] = React.useState(true);
	//fetch printers list
	useEffect(()=> {
		Axios.get("http://192.46.223.124/api/fetch/printers")
		.then((response) => {
			setPrinterList(response.data);
			setIsPrinterListLoading(false);
		})
		.catch((e) => {
       		console.log("error ", e)});
	}, []);




	let [selCategory, setSelCategory] = React.useState(null);
	let [selDispCategory, setSelDispCategory] = React.useState(null);
	let [selCategoryOrderID, setSelCategoryOrderID] = React.useState(null);
	let [selCategoryName, setSelCategoryName] = React.useState(null);
	let [isDisabled, setIsDisabled] = React.useState(null);

	function handleSelCategory(id, name, mapIndex, orderIndex, disabled) {

		setSelCategory(id);
		setSelDispCategory(mapIndex);
		setSelCategoryName(name);
		setSelCategoryOrderID(orderIndex);
		setIsDisabled(disabled);
	}

	let [showCreateCategory, setShowCreateCategory] = React.useState(null);

	function handleCreateClick() {

		setSelCategory(null);
		setSelDispCategory(null);
		setSelCategoryName(null);

		if (showCreateCategory === null) {
			setShowCreateCategory(1);
		}
		if (showCreateCategory === 1) {
			setShowCreateCategory(null);
		}
	}

	//category name to be inserted from text input
	let [categoryName, setCategoryName] = React.useState("");

	function handleCreateCategory() {

		if(categoryName) {

			Axios.post("http://192.46.223.124/api/add/category", {
				categoryName: categoryName,
				selPrinters: selPrinters,
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			//empty text box value
			setCategoryName("");
			setSelPrinters([]);
			
		}

	};
	//delete category
	function handleDeleteCategory() {
		if(selCategory) {

			Axios.post("http://192.46.223.124/api/delete/category", {
				selCategory: selCategory,
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
				//reset selection
				setSelCategory(null);
				setSelCategoryName(null);
				setSelDispCategory(null);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	};

	//show/hide move category menu
	let [showMoveCategory, setShowMoveCategory] = React.useState(null);

	function handleMoveCategoryClick() {

		if (showMoveCategory === null) {
			setShowMoveCategory(1);
		}
		if (showMoveCategory === 1) {
			//reset all var and close menu
			setShowMoveCategory(null);
			setSelCategory(null);
			setSelDispCategory(null);
			setSelCategoryName(null);
		}
	}

	//moving category sort item up(1) or down(0)
	function handleMoveCategory(direction) {

		//current selected category id and order index
		var currentRowID = selCategory;
		var currentRowOrderID = selCategoryOrderID;

		//check if first item on list trying to move up
		//or if last item on list trying to move down
		const currentRowMapID = selDispCategory-1;
		if(currentRowMapID === 0 && direction === 1 || currentRowMapID === categoryList.length-1 && direction === 0) {
			return;
		}

		//setup vars to hold next row info
		var nextRowID;
		var nextRowOrderID;


		if(direction === 1) {
			//get id and order index of row above
			nextRowID = categoryList[currentRowMapID-1].category_id;
			nextRowOrderID = categoryList[currentRowMapID-1].category_order_index;

			//set display number and order index to row above
			setSelDispCategory(currentRowMapID);
			setSelCategoryOrderID(nextRowOrderID)
		}
		if(direction === 0) {
			//get id and order index of row below
			nextRowID = categoryList[currentRowMapID+1].category_id;
			nextRowOrderID = categoryList[currentRowMapID+1].category_order_index;

			//set display number and order index to row below
			setSelDispCategory(currentRowMapID+2);
			setSelCategoryOrderID(nextRowOrderID)
		}

		//send to backend
		Axios.post("http://192.46.223.124/api/move/category", {
			currentRowID: currentRowID,
			currentRowOrderID: currentRowOrderID,
			nextRowID: nextRowID,
			nextRowOrderID: nextRowOrderID,
		})
		.then((response) => {
			console.log("moved");
			//update category list with new data
			setCategoryList(response.data);

		})
		.catch((e) => {
       		console.log("error ", e)});

	};

	let [showEditCategory, setShowEditCategory] = React.useState(null);

	//show or hide category edit box
	function handleEditClick() {

		if (showEditCategory === null) {
			setShowEditCategory(1);	
		}
		if (showEditCategory === 1) {
			setShowEditCategory(null);
			//reset selection
			setSelCategory(null);
			setSelCategoryName(null);
			setSelDispCategory(null);
		}
	}

	useEffect(()=> {
		if(selCategory) {
			//fetch selected printer list of selected category
			Axios.post("http://192.46.223.124/api/fetch/selected_printers", {
				selCategory: selCategory,
			})
			.then((response) => {
				if (response.data.length) {
					//temp array to store selected printers
					let printerData = [];
					//add each row of days as string from db into temp array
					response.data.map((printer) => (printerData.push(printer.printer_id)));
					//set the state var to value of temp array
					setSelPrinters(printerData);
				}
				else {
					setSelPrinters([]);
				}
			})
			.catch((e) => {
		   		console.log("error ", e)});
		}
	}, [selCategory]);

	//edit category
	function handleEditCategory() {
		if(selCategoryName) {

			Axios.post("http://192.46.223.124/api/edit/category", {
				categoryName: selCategoryName,
				selCategory: selCategory,
				selPrinters: selPrinters
			})
			.then((response) => {
				//update category list with fresh data
				setCategoryList(response.data);
				setShowEditCategory(null);
				//reset selection
				setSelCategory(null);
				setSelCategoryName(null);
				setSelDispCategory(null);
				setSelPrinters([]);
			})
			.catch((e) => {
	       		console.log("error ", e)});
			
		}
	}

	//enable or disable category
	function handleToggleCategory() {

		var disabled = !isDisabled;

		if(selCategory) {

			Axios.post("http://192.46.223.124/api/toggle/category", {
				disabled: disabled,
				selCategory: selCategory,
			})
			.then((response) => {
				setCategoryList(response.data);
				setIsDisabled(!isDisabled);
			})
			.catch((e) => {
	       		console.log("error ", e)});
		}

	}

	//selected printers
	let [selPrinters, setSelPrinters] = React.useState([]);
	//selected printers in select menu
	function handleSelPrinters(event) {
		setSelPrinters(event.target.value);
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
                        <Container maxWidth={false} className={classes.adminCategoryManagerCardGridContainer}>
                            <Container className={classes.adminCategoryManagerCardGrid} maxWidth="md">
                                {isListLoading && (

                                    <Typography>loading...</Typography>

                                )}
                                {!isListLoading && (
                                    <Grid container direction="column" spacing={2}>
                                    {categoryList.map((category, index) => (
                                        <Grid item key={category.category_id}>
                                            <Card className={classes.Card}>
                                            <CardActionArea onClick={() => handleSelCategory(category.category_id, category.category_name, index+1, category.category_order_index, category.disabled)}>
                                                <Grid className={classes.adminCategoryManagerCard} container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Typography variant="subtitle2" color="textPrimary">
                                                            {index+1}.
                                                        </Typography>
                                                    </Grid>
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
                        </Container>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper elevation={1}>
                            <Container maxWidth={false} className={classes.adminNavigationContainer}>


                                <List>
                                    <ListItem>
                                        <Typography variant="h5" color="textPrimary" align="center">
                                            Category Manager
                                        </Typography>
                                    </ListItem>
                                    {selDispCategory && [ showCreateCategory === null &&
                                    <ListItem>
                                        <Typography variant="h6" color="textPrimary" align="center">
                                            {selDispCategory}. {selCategoryName}
                                        </Typography>
                                    </ListItem>
                                    ]}
                                    <Divider />
                                    {showCreateCategory === null && [ 
                                        showMoveCategory === null && [
                                            showEditCategory === null &&
                                    <>
                                    <ListItem button onClick={() => handleCreateClick()}>
                                        <ListItemText primary="Add New Category" />
                                    </ListItem>	
                                    <ListItem button disabled={selCategory === null} onClick={() => handleEditClick()}>
                                        <ListItemText primary="Edit Category" />
                                    </ListItem>															
                                    <ListItem button disabled={selCategory === null} onClick={() => handleMoveCategoryClick()}>
                                        <ListItemText primary="Move Category" />
                                    </ListItem>
                                    <ListItem button disabled={selCategory === null} onClick={() => handleToggleCategory()}>
                                        {(() => {
                                          if (isDisabled) {
                                            return <ListItemText primary="Enable Category" />;
                                          } else {
                                            return <ListItemText primary="Disable Category" />;
                                          }
                                        })()}
                                    </ListItem>
                                    <ListItem button disabled={selCategory === null} onClick={() => handleDeleteCategory()}>
                                        <ListItemText primary="Remove Category" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleStep(1000)}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    ]]}
                                    {showMoveCategory === 1 && (
                                    <>
                                    <ListItem button onClick={() => handleMoveCategory(1)} disabled={selDispCategory-1 === 0}>
                                        <ListItemText primary="Move Category Up" />
                                    </ListItem>
                                    <ListItem button onClick={() => handleMoveCategory(0)} disabled={selDispCategory-1 === categoryList.length-1}>
                                        <ListItemText primary="Move Category Down" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleMoveCategoryClick()}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )}
                                    {showEditCategory === 1 && (
                                    <>
                                    <ListItem>
                                    <form>
                                        <Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
                                            <Grid item>
                                                <Typography variant="h5">
                                                    Edit Category
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="category" 
                                                    label="Category Name"
                                                    onChange={(e) => {setSelCategoryName(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={selCategoryName} 
                                                />
                                            </Grid>
                                            <Grid item className={classes.adminCategoryManagerSelectedPrinters}>
                                                <Typography variant="h6">
                                                    Selected Printers
                                                </Typography>
                                                <FormControl className={classes.adminCategoryManagerSelect}>
                                                    <InputLabel>Printers</InputLabel>
                                                    <Select
                                                        multiple 
                                                        value={selPrinters}
                                                        onChange={handleSelPrinters}
                                                        variant="filled"
                                                    >
                                                        {printerList.map((printer, index) => (
                                                            <MenuItem key={index} value={printer.printer_id}>
                                                              {printer.printer_name}
                                                            </MenuItem>
                                                          ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary" onClick={() => handleEditCategory()} disabled={!selCategoryName}>
                                                    Save Edit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleEditClick()}>
                                        <ListItemText primary="Go Back"/>
                                    </ListItem>
                                    </>
                                    )}
                                    {showCreateCategory === 1 && (
                                    <>
                                    <ListItem>
                                    <form>
                                        <Grid container spacing={2} alignItems="flex-start" justifyContent="center" direction="column" className={classes.adminCategoryManagerCreateCategoryContainer}>
                                            <Grid item>
                                                <Typography variant="h5">
                                                    Create New Category
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <TextField 
                                                    id="category" 
                                                    label="Category Name"
                                                    onChange={(e) => {setCategoryName(e.target.value)}} 
                                                    variant="filled" 
                                                    fullWidth
                                                    value={categoryName} 
                                                />
                                            </Grid>
                                            <Grid item className={classes.adminCategoryManagerSelectedPrinters}>
                                                <Typography variant="h6">
                                                    Selected Printers
                                                </Typography>
                                                <FormControl className={classes.adminCategoryManagerSelect}>
                                                    <InputLabel>Printers</InputLabel>
                                                    <Select
                                                        multiple 
                                                        value={selPrinters}
                                                        onChange={handleSelPrinters}
                                                        variant="filled"
                                                    >
                                                        {printerList.map((printer, index) => (
                                                            <MenuItem key={index} value={printer.printer_id}>
                                                              {printer.printer_name}
                                                            </MenuItem>
                                                          ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item>
                                                <Button variant="contained" color="primary" onClick={() => handleCreateCategory()}>
                                                    Add Category
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                    </ListItem>
                                    <Divider />
                                    <ListItem button onClick={() => handleCreateClick()}>
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

export default AdminCategoryManager;