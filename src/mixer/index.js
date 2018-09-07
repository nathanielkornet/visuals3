import Channel from './channel'
import bind from '@dlmanning/bind'

const initialState = {
  spread: 1,
  spreadSpeed: 0,
  spreadSpeedApply: 0,
  fuckFactor: 1,
  fuckFactorSpeed: 0,
  fuckFactorSpeedApply: 0,
  c: 1,
  cSpeed: 0,
  cSpeedApply: 0,
  d: 1,
  dSpeed: 0,
  dSpeedApply: 0
}

export default class Mixer {
  constructor (numChannels, midi, socket, scene) {
    this.state = {
      spread: 1,
      spreadSpeed: 0,
      spreadSpeedApply: 0,
      fuckFactor: 1,
      fuckFactorSpeed: 0,
      fuckFactorSpeedApply: 0,
      c: 1,
      cSpeed: 0,
      cSpeedApply: 0,
      d: 1,
      dSpeed: 0,
      dSpeedApply: 0
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
    midi.bind('1-K1', val => {
      this.state.spreadSpeed = val / 127
    })
    // dec spread
    midi.bind('1-PB1', val => {
      if (val > 0) {
        this.state.spreadSpeedApply = -1
      } else {
        this.state.spreadSpeedApply = 0
      }
    })
    // inc spread
    midi.bind('1-PB5', val => {
      if (val > 0) {
        this.state.spreadSpeedApply = 1
      } else {
        this.state.spreadSpeedApply = 0
      }
    })

    // controls the "fuck factor" of the spheres
    midi.bind('1-K2', val => {
      this.state.fuckFactorSpeed = (val / 127 / 100)
    })
    // dec fuckFactor
    midi.bind('1-PB2', val => {
      if (val > 0) {
        this.state.fuckFactorSpeedApply = -1
      } else {
        this.state.fuckFactorSpeedApply = 0
      }
    })
    // inc fuckFactor
    midi.bind('1-PB6', val => {
      if (val > 0) {
        this.state.fuckFactorSpeedApply = 1
      } else {
        this.state.fuckFactorSpeedApply = 0
      }
    })

    // param c
    midi.bind('1-K3', val => {
      this.state.cSpeed = (val / 127 / 100)
    })
    // dec c
    midi.bind('1-PB3', val => {
      if (val > 0) {
        this.state.cSpeedApply = -1
      } else {
        this.state.cSpeedApply = 0
      }
    })
    // inc c
    midi.bind('1-PB7', val => {
      if (val > 0) {
        this.state.cSpeedApply = 1
      } else {
        this.state.cSpeedApply = 0
      }
    })

    // param d
    midi.bind('1-K4', val => {
      this.state.dSpeed = (val / 127 / 100)
    })
    // dec d
    midi.bind('1-PB4', val => {
      if (val > 0) {
        this.state.dSpeedApply = -1
      } else {
        this.state.dSpeedApply = 0
      }
    })
    // inc d
    midi.bind('1-PB8', val => {
      if (val > 0) {
        this.state.dSpeedApply = 1
      } else {
        this.state.dSpeedApply = 0
      }
    })

    // reset state
    midi.bind('1-B5', () => {
      Object.keys(initialState).forEach(stateVar => {
        this.state[stateVar] = initialState[stateVar]
      })
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
    if (
      this.state.spreadSpeedApply !== 0 ||
      this.state.fuckFactorSpeedApply !== 0 ||
      this.state.cSpeedApply !== 0 ||
      this.state.dSpeedApply !== 0
    ) {
      this.state.spread +=
        (this.state.spreadSpeed * this.state.spreadSpeedApply)
      this.state.fuckFactor +=
        (this.state.fuckFactorSpeed * this.state.fuckFactorSpeedApply)
      this.state.c +=
        (this.state.cSpeed * this.state.cSpeedApply)
      this.state.d +=
        (this.state.dSpeed * this.state.dSpeedApply)

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
