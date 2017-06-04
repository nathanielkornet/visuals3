import {
  Group
} from 'three'
import { RandomConvexPolygon } from '../../lib/mesh'
import { getRandomGrayscaleHexColor } from '../../lib/helpers'
import bind from '@dlmanning/bind'

export default class RandoPolys extends Group {
  constructor (midi) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize()
  }

  initialize () {
    for (let i = 0; i < 7; i++) {
      const randoPoly = new RandomConvexPolygon({
        color: getRandomGrayscaleHexColor(),
        maxHeight: 20,
        maxWidth: 20,
        maxDepth: 20
      })
      this.add(randoPoly)
    }
  }

  update (props) {
    const {
      time,
      spread,
      fuckFactor
    } = props

    this.rotation.y += 0.001
    this.rotation.x += 0.0001
    this.rotation.y += 0.0001

    this.children.forEach((poly, i) => {
      const theta = (0.002 * time) + (i / (this.children.length - 1)) * 2 * Math.PI * fuckFactor
      const chi = (0.002 * time) + (i / (this.children.length - 1)) * Math.PI * fuckFactor

      poly.position.x = spread * 20 * Math.cos(theta) * Math.sin(chi)
      poly.position.y = spread * 20 * Math.sin(theta) * Math.sin(chi)
      poly.position.z = spread * 20 * Math.cos(chi)
    })
  }
}
