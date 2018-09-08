import {
  Group, Mesh, SphereGeometry, Vector3, Geometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'
import { getRandomHexColor } from '../../lib/helpers'

export default class Flow extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)

    this.added = false
  }

  initialize (props) {
    var geometry = new THREE.TorusKnotBufferGeometry( 20, 5, 256, 32 );
    var material = new THREE.MeshStandardMaterial( { color: 0x6083c2 } );
    var mesh = new THREE.Mesh( geometry, material );

    this.add(mesh)

    this.noodle = mesh

    this.lils = []
    for (var i = 0; i < 500; i++) {
      var geometry = new THREE.TorusKnotBufferGeometry(
        Math.random() * 1.2,
        Math.random() * 0.4,
        16,
        16,
        Math.round(Math.random() * 5),
        Math.round(Math.random() * 3)
      );
      var material = new THREE.MeshPhongMaterial( {
        color: 0x6083c2,
        wireframe: Math.random() > 0.7
      } );
      var mesh = new THREE.Mesh( geometry, material );

      mesh.position.x = Math.random() * 80 - 40
      mesh.position.y = Math.random() * 80 - 40
      mesh.position.z = Math.random() * 80 - 40

      this.lils.push(mesh)
    }

    // biggies
    for (var i = 0; i < 20; i++) {
      var geometry = new THREE.TorusKnotBufferGeometry(
        Math.random() * 10,
        Math.random() * 5,
        32,
        32,
        Math.round(Math.random() * 5),
        Math.round(Math.random() * 3)
      );
      var material = new THREE.MeshPhongMaterial( {
        color: 0x6083c2,
        wireframe: Math.random() > 0.7
      } );
      var mesh = new THREE.Mesh( geometry, material );

      mesh.position.x = Math.random() * 160 - 80
      mesh.position.y = Math.random() * 160 - 80
      mesh.position.z = Math.random() * 160 - 80

      mesh.position.x += Math.sign(mesh.position.x) * 10
      mesh.position.y += Math.sign(mesh.position.y) * 10
      mesh.position.z += Math.sign(mesh.position.z) * 10

      this.lils.push(mesh)
    }
  }

  update (props) {
    this.rotation.y += 0.001

    this.noodle.material.opacity = props.opacity
    this.noodle.material.transparent = true

    this.lils.forEach((lil, idx) => {
      lil.material.opacity = props.opacity
      lil.material.transparent = true

      lil.position.y += Math.sin(props.time / 200000 * idx) * 0.02
    })

    if (props.specialEffect && !this.added) {
      this.lils.forEach(lil => this.add(lil))
      this.added = true
    } else if (!props.specialEffect && this.added) {
      this.lils.forEach(lil => this.remove(lil))
      this.added = false
    }

  }
}
