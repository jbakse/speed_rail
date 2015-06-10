console.log("Hello, Speed Rail!");


var express = require('express');
var SerialPort = require("serialport");

// set up express static http server
var app = express();
app.use(express.static('public'));

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});




// set up socket.io server
var io = require('socket.io')(server);

io.on('connection', function (socket) {

	socket.on('send_command', function (data) {
		serialWrite(data.command);
	});
	
	
	if (serialPort && serialPort.isOpen()) {
		io.emit("serial_connect", {name: serialPort.path});
	}
	
});








// Serial Port
var connectSettings = {
	baudrate: 115200
};

var serialPort;

serialConnect();

function serialConnect() {
	SerialPort.list(function (err, ports) {
		if (err) {
			return console.error("Error listing serial ports");
		}

		ports.forEach(function(port) {
			if (!serialPort && port.productId == '0x6015') {
				serialPort = new SerialPort.SerialPort(port.comName, connectSettings, true, serialConnectCallback);
				serialPort.on("open", function () {
					console.log('Serial port connected.');
					serialPort.on('data', serialRead);
					
				});
			}
		});
	});
}


function serialConnectCallback(err) {
	if (err) {
		console.error("Error opening serial port.", err);
	}
}


function serialRead(data) {
	console.info('Serial data received: \n' + data);
}

function serialWrite(message) {
	if (!serialPort.isOpen()) return;

	serialPort.write(message + "\n", function(err, results) {
		if (err) console.error('Serial write error: \n' + err);
		if (results) console.log('Serial write results: \n' + results);
	});
}



