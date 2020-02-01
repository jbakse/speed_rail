console.log("\n\n\n");
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

		console.log("Socket got 'send_command' with data:");
		console.log(data);
		serialWrite(data.command);
	});


	if (serialPort) { //&& serialPort.isOpen()
		io.emit("serial_connect", { name: serialPort.path });
	}

});








// Serial Port
var connectSettings = {
	baudRate: 115200
};

var serialPort;

serialConnect();

function serialConnect() {
	console.log("Attempting to establish serial connection.");
	console.log("Requesting port list.");
	SerialPort.list(function (err, ports) {
		if (err) {
			return console.error("Error listing serial ports");
		}
		console.log("Listing ports");
		ports.forEach(function (port) {
			console.log(port);
			if (!serialPort && port.productId == '6015') {
				console.log("Found port for productId 6015");
				serialPort = new SerialPort(port.comName, connectSettings, true, serialConnectCallback);
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
	console.info('Serial data received:');
	console.info(data.toString());
}


function serialWrite(message) {
	//if (!serialPort.isOpen()) return;

	q.push(message);

}

var q = [];
setInterval(checkQueue, 100);

function checkQueue() {
	message = q.shift();
	// console.log("tick");
	if (!message) return;

	console.log("serialport Write: \n===\n" + message + "\n---");

	serialPort.write(message + "\n", function (err, results) {
		if (err) console.error('Serial write error: \n' + err);
		if (results) console.log('Serial write results: \n' + results);
	});
}



