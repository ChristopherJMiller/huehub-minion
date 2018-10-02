const fetch = require('node-fetch')
const Log = require('./Logger')

class HueSlave {

  constructor(bridgeAddress, hubAddress, lightContollerID) {
    this.bridgeAddress = bridgeAddress;
    this.hubAddress = hubAddress;
    this.lightContollerID = lightContollerID;

    this.LOGGER_TAG = "HueSlave"



    let hID, hT
    this.getChosenController(hubAddress, lightContollerID).then(function(controller) {
      hID = controller.hueID
      hT = controller.hT
    })

    this.hueID = hID;
    this.hueType = hT;

    Log(this.LOGGER_TAG, "Hue Slave Initialized, Watching Controller id " + this.lightContollerID)
  }

  getChosenController(address, lightContollerID) {
    return new Promise(function(resolve, reject) {
      fetch(address + '/api/light_controller.json')
        .then(function(response) {
          return response.json()
        }).then(function(json) {
          let controller = null
          json.light_controllers.forEach(function(element) {
            if (element.id == lightContollerID) {
              controller = element
            }
          })
          if (controller == null) {
            throw "Given Light Controller ID not found when contacting the Hub!"
          }
          resolve(controller)
        }).catch(function(err) {
          console.log('parsing failed', err)
        })
    })
  }
}

module.exports = HueSlave