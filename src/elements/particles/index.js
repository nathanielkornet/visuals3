import {
  Group
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomHexColor } from '../../lib/helpers'

// blank slate!

export default class Particles extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    this.particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 250000
    })

    this.add(this.particleSystem)

    this.options = {
      position: new THREE.Vector3(),
      positionRandomness: 0.3,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.5,
      colorRandomness: 0.2,
      turbulence: 0.5,
      lifetime: 20, // 10
      size: 15,
      sizeRandomness: 5
    }

    this.spawnerOptions = {
      spawnRate: 100,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 1
    }

    this.clock = new THREE.Clock()

    this.tick = 0
  }

  update (props) {
    const { spread } = props

    const spreadAmt = 1 // spread / 1000

    const delta = this.clock.getDelta() * this.spawnerOptions.timeScale

    this.tick += delta

    if (this.tick < 0) this.tick = 0

    if (delta > 0) {
      for (let x = 0; x < this.spawnerOptions.spawnRate; x++) {
        const amt = x // / this.spawnerOptions.spawnRate
        this.options.position.x = Math.sin(this.tick * this.spawnerOptions.horizontalSpeed) * 20 * amt * spreadAmt
        this.options.position.y = Math.cos(this.tick * this.spawnerOptions.verticalSpeed) * 10 * amt * spreadAmt
        this.options.position.z = Math.sin(this.tick * (this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed)) * 5 * amt * spreadAmt

        this.particleSystem.spawnParticle({
          ...this.options,
          color: getRandomHexColor()
        })
      }
    }

    this.particleSystem.update(this.tick)

    this.rotation.y += 0.001
    this.rotation.x += 0.002
  }
}
