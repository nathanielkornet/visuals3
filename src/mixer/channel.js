export default class Channel {
  constructor (channelNum, midi, socket) {
    this.state = {
      opacity: 0,
      isActive: false
    }

    this.channelNum = channelNum

    if (midi != null) {
      this.initializeMidiBindings(midi, socket)
    }
  }

  initializeMidiBindings (midi, socket) {
    const { channelNum } = this

    const knob = `K${channelNum}`

    midi.bind(knob, val => {
      if (val === 0) {
        this.setActive(false)
      } else {
        if (!this.isActive()) {
          this.setActive(true)
        }
      }
      const newOpacity = (val / 127)

      this.setOpacity(newOpacity)

      if (process.env.IS_HOST) {
        socket.emit('update channel', {
          channelNum,
          ...this.state
        })
      }
    })
  }

  setInput (source) {
    this.source = source
  }

  hasInput () {
    return this.source != null
  }

  getOutput (props) {
    return this.source.update({...this.state, ...props})
  }

  isActive () {
    return this.state.isActive === true
  }

  setActive (val) {
    this.state.isActive = val
  }

  setOpacity (val) {
    this.state.opacity = val
  }
}
