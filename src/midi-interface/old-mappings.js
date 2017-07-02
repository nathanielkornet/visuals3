/*

/****             ****
**  MPK MINI MAPPINGS **
********       *******

// Mixer //

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

// channel

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

// camera
initializeMidiBindings () {
  const { midi } = this
  // Camera position / type
  midi.bind('PB1', val => {
    if (val > 1) {
      this.position.set(0, 0, 100)
      this.lookAt(new Vector3(0, 0, 0))
      this.state.cameraType = 1
    }
  })
  midi.bind('PB2', val => {
    if (val > 1) {
      this.position.set(0, 0, 0)
      this.state.cameraType = 2
    }
  })

  // roation speed (in camera 2 view)
  midi.bind('K8', val => {
    this.state.cameraRotationSpeed = val - 64
  })

  // Joystick X: camera X
  midi.bind('K9', val => {
    this.state.cameraSpeed.x = val - 64
  })
  // Joystick Y: camera Y
  midi.bind('K10', val => {
    this.state.cameraSpeed.y = val - 64
  })

  // Camera zoom
  // speed
  midi.bind('K7', val => {
    this.state.cameraSpeed.z = val / 1.5
  })
  // in toggle
  midi.bind('PA1', val => {
    this.state.zoomZ = val > 0 ? 1 : 0
  })
  // out toggle
  midi.bind('PA5', val => {
    this.state.zoomZ = val > 0 ? -1 : 0
  })



*/
