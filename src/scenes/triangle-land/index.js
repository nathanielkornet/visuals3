import { Scene, Group } from 'three'
import Triangle from './triangle'
import bind from '@dlmanning/bind'

export default class TriangleLand extends Scene {
  constructor (midi) {
    super()

    this.initializeMidiBindings = bind(this, this.initializeMidiBindings)
    this.initializeScene = bind(this, this.initializeScene)
    this.update = bind(this, this.update)

    // this.initializeMidiBindings(midi)
    this.initializeScene()
  }

  initializeMidiBindings (midi) {
    // controls "spread" of the triangles
    midi.bind('K5', val => { this.state.spread = val })
  }

  initializeScene () {
    const triangleDaddy = new Group()

    const triangles = []
    const triangles2 = []

    // up to 2000
    for (let i = 0; i < 500; i += 1) {
      const triangle = new Triangle()

      if (i < 250) {
        triangles.push(triangle)
      } else {
        triangles2.push(triangle)
      }

      triangleDaddy.add(triangle)
    }

    this.add(triangleDaddy)

    this.triangles = triangles
    this.triangles2 = triangles2
    this.triangleDaddy = triangleDaddy
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor
    } = props

    const {
      triangles,
      triangles2,
      triangleDaddy
    } = this

    triangles.forEach((triangle, idx) => {
      triangle.setPosition('z', spread * Math.sin(time / 50000 * idx + fuckFactor))
      triangle.setPosition('y', spread * 0.1 * Math.sin(time / 20000 * idx + fuckFactor))
      triangle.setPosition('x', spread * 0.1 * Math.cos(time / 20000 * idx + fuckFactor))

      triangle.rotateAll(0.001)
    })

    triangles2.forEach((triangle, idx) => {
      triangle.setPosition('z', spread * Math.sin(time / 50000 * idx + fuckFactor))
      triangle.setPosition('y', spread * 0.1 * Math.sin(time / 20000 * idx + fuckFactor))
      triangle.setPosition('x', spread * 0.1 * Math.cos(time / 20000 * idx + fuckFactor))

      triangle.rotateAll(-0.001)
    })

    // set opacity
    triangleDaddy.children.forEach(child => {
      child.material.opacity = opacity
      child.material.transparent = true
    })
  }
}
