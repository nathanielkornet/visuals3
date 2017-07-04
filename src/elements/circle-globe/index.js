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

    const circlez = []

    for (let i = 0; i < numCircles * numCircles; i++) {
      const circle = new Mesh(Geometry, Material)
      circlez.push(circle)
    }

    for (let i = 0; i < numCircles; i++) {
      const chi = (i / numCircles) * Math.PI
      for (let j = 0; j < numCircles; j++) {
        const theta = (j / numCircles) * 2 * Math.PI
        const index = i * numCircles + j
        const circle = circlez[index]

        circle.position.x = 30 * Math.cos(theta) * Math.sin(chi)
        circle.position.y = 30 * Math.sin(theta) * Math.sin(chi)
        circle.position.z = 30 * Math.cos(chi)

        circle.lookAt(new Vector3(0, 0, 0))

        this.add(circle)
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

    this.children.forEach((circle, i) => {
      circle.material.opacity = opacity
      circle.material.transparent = true
    })

    if (specialEffect) {
      this.children.forEach((circle, i) => {
        circle.rotation.y += 0.01
      })
    }
  }
}
