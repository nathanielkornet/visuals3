import {
  Group,
  SphereGeometry,
  BoxGeometry,
  MeshNormalMaterial,
  MeshBasicMaterial,
  Mesh,
  DoubleSide
} from 'three'
import bind from '@dlmanning/bind'

export default class GiantContainer extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    const {
      radius = 85,
      color,
      wireframe = false,
      shape = 'sphere'
    } = props

    const Geometry = shape === 'box'
      ? new BoxGeometry(170, 170, 170, 32, 32, 32)
      : new SphereGeometry(radius, 32, 32)

    const Material = color != null
      ? new MeshBasicMaterial({
        color: color, wireframe
      })
      : new MeshNormalMaterial({
        wireframe,
        side: DoubleSide
      })

    const sphere = new Mesh(Geometry, Material)
    this.add(sphere)
    this.sphere = sphere

    console.log(sphere)
  }

  update (props) {
    const {
      opacity,
      specialEffect
    } = props

    this.rotation.y += specialEffect ? 0.0025 : 0.001

    this.sphere.material.transparent = true
    this.sphere.material.opacity = opacity
  }
}
