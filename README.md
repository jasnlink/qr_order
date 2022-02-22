# Scan to Order with Table Management System

## Project purpose and goal
This is a react app made for all you can eat restaurants. The idea is that a unique QR code is generated for every table. The customer scans the QR code to access the app with their table information automatically entered. The customer can order anything they please on the web app and then send the order directly to the kitchen. The web server receives the order and then sends it to an onsite node.js server that distributes the order to be printed to different receipt printers depending on the item to the kitchen. The chefs can then see what the customers ordered and are ready to fulfill them.

On the administrative side to be accessed through an onsite tablet, there is a table management system so that the staff can add, remove, open and close tables. There is a management system for the food so that the restaurant can update the menu themselves. There is also an order management system so that the staff can see what each table has ordered
 
 
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
- Customers scan a QR code to access the app
- Navigate categories and choose food items to add
- Select and zoom in to get more information on each item
- Add items to a cart system
- Cart drawer with order summary
- Customer places order and the order is sent to the kitchen
- Orders are printed directly from a local server to a thermal printer

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
