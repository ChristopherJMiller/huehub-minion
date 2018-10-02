const http = require('http')

const HueSlave = require('./HueSlave')
const HueLight = require('./HueLight')

const Log = require('./Logger')
const LOGGING_TAG = "Main"

Log(LOGGING_TAG, "Slave Init")

let slave = new HueSlave('test', 'http://localhost:5000', 2)

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  
  response.end('Slave Updated');
}).listen(8080);

