import {
  Group, SphereGeometry, Mesh, CircleGeometry, MeshLambertMaterial, DirectionalLight
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomHexColor } from '../../lib/helpers'

export default class Atom extends Group {
  constructor () {
    super()

    // this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    // this.initializeMidiBindings(midi)
    this.initialize()
  }

  initialize () {
    this.atoms = []
    const loader = new THREE.TextureLoader()

    // sun w/ logo
    // const SunGeometry = new CircleGeometry(19, 32, 32)
    const tex = loader.load('./perlin-512.png')

    for (let i = 0; i < 50; i++) {
      const atom = this.makeAtom(tex)

      this.add(atom.group)
      this.atoms.push(atom)
    }

    this.atoms.forEach(atom => {
      atom.group.position.x = Math.random() * 100 - 50
      atom.group.position.y = Math.random() * 100 - 50
      atom.group.position.z = Math.random() * 100 - 50
    })
  }

  makeAtom (tex) {
    const group = new Group()
    // nucleus

    const nGeometry = new SphereGeometry(4, 16, 16)
    const nMaterial = new THREE.MeshBasicMaterial({color: 'white', map: tex})
    const nucleus = new Mesh(nGeometry, nMaterial)
    group.add(nucleus)

    const electrons = []

    for (let i = 0; i < 16; i++) {
      const eGeometry = new SphereGeometry(0.5, 8, 8)
      const eMaterial = new THREE.MeshPhongMaterial({color: 'blue'})
      const electron = new Mesh(eGeometry, eMaterial)
      electrons.push(electron)
      group.add(electron)
    }

    return {
      group,
      electrons,
      nucleus
    }
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor
    } = props

    this.atoms.forEach((atom, ati) => {
      // atom.group.position.z += Math.sin(time / 400000 * ati) * 0.1



      atom.nucleus.rotation.z += 0.01
      atom.nucleus.rotation.y += 0.02

      atom.nucleus.material.opacity = opacity
      atom.nucleus.material.transparent = true

      atom.electrons.forEach((electron, idx) => {
        // const spot = idx * 2 * Math.PI / this.electrons.length
        //
        // electron.position.x = 20 * Math.sin(time * 0.01 + spot)
        // electron.position.y = 20 * Math.cos(time * 0.01 + spot)

        const theta = (0.01 * time) + (idx / (this.children.length - 1)) * 2 * Math.PI * fuckFactor + (time/40000)
        const chi = (0.01 * time) + (idx / (this.children.length - 1)) * Math.PI * fuckFactor + (time/40000)

        electron.position.x = 2 * spread * Math.cos(theta) * Math.sin(chi)
        electron.position.y = 2 * spread * Math.sin(theta) * Math.sin(chi)
        electron.position.z = 2 * spread * Math.cos(chi)

        electron.material.opacity = opacity
        electron.material.transparent = true
      })
    })

    this.rotation.x -= 0.001
    this.rotation.z += 0.002
  }
}
