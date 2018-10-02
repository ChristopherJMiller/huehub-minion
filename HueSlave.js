const fetch = require('node-fetch')
const Log = require('./Logger')

class HueSlave {
  static async build(hubAddress, lightContollerID) {
    let slave = new HueSlave();
    slave.hubAddress = hubAddress;
    slave.lightContollerID = lightContollerID;

    slave.LOGGER_TAG = "HueSlave"

    await slave.updateSlave(hubAddress, lightContollerID)
  
    Log(slave.LOGGER_TAG, "Hue Slave Initialized, Watching Controller id " + slave.lightContollerID + ", Hue Light Selected is " + slave.hueID)

    return slave
  }

  async updateSlave(hubAddress, lightContollerID) {
    let hI, hT
    await this.getChosenController(hubAddress, lightContollerID).then(function(controller) {
      hI = controller.hueID
      hT = controller.hueType
    })
    this.updateSlaveTask(hI, hT)
  }

  updateSlaveTask(hueID, hueType) {
    this.hueID = hueID
    this.hueType = hueType
  }

  registerCallback(callback) {
    this.callback = callback
  }

  async updateController() {
    await this.updateSlave(this.hubAddress, this.lightContollerID)
    Log(this.LOGGER_TAG, "Slave Updated, Watching Cid " + this.lightContollerID + " & Hid " + this.hueID)
    if (this.callback != null) {
      this.callback()
    }
  }

  async getChosenController(address, lightContollerID) {
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