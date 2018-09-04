// this makes it easier to use third party stuff
// TODO: make this the preferred way of accessing THREE lib
global.THREE = require('three')

// loads external stuff. mostly from threejs demos.
require('./ext')

console.log('THREE', THREE)

const {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Color
} = THREE
import VRControls from './lib/vr/vr-controls'
import VREffect from './lib/vr/vr-effect'
import Camera from './camera'
import Mixer from './mixer'
import Effects from './effects'
import {
  Atom,
  TriangleLand,
  Spherez,
  LineGeometry,
  RandoPolys,
  GiantSphere,
  CircleGlobe,
  Sandbox,
  HeardYouLikeCubes,
  Flow,
  Grid,
  Noodle,
  Debris
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
    renderer.setClearColor( 0x20252f );
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
    scene.background = new Color('#000')

    // light n fog
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
    scene.add( new THREE.AmbientLight( 0x222222, 0.4 ) );
		const	light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );

    if (process.env.SANDBOX) {
      // enter sandbox mode
      this.mixer = new Mixer(1, this.midi, this.socket, scene)
      const sandbox = this.mixer.channels[0]
      sandbox.setSource(new Sandbox())
      sandbox.setOpacity(0.85)
    } else {
      this.mixer = new Mixer(8, this.midi, this.socket, scene)

      // set mixer channel input sources, add source to scene
      // this.mixer.channels[0].setSource(new HeardYouLikeCubes())
      this.mixer.channels[1].setSource(new Spherez())
      this.mixer.channels[2].setSource(new RandoPolys())
      this.mixer.channels[3].setSource(new Noodle())
      this.mixer.channels[4].setSource(new Debris())
      this.mixer.channels[5].setSource(new TriangleLand())
      this.mixer.channels[6].setSource(new CircleGlobe({
        numCircles: 20,
        circleRadius: 5,
        circleSegments: 64
      }))
      this.mixer.channels[7].setSource(new Flow())
    }

    // init effects
    const effects = new Effects(renderer, scene, camera, midi)

    // store to (this) context for later access
    this.renderer = renderer
    this.camera = camera
    this.scene = scene
    this.effects = effects

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

    // this.midi.logBindings()
  }

  render (vrDisplay) {
    const { renderer, camera, scene, mixer, controls, effect, effects } = this

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

    // effect rendering needs to happen after scene is rendered.
    effects.render(time)
  }
}
