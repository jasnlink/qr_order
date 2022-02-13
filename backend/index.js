import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';

import fileUpload from 'express-fileupload';
import QRCode from 'qrcode';
import Axios from 'axios';
import path from 'path';

import { Server } from 'socket.io';
var io = new Server(8000);

io.on('connection', (socket) => {
    console.log('Client has connected...');

    socket.on('disconnect', (reason) => {
        console.log('Client has disconnected...', reason);
    });
});



// set current working directory
const __dirname = path.resolve();
// public image directory
const cdnDir = path.join(__dirname, 'public');
// set website address
const SITE = 'http://192.46.223.124/';



// set port, listen for requests
const PORT = process.env.PORT || 3500;

//database connection info
var connection;
const connectionInfo = {
    host: '127.0.0.1', 
    user:'admin', 
    password: 'password',
    database: 'qr_order_system'
};

const app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(cdnDir));
app.use(fileUpload());


//auto connect and reconnect to database function
function connectToDb(callback) {
  const attemptConnection = () => {
    console.log('Connecting to database...')
    connectionInfo.connectTimeout = 2000 // same as setTimeout to avoid server overload 
    connection = mysql.createConnection(connectionInfo)
    connection.connect(function (err) {
      if (err) {
        console.log('Error connecting to database, trying again in 2 secs...')
        connection.destroy() // end immediately failed connection before creating new one
        setTimeout(attemptConnection, 2000)
      } else {
        callback()
      }
    })
    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Renewing database connection...');
        } else {
            console.log('database error...', err);
        }
        attemptConnection();
    });

  }
  attemptConnection()
}
// now you simply call it with normal callback
connectToDb( () => {
    console.log("Connected to database!");
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

/***********************************************************************************
************************************************************************************/
//          Category Manager Routes
//
//
/***********************************************************************************
************************************************************************************/
//fetch all categories
app.get('/api/fetch/categories', (req, res) => {

    let query = "SELECT * FROM category_list ORDER BY category_order_index";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all categories...');
        res.send(result);
    });
});



//Add category
app.post('/api/add/category', (req, res) => {

    const categoryName = req.body.categoryName;
    const selPrinters = req.body.selPrinters;

    //insert new row
	const query = "INSERT INTO category_list (category_name) VALUES (?);";
	connection.query(query, [categoryName], (err, result) => {
		if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Adding category...', result.affectedRows);
        const lastInsertID = result.insertId;

        //update category order index of row with category id (kind of like manual auto increment)
        const query = "UPDATE category_list SET category_order_index=LAST_INSERT_ID() WHERE category_id=LAST_INSERT_ID();";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Adding category (matching)...', result.affectedRows);

            if (selPrinters.length > 0) {
                //insert new selected printers to matching category
                Promise.all(              
                    selPrinters.map((printer) => {
                        let query = "INSERT INTO printer_category_list (printer_id, category_id) VALUES (?, ?)";
                        connection.query(query, [printer, lastInsertID], (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('Inserting selected printers...');
                        });
                    })
                ).then((result) => {
                    //fetch updated category list
                    let query = "SELECT * FROM category_list ORDER BY category_order_index";
                    connection.query(query, (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('Fetching updated categories...');
                        res.send(result);
                });

                })
            } else {
                //fetch updated category list
                let query = "SELECT * FROM category_list ORDER BY category_order_index";
                connection.query(query, (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated categories...');
                    res.send(result);
                });
            }

        });
    });
});


//Delete category
app.post('/api/delete/category', (req, res) => {

    const selCategory = req.body.selCategory;
    const query = "DELETE FROM category_list WHERE category_id=?";
    connection.query(query, [selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting category...', result.affectedRows);

        //delete all selected printers from category
        let query = "DELETE FROM printer_category_list WHERE category_id=?;";
        connection.query(query, [selCategory], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Deleting selected printers from category...', result.affectedRows);


            //fetch updated category list
            let query = "SELECT * FROM category_list ORDER BY category_order_index";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated categories...');
                res.send(result);
            });
        });
    });
});


//Move category
app.post('/api/move/category', (req, res) => {

    const currentRowID = req.body.currentRowID;
    const currentRowOrderID = req.body.currentRowOrderID;
    const nextRowID = req.body.nextRowID;
    const nextRowOrderID = req.body.nextRowOrderID;

    //set order index of row above with current one
    const query = "UPDATE category_list SET category_order_index=? WHERE category_id=?;";
    connection.query(query, [currentRowOrderID, nextRowID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Moving current category...', result.affectedRows);

        //set order index of current row with the one above
        const query = "UPDATE category_list SET category_order_index=? WHERE category_id=?;";
        connection.query(query, [nextRowOrderID, currentRowID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Moving next category...', result.affectedRows);

            //fetch new update category list
            let query = "SELECT * FROM category_list ORDER BY category_order_index";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated categories...');
                res.send(result);
            });
        });
    });
});


//edit category
app.post('/api/edit/category', (req, res) => {

    const categoryName = req.body.categoryName;
    const selCategory = req.body.selCategory;
    const selPrinters = req.body.selPrinters

    console.log(selPrinters);

    let query = "UPDATE category_list SET category_name=? WHERE category_id=?;";
    connection.query(query, [categoryName, selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Editing category...');


        //delete all selected printers from category
        let query = "DELETE FROM printer_category_list WHERE category_id=?;";
        connection.query(query, [selCategory], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Deleting selected printers from category...', result.affectedRows);

            //insert new selected printers
            Promise.all( 
                selPrinters.map((printer) => {
                    let query = "INSERT INTO printer_category_list (printer_id, category_id) VALUES (?, ?)";
                        connection.query(query, [printer, selCategory], (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('Inserting new selected printers to category...');
                        });
                })
            ).then((result) => {

                //fetch updated category list
                let query = "SELECT * FROM category_list ORDER BY category_order_index";
                connection.query(query, (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated categories...');
                    res.send(result);
                });
            });
        });
    });
});



//Enable or Disable Category
app.post('/api/toggle/category', (req, res) => {

    const selCategory = req.body.selCategory;
    const disabled = req.body.disabled;

    const query = "UPDATE category_list SET disabled=? WHERE category_id=?;";
    connection.query(query, [disabled, selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Toggling category...', result.affectedRows);
        //fetch updated category list
        let query = "SELECT * FROM category_list ORDER BY category_order_index";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated categories...');
            res.send(result);
        });
    });
});


//fetch all printers
app.get('/api/fetch/printers', (req, res) => {

    let query = "SELECT * FROM printer_list";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all printers...');
        res.send(result);
    });
});

//fetch selected printers from selected category
app.post('/api/fetch/selected_printers', (req, res) => {

    const selCategory = req.body.selCategory;
    console.log(selCategory);

    let query = "SELECT printer_id FROM printer_category_list WHERE category_id=?";
    connection.query(query, [selCategory], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching selected printers from selected category...');
        res.send(result);
    });
});

/***********************************************************************************
************************************************************************************/
//          Table Manager Routes
//
//
/***********************************************************************************
************************************************************************************/

//fetch all tables
app.get('/api/fetch/tables', (req, res) => {

    let query = "SELECT * FROM table_list ORDER BY table_number";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all tables...');
        res.send(result);
    });
});



//Seat table
app.post('/api/occupy/table', (req, res) => {

    const selTableID = req.body.selTableID;
    const selTableNumber = req.body.selTableNumber;
    const seatTableAdultCount = req.body.seatTableAdultCount;
    const seatTableChildCount = req.body.seatTableChildCount;

    const query = "UPDATE table_list SET occupied='1', adult_count=?, child_count=? WHERE table_id=?;";
    connection.query(query, [seatTableAdultCount, seatTableChildCount, selTableID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Occupying table...', result.affectedRows);

        io.emit('print_table', {id: selTableID, number: selTableNumber, adults: seatTableAdultCount, children: seatTableChildCount});
        console.log('Sending print job...');

        //fetch updated table list
        let query = "SELECT * FROM table_list ORDER BY table_number";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated tables...');
            res.send(result);
        });
    });
});


//Unseat table
app.post('/api/unoccupy/table', (req, res) => {

    const selTableID = req.body.selTableID;

    const query = "UPDATE table_list SET occupied='0', adult_count='null', child_count='null' WHERE table_id=?;";
    connection.query(query, [selTableID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Unoccupying table...', result.affectedRows);
        //fetch updated table list
        let query = "SELECT * FROM table_list ORDER BY table_number";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated tables...');
            res.send(result);
        });
    });
});


//Delete table
app.post('/api/delete/table', (req, res) => {

    const selTableID = req.body.selTableID;
    const query = "DELETE FROM table_list WHERE table_id=?";
    connection.query(query, [selTableID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting table...', result.affectedRows);
        //fetch updated table list
        let query = "SELECT * FROM table_list ORDER BY table_number";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated tables...');
            res.send(result);
        });
    });
});


//find table when input from kaypad
app.post('/api/find/table', (req, res) => {

    const selTableNumber = req.body.selTableNumber;

    let query = "SELECT * FROM table_list WHERE table_number=?";
    connection.query(query, [selTableNumber], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Finding table...');
        res.send(result);
    });
});



//Add table from keypad input if table not found
app.post('/api/add/table', (req, res) => {

    console.log('Table not found...');

    const selTableNumber = req.body.selTableNumber;

    //insert new row
    const query = "INSERT INTO table_list (table_number) VALUES (?);";
    connection.query(query, [selTableNumber], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Adding table...', result.affectedRows);
        console.log(result);
        res.send(result);

    });
});


//Print table QR code
app.post('/api/print/table', (req, res) => {

    console.log('Printing table QR code...');

    const selTableID = req.body.selTableID;
    const selTableNumber = req.body.selTableNumber;
    const selTableAdultCount = req.body.selTableAdultCount;
    const selTableChildCount = req.body.selTableChildCount;

    io.emit('print_table', {id: selTableID, number: selTableNumber, adults: selTableAdultCount, children: selTableChildCount});
    console.log('Sending print job...');

    res.send('success');

});


/***********************************************************************************
************************************************************************************/
//          Menu Manager Routes
//
//
/***********************************************************************************
************************************************************************************/

//fetch all menu items from category
app.post('/api/fetch/items', (req, res) => {

    const selCategoryID = req.body.selCategoryID;

    let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
    connection.query(query, [selCategoryID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching items from category...');
        res.send(result);
    });
});



//Add item
app.post('/api/add/item', (req, res) => {

    // if no file uploaded
    if(!req.files) {
            return res.status(400).json({ msg: 'No image uploaded' });
        }

    //set var to file from request
    const file = req.files.file;

    //set upload path
    const uploadPath = cdnDir+'/assets/';
    const timestamp = Date.now();
    const fileName = timestamp+'_'+file.name;
    const filePath = uploadPath+fileName;

    //move file to directory
    file.mv(filePath, err => {

        if(err) {
            console.error(err);
            res.status(400).send(err);
        } 

    })

    //grab rest of form data
    const selCategoryID = req.body.selCategoryID;
    const itemName = req.body.itemName;
    const itemDesc = req.body.itemDesc;
    const itemKitchenName = req.body.itemKitchenName;
    const itemImgURL = SITE+'assets/'+fileName;


        //insert new row
        const query = "INSERT INTO item_list (item_name, item_kitchen_name, item_desc, item_img_url, category_id) VALUES (?, ?, ?, ?, ?);";
        connection.query(query, [itemName, itemKitchenName, itemDesc, itemImgURL, selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Adding item...', result.affectedRows);

            //update item order index of row with item id (kind of like manual auto increment)
            const query = "UPDATE item_list SET item_order_index=LAST_INSERT_ID() WHERE item_id=LAST_INSERT_ID();";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Adding item (matching)...', result.affectedRows);

                //fetch updated item list
                let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
                connection.query(query, [selCategoryID], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated items...');
                    res.send(result);
                });

            });
        });

  

});


//Edit item
app.post('/api/edit/item', (req, res) => {

    // if file uploaded
    if(req.files) {
            
        //set var to file from request
        const file = req.files.file;

        //set upload path
        const uploadPath = cdnDir+'/assets/';
        const timestamp = Date.now();
        const fileName = timestamp+'_'+file.name;
        const filePath = uploadPath+fileName;


        //move file to directory
        file.mv(filePath, err => {

            if(err) {
                console.error(err);
                res.status(400).send(err);
            } 

        })

        //grab rest of form data
        const selCategoryID = req.body.selCategoryID;
        const selItemID = req.body.selItemID;
        const selItemName = req.body.selItemName;
        const selItemDesc = req.body.selItemDesc;
        const selItemKitchenName = req.body.selItemKitchenName;
        const itemImgURL = SITE+'assets/'+fileName;


            //update item row
            const query = "UPDATE item_list SET item_name=?, item_kitchen_name=?, item_desc=?, item_img_url=? WHERE item_id=?;";
            connection.query(query, [selItemName, selItemKitchenName, selItemDesc, itemImgURL, selItemID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Editing item...', result.affectedRows);


                //fetch updated item list
                let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
                connection.query(query, [selCategoryID], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated items...');
                    res.send(result);
                });

            });

    }
    if(!req.files) {

        const selCategoryID = req.body.selCategoryID;
        const selItemID = req.body.selItemID;
        const selItemName = req.body.selItemName;
        const selItemDesc = req.body.selItemDesc;
        const selItemKitchenName = req.body.selItemKitchenName;


            //update item row
            const query = "UPDATE item_list SET item_name=?, item_kitchen_name=?, item_desc=? WHERE item_id=?;";
            connection.query(query, [selItemName, selItemKitchenName, selItemDesc, selItemID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Editing item...', result.affectedRows);


                //fetch updated item list
                let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
                connection.query(query, [selCategoryID], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching updated items...');
                    res.send(result);
                });

            });
    }

});

//Move item
app.post('/api/move/item', (req, res) => {

    const selCategoryID = req.body.selCategoryID;
    const currentRowID = req.body.currentRowID;
    const currentRowOrderID = req.body.currentRowOrderID;
    const nextRowID = req.body.nextRowID;
    const nextRowOrderID = req.body.nextRowOrderID;

    //set order index of row above with current one
    const query = "UPDATE item_list SET item_order_index=? WHERE item_id=? AND category_id=?;";
    connection.query(query, [currentRowOrderID, nextRowID, selCategoryID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Moving current item...', result.affectedRows);

        //set order index of current row with the one above
        const query = "UPDATE item_list SET item_order_index=? WHERE item_id=? AND category_id=?;";
        connection.query(query, [nextRowOrderID, currentRowID, selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Moving next category...', result.affectedRows);

            //fetch new update item list
            let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
            connection.query(query, [selCategoryID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching updated items...');
                res.send(result);
            });
        });
    });
});

//Change item category
app.post('/api/change/item', (req, res) => {

    const selItemID = req.body.selItemID;
    const selNewCategoryID = req.body.selNewCategoryID;
    const selCategoryID = req.body.selCategoryID

    const query = "UPDATE item_list SET category_id=? WHERE item_id=?;";
    connection.query(query, [selNewCategoryID, selItemID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Changing item category...', result.affectedRows);
        //fetch updated item list
        let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
        connection.query(query, [selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated items...');
            res.send(result);
        });
    });
});


//Delete item
app.post('/api/delete/item', (req, res) => {

    const selCategoryID = req.body.selCategoryID
    const selItemID = req.body.selItemID;

    const query = "DELETE FROM item_list WHERE item_id=?";
    connection.query(query, [selItemID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting item...', result.affectedRows);
        //fetch updated category list
        let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
        connection.query(query, [selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated items...');
            res.send(result);
        });
    });
});


//Enable or Disable item
app.post('/api/toggle/item', (req, res) => {

    const selCategoryID = req.body.selCategoryID
    const selItemID = req.body.selItemID;
    const disabled = req.body.disabled;

    const query = "UPDATE item_list SET disabled=? WHERE item_id=?;";
    connection.query(query, [disabled, selItemID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Toggling item...', result.affectedRows);
        //fetch updated item list
        let query = "SELECT * FROM item_list WHERE category_id=? ORDER BY item_order_index";
        connection.query(query, [selCategoryID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated items...');
            res.send(result);
        });
    });
});


/***********************************************************************************
************************************************************************************/
//          Time Manager Routes
//
//
/***********************************************************************************
************************************************************************************/

//fetch all time groups
app.get('/api/fetch/timegroup', (req, res) => {

    let query = "SELECT * FROM time_group_list";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all time groups...');
        res.send(result);
    });
});

//fetch days from selected time group
app.post('/api/fetch/timedata', (req, res) => {

    const selTimeGroupID = req.body.selTimeGroupID;

    let query = "SELECT * FROM time_day_list WHERE time_group_id=?";
    connection.query(query, [selTimeGroupID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching time data from time group...');
        res.send(result);
    });
});

//fetch categories from selected time group
app.post('/api/fetch/timecategories', (req, res) => {

    const selTimeGroupID = req.body.selTimeGroupID;

    let query = "SELECT * FROM time_category_list WHERE time_group_id=?";
    connection.query(query, [selTimeGroupID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching time categories from time group...');
        res.send(result);
    });
});

//save changes to time group
app.post('/api/save/timegroup', (req, res) => {

    const selTimeGroupID = req.body.selTimeGroupID
    const fromTime = req.body.fromTime;
    const toTime = req.body.toTime;

    console.log(fromTime);

    const selDays = req.body.selDays;
    const selCategories = req.body.selCategories;

    //delete all days from time group
    let query = "DELETE FROM time_day_list WHERE time_group_id=?;";
    connection.query(query, [selTimeGroupID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting days from time group...', result.affectedRows);

        //delete all selected categories from time group
        let query = "DELETE FROM time_category_list WHERE time_group_id=?;";
        connection.query(query, [selTimeGroupID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
        console.log('Deleting selected categories from time group...', result.affectedRows);

            //insert new selected days to time group
            Promise.all(
                selDays.map((day) => {
                    let query = "INSERT INTO time_day_list (time_group_id, day) VALUES (?, ?)";
                    connection.query(query, [selTimeGroupID, parseInt(day)], (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('Inserting new selected day...');
                    });
                })
            ).then((result) => {
                //insert new selected categories to time group
                Promise.all(              
                    selCategories.map((category) => {
                        let query = "INSERT INTO time_category_list (time_group_id, category_id) VALUES (?, ?)";
                        connection.query(query, [selTimeGroupID, category], (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('Inserting new selected category...');
                        });
                    })
                ).then((result) => {
                    //update time group hours
                    let query = "UPDATE time_group_list SET from_time=?, to_time=? WHERE time_group_id=?;";
                    connection.query(query, [fromTime, toTime, selTimeGroupID], (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('Updating time group hours...');

                        let query = "SELECT * FROM time_group_list";
                        connection.query(query, (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('Fetching all time groups...');
                            res.send(result);
                        });

                    })
                })
                .catch((e) => {
                console.log("error ", e)});            
            })
            .catch((e) => {
                    console.log("error ", e)});
        });
    });
});

//Add new time group
app.post('/api/add/timegroup', (req, res) => {

    const newTimeGroupName = req.body.newTimeGroupName;
    const newDaysArray = [0, 1, 2, 3, 4, 5, 6];

    let query = "INSERT INTO time_group_list (time_group_name) VALUES (?);";
    connection.query(query, [newTimeGroupName], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Adding new time group...');

        const lastInsertID = result.insertId;

        Promise.all( 
            newDaysArray.map((day) => {
                let query = "INSERT INTO time_day_list (time_group_id, day) VALUES (?, ?)";
                    connection.query(query, [lastInsertID, day], (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('Inserting new days to new time group...');
                    });
            })
        ).then((result) => {
            let query = "SELECT * FROM time_group_list";
            connection.query(query, (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching all time groups...');
                res.send(result);
            });
        })
        .catch((e) => {
                console.log("error ", e)});           


    })

});


//edit time group name
app.post('/api/edit/timegroup', (req, res) => {

    const selTimeGroupID = req.body.selTimeGroupID;
    const newTimeGroupName = req.body.newTimeGroupName;

    let query = "UPDATE time_group_list SET time_group_name=? WHERE time_group_id=?;";
    connection.query(query, [newTimeGroupName, selTimeGroupID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Editing time group...');

        //fetch updated time group list
        let query = "SELECT * FROM time_group_list";
        connection.query(query, (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Fetching updated time group list...');
            res.send(result);
        });
    });
});

//delete time group
app.post('/api/delete/timegroup', (req, res) => {

    const selTimeGroupID = req.body.selTimeGroupID;

    let query = "DELETE FROM time_category_list WHERE time_group_id=?;";
    connection.query(query, [selTimeGroupID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Deleting time group categories...');

        let query = "DELETE FROM time_day_list WHERE time_group_id=?;";
        connection.query(query, [selTimeGroupID], (err, result) => {
            if(err) {
                res.status(400).send(err);
                return;
            }
            console.log('Deleting time group days...');

            let query = "DELETE FROM time_group_list WHERE time_group_id=?;";
            connection.query(query, [selTimeGroupID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Deleting time group...');

                let query = "SELECT * FROM time_group_list";
                connection.query(query, (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    console.log('Fetching all time groups...');
                    res.send(result);
                });
            });
        });
    });
});


/***********************************************************************************
************************************************************************************/
//          Customer Front Routes
//
//
/***********************************************************************************
************************************************************************************/



//fetch categories depending on time
app.post('/api/fetch/timed_categories', (req, res) => {

    //check if current time is between menu open and close hours
    let query = "SELECT time_group_list.time_group_id FROM time_group_list INNER JOIN time_day_list ON time_group_list.time_group_id = time_day_list.time_group_id WHERE time_day_list.day = 1 AND CURRENT_TIME BETWEEN time_group_list.from_time AND time_group_list.to_time";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching current time group...');
        if(result.length) {
            let currentTimeGroupID = result[0].time_group_id;

            let query = "SELECT * FROM category_list AS t1 INNER JOIN time_category_list AS t2 ON t2.category_id = t1.category_id WHERE t2.time_group_id=? AND t1.disabled='0' ORDER BY t1.category_order_index;";
            connection.query(query, [currentTimeGroupID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Fetching matching categories...');
                res.send(result);
            });
        } else {
            res.status(999).send('ERR 1: La cuisine est fermé en ce moment.');
        }
    });
});


app.post('/api/place/order', (req, res) => {

    const curTableID = req.body.curTableID;
    const cartContent = req.body.cartContent;



    //check if current time is between menu open and close hours
    let query = "SELECT time_group_list.time_group_id FROM time_group_list INNER JOIN time_day_list ON time_group_list.time_group_id = time_day_list.time_group_id WHERE time_day_list.day = 1 AND CURRENT_TIME BETWEEN time_group_list.from_time AND time_group_list.to_time";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching current time group...');

        if(result.length) {
            let query = "INSERT INTO placed_order (table_id, time_placed) VALUES (?, CURRENT_TIME);";
            connection.query(query, [curTableID], (err, result) => {
                if(err) {
                    res.status(400).send(err);
                    return;
                }
                console.log('Placing new order...');

                const lastInsertID = result.insertId;

                Promise.all(              
                    cartContent.map((item) => {
                        let query = "INSERT INTO placed_in_order (placed_order_id, item_id, quantity) VALUES (?, ?, ?)";
                        connection.query(query, [lastInsertID, item.itemID, item.itemQty], (err, result) => {
                            if(err) {
                                res.status(400).send(err);
                                return;
                            }
                            console.log('Adding item to new order...');
                        });
                    })
                ).then((result) => {

                    //temp var to hold table info
                    var tableInfo;

                    //get table info and order info
                    let query = "SELECT t1.placed_order_id, t2.table_number, t2.adult_count, t2.child_count, DATE_FORMAT(t1.datetime_placed,'%Y-%m-%d %H:%i') AS datetime_placed FROM placed_order AS t1 INNER JOIN table_list AS t2 ON t2.table_id = t1.table_id WHERE t1.placed_order_id=?";
                    connection.query(query, [lastInsertID], (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('Fetching Order and Table info...');
                        tableInfo = result;
                    });

                    //fetch all existing printers
                    let query1 = "SELECT * FROM printer_list";
                    connection.query(query1, (err, result) => {
                        if(err) {
                            res.status(400).send(err);
                            return;
                        }
                        console.log('Fetching all printers...');
                        console.log(result)

                        //go through each printer and get order info
                        Promise.all(
                            result.map((printer) => {
                                let query = "SELECT t1.item_id, t1.quantity, t2.item_name, t2.item_kitchen_name, t2.category_id, t3.category_name, t3.category_order_index, t4.printer_id, t6.printer_name, date_format(t5.datetime_placed,'%Y-%m-%d %H:%i') AS datetime_placed FROM placed_in_order AS t1 INNER JOIN item_list AS t2 ON t2.item_id = t1.item_id INNER JOIN category_list AS t3 ON t3.category_id = t2.category_id INNER JOIN printer_category_list AS t4 ON t4.category_id = t2.category_id INNER JOIN placed_order AS t5 ON t5.placed_order_id=? INNER JOIN printer_list AS t6 ON t6.printer_id=? WHERE t1.placed_order_id=? AND t4.printer_id=? ORDER BY t3.category_order_index;";
                                connection.query(query, [lastInsertID, printer.printer_id, lastInsertID, printer.printer_id], (err, result) => {
                                    if(err) {
                                        res.status(400).send(err);
                                        return;
                                    }
                                    if(result.length) {
                                        //send printer order to local print server
                                        console.log('Fetching print order...');
                                        console.log('Printer #'+printer.printer_id);
                                        io.emit('print_order', tableInfo, result);
                                    }
                                });
                            })
                        ).then((result) => {
                            console.log('Order printed...');
                            res.end(JSON.stringify(lastInsertID));
                        })
                        .catch((e) => {
                            console.log("error ", e)}); 
                    });
                    
                })
                .catch((e) => {
                console.log("error ", e)}); 
            });
        } else {
            res.status(999).send('ERR 1: La cuisine est fermé en ce moment.');
        }
    });

});


//fetch all orders placed from selected table
app.post('/api/fetch/orders', (req, res) => {

    const curTableID = req.body.curTableID;

    let query = 'SELECT t.placed_order_id, t.table_id, TIME_FORMAT(t.time_placed, "%H:%i") AS time_placed FROM placed_order AS t WHERE table_id=?';
    connection.query(query, [curTableID], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching orders placed...');
        res.send(result);
    });
});

//fetch all orders placed from selected table
app.post('/api/fetch/in_order', (req, res) => {

    const selOrder = req.body.selOrder;

    let query = 'SELECT t1.placed_in_order_id, t1.placed_order_id, t1.item_id, t1.quantity, t2.item_name FROM placed_in_order AS t1 INNER JOIN item_list AS t2 ON t2.item_id = t1.item_id WHERE t1.placed_order_id=?;';
    connection.query(query, [selOrder], (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching items in placed order...');
        res.send(result);
    });
});

/***********************************************************************************
************************************************************************************/
//          TESTING123
//
//
/***********************************************************************************
************************************************************************************/

//fetch all tables
app.get('/api/test/qrcode', (req, res) => {

    const uploadPath = cdnDir+'/tables/';
    const timestamp = Date.now();
    const fileName = timestamp+'.png';
    const filePath = uploadPath+fileName;

    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    console.log(ip);

    QRCode.toFile( filePath, 'https://www.facebook.com/', { errorCorrectionLevel: 'H' })
    .then((result) => {
        res.send('QR Code Generated...');
    })
    .catch((e) => {
        return console.log("error ", e); 
    })
});



app.get('/api/do/test', (req, res) => {

    var tableInfo;

    let query = "SELECT t1.placed_order_id, t2.table_number, t2.adult_count, t2.child_count, DATE_FORMAT(t1.datetime_placed,'%Y-%m-%d %H:%i') AS datetime_placed FROM placed_order AS t1 INNER JOIN table_list AS t2 ON t2.table_id = t1.table_id WHERE t1.placed_order_id=25";
    connection.query(query, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching Order and Table info...');
        tableInfo = result;
    });

    let query1 = "SELECT * FROM printer_list";
    connection.query(query1, (err, result) => {
        if(err) {
            res.status(400).send(err);
            return;
        }
        console.log('Fetching all printers...');
        console.log(result)

        Promise.all(
            result.map((printer) => {
                let query = "SELECT t1.item_id, t1.quantity, t2.item_name, t2.item_kitchen_name, t2.category_id, t3.category_name, t3.category_order_index, t4.printer_id, t6.printer_name, date_format(t5.datetime_placed,'%Y-%m-%d %H:%i') AS datetime_placed FROM placed_in_order AS t1 INNER JOIN item_list AS t2 ON t2.item_id = t1.item_id INNER JOIN category_list AS t3 ON t3.category_id = t2.category_id INNER JOIN printer_category_list AS t4 ON t4.category_id = t2.category_id INNER JOIN placed_order AS t5 ON t5.placed_order_id=25 INNER JOIN printer_list AS t6 ON t6.printer_id=? WHERE t1.placed_order_id=25 AND t4.printer_id=? ORDER BY t3.category_order_index;";
                connection.query(query, [printer.printer_id, printer.printer_id], (err, result) => {
                    if(err) {
                        res.status(400).send(err);
                        return;
                    }
                    if(result.length) {
                        console.log('Fetching print order...');
                        console.log(printer.printer_id);
                        io.emit('print_order', tableInfo, result);
                    }
                });
            })
        ).then((result) => {
            res.send('Order printed...');
        })
        .catch((e) => {
            console.log("error ", e)}); 
    });
});

app.get('/api/do/printerslist', (req, res) => {

    io.emit('printerlist', {msg: 'really good'});
    console.log('Listing Printers...');
    res.send('success');
});
