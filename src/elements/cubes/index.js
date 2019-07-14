import {
  Group,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomGrayscaleHexColor } from '../../lib/helpers'

export default class HeardYouLikeCubes extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)
    this.addBoxes = bind(this, addBoxes)

    this.initialize(props)
  }

  initialize (props) {
    const {
      radius = 50, // 50
      // color = 'blue',
      wireframe = true
    } = props

    const Geometry = new BoxGeometry(2, 2, 2, 2, 2, 2)

    this.boxes = []

    this.addBoxes(1700, wireframe, Geometry, radius)
    this.addBoxes(300, wireframe, Geometry, radius / 2)
    this.addBoxes(1900, wireframe, Geometry, radius * 3)

    // 700 300 900
  }

  update (props) {
    const {
      opacity,
      specialEffect,
      spread,
      time
    } = props


    // const spread = Math.sin(time / 5000)
    const spreadx = Math.sin(time / 4000)
    const spready = Math.sin(time / 4000)
    const spreadz = Math.sin(time / 4000)

    this.rotation.x += (specialEffect ? 0.0025 : 0.0015) * Math.sin(time / 2000)
    this.rotation.y += (specialEffect ? 0.0025 : 0.001) * Math.sin(time / 2000)
    this.rotation.z += (specialEffect ? 0.0025 : 0.0005) * Math.sin(time / 2000)

    this.boxes.forEach((box, idx) => {
      box.rotation.x += box.rotationConsts.x * Math.sin(time / 1000)
      box.rotation.y += box.rotationConsts.y * Math.sin(time / 1000)
      box.rotation.z += box.rotationConsts.z * Math.sin(time / 1000)

      box.material.transparent = true
      box.material.opacity = opacity

      if (idx % 8 === 0) {
        box.position.x = box.originalPosition.x * Math.sin(idx + time / 1000)
        box.position.y = box.originalPosition.y * Math.sin(idx + time / 1000)
        box.position.z = box.originalPosition.z * Math.sin(idx + time / 1000)
      } else {
        box.position.x = box.originalPosition.x * (spreadx)
        box.position.y = box.originalPosition.y * (spready)
        box.position.z = box.originalPosition.z * (spreadz)
      }
    })
  }
}

function addBoxes (count, wireframe, Geometry, radius) {
  for (let i = 0; i < count; i++) {
    const Material = new MeshBasicMaterial({color: getRandomGrayscaleHexColor(), wireframe})
    const box = new Mesh(Geometry, Material)

    box.originalPosition = {}
    box.originalPosition.x = Math.random() * radius - (radius / 2)
    box.originalPosition.y = Math.random() * radius - (radius / 2)
    box.originalPosition.z = Math.random() * radius - (radius / 2)

    box.position.x = box.originalPosition.x
    box.position.y = box.originalPosition.y
    box.position.z = box.originalPosition.z

    box.rotationConsts = {
      x: 0.0075 * Math.random(),
      y: 0.0075 * Math.random(),
      z: 0.0075 * Math.random()
    }

    this.boxes.push(box)
    this.add(box)
  }
}
