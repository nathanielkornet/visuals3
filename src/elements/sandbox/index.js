import { Group } from 'three'
import bind from '@dlmanning/bind'

export default class Waves extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    const {
      color = true,
      num = 210
    } = props

    let geometry = new THREE.PlaneGeometry( 250, 250, 128, 128 )
    let material = new THREE.ShaderMaterial({
      uniforms: THREE.SimplexVertex.uniforms,
      fragmentShader: THREE.SimplexVertex.fragmentShader,
      vertexShader: THREE.SimplexVertex.vertexShader,
    })

  //   material = new THREE.MeshBasicMaterial( {
  //     color: 0xb7ff00,
  //     wireframe: true
  // } );

    this.material = material

    material.uniforms['u_resolution'] = { type: 'v2',
      value: new THREE.Vector2(20, 20)
    }

    let mesh = new THREE.Mesh(geometry, material)

    this.add(mesh)
    //
    this.add(new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
          color: 0xb7ff00,
          wireframe: true
      } )
    ))

    console.log(mesh)

    this.rotation.x -= 1

    this.clock = new THREE.Clock()
  }

  update (props) {
    const {
      time,
      opacity,
      spread,
      fuckFactor,
      specialEffect,
      c,
      d
    } = props

    this.material.uniforms['time'].value += this.clock.getDelta()
  }
}
