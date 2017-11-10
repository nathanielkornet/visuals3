import {
  Group, Mesh, SphereGeometry, Vector3, Geometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomHexColor } from '../../lib/helpers'

export default class CircleGlobe extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    const {
      color
    } = props

    const pGeometry = new SphereGeometry(0.2)
    const Material = color != null
      ? new MeshBasicMaterial({color})
      : new MeshNormalMaterial()

    for (let i = 0; i < 200; i += 2) {
      for (let j = 0; j < 200; j += 2) {
        const point = new Mesh(pGeometry, Material)
        point.position.x = i - 100
        point.position.y = j - 100

        this.add(point)
      }
    }
  }

  update (props) {
    const {
      time,
      opacity
    } = props

    this.children.forEach((point, i) => {
      point.material.opacity = opacity
      point.material.transparent = true

      const currentX = Number(point.position.x)
      const currentY = Number(point.position.y)

      const xVelocity = (Math.sin(currentY ^ 3) - Math.cos(9 * currentY)) / 50
      // const xVelocity = (Math.sin(currentY ^ 3 * time) - Math.cos(9 * currentY)) / 50

      const yVelocity = (Math.cos(currentX ^ 3) - Math.sin(9 * currentX)) / 50

      point.position.x += xVelocity
      point.position.y += yVelocity
    })
  }
}
