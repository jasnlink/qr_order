# AYCEHub - All You Can Eat Tableside Scan to Order with Table Management System

## Purpose
This app allows customers to scan a QR code at the table and start ordering. When the order is placed, the order is printed directly in the kitchen.

This solution removes the need to use paper checklists to capture orders and reduces the amount of staff needed to run the restaurant.

This is a better and lower cost solution to using tablets at every table with the advent of COVID.

## Challenges faced
I needed a way to bridge orders placed on the web app to local thermal printers.

I used a local machine running a nodeJS server that listens for socket.io requests from the web app's backend. The local machine receives the orders placed and then sends them to be printed on thermal printers in the kitchen.
 
 #### Table management
 
 ![table management](https://msmtech.ca/wp-content/uploads/2022/04/1-2.jpg)
 
 #### Customer view after scanning the QR code.
 
 ![orderflow](https://msmtech.ca/wp-content/uploads/2022/04/4-2.jpg)
 ![orderflow](https://msmtech.ca/wp-content/uploads/2022/04/2-3.jpg)

 
## Technologies used:
- react.js
- node.js
- Material UI
- HTML
- CSS
- PHP
- MySQL
- LEMP stack setup on Linode

## Main features
- Included QR code scanner on the web app.
- Conveniently assign QR codes and print them to each table with the table management system.
- Easily navigate the menu and place orders to be placed.
- Magically send orders straight to the kitchen, removing the need for paper checklists and reducing the number of staff needed.

## Admin side features
- Generate QR code for a table
- Full category, subcategory and food menu customization system
- Customization system includes create, edit, reorder and remove items
- Table management system with table number
- Track number of adults and children per table
- Dynamic keypad entry of table numbers, seamless function of either opening new table or finding existing table
- Order management system with order number
- View and reprint placed orders

## Demo
### Admin
- https://arandesign.ca/admin

### Customer
- https://arandesign.ca/table/110/52
- https://arandesign.ca
