import {
  Group, Mesh, SphereGeometry, Vector3, Geometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomHexColor } from '../../lib/helpers'

export default class Debris extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)

    this.specialActive = false
    this.allNormal = true
  }

  initialize (props) {
    this.debris = []
    this.small = []
    this.smallGroup = new Group()
    const geometry = new THREE.SphereBufferGeometry(1, 4, 4)
    const material = new THREE.MeshNormalMaterial({ color: 0xffffff, flatShading: true })
    // MeshPhong
    for (let i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geometry, material)

      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
      mesh.position.multiplyScalar(Math.random() * 40)
      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      const scale = Math.random() * 10
      mesh.scale.x = mesh.scale.y = scale < 0.0001 ? 1 : scale
      mesh.scale.z = scale

      mesh.growSpeed = {
        x: Math.random() * 2 * (Math.random() > 0.1 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1),
        y: Math.random() * 2 * (Math.random() > 0.1 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1),
        z: Math.random() * 2 * (Math.random() > 0.1 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1) / 3
      }

      mesh.myRotation = {
        x: (Math.random() * 0.0005) * (Math.random() > 0.3 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1),
        y: (Math.random() * 0.0005) * (Math.random() > 0.3 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1),
        z: (Math.random() * 0.0005) * (Math.random() > 0.3 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1)
      }

      this.add(mesh)
      this.debris.push(mesh)
    }

    for (let i = 0; i < 4000; i++) {
      const mesh = new THREE.Mesh(geometry, material)

      mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.5

      mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
      mesh.position.multiplyScalar(Math.random() * 70)

      mesh.myRotation = {
        x: (Math.random() * 0.005) * (Math.random() > 0.8 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1),
        y: (Math.random() * 0.005) * (Math.random() > 0.8 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1),
        z: (Math.random() * 0.005) * (Math.random() > 0.8 ? 0 : 1) * (Math.random() > Math.random() ? -1 : 1)
      }

      this.small.push(mesh)
      this.smallGroup.add(mesh)

      this.smallGroup.rotation.z -= 0.01

      mesh.origY = Number(mesh.position.y)
    }
    this.add(this.smallGroup)

  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor,
      c,
      d
    } = props

    this.rotation.y += 0.0001

    const globalGrowSpeed = c - 1
    const rotApply = d * 10

    this.debris.forEach((thing, idx) => {
      thing.material.opacity = props.opacity
      thing.material.transparent = true

      if (true){//props.specialEffect) {
        thing.scale.x += Math.sin(props.time / (400 * idx) + idx) / 40 * thing.growSpeed.x * globalGrowSpeed
        thing.scale.y += Math.sin(props.time / (400 * idx) + idx) / 40 * thing.growSpeed.y * globalGrowSpeed
        thing.scale.z += Math.sin(props.time / (400 * idx) + idx) / 40 * thing.growSpeed.z * globalGrowSpeed

        thing.rotation.x += thing.myRotation.x * rotApply
        thing.rotation.y += thing.myRotation.y * rotApply
        thing.rotation.z += thing.myRotation.z * rotApply
      }
    })

    if (props.specialEffect) {
      this.smallGroup.rotation.z += 0.0005
    }

    this.small.forEach((smallThing, idx) => {
      smallThing.rotation.x += smallThing.myRotation.x
      smallThing.rotation.y += smallThing.myRotation.y
      smallThing.rotation.z += smallThing.myRotation.z

      smallThing.scale.x += 0.005 * Math.sin(props.time)
      smallThing.scale.y += 0.005 * Math.sin(props.time)
      smallThing.scale.z += 0.005 * Math.sin(props.time)

      smallThing.position.y = (smallThing.origY) * (spread / 200 + 1)

      // const spot = i * 2 * Math.PI / this.small.length
      //
      // smallThing.position.x = 20 * Math.sin(props.time * 0.01 + spot)
      // smallThing.position.z = 20 * Math.cos(props.time * 0.01 + spot)

      // const theta = (0.0001 * time) + (i / (this.children.length - 1)) * 2 * Math.PI * fuckFactor
      // const chi = (0.0001 * time) + (i / (this.children.length - 1)) * Math.PI * fuckFactor
      //
      // smallThing.position.x = spread * Math.cos(theta) * Math.sin(chi)
      // smallThing.position.y = spread * Math.sin(theta) * Math.sin(chi)
      // smallThing.position.z = spread * Math.cos(chi)
      //
      // smallThing.material.opacity = opacity
      // smallThing.material.transparent = true



    })
  }
}
