import {
  Group, Mesh, SphereGeometry, MeshBasicMaterial, MeshNormalMaterial
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

    this.points = []

    const pGeometry = new SphereGeometry(0.4) // 0.2

    // const Material = color != null
    //   ? new MeshBasicMaterial({color})
    //   : new MeshNormalMaterial()

      // OR 400 and /2
      // OR 200 and no divide
    for (let i = 0; i < 200; i += 2) {
      for (let j = 0; j < 200; j += 2) {
        const Material = color
          ? new MeshBasicMaterial({color: getRandomHexColor()})
          : new MeshNormalMaterial()

        const point = new Mesh(pGeometry, Material)
        point.position.x = (i) - 100
        point.position.y = (j) - 100

        point.origPos = {
          x: Number(point.position.x),
          y: Number(point.position.y)
        }

        this.points.push(point)
        this.add(point)
      }
    }
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor,
      specialEffect,
      c,
      d
    } = props

    if (this.position.z === 0 && specialEffect) {
      this.position.z = 90
      this.points.forEach(point => {
        point.position.x = point.origPos.x
        point.position.y = point.origPos.y
      })
    } else if (this.position.z === 90 && !specialEffect) {
      this.position.z = 0
      this.points.forEach(point => {
        point.position.x = point.origPos.x
        point.position.y = point.origPos.y
      })
    }

    this.children.forEach((point, i) => {
      point.material.opacity = opacity
      point.material.transparent = true

      const currentX = Number(point.position.x)
      const currentY = Number(point.position.y)

      const xVelocity = (Math.sin(currentY ^ 3) - Math.cos(9 * currentY)) / 50
      // const xVelocity = (Math.sin(currentY ^ 3 * time) - Math.cos(9 * currentY)) / 50

      const yVelocity = (Math.cos(currentX ^ 3) - Math.sin(9 * currentX)) / 50

      point.position.x += xVelocity * (c - 1)
      point.position.y += yVelocity * (c - 1)

      // apply spread
      point.position.z = Math.sin(time / 50000000 * i) * spread

      // apply ffactor
      point.scale.x = fuckFactor
      point.scale.y = fuckFactor
      point.scale.z = fuckFactor
    })
  }
}
