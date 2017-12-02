import {
  Group,
  Geometry,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  Line,
  LineBasicMaterial,
  Color
} from 'three'
import bind from '@dlmanning/bind'

export default class LineGeometry extends Group {
  constructor () {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize()
  }

  initialize () {
    const geometry = new Geometry()

    const particleGeo = new SphereGeometry(0.25, 32, 32)
    const particleMaterial = new MeshBasicMaterial({color: 'black'})

    for (let i = 0; i < 250; i++) {
      const particle = new Mesh(particleGeo, particleMaterial)

      particle.position.x = Math.random() * 2 - 1
      particle.position.y = Math.random() * 2 - 1
      particle.position.z = Math.random() * 2 - 1
      particle.position.normalize()
      particle.position.multiplyScalar(Math.random() * 60 + 10)
      this.add(particle)

      geometry.vertices.push(particle.position)
    }

    // lines
    const line = new Line(geometry, new LineBasicMaterial(
      { color: 'black', opacity: 0.5 }
    ))
    this.add(line)
  }

  update (props) {
    const {
      opacity,
      fuckFactor,
      specialEffect
    } = props

    this.rotation.x += 0.0001
    this.rotation.y += 0.0001

    if (specialEffect) {
      this.children.forEach(child => {
        child.material.color = new Color('white')
      })
    } else {
      this.children.forEach(child => {
        child.material.color = new Color('black')
      })
    }

    this.children.forEach(child => {
      child.material.opacity = opacity
      child.material.transparent = true
    })

    // this.rotation.x = Math.random() / 10
    // this.rotation.y = Math.random() / 10
  }
}
