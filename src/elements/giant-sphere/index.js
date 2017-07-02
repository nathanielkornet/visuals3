import {
  Group, SphereGeometry, MeshNormalMaterial, Mesh
} from 'three'
import bind from '@dlmanning/bind'

export default class GiantSphere extends Group {
  constructor () {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize()
  }

  initialize () {
    const Geometry = new SphereGeometry(75, 32, 32)
    const Material = new MeshNormalMaterial({
      wireframe: true
    })
    const sphere = new Mesh(Geometry, Material)
    this.add(sphere)
    this.sphere = sphere
  }

  update (props) {
    const {
      opacity
    } = props

    const val = 0.001
    this.rotation.y += val

    this.sphere.material.transparent = true
    this.sphere.material.opacity = opacity
  }
}
