import {
  Group, Mesh, SphereGeometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'

export default class Waves extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    const {
      color = true,
      num = 210
    } = props

    this.points = []

    const pGeometry = new SphereGeometry(0.5, 4, 4) // 0.2

      // OR 400 and /2
      // OR 200 and no divide
    for (let i = 0; i < num; i += 2) {
      for (let j = 0; j < num; j += 2) {
        const Material = color
          ? new MeshBasicMaterial({color: `rgba(${Math.floor(i / num * 255)},125,${Math.floor(j / num * 255)},1)`})
          : new MeshNormalMaterial()

        const point = new Mesh(pGeometry, Material)
        point.position.x = (i) - (num / 2)
        point.position.z = (j) - (num / 2)

        point.origPos = {
          x: Number(point.position.x),
          z: Number(point.position.z)
        }

        this.points.push(point)
        this.add(point)
      }
    }

    // this.rotation.y -= 0.01

    this.position.z += 50
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

    this.rotation.y += 0.001
    this.rotation.x = Math.sin(time / 1200) / 2

    this.children.forEach((point, i) => {
      point.material.opacity = opacity
      point.material.transparent = true

      point.position.y =
      (
        Math.sin(time / 5000) +
        Math.sin(point.position.x / 50 * 1.5 * Math.PI + time / 90) +
        Math.cos(point.position.z / 50 * 1.5 * Math.PI + time / 100) +
        Math.sin(Math.PI + time / 200 + Math.PI * (i / 2100)) +
        Math.sin((point.position.x + 0 * point.position.y) / 50 * Math.PI + time / 300) +
        Math.sin((point.position.y) / 50 * Math.PI + time / 500)
      ) * (c * 4) - 15

      point.position.x = point.origPos.x * spread / 100 + point.origPos.x
      point.position.z = point.origPos.z * spread / 100 + point.origPos.z

      point.scale.x = fuckFactor
      point.scale.y = fuckFactor
      point.scale.z = fuckFactor
    })
  }
}
