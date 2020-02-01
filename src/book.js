var SerialPort = require("serialport");



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

                    setup();
                    step();
                    setInterval(step, 5000);

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


function setup() {
    console.log("setup");
    serialWrite(`{"xvm":60000}`);
    serialWrite(`{"xjm":10000}`);
}
function step() {
    console.log();
    console.log("----")
    console.log("step");
    serialWrite(`{"gc": "g0 x100"}`);
    serialWrite(`{"gc": "g0 x0"}`);
    serialWrite(`{"gc": "g0 x100"}`);
    serialWrite(`{"gc": "g0 x0"}`);
    serialWrite(`{"gc": "g0 x100"}`);
    serialWrite(`{"gc": "g0 x0"}`);
    serialWrite(`{"gc": "g0 x100"}`);
    serialWrite(`{"gc": "g0 x0"}`);
}

