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
  }

  initialize (props) {
			var geometry = new THREE.SphereBufferGeometry( 1, 4, 4 );
			var material = new THREE.MeshNormalMaterial( { color: 0xffffff, flatShading: true } );
			for ( var i = 0; i < 100; i ++ ) {
				var mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
				mesh.position.multiplyScalar( Math.random() * 40 );
				mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
				mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 10;
				this.add( mesh );
			}

  }

  update (props) {
    this.rotation.y += 0.001
  }
}
