import {
  Group, CircleGeometry, MeshNormalMaterial, MeshBasicMaterial, Mesh, Vector3
} from 'three'
import bind from '@dlmanning/bind'

export default class CircleGlobe extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    const {
      numCircles = 15,
      circleRadius = 5,
      circleSegments = 32,
      color
    } = props

    const Geometry = new CircleGeometry(circleRadius, circleSegments, circleSegments)
    const Material = color != null
      ? new MeshBasicMaterial({color, wireframe: true})
      : new MeshNormalMaterial({wireframe: true})

    const spherez = []

    for (let i = 0; i < numCircles * numCircles; i++) {
      const sphere = new Mesh(Geometry, Material)
      spherez.push(sphere)
    }

    for (let i = 0; i < numCircles; i++) {
      const chi = (i / numCircles) * Math.PI
      for (let j = 0; j < numCircles; j++) {
        const theta = (j / numCircles) * 2 * Math.PI
        const index = i * numCircles + j
        const sphere = spherez[index]

        sphere.position.x = 30 * Math.cos(theta) * Math.sin(chi)
        sphere.position.y = 30 * Math.sin(theta) * Math.sin(chi)
        sphere.position.z = 30 * Math.cos(chi)

        sphere.lookAt(new Vector3(0, 0, 0))

        this.add(sphere)
      }
    }
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor,
      specialEffect
    } = props

    const val = 0.001
    this.rotation.y += val

    if (specialEffect) {
      this.children.forEach((sphere, i) => {
        sphere.rotation.y += 0.01
      })
    }
  }
}
