import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import QRCode from 'qrcode';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ThermalPrinter = require("node-thermal-printer").printer;
const iconv = require('iconv-lite');

import printer from 'printer';
import util from 'util';


import os from 'os';
import publicIp from 'public-ip';

import io from 'socket.io-client';
var ioClient = io.connect('http://192.46.223.124:8000');

ioClient.on('connect', (socket) => {
  console.log('Connected to cloud...');
});

ioClient.on('disconnect', (reason) => {
  console.log('Disconnected from cloud...', reason);
});


const app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

var networkInterfaces = os.networkInterfaces();

// set port, listen for requests
const PORT = process.env.PORT || 3001;


publicIp.v4().then(ip => {
  console.log("your public ip address", ip);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));

let printer1 = new ThermalPrinter({

  type: 'epson',
  interface: 'printer:EPSON TM-T88V Receipt',
  driver: require('printer')

});

let printer2 = new ThermalPrinter({

  type: 'epson',
  interface: 'printer:EPSON TM-T88V Ethernet',
  characterSet: 'CHINA',
  driver: require('printer')

});


let printer3 = new ThermalPrinter({

  type: 'star',
  interface: 'printer:Star TSP143IIILAN Cutter',
  characterSet: 'CHINA',
  driver: require('printer')

});


let printerStack = new Array(printer1, printer2, printer3);

printer3.isPrinterConnected()
.then((status) => {
  console.log('Connected to printer1...');
})
.catch((err) => {
  console.log(err);
})

ioClient.on('printerlist', (response) => {
  console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));
})


ioClient.on('test', (response) => {
  console.log(response.msg);

  //console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

  printer2.isPrinterConnected()
  .then((status) => {
    console.log(status);
  })
  .catch((err) => {
    console.log(err);
  })

  printer3.alignLeft();
  printer3.setTextQuadArea();
  printer3.bold(true);
  printer3.print("52");
  printer3.setTextNormal();
  printer3.bold(true);
  printer3.print("          07/09 10:48");
  printer3.newLine();
  printer3.newLine();
  printer3.setTextNormal();
  printer3.bold(true);
  printer3.print("4 a : 2 c");
  printer3.println("          Island");
  printer3.bold(false);
  printer3.println("________________________________________");
  printer3.newLine();
  printer3.setTextDoubleHeight();
  printer3.bold(true);
  printer3.print("1");
  printer3.setCharacterSet('CHINA');
  var str = "   כ所有人生而自由，在尊嚴和權利上一律平等";
  printer3.println(str);
  printer3.partialCut();
  printer3.execute()
  .then(() => {
    console.log('Printing...');
    printer3.clear();
  })
  .catch((err) => {
    console.log(err);
  })
});


ioClient.on('occupy_table', (res) => {

  printer1.alignCenter();
  printer1.bold(true);
  printer1.setTextQuadArea();
  printer1.println("Table "+res.number);
  printer1.newLine();
  printer1.setTextNormal();
  printer1.bold(true);
  if (res.children) {
    printer1.println(res.adults+" a : "+res.children+" c");
  } else {
    printer1.println(res.adults+" a");
  }
  printer1.println("________________________");
  printer1.newLine();
  printer1.newLine();
  printer1.printQR("http://192.46.223.124:3000/table/"+res.id+"/"+res.number, {
    cellSize: 8,
    correction: 'H',
    model: 2
  });
  printer1.newLine();
  printer1.newLine();
  printer1.println("Scannez avec la caméra");
  printer1.println("et placez une commande.");
  printer1.partialCut();
  printer1.execute()
  .then(() => {
    console.log('Printing QR Code... Table '+res.number);
    printer1.clear();
  })
  .catch((err) => {
    console.log(err);
  })

});


ioClient.on('print_order', (tableInfo, res) => {
  console.log(tableInfo);
  console.log(res);
  let selectedPrinter = printerStack[res[0].printer_id];

  selectedPrinter.alignCenter();
  selectedPrinter.setTextQuadArea();
  selectedPrinter.bold(true);
  selectedPrinter.println("TABLE "+tableInfo[0].table_number);
  selectedPrinter.bold(false);
  selectedPrinter.setTextNormal();
  selectedPrinter.println("ORDER "+tableInfo[0].placed_order_id);
  selectedPrinter.newLine();
  selectedPrinter.println(tableInfo[0].datetime_placed);
  selectedPrinter.setTextNormal();
  selectedPrinter.bold(true);
  if(tableInfo[0].child_count) {
    selectedPrinter.print(tableInfo[0].adult_count+" adults : "+tableInfo[0].child_count+" children");
  } else {
    selectedPrinter.print(tableInfo[0].adult_count+" adults");
  }
  
  selectedPrinter.println("     "+res[0].printer_name);
  selectedPrinter.bold(false);
  selectedPrinter.println("________________________");
  selectedPrinter.newLine();
  selectedPrinter.alignLeft();
  selectedPrinter.setTextDoubleHeight();


    res.map((item) => {
      selectedPrinter.print(item.quantity);
      selectedPrinter.print("   "+item.item_name);
      selectedPrinter.println("    ("+item.item_kitchen_name+")");

    })

  selectedPrinter.partialCut();
  selectedPrinter.execute()
  .then(() => {
    console.log('Printing...');
    selectedPrinter.clear();
  })
  .catch((err) => {
    console.log(err);
  })


})