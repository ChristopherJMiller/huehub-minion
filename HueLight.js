const fetch = require('node-fetch')
const Log = require('./Logger')
const colorsys = require('colorsys')
const colors = require('colors/safe');

const LOGGING_TAG = "HueLight"
const LOGGING_COLOR = colors.cyan

class HueLight {
  static async build(bridgeAddress, id, interval) {
    let light = new HueLight()

    Log(LOGGING_TAG, "Light Initialized", LOGGING_COLOR)
    light.bridgeAddress = bridgeAddress
    light.id = id

    await light.updateColor()

    return light
  }

  async updateColor() {
    this.status = await this.updateStatus(this.bridgeAddress, this.id)
    let rgbColor = this.getRGB((this.status.state.hue / 65535) * 360, (this.status.state.sat / 254) * 100, (this.status.state.bri / 254) * 100)
    if (JSON.stringify(rgbColor) !== JSON.stringify(this.rgbColor)) {
      this.rgbColor = rgbColor
      Log(LOGGING_TAG, "Color Updated", LOGGING_COLOR)
    }
  }

  getRGB(h, s, l) {
    return colorsys.hsv2Rgb({h: h, s: s, v: l})
  }

  async updateStatus(address, id) {
    let status
    await this.getStatus(address, id).then(function(json) {
      status = json
    })
    return status
  }

  async getStatus(address, id) {
    return new Promise(function(resolve, reject) {
      fetch(address + '/lights/' + id)
        .then(function(response) {
          return response.json()
        }).then(function(json) {
          resolve(json)
        }).catch(function(err) {
          console.log('parsing failed', err)
        })
    })
  }
}

module.exports = HueLight