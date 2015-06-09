console.log("Hello, Node!");


var express = require('express');
var app = express();
app.use(express.static('public'));


var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});




var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("/dev/cu.usbserial-DA00XX95", {
	baudrate: 115200
});


serialPort.on("open", function () {
	console.log('open');
	
	serialPort.on('data', function(data) {
		console.log('data received: ' + data);
	});
	
	serialPort.write("g0 x10 \n", function(err, results) {
		console.log('err ' + err);
		console.log('results ' + results);
	});
});





