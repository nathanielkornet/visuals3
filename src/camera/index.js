import { PerspectiveCamera, Vector3 } from 'three'
import bind from '@dlmanning/bind'

const origin = new Vector3(0, 0, 0)

export default class Camera extends PerspectiveCamera {
  constructor (midi, socket) {
    super(45, window.innerWidth / window.innerHeight, 1, 500)

    this.state = {
      cameraSpeed: {x: 0, y: 0, z: 0},
      zoom: {x: 0, y: 0, z: 0},
      cameraType: 1,
      cameraRotationSpeed: 0,
      cameraDistance: 60
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

    this.position.set(0, 0, 400) // 100
    this.lookAt(origin)

    // TODO: maybe delete this
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
		this.add( pointLight );
  }

  initializeMidiBindings () {
    const { midi } = this
    // Camera position / type
    midi.bind('1-B1', () => {
      this.position.set(0, 0, 100)
      this.lookAt(origin)
      this.state.cameraType = 1
    })
    midi.bind('1-B2', () => {
      this.position.set(0, 0, 0)
      this.state.cameraType = 2
    })
    midi.bind('1-B3', () => {
      this.state.cameraType = 3
    })
    midi.bind('1-B4', () => {
      this.state.cameraType = 4
    })

    // roation speed (in camera 2 view)
    midi.bind('1-K8', val => {
      this.state.cameraRotationSpeed = val - 64
    })

    // zoom speed
    // x
    midi.bind('1-K5', val => {
      this.state.cameraSpeed.x = val
    })
    // y
    midi.bind('1-K6', val => {
      this.state.cameraSpeed.y = val
    })
    // z
    midi.bind('1-K7', val => {
      this.state.cameraSpeed.z = val
    })

    // zoom in/out toggles
    // x
    midi.bind('1-PA5', val => {
      this.state.zoom.x = val > 0 ? 1 : 0
    })
    midi.bind('1-PA1', val => {
      this.state.zoom.x = val > 0 ? -1 : 0
    })
    // y
    midi.bind('1-PA6', val => {
      this.state.zoom.y = val > 0 ? 1 : 0
    })
    midi.bind('1-PA2', val => {
      this.state.zoom.y = val > 0 ? -1 : 0
    })
    // z
    midi.bind('1-PA7', val => {
      this.state.zoom.z = val > 0 ? 1 : 0
    })
    midi.bind('1-PA3', val => {
      this.state.zoom.z = val > 0 ? -1 : 0
    })
  }

  update (props) {
    const {
      cameraSpeed,
      cameraRotationSpeed,
      cameraType,
      cameraDistance,
      zoom
    } = this.state

    let newCameraPosition = {x: 0, y: 0, z: 0}
    if (cameraType === 1) {
      newCameraPosition = {
        x: this.position.x + (0.001 * zoom.x * cameraSpeed.x),
        y: this.position.y + (0.001 * zoom.y * cameraSpeed.y),
        z: this.position.z - (0.005 * zoom.z * cameraSpeed.z)
      }

      this.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z)
    } else if (cameraType === 2) {
      this.position.set(0, 0, 0)
      let newRotation = 0
      if (cameraType === 2) {
        // apply rotation
        newRotation = 0.0005 * cameraRotationSpeed
        this.rotation.y += newRotation
      }
    } else if (cameraType === 3 || cameraType === 4) {
      const { time } = props

      newCameraPosition = {
        x: cameraDistance * Math.sin(time / 1010) + (cameraType === 4 ? 40 : 0),
        y: cameraDistance * Math.sin(time / 505) + (cameraType === 4 ? 40 : 0),
        z: cameraDistance * Math.cos(time / 8030) + (cameraType === 4 ? 40 : 0)
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
