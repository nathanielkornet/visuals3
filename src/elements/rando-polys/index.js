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

    this.materialType = 'basic'
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
        rotationZ: 0.005 * Math.random(),
        wireframe: true
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

    this.rotation.y = 0.0002
    this.rotation.x = 0.0001
    this.rotation.y = 0.0001

    this.children.forEach((poly, i) => {
      poly.applyRotation()

      if (specialEffect && this.materialType === 'basic') {
        poly.switchToNormalMaterial()
        if (i === this.children.length - 1) {
          this.materialType = 'normal'
        }
      } else if (!specialEffect && this.materialType === 'normal') {
        poly.switchToBasicMaterial()
        if (i === this.children.length - 1) {
          this.materialType = 'basic'
        }
      }

      poly.material.opacity = opacity
      poly.material.transparent = true
    })
  }
}
