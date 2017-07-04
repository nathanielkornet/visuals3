import {
  Group, SphereGeometry, MeshNormalMaterial, Mesh
} from 'three'
import bind from '@dlmanning/bind'

export default class Spherez extends Group {
  constructor () {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize()
  }

  initialize () {
    // up to 2000
    const numSpheres = 100
    const Geometry = new SphereGeometry(3, 32, 32)
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
      let theta
      let chi
      if (i % 2 === 0) {
        theta = (0.001 * time) + (i / (this.children.length - 1)) * 2 * Math.PI * fuckFactor
        chi = (0.001 * time) + (i / (this.children.length - 1)) * Math.PI * fuckFactor
      } else {
        theta = (0.001 * time) + (i / (this.children.length - 1)) * 2 * Math.PI * fuckFactor * 2
        chi = (0.001 * time) + (i / (this.children.length - 1)) * Math.PI * fuckFactor * 2
      }


      sphere.position.x = spread * Math.cos(theta) * Math.sin(chi)
      sphere.position.y = spread * Math.sin(theta) * Math.sin(chi)
      sphere.position.z = spread * Math.cos(chi)

      sphere.material.opacity = opacity
      sphere.material.transparent = true
    })
  }
}
