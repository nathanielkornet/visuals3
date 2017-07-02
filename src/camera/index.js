import { PerspectiveCamera, Vector3 } from 'three'
import bind from '@dlmanning/bind'

const origin = new Vector3(0, 0, 0)

export default class Camera extends PerspectiveCamera {
  constructor (midi, socket) {
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
    if (midi != null) {
      this.initializeMidiBindings()
    }

    this.socket = socket
    if (process.env.IS_GUEST) {
      socket.on('update camera', data => {
        const { cameraPosition, cameraRotationSpeed, cameraType } = data

        if (this.state.cameraType !== 1 && cameraType === 1) {
          this.lookAt(origin)
        }
        this.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        this.state.cameraRotationSpeed = cameraRotationSpeed
        this.state.cameraType = cameraType
      })
    }

    this.position.set(0, 0, 0)
    this.lookAt(origin)
  }

  initializeMidiBindings () {
    const { midi } = this
    // Camera position / type
    midi.bind('B1', () => {
      this.position.set(0, 0, 100)
      this.lookAt(origin)
      this.state.cameraType = 1
    })
    midi.bind('B2', () => {
      this.position.set(0, 0, 0)
      this.state.cameraType = 2
    })
    midi.bind('B3', () => {
      this.state.cameraType = 3
    })

    midi.bind('B5', () => {
      // kill zoom
      this.state.cameraSpeed = {x: 0, y: 0, z: 0}
    })

    // roation speed (in camera 2 view)
    midi.bind('K8', val => {
      this.state.cameraRotationSpeed = val - 64
    })

    // Joystick X: camera X
    midi.bind('K5', val => {
      this.state.cameraSpeed.x = val - 64
    })
    // Joystick Y: camera Y
    midi.bind('K6', val => {
      this.state.cameraSpeed.y = val - 64
    })

    // Camera zoom
    // speed
    midi.bind('K7', val => {
      this.state.cameraSpeed.z = val - 64
    })
    // // in toggle
    // midi.bind('PA1', val => {
    //   this.state.zoomZ = val > 0 ? 1 : 0
    // })
    // // out toggle
    // midi.bind('PA5', val => {
    //   this.state.zoomZ = val > 0 ? -1 : 0
    // })
  }

  update (props) {
    const {
      cameraSpeed,
      cameraRotationSpeed,
      cameraType
      // zoomZ
    } = this.state

    let newCameraPosition = {x: 0, y: 0, z: 0}
    if (cameraType === 1) {
      newCameraPosition = {
        x: this.position.x + (0.001 * cameraSpeed.x),
        y: this.position.y + (0.001 * cameraSpeed.y),
        z: this.position.z - (0.005 * cameraSpeed.z)
        // z: this.position.z + (0.005 * zoomZ * cameraSpeed.z)
      }

      this.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z)
    } else if (cameraType === 2) {
      let newRotation = 0
      if (cameraType === 2) {
        // apply rotation
        newRotation = 0.0005 * cameraRotationSpeed
        this.rotation.y += newRotation
      }
    } else if (cameraType === 3) {
      const { time } = props

      newCameraPosition = {
        x: Math.sin(time / 50000),
        y: 0,
        z: Math.cos(time / 50000)
        // z: this.position.z + (0.005 * zoomZ * cameraSpeed.z)
      }

      this.lookAt(origin)

      this.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z)
    }

    if (process.env.IS_HOST) {
      this.socket.emit('update camera', {
        cameraPosition: newCameraPosition,
        cameraRotationSpeed,
        cameraType
      })
    }
  }
}
