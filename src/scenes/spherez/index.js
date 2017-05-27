import {
  Group, SphereGeometry, MeshNormalMaterial, Mesh
} from 'three'
import bind from '@dlmanning/bind'

export default class Spherez extends Group {
  constructor (midi) {
    super()

    // this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    // this.initializeMidiBindings(midi)

    this.initialize()
  }

  initialize () {
    // up to 2000
    const numSpheres = 25
    const Geometry = new SphereGeometry(5, 32, 32)
    const Material = new MeshNormalMaterial()

    for (let i = 0; i < numSpheres; i++) {
      const sphere = new Mesh(Geometry, Material)
      this.add(sphere)
    }
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor
    } = props

    const val = 0.001
    this.rotation.y += val

    this.children.forEach((sphere, i) => {
      const theta = (0.001 * time) + (i / (this.children.length - 1)) * 2 * Math.PI * fuckFactor
      const chi = (0.001 * time) + (i / (this.children.length - 1)) * Math.PI * fuckFactor

      sphere.position.x = spread * Math.cos(theta) * Math.sin(chi)
      sphere.position.y = spread * Math.sin(theta) * Math.sin(chi)
      sphere.position.z = spread * Math.cos(chi)

      sphere.material.opacity = opacity
      sphere.material.transparent = true
    })
  }
}
