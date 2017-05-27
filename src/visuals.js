import {
  WebGLRenderer, PerspectiveCamera, Vector3, Scene
} from 'three'
import MidiInterface from './midi-interface'
import Mixer from './mixer'
import { TriangleLand, Spherez, LineGeometry } from './scenes'
import bind from '@dlmanning/bind'

export default class Visuals {
  constructor () {
    this.state = {
      time: 0,
      cameraSpeed: {x: 0, y: 0, z: 0},
      zoomZ: 0,
      cameraType: 1,
      cameraRotationSpeed: 0
    }

    this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.initializeRenderer = bind(this, this.initializeRenderer)
    this.render = bind(this, this.render)

    // this.midi = new MidiInterface()
    this.mixer = new Mixer(8, this.midi)

    // this.initializeMidiBindings()

    this.initializeRenderer()
  }

  initializeRenderer () {
    const { mixer } = this

    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)
    camera.position.set(0, 0, 100)
    camera.lookAt(new Vector3(0, 0, 0))

    const scene = new Scene()

    // set mixer channel input sources, add source to scene
    const triangleLand = new TriangleLand()
    mixer.channels[0].setInput(triangleLand)
    scene.add(triangleLand)

    const spherez = new Spherez()
    mixer.channels[1].setInput(spherez)
    scene.add(spherez)

    const lineGeo = new LineGeometry()
    mixer.channels[2].setInput(lineGeo)
    scene.add(lineGeo)

    // ^^ there's gotta be a better way...

    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.mixer = mixer

    this.render()
  }

  initializeMidiBindings () {
    const { midi } = this
    /**
    * Camera
    **/

    // Camera position / type
    midi.bind('PB1', val => {
      if (val > 1) {
        this.camera.position.set(0, 0, 100)
        this.camera.lookAt(new Vector3(0, 0, 0))
        this.state.cameraType = 1
      }
    })
    midi.bind('PB2', val => {
      if (val > 1) {
        this.camera.position.set(0, 0, 0)
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

  render () {
    window.requestAnimationFrame(this.render)

    const date = new Date()
    const time = date.getTime() / 1000 * 60

    const { renderer, camera, scene, mixer } = this

    const {
      cameraSpeed,
      cameraRotationSpeed,
      cameraType,
      zoomZ
    } = this.state

    // update camera
    const newCameraPos = {
      x: camera.position.x + (0.001 * cameraSpeed.x),
      y: camera.position.y + (0.001 * cameraSpeed.y),
      z: camera.position.z + (0.005 * zoomZ * cameraSpeed.z)
    }
    camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z)

    if (cameraType === 2) {
      // apply rotation
      const val = 0.0005 * cameraRotationSpeed
      camera.rotation.y += val
    }

    // "get mixer output" aka update the various visuals
    mixer.getOutput({...this.state, time})

    renderer.render(scene, camera)
  }
}
