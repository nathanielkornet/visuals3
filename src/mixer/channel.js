export default class Channel {
  constructor (channelNum, midi, socket, scene) {
    this.state = {
      opacity: 0,
      isActive: false,
      specialEffect: false
    }

    this.channelNum = channelNum

    this.setSource = (source) => {
      this.source = source
      // scene.add(this.source)
    }
    this.hasSource = () => this.source != null
    this.updateSource = (props) => {
      return this.source.update({...this.state, ...props})
    }

    this.isActive = () => this.state.isActive === true
    this.setActive = (val) => {
      this.state.isActive = val
    }

    this.setOpacity = (val) => {
      this.state.opacity = val

      if (val === 0) {
        this.setActive(false)
        scene.remove(this.source)
      } else {
        if (!this.isActive() && this.hasSource()) {
          this.setActive(true)
          scene.add(this.source)
        }
      }
    }

    this.setSpecialEffect = val => {
      this.state.specialEffect = val
    }

    if (midi != null) {
      this.initializeMidiBindings(midi, socket, scene)
    }
  }

  initializeMidiBindings (midi, socket, scene) {
    const { channelNum } = this

    let cNum = channelNum < 9 ? channelNum : channelNum - 8
    let midiChannel = channelNum < 9 ? 1 : 3

    console.log(midiChannel, cNum)

    const faderId = `${midiChannel}-F${cNum}`
    const switchId = `${midiChannel}-S${cNum}`

    midi.bind(faderId, val => {
      const newOpacity = (val / 127)

      this.setOpacity(newOpacity)

      if (process.env.IS_HOST) {
        socket.emit('update channel', {
          channelNum,
          ...this.state
        })
      }
    })

    midi.bind(switchId, val => {
      if (val === 0) {
        this.setSpecialEffect(false)
      } else {
        this.setSpecialEffect(true)
      }

      if (process.env.IS_HOST) {
        socket.emit('update channel', {
          channelNum,
          ...this.state
        })
      }
    })
  }
}
