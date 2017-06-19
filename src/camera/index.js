import { PerspectiveCamera, Vector3 } from 'three'
import bind from '@dlmanning/bind'

export default class Camera extends PerspectiveCamera {
  constructor (midi) {
    super(45, window.innerWidth / window.innerHeight, 1, 500)

    this.state = {
      cameraSpeed: {x: 0, y: 0, z: 0},
      zoomZ: 0,
      cameraType: 1,
      cameraRotationSpeed: 0
    }

    this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.update = bind(this, this.update)

    this.midi = midi
    this.initializeMidiBindings()

    this.position.set(0, 0, 100)
    this.lookAt(new Vector3(0, 0, 0))
  }

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
  }

  update () {
    const {
      cameraSpeed,
      cameraRotationSpeed,
      cameraType,
      zoomZ
    } = this.state

    const newCameraPos = {
      x: this.position.x + (0.001 * cameraSpeed.x),
      y: this.position.y + (0.001 * cameraSpeed.y),
      z: this.position.z + (0.005 * zoomZ * cameraSpeed.z)
    }

    this.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z)

    if (cameraType === 2) {
      // apply rotation
      const val = 0.0005 * cameraRotationSpeed
      this.rotation.y += val
    }
  }
}
