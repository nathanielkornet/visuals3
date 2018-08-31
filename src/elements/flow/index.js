import {
  Group, Mesh, SphereGeometry, Vector3, Geometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomHexColor } from '../../lib/helpers'

export default class Flow extends Group {
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

      // OR 400 and /2
      // OR 200 and no divide
    for (let i = 0; i < 300; i += 2) {
      for (let j = 0; j < 300; j += 2) {
        const point = new Mesh(pGeometry, Material)
        point.position.x = (i/1.5) - 100
        point.position.y = (j/1.5) - 100

        this.add(point)
      }
    }
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor
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

      // apply spread
      point.position.z = Math.sin(time / 50000000 * i) * spread

      // apply ffactor
      point.scale.x = fuckFactor
      point.scale.y = fuckFactor
      point.scale.z = fuckFactor
    })
  }
}
