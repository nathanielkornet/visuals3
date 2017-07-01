import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera
} from 'three'
import VRControls from './lib/vr/vr-controls'
import VREffect from './lib/vr/vr-effect'
import Camera from './camera'
import Mixer from './mixer'
import { TriangleLand, Spherez, LineGeometry, RandoPolys } from './elements'
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
      this.socket = new SocketIOClient('http://localhost:9001')
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

    this.mixer = new Mixer(8, this.midi, this.socket)

    this.initializeRenderer()
  }

  initializeRenderer () {
    const { mixer, midi, socket } = this

    const renderer = new WebGLRenderer({antialias: false})
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

    // set mixer channel input sources, add source to scene
    const triangleLand = new TriangleLand()
    mixer.channels[0].setInput(triangleLand)
    scene.add(triangleLand)

    const spherez = new Spherez()
    mixer.channels[1].setInput(spherez)
    scene.add(spherez)

    // const lineGeo = new LineGeometry()
    // mixer.channels[2].setInput(lineGeo)
    // scene.add(lineGeo)

    const randoPolys = new RandoPolys()
    mixer.channels[3].setInput(randoPolys)
    scene.add(randoPolys)

    // ^^ there's gotta be a better way...

    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.mixer = mixer

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

    const date = new Date()
    const time = date.getTime() / 1000 * 60

    // "get mixer output" aka update the various visuals
    mixer.getOutput({time})

    if (process.env.VR_CLIENT) {
      controls.update()
      effect.render(scene, camera)
    } else {
      // update camera
      camera.update()
      renderer.render(scene, camera)
    }
  }
}
