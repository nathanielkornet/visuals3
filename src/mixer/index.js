import Channel from './channel'
import bind from '@dlmanning/bind'

export default class Mixer {
  constructor (numChannels, midi, socket, scene) {
    this.state = {
      spread: 1,
      spreadSpeed: 0,
      spreadSpeedApply: 0,
      fuckFactor: 1,
      fuckFactorSpeed: 0,
      fuckFactorSpeedApply: 0,
      speedA: 1,
      speedB: 1
    }

    this.channels = []
    this.midi = midi
    this.socket = socket

    this.addChannels = bind(this, this.addChannels)
    this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.getOutput = bind(this, this.getOutput)
    this.addChannels = bind(this, this.addChannels)

    this.addChannels(numChannels, socket, scene)

    if (midi != null) {
      this.initializeMidiBindings()
    }

    if (process.env.IS_GUEST) {
      socket.on('update channel', data => {
        const channelIdx = data.channelNum - 1
        this.channels[channelIdx].setOpacity(data.opacity)
        this.channels[channelIdx].setActive(data.isActive)
        this.channels[channelIdx].setSpecialEffect(data.specialEffect)
      })

      socket.on('update mixer', data => {
        this.state.spread = data.spread
        this.state.fuckFactor = data.fuckFactor
      })
    }
  }

  initializeMidiBindings () {
    const { midi } = this

    // controls spread speed change of the spheres
    midi.bind('K1', val => {
      this.state.spreadSpeed = val / 127
    })
    // dec spread
    midi.bind('PB1', val => {
      if (val > 0) {
        this.state.spreadSpeedApply = -1
      } else {
        this.state.spreadSpeedApply = 0
      }
    })
    // inc spread
    midi.bind('PB5', val => {
      if (val > 0) {
        this.state.spreadSpeedApply = 1
      } else {
        this.state.spreadSpeedApply = 0
      }
    })

    // controls the "fuck factor" of the spheres
    midi.bind('K2', val => {
      this.state.fuckFactorSpeed = (val / 127 / 100)
    })
    // dec fuckFactor
    midi.bind('PB2', val => {
      if (val > 0) {
        this.state.fuckFactorSpeedApply = -1
      } else {
        this.state.fuckFactorSpeedApply = 0
      }
    })
    // inc fuckFactor
    midi.bind('PB6', val => {
      if (val > 0) {
        this.state.fuckFactorSpeedApply = 1
      } else {
        this.state.fuckFactorSpeedApply = 0
      }
    })

    // speedA
    midi.bind('K3', val => {
      this.state.speedA = val / 64
    })

    // speedB
    midi.bind('K4', val => {
      this.state.speedB = val / 64
    })
  }

  addChannels (num, socket, scene) {
    for (let i = 1; i <= num; i++) {
      this.channels.push(new Channel(i, this.midi, socket, scene))
    }
  }

  getOutput (props) {
    // should change this name, it's just updating the scene
    // not really a "getter"
    if (this.state.spreadSpeedApply !== 0 ||
        this.state.fuckFactorSpeedApply !== 0) {
      this.state.spread +=
        (this.state.spreadSpeed * this.state.spreadSpeedApply)
      this.state.fuckFactor +=
        (this.state.fuckFactorSpeed * this.state.fuckFactorSpeedApply)

      if (process.env.IS_HOST) {
        this.socket.emit('update mixer', {
          spread: this.state.spread,
          fuckFactor: this.state.fuckFactor
        })
      }
    }

    this.channels.forEach(channel => {
      if (channel.hasSource()) {
        channel.updateSource({...this.state, ...props})
      }
    })
  }
}
