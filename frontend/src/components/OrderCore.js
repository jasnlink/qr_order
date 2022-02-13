import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";



import Welcome from './Welcome';
import Ordering from './Ordering';
import PlaceOrder from './PlaceOrder';
import OrderHistory from './OrderHistory';
import OrderDetail from './OrderDetail';

import Admin from './admin/Admin';
import AdminViewTableOrders from './admin/AdminViewTableOrders';
import AdminViewOrder from './admin/AdminViewOrder';
import AdminCategoryManager from './admin/AdminCategoryManager';
import AdminMenuManager from './admin/AdminMenuManager';
import AdminTimeManager from './admin/AdminTimeManager';


import useClasses from '../classes'
import styles from '../styles';

function OrderCore() {

	const [step, setStep] = useState(1);

	//Current table id of customer
	let [curTableID, setCurTableID] = useState(null);
	//Current table number of customer
	let [curTableNumber, setCurTableNumber] = useState(null);
	//Cart contents
	let [cart, setCart] = React.useState([]);

	//Currently selected order to view in order history
	let [curOrder, setCurOrder] = React.useState(null);
	//Currently selected order time placed
	let [curOrderTime, setCurOrderTime] = React.useState(null);

	//Currently selected admin table to manage
	let [adminCurTableID, setAdminCurTableID] = React.useState(null);
	//Currently selected admin table number to manage
	let [adminCurTableNumber, setAdminCurTableNumber] = React.useState(null);
	//Currently selected admin table occupied state to manage
	let [adminCurTableOccupied, setAdminCurTableOccupied] = React.useState(null);

	//Currently selected admin order to manage
	let [adminCurOrderID, setAdminCurOrderID] = React.useState(null);
	//Currently selected admin order time placed
	let [adminCurOrderTime, setAdminCurOrderTime] = React.useState(null);


	const classes = useClasses(styles);


	switch(step) {
			case 1:
				return (
					<div>
						<Router>
							<Switch>
								<Route exact path="/admin" render={() => setStep(1000)} />
							</Switch>
						</Router>

						<Welcome 
							curStep={step} 
							handleStep={step => setStep(step)}
							curTableID={curTableID}
							handleTableID={table => setCurTableID(table)}
							curTableNumber={curTableNumber}
							handleTableNumber={num => setCurTableNumber(num)}
							cartContent={cart} 
							handleCart={cart => setCart(cart)} 
						/>
					</div>
					)
			case 2:
				return (
					<div>
						<Ordering 
							curStep={step} 
							handleStep={step => setStep(step)}
							cartContent={cart} 
							handleCart={cart => setCart(cart)} 
						/>
					</div>
					)
			case 3:
				return (
					<div>
						<PlaceOrder 
							curStep={step} 
							handleStep={step => setStep(step)}
							curTableID={curTableID}
							cartContent={cart} 
							handleCart={cart => setCart(cart)} 
						/>
					</div>
					)
			case 11:
				return (
					<div>
						<OrderHistory 
							curStep={step} 
							handleStep={step => setStep(step)}
							handleOrder={order => setCurOrder(order)}
							curTableID={curTableID}
							curOrderTime={curOrderTime}
							handleOrderTime={time => setCurOrderTime(time)} 
						/>
					</div>
					)
			case 12:
				return (
					<div>
						<OrderDetail 
							curStep={step} 
							handleStep={step => setStep(step)} 
							selOrder={curOrder}
							curOrderTime={curOrderTime}
						/>
					</div>
					)
			case 1000:
				return (
					<div>
						<Admin 
							curStep={step} 
							handleStep={step => setStep(step)} 
							selTableID={adminCurTableID}
							handleTableID={table => setAdminCurTableID(table)}
							selTableNumber={adminCurTableNumber}
							handleTableNumber={tableNumber => setAdminCurTableNumber(tableNumber)}
							selTableOccupied={adminCurTableOccupied}
							handleTableOccupied={occupied => setAdminCurTableOccupied(occupied)}
						/>
					</div>
					)
			case 1001:
				return (
					<div>
						<AdminViewTableOrders 
							curStep={step} 
							handleStep={step => setStep(step)} 
							selTableID={adminCurTableID}
							handleTableID={table => setAdminCurTableID(table)}
							selOrderID={adminCurOrderID}
							handleOrderID={setAdminCurOrderID}
							adminCurTableNumber={adminCurTableNumber}
							adminCurOrderTime={adminCurOrderTime}
							handleOrderTime={time => setAdminCurOrderTime(time)}
						/>
					</div>
					)
			case 1002:
				return (
					<div>
						<AdminViewOrder 
							curStep={step} 
							handleStep={step => setStep(step)} 
							selTableID={adminCurTableID}
							selOrderID={adminCurOrderID}
							adminCurOrderTime={adminCurOrderTime}
						/>
					</div>
					)
			case 1010:
				return (
					<div>
						<AdminCategoryManager 
							curStep={step} 
							handleStep={step => setStep(step)}
						/>
					</div>
					)
			case 1020:
				return (
					<div>
						<AdminMenuManager 
							curStep={step} 
							handleStep={step => setStep(step)}
						/>
					</div>
					)
			case 1030:
				return (
					<div>
						<AdminTimeManager 
							curStep={step} 
							handleStep={step => setStep(step)}
						/>
					</div>
					)
		}

}


export default OrderCore;