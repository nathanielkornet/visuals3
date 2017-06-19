import {
  Group, SphereGeometry, Mesh, CircleGeometry, MeshLambertMaterial, DirectionalLight
} from 'three'
import bind from '@dlmanning/bind'

export default class Atom extends Group {
  constructor () {
    super()

    this.state = {
      time: 0,
      spread: 0,
      cameraSpeed: {x: 0, y: 0, z: 0},
      zoomZ: 0
    }

    // this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    // this.initializeMidiBindings(midi)
    this.initialize()
  }

  initialize () {
    // nucleus
    const nGeometry = new SphereGeometry(5, 32, 32)
    const nMaterial = new MeshLambertMaterial({color: 'blue'})
    const nucleus = new Mesh(nGeometry, nMaterial)
    this.add(nucleus)

    let cGeometry = new CircleGeometry(20, 32)
    let cMaterial = new MeshLambertMaterial({color: 'grey'})
    let circle = new Mesh(cGeometry, cMaterial)
    this.add(circle)

    // electron
    const eGeometry = new SphereGeometry(2, 32, 32)
    const eMaterial = new MeshLambertMaterial({color: 'green'})
    const electron = new Mesh(eGeometry, eMaterial)
    this.add(electron)

    this.electrons = []

    for (let i = 0; i < 6; i++) {
      const eGeometry = new SphereGeometry(2, 32, 32)
      const eMaterial = new MeshLambertMaterial({color: 'green'})
      const electron = new Mesh(eGeometry, eMaterial)
      this.electrons.push(electron)
      this.add(electron)
    }

    this.nucleus = nucleus

    let dlight = new DirectionalLight(0xffffff, 0.8)
    this.add(dlight)

    let dlight2 = new DirectionalLight(0xffffff, 0.8)
    dlight2.position.x = 1
    this.add(dlight2)

    let dlight3 = new DirectionalLight(0xffffff, 0.3)
    dlight3.position.x = -1
    dlight3.position.y = -1
    this.add(dlight3)

    this.update()
  }

  update (props) {
    window.requestAnimationFrame(this.update)

    const {
      time
    } = props

    this.electrons.forEach((electron, idx) => {
      const spot = idx * 2 * Math.PI / this.electrons.length

      electron.position.x = 20 * Math.sin(time * 0.01 + spot)
      electron.position.y = 20 * Math.cos(time * 0.01 + spot)
    })
  }
}
