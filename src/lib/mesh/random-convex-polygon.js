import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial
} from 'three'
import { ConvexBufferGeometry } from '../geometries'

export default class RandomConvexPolygon extends Mesh {
  constructor (props = {}) {
    const {
      maxHeight = 10,
      maxWidth = 10,
      maxDepth = 10,
      rotationX = 0.001,
      rotationY = 0.001,
      rotationZ = 0.001,
      opacity = 1,
      color = 'white',
      wireframe = true,
      maxPoints = 50,
      useNormalMaterial = false
    } = props

    let points = []

    for (let i = 0; i < maxPoints; i++) {
      const point = []

      // x, y, z
      point.push(Math.random() * maxWidth)
      point.push(Math.random() * maxHeight)
      point.push(Math.random() * maxDepth)

      points.push(point)
    }

    const geometry = new ConvexBufferGeometry(points)

    const MeshMaterial = useNormalMaterial
      ? MeshNormalMaterial
      : MeshBasicMaterial

    const material = new MeshMaterial({
      color,
      wireframe,
      opacity
    })

    material.opacity = 0.55

    super(geometry, material)

    this.rotationConsts = {
      x: rotationX,
      y: rotationY,
      z: rotationZ
    }
  }

  applyRotation () {
    this.rotation.x += this.rotationConsts.x
    this.rotation.y += this.rotationConsts.y
    this.rotation.z += this.rotationConsts.z
  }
}
