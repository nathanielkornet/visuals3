import { WebGLRenderer, Scene } from 'three'
import Camera from './camera'
import Mixer from './mixer'
import { TriangleLand, Spherez, LineGeometry, RandoPolys } from './elements'
import bind from '@dlmanning/bind'
const SocketIOClient = require('socket.io-client')

// conditionally require midi interface module
let MidiInterface = null
if (process.env.IS_HOST_CLIENT) {
  MidiInterface = require('./midi-interface')
}

export default class Visuals {
  constructor (props) {
    this.initializeRenderer = bind(this, this.initializeRenderer)
    this.render = bind(this, this.render)

    if (process.env.IS_HOST_CLIENT) {
      this.socket = new SocketIOClient('http://localhost:9001')
      this.socket.open()
      this.socket.emit('test', 'hello from the host, socket world')
    } else {
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

    const renderer = new WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const camera = new Camera(midi, socket)
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

    this.render()
  }

  render () {
    window.requestAnimationFrame(this.render)

    const date = new Date()
    const time = date.getTime() / 1000 * 60

    const { renderer, camera, scene, mixer } = this

    // "get mixer output" aka update the various visuals
    mixer.getOutput({time})

    // update camera
    camera.update()

    renderer.render(scene, camera)
  }
}
