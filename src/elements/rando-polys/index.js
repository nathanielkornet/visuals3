import { Group } from 'three'
import { RandomConvexPolygon } from '../../lib/mesh'
import { getRandomGrayscaleHexColor } from '../../lib/helpers'
import bind from '@dlmanning/bind'

export default class RandoPolys extends Group {
  constructor () {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize()
  }

  initialize () {
    for (let i = 0; i < 200; i++) {
      const randoPoly = new RandomConvexPolygon({
        color: getRandomGrayscaleHexColor(),
        maxHeight: 5 * Math.random() + 2,
        maxWidth: 5 * Math.random() + 2,
        maxDepth: 5 * Math.random() + 2,
        rotationX: 0.005 * Math.random(),
        rotationY: 0.005 * Math.random(),
        rotationZ: 0.005 * Math.random()
      })

      randoPoly.position.x = Math.random() * 2 - 1
      randoPoly.position.y = Math.random() * 2 - 1
      randoPoly.position.z = Math.random() * 2 - 1
      randoPoly.position.normalize()
      randoPoly.position.multiplyScalar(Math.random() * 60 + 10)
      this.add(randoPoly)
    }
  }

  update (props) {
    const {
      time,
      spread,
      fuckFactor,
      opacity,
      specialEffect
    } = props

    this.rotation.y += 0.0001
    this.rotation.x += 0.0001
    this.rotation.y += 0.0001

    this.children.forEach((poly, i) => {
      // const theta = (0.002 * time) + (i / (this.children.length - 1)) * 2 * Math.PI * fuckFactor
      // const chi = (0.002 * time) + (i / (this.children.length - 1)) * Math.PI * fuckFactor

      // poly.position.x = spread * Math.cos(theta) * Math.sin(chi)
      // poly.position.y = spread * Math.sin(theta) * Math.sin(chi)
      // poly.position.z = spread * Math.cos(chi)
      poly.applyRotation()

      poly.material.opacity = opacity
      poly.material.transparent = true
    })
  }
}
