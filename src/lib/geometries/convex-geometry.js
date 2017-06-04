import QuickHull from 'quickhull3d/dist/QuickHull'
import {
  Geometry,
  BufferGeometry,
  Float32BufferAttribute
} from 'three'

export function ConvexGeometry (points) {
  Geometry.call(this)

  this.type = 'ConvexGeometry'

  this.fromBufferGeometry(new ConvexBufferGeometry(points))
  this.mergeVertices()
}

ConvexGeometry.prototype = Object.create(Geometry.prototype)
ConvexGeometry.prototype.constructor = ConvexGeometry

  // ConvexBufferGeometry

export function ConvexBufferGeometry (points) {
  BufferGeometry.call(this)

  this.type = 'ConvexBufferGeometry'
  // buffers

  const vertices = []
  const normals = []

  // execute QuickHull

  if (QuickHull === undefined) {
    console.error('ConvexBufferGeometry: ConvexBufferGeometry relies on QuickHull')
  }

  const quickHull = new QuickHull(points)
  quickHull.build()

  // generate vertices and normals
  const faces = quickHull.faces

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i]
    let edge = face.edge

    // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)
    do {
      const point = edge.vertex.point

      vertices.push(point[0], point[1], point[2])
      normals.push(face.normal[0], face.normal[1], face.normal[2])

      edge = edge.next
    } while (edge !== face.edge)
  }

  // build geometry
  this.addAttribute('position', new Float32BufferAttribute(vertices, 3))
  this.addAttribute('normal', new Float32BufferAttribute(normals, 3))
}

ConvexBufferGeometry.prototype = Object.create(BufferGeometry.prototype)
ConvexBufferGeometry.prototype.constructor = ConvexBufferGeometry
