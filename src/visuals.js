import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera
} from 'three'
import VRControls from './lib/vr/vr-controls'
import VREffect from './lib/vr/vr-effect'
import Camera from './camera'
import Mixer from './mixer'
import {
  TriangleLand,
  Spherez,
  LineGeometry,
  RandoPolys,
  GiantSphere,
  CircleGlobe
} from './elements'
import bind from '@dlmanning/bind'
const SocketIOClient = require('socket.io-client')

// conditionally require midi interface module
let MidiInterface = null
if (!process.env.IS_GUEST) {
  MidiInterface = require('./midi-interface')
}

export default class Visuals {
  constructor (props) {
    this.initializeRenderer = bind(this, this.initializeRenderer)
    this.render = bind(this, this.render)

    if (process.env.IS_HOST) {
      this.socket = new SocketIOClient('http://localhost:8888')
      this.socket.open()
      this.socket.emit('test', 'hello from the host, socket world')
    } else if (process.env.IS_GUEST) {
      this.socket = new SocketIOClient()

      // socket.on('connect', () => getInitialState())
      this.socket.open()
      this.socket.on('test', val => {
        console.log(val)
      })
    }

    if (MidiInterface != null) {
      this.midi = new MidiInterface(this.socket)
    }

    this.initializeRenderer()
  }

  initializeRenderer () {
    const { midi, socket } = this

    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.setPixelRatio(Math.floor(window.devicePixelRatio))
    document.body.appendChild(renderer.domElement)

    let camera = null
    if (process.env.VR_CLIENT) {
      require('./lib/vr/webvr-polyfill.js')
      camera = new PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 10000
      )

      this.controls = new VRControls(camera)
      this.effect = new VREffect(renderer)
      this.effect.setSize(window.innerWidth, window.innerHeight)
    } else {
      camera = new Camera(midi, socket)
    }

    const scene = new Scene()
    // scene.background = new Color('white')

    this.mixer = new Mixer(8, this.midi, this.socket, scene)

    // set mixer channel input sources, add source to scene
    this.mixer.channels[0].setSource(new TriangleLand())
    this.mixer.channels[1].setSource(new Spherez())
    this.mixer.channels[2].setSource(new RandoPolys())
    this.mixer.channels[3].setSource(new GiantSphere({
      wireframe: true
    }))
    this.mixer.channels[4].setSource(new GiantSphere({
      wireframe: true,
      shape: 'box',
      color: 'green',
      radius: 100
    }))
    this.mixer.channels[5].setSource(new LineGeometry())
    this.mixer.channels[6].setSource(new CircleGlobe({
      numCircles: 20,
      circleRadius: 5,
      circleSegments: 64
    }))

    // this.midi.logBindings()

    // const lineGeo = new LineGeometry()
    // mixer.channels[2].setInput(lineGeo)
    // scene.add(lineGeo)

    this.renderer = renderer
    this.camera = camera
    this.scene = scene

    // let vrDisplay = null
    if (process.env.VR_CLIENT) {
      // Initialize VR environment
      if (navigator.getVRDisplays) {
        this.assignVRDisplay = bind(this, function (displays) {
          if (displays.length > 0) {
            const vrDisplay = displays[0]
            this.render(vrDisplay)
          }
        })
        navigator.getVRDisplays().then(this.assignVRDisplay)
      } else {
        console.warn('no getVRDisplays')
      }
    } else {
      this.render()
    }
  }

  render (vrDisplay) {
    const { renderer, camera, scene, mixer, controls, effect } = this

    if (process.env.VR_CLIENT && vrDisplay != null) {
      if (!vrDisplay.isPresenting && vrDisplay.requestPresent) {
        vrDisplay.requestPresent([{ source: renderer.domElement }])
      }
    }
    window.requestAnimationFrame(this.render)

    const time = Date.now() / 1000 * 60

    // "get mixer output" aka update the various visuals
    mixer.getOutput({time})

    if (process.env.VR_CLIENT) {
      controls.update()
      effect.render(scene, camera)
    } else {
      // update camera
      camera.update({time})
      renderer.render(scene, camera)
    }
  }
}
