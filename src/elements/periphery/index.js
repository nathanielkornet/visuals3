import {
  Group, CircleGeometry, MeshBasicMaterial, Mesh, TextureLoader
} from 'three'
import bind from '@dlmanning/bind'

export default class Eclipse extends Group {
  constructor () {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize()

    this.time = 0

    this.isTbyrd = false
  }

  initialize () {
    const loader = new TextureLoader()

    // sun w/ logo
    // const SunGeometry = new CircleGeometry(19, 32, 32)
    const SunGeometry = new CircleGeometry(25, 64, 64) // 19
    const periphery = loader.load('./periphery.jpg')
    const SunMaterial = new MeshBasicMaterial({ color: '#FFFFE0', map: periphery })
    const sun = new Mesh(SunGeometry, SunMaterial)
    sun.position.set(0, 0, 0) // 0 0 -75
    this.add(sun)
    this.sun = sun

    // moon
    // this.tbyrd = loader.load('./tbyrd.png')

    const MoonGeometry = new CircleGeometry(3.75, 32, 32)
    const MoonMaterial = new MeshBasicMaterial({color: '#232b2b'})
    const moon = new Mesh(MoonGeometry, MoonMaterial)
    // this.add(moon)
    this.moon = moon
  }

  update (props) {
    const { specialEffect, opacity } = props

    if (specialEffect) {
      this.rotation.z -= 0.01
    }

    this.sun.material.opacity = opacity
    this.sun.material.transparent = true

    // if (!this.isTbyrd && specialEffect) {
    //   this.isTbyrd = true
    //   // make it tbyrd
    //   this.moon.material = new MeshBasicMaterial({map: this.tbyrd})
    // } else if (this.isTbyrd && !specialEffect) {
    //   this.isTbyrd = false
    //   // make it regs
    //   this.moon.material = new MeshBasicMaterial({color: '#232b2b'})
    // }
    //
    // this.moon.position.x = 15 * -Math.sin(0.000025 * this.time / 18)
    // this.moon.position.z = 15 * Math.cos(Math.PI + 0.000025 * this.time / 18)
    //
    // this.time += 60
  }
}
