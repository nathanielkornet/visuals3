import { Vector3, Geometry, Line, LineBasicMaterial } from 'three'
import { getRandomHexColor } from '../../lib/helpers'

const xyz = ['x', 'y', 'z']

const geometry = new Geometry()
geometry.vertices.push(new Vector3(-10, 0, 0))
geometry.vertices.push(new Vector3(0, 10, 0))
geometry.vertices.push(new Vector3(10, 0, 0))
geometry.vertices.push(new Vector3(-10, 0, 0))

export default class Triangle extends Line {
  constructor (props) {
    const material = new LineBasicMaterial({
      color: getRandomHexColor()
    })

    super(geometry, material)
  }

  setPosition (direction, val) {
    if (xyz.includes(direction)) {
      this.position[direction] = val
    }
  }

  getPosition (direction) {
    return this.position[direction]
  }

  setRotation (direction, val) {
    if (xyz.includes(direction)) {
      this.rotation[direction] = val
    }
  }

  getRotation (direction) {
    return this.rotation[direction]
  }

  rotateAll (val) {
    this.rotation.x += val
    this.rotation.y += val
    this.rotation.z += val
  }
}
