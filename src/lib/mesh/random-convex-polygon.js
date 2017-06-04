import { Mesh, MeshBasicMaterial } from 'three'
import { ConvexBufferGeometry } from '../geometries'

export default class RandomConvexPolygon extends Mesh {
  constructor (props = {}) {
    const {
      // maxHeight = 10,
      // maxWidth = 10,
      // maxDepth = 10,
      opacity = 1,
      color = 'white',
      wireframe = true
    } = props

    let points = []

    for (let i = 0; i < 50; i++) {
      const point = []

      for (let i = 0; i < 3; i++) {
        const pos = Math.random() * 30
        const mult = Math.random() > 0.5 ? 1 : -1
        point.push(pos * mult)
      }

      points.push(point)
    }

    const geometry = new ConvexBufferGeometry(points)

    const material = new MeshBasicMaterial({
      color,
      wireframe,
      opacity
    })

    material.opacity = 0.55

    super(geometry, material)
  }
}
