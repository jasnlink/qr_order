import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";


import Preface from './Preface';
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
	let [curOrderID, setCurOrderID] = React.useState(null);
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

	function SetTable() {

  		const params = useParams();
		setCurTableID(params.id);
  		setCurTableNumber(params.num);
  		return (<Welcome 
					step={step} 
					setStep={step => setStep(step)}
					curTableID={curTableID}
					curTableNumber={curTableNumber}
					cart={cart} 
					setCart={cart => setCart(cart)} 
				/>);

  	}

	switch(step) {
			case 1:
				return (
					<div>
						<Router>
							<Switch>
								<Route exact path="/admin" render={() => setStep(1000)} />
								<Route exact path="/table/:id/:num">
									<SetTable />
								</Route>
								<Route path="/*">
									<Preface />
								</Route>
							</Switch>
						</Router>
					</div>
					)
			case 2:
				return (
					<div>
						<Ordering 
							step={step} 
							setStep={step => setStep(step)}
							cart={cart} 
							setCart={cart => setCart(cart)} 
						/>
					</div>
					)
			case 3:
				return (
					<div>
						<PlaceOrder 
							step={step} 
							setStep={step => setStep(step)}
							curTableID={curTableID}
							cart={cart} 
							setCart={cart => setCart(cart)} 
						/>
					</div>
					)
			case 11:
				return (
					<div>
						<OrderHistory 
							step={step} 
							setStep={step => setStep(step)}
							setCurOrderID={order => setCurOrderID(order)}
							curTableID={curTableID}
							curOrderTime={curOrderTime}
							setCurOrderTime={time => setCurOrderTime(time)} 
						/>
					</div>
					)
			case 12:
				return (
					<div>
						<OrderDetail 
							step={step} 
							setStep={step => setStep(step)} 
							curOrderID={curOrderID}
							curOrderTime={curOrderTime}
						/>
					</div>
					)
			case 1000:
				return (
					<div>
						<Admin 
							step={step} 
							setStep={step => setStep(step)} 
							adminCurTableID={adminCurTableID}
							setAdminCurTableID={table => setAdminCurTableID(table)}
							adminCurTableNumber={adminCurTableNumber}
							setAdminCurTableNumber={tableNumber => setAdminCurTableNumber(tableNumber)}
							adminCurTableOccupied={adminCurTableOccupied}
							setAdminCurTableOccupied={occupied => setAdminCurTableOccupied(occupied)}
						/>
					</div>
					)
			case 1001:
				return (
					<div>
						<AdminViewTableOrders 
							step={step} 
							setStep={step => setStep(step)} 
							adminCurTableID={adminCurTableID}
							setAdminCurTableID={table => setAdminCurTableID(table)}
							adminCurOrderID={adminCurOrderID}
							setAdminCurOrderID={setAdminCurOrderID}
							adminCurTableNumber={adminCurTableNumber}
							adminCurOrderTime={adminCurOrderTime}
							setAdminCurOrderTime={time => setAdminCurOrderTime(time)}
						/>
					</div>
					)
			case 1002:
				return (
					<div>
						<AdminViewOrder 
							step={step} 
							setStep={step => setStep(step)} 
							adminCurTableID={adminCurTableID}
							adminCurOrderID={adminCurOrderID}
							adminCurOrderTime={adminCurOrderTime}
						/>
					</div>
					)
			case 1010:
				return (
					<div>
						<AdminCategoryManager 
							step={step} 
							setStep={step => setStep(step)}
						/>
					</div>
					)
			case 1020:
				return (
					<div>
						<AdminMenuManager 
							step={step} 
							setStep={step => setStep(step)}
						/>
					</div>
					)
			case 1030:
				return (
					<div>
						<AdminTimeManager 
							step={step} 
							setStep={step => setStep(step)}
						/>
					</div>
					)
		}

}


export default OrderCore;