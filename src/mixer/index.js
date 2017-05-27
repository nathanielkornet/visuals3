import Channel from './channel'
import bind from '@dlmanning/bind'

export default class Mixer {
  constructor (numChannels, midi) {
    this.state = {
      spread: 1,
      spreadSpeed: 0,
      spreadSpeedApply: 0,
      fuckFactor: 1,
      fuckFactorSpeed: 0,
      fuckFactorSpeedApply: 0
    }

    this.channels = []
    this.midi = midi

    this.addChannels = bind(this, this.addChannels)
    this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.getOutput = bind(this, this.getOutput)
    this.addChannels = bind(this, this.addChannels)

    this.addChannels(numChannels)
    this.initializeMidiBindings()
  }

  initializeMidiBindings () {
    const { midi } = this

    // controls spread speed change of the spheres
    midi.bind('K5', val => {
      this.state.spreadSpeed = val / 127
    })
    // dec spread
    midi.bind('PA2', val => {
      if (val > 0) {
        this.state.spreadSpeedApply = -1
      } else {
        this.state.spreadSpeedApply = 0
      }
    })
    // inc spread
    midi.bind('PA6', val => {
      if (val > 0) {
        this.state.spreadSpeedApply = 1
      } else {
        this.state.spreadSpeedApply = 0
      }
    })

    // controls the "fuck factor" of the spheres
    midi.bind('K6', val => {
      this.state.fuckFactorSpeed = (val / 127 / 100)
    })
    // dec fuckFactor
    midi.bind('PA3', val => {
      if (val > 0) {
        this.state.fuckFactorSpeedApply = -1
      } else {
        this.state.fuckFactorSpeedApply = 0
      }
    })
    // inc fuckFactor
    midi.bind('PA7', val => {
      if (val > 0) {
        this.state.fuckFactorSpeedApply = 1
      } else {
        this.state.fuckFactorSpeedApply = 0
      }
    })
  }

  addChannels (num) {
    for (let i = 1; i < num; i++) {
      this.channels.push(new Channel(i, this.midi))
    }
  }

  getOutput (props) {
    // should change this name, it's just updating the scene
    // not really a "getter"
    this.state.spread +=
      (this.state.spreadSpeed * this.state.spreadSpeedApply)
    this.state.fuckFactor +=
      (this.state.fuckFactorSpeed * this.state.fuckFactorSpeedApply)

    this.channels.forEach(channel => {
      if (channel.hasInput()) {
        channel.getOutput({...this.state, ...props})
      }
    })
  }
}
