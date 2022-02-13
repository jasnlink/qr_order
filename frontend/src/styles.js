
const styles = theme => ({


	container: {
		height: '100%',
		maxHeight : '100%',
		margin : theme.spacing(4)
	},
	icon : {
		marginRight: theme.spacing(2),
	},
	buttons : {
		
	},
	PrimaryText : {
		color: '#000000DE'
	},
	//Welcome card style
	welcomeCardGrid : {
		marginTop: theme.spacing(10)
	},
	welcomeCard : {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		paddingBottom: theme.spacing(2)
	},
	welcomeCardMedia : {
		paddingTop: '56.25%' //16:9
	},
	welcomeCardContent : {
		flexGrow: 1,
	},


	//Menu item card style
	menuCardGrid : {
		padding: theme.spacing(0),
		marginTop: theme.spacing(6),
		marginBottom: theme.spacing(4)
	},
	menuCard : {
		borderColor: '#000000',
	},
	menuCardMedia : {
		paddingTop: '100%',
		borderRadius: 0,
	},
	menuCardContent : {
		flexGrow: 1,
		padding: '8px',
	},

	//Menu item selection dialog
	dialogBox : {
		paddingTop: '0',
	},
	dialogMedia : {
		width: '100%',
	},
	dialogContent : {
		padding: '0',
	},
	dialogTitle : {
		paddingBottom: '0',
		color: '#000000DE'
	},
	dialogText : {
		paddingRight: theme.spacing(3),
		paddingLeft: theme.spacing(3),
	},
	dialogAdjust : {
		color: '#1976d2',
	},
	dialogButton : {
		marginRight: theme.spacing(2),
	},

	//Category selection drawer
	orderingDrawerCategoryList: {
		paddingBottom: theme.spacing(8),
	},
	orderingDrawerBar: {
		top: 'auto',
		bottom: '0',
		backgroundColor: '#ffffff',
	},
	paper: {
        maxHeight: '75%',
      },

	//Cart contents card list
	cartCardGrid : {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(9)
	},
	cartCard : {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	cartMedia : {
		height: '64px',
		width: '64px'
	},
	cartNav : {
		top: 'auto',
		bottom: '0',
	},
	cartButton : {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	//Cart place order dialog
	cartDialog : {
		padding: theme.spacing(4)
	},
	cartDialogIcon : {
		marginTop: theme.spacing(4),
		marginRight: theme.spacing(6),
		marginLeft: theme.spacing(6),
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4)
	},
	cartDialogButton : {
		marginTop: theme.spacing(2),
	},

	//Order history card list
	historyCardGrid : {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(4)
	},
	historyCard : {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1)
	},
	//Selected order detail card list
	orderDetailsCardGrid : {
		marginTop: theme.spacing(10),
		marginBottom: theme.spacing(9)
	},
	orderDetailsCardTitle : {
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1)
	},

	//Admin table manager styles
	adminTablesCardGridContainer : {
		overflow: 'auto',
		maxHeight: '100vh',
	},
	adminTablesCardGrid : {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(4),
		paddingRight: theme.spacing(3),
		paddingLeft: theme.spacing(3),
		overflow: 'hidden',
		height: '100%',
	},
	adminTablesBracketsGrid : {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	adminTablesCardSeated : {
		backgroundColor: '#afbafb',
	},
	adminTablesCardAvailable : {
	},
	adminNavigationGridColumn : {
		paddingBottom: theme.spacing(4)
	},
	adminNavigationContainer : {
		paddingTop: theme.spacing(8),
		height: '100vh'
	},
	adminNavigationTitle : {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(4),
	},
	adminSeatKeyPad : {
		color: 'white',
		paddingBottom: '24px',
	},
	adminKeyPadDisplay : {
		minHeight: '32px',
	},
	adminKeyPadBackSpace : {
		color: '#b2102f',
	},
	adminKeyPadEnterText : {
		color: 'white',
	},
	adminKeyPadEnterKey : {
		background: '#3f51b5',
	},
	adminViewTableOrdersCardGrid : {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(4),
		paddingRight: theme.spacing(3),
		paddingLeft: theme.spacing(3),
	},
	adminViewTableOrdersCard : {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4)
	},

	//Admin view order detail card list
	adminOrderDetailsCardGrid : {
		marginTop: theme.spacing(16),
		marginBottom: theme.spacing(9)
	},
	adminOrderDetailsCardTitle : {
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1)
	},
	adminOrderCardContent : {
		overflow: 'auto',
		maxHeight: '60vh',
	},

	//Admin category manager styles
	adminCategoryManagerCreateCategoryContainer : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2)
	},
	adminCategoryManagerCardGridContainer : {
		overflow: 'auto',
		maxHeight: '95vh',
	},
	adminCategoryManagerCardGrid : {
		marginTop: theme.spacing(10),
		marginBottom: theme.spacing(4),
	},
	adminCategoryManagerCard : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(12),
		paddingRight: theme.spacing(12),
	},
	adminCategoryManagerSelectedPrinters : {
		marginTop: theme.spacing(2),
	},
	adminCategoryManagerSelect : {
		minWidth: '250px',
		maxWidth: '250px',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},

	//Admin Menu Manager Styles
	adminMenuListContainer : {
		paddingTop: theme.spacing(6),
		maxHeight: '95vh',
		overflow: 'auto',
	},

	adminMenuManagerCategoryCardGrid : {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
		borderRight: 'solid 1px #dcdcdc',
	},
	adminMenuManagerCategoryCard : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},

	adminMenuManagerItemCardGrid : {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4)
	},
	adminMenuManagerItemMedia : {
		height: '48px',
		width: '48px'
	},
	adminMenuManagerItemCard : {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
	adminMenuManagerItemImage : {
		height: '128px',
		width: '128px'
	},

	//Admin time manager styles
	adminTimeManagerCardGrid : {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
	},
	adminTimeGroupListContainer : {
		paddingTop: theme.spacing(6),
		maxHeight: '95vh',
		overflow: 'auto',
	},
	adminTimeGroupCardGrid : {
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
		borderRight: 'solid 1px #dcdcdc',
	},
	adminTimeGroupCard : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	adminTimeManagerCard : {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
	},
	adminTimeManagerButtonGroup : {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	adminTimeManagerTimeBlock : {
		marginBottom: theme.spacing(2),
	},
	adminTimeManagerAppliedCategories : {
		marginTop: theme.spacing(2),
	},
	adminTimeManagerSelect : {
		minWidth: '250px',
		maxWidth: '250px',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(2),
	},


	appBarMenu : {
		width : '100%',
	},
	fab: {
		position: 'fixed',
    	bottom: theme.spacing(4),
    	right: theme.spacing(4),
	},
	drawerPaper: {
		height: '20px',
	},
	backButton: {
		color:'#ffffff'
	}

});

export default styles;