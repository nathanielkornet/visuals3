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
  }

  initialize (props) {
    var geometry = new THREE.TorusKnotBufferGeometry( 20, 5, 256, 32 );
    var material = new THREE.MeshStandardMaterial( { color: 0x6083c2 } );
    var mesh = new THREE.Mesh( geometry, material );
    this.add(mesh)
  }

  update (props) {
    this.rotation.y += 0.001
  }
}
