export default class Channel {
  constructor (channelNum, midi) {
    this.state = {
      opacity: 0,
      isActive: false
    }

    this.channelNum = channelNum

    // this.initializeMidiBindings(midi)
  }

  initializeMidiBindings (midi) {
    //
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
      this.state.opacity = (val / 127)
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
}
