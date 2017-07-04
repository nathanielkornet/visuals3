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
      scene.add(this.source)
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

    const faderId = `F${channelNum}`
    const switchId = `S${channelNum}`

    midi.bind(faderId, val => {
      if (val === 0) {
        this.setActive(false)
        scene.remove(this.source)
      } else {
        if (!this.isActive() && this.hasSource()) {
          this.setActive(true)
          scene.add(this.source)
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
