import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import QRCode from 'qrcode';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ThermalPrinter = require("node-thermal-printer").printer;

import printer from 'printer';
import util from 'util';

import os from 'os';
import io from 'socket.io-client';


// ###################################################



var ioClient = io.connect('http://192.46.223.124:8000');

ioClient.on('connect', (socket) => {
  console.log('Connected to cloud...');
});

ioClient.on('disconnect', (reason) => {
  console.log('Disconnected from cloud...', reason);
});


// ###################################################

const app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

var networkInterfaces = os.networkInterfaces();

// set port, listen for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));


// ###################################################



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


// ###################################################


ioClient.on('printerlist', (response) => {
  console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));

printer3.isPrinterConnected()
.then((status) => {
  console.log('Connected to printer1...');
})
.catch((err) => {
  console.log(err);
})


})


ioClient.on('test1', (response) => {
  console.log("installed printers:\n"+util.inspect(printer.getSupportedPrintFormats(), {colors:true, depth:10}));
  QRCode.toString('I am a pony!',{type:'utf8'}, function (err, url) {
    console.log(url)
  })
})


// ###################################################



ioClient.on('test', (response) => {

  console.log(response.msg);

  const filename = './assets/print.png';

  QRCode.toFile(filename,'I am a pony!', {
    version: 4, 
    errorCorrectionLevel: 'H',
    scale: 12,
   }, function (err, url) {
    if(err) {
      console.log(err);
    };
    console.log('write success');
/*
    printer3.printImage(filename)
    .then(() => {
      printer3.partialCut();
      printer3.execute()
        .then(() => {
          printer3.clear();
          console.log('success print');
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    })
    */
  });


/*
  printer.printDirect({
    data:fs.readFileSync(filename),
    printer: printerName,
    success:function(jobID){
      console.log("sent to printer with ID: "+jobID);
    },
    error:function(err){
      console.log(err);
    }
  });


  printer.printDirect({
    data:url, // or simple String: "some text"
    printer:printerName, // printer name
    type: printerFormat, // type: RAW, TEXT, PDF, JPEG, .. depends on platform
      options: // supported page sizes may be retrieved using getPrinterDriverOptions, supports CUPS printing options
      {
          media: 'Letter',
          'fit-to-page': true
      },
    success:function(jobID){console.log(jobID+" Success"+url);},
    error:function(err){console.log(err);}
  });
 
*/  
});



ioClient.on('test2', (response) => {
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
  printer3.printQR("http://192.46.223.124/table/", {
    cellSize: 8,
    correction: 'H',
    model: 2
  });
  printer3.printImage('./assets/qr-code.png');
  printer3.code128("20101", {
  height: 50,
  text: 1
  });
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


// ###################################################



ioClient.on('print_table', (res) => {


  const filename = './assets/print.png';

  QRCode.toFile(filename,'http://192.46.223.124/table/'+res.id+'/'+res.number, {
    version: 4, 
    errorCorrectionLevel: 'H',
    scale: 10,
   }, function (err, url) {
    if(err) {
      console.log(err);
    };
    console.log('write success');



  printer3.alignCenter();
  printer3.bold(true);
  printer3.setTextQuadArea();
  printer3.println("Table "+res.number);
  printer3.newLine();
  printer3.setTextNormal();
  printer3.bold(true);
  if (res.children) {
    printer3.println(res.adults+" a : "+res.children+" c");
  } else {
    printer3.println(res.adults+" a");
  }
  printer3.println("________________________");
  printer3.newLine();
  printer3.newLine();

  printer3.printImage(filename)
    .then(() => {
      printer3.newLine();
      printer3.newLine();
      printer3.println("Scannez avec la caméra");
      printer3.println("et placez une commande.");
      printer3.newLine();
      printer3.newLine();
      printer3.partialCut();
      printer3.execute()
        .then(() => {
          printer3.clear();
          console.log('Printing QR Code... Table '+res.number);
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    })
  });
});


// ###################################################



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


