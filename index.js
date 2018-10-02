require('dotenv').config()

const http = require('http')

const HueSlave = require('./HueSlave')
const HueLight = require('./HueLight')

const Log = require('./Logger')
const MAIN_LOGGING_TAG = "Main"
const TASK_LOGGING_TAG = "Task"

const TICK = process.env.TICK || 5000

let slave = null
let light = null

let tick = null

function task() {
  clearInterval(tick)
  Log(TASK_LOGGING_TAG, "Current Job: " + slave.hueType)
  switch(slave.hueType) {
    case 'light_mimic':
      tick = setInterval(function() {
        light.updateColor()
      }, TICK)
      break
    default:
      Log(TASK_LOGGING_TAG, "Job given of unknown type, idling")
  }
}

async function init () {
  Log(MAIN_LOGGING_TAG, "Slave Init")

  process.on('unhandledRejection', r => console.log(r));
  
  slave = await HueSlave.build(process.env.HUEPANEL_URL, 2)
  light = await HueLight.build(process.env.HUE_BRIDGE_URL, slave.hueID)
  
  http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    
    slave.updateController()

    response.end('Slave Updated');
  }).listen(8080);

  slave.registerCallback(task)

  task()
}

init()
