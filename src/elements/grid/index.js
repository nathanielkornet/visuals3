import {
  PointLight,
  PointLightHelper,
  Group,
  GridHelper,
  PolarGridHelper
} from 'three'
import bind from '@dlmanning/bind'

// blank slate!

export default class Sandbox extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {
    const helper = new GridHelper( 2000, 200, 'green', 'green' );
    // const helper = new PolarGridHelper( 200, 200, 128, 128, 'green', 'green' );
    helper.material.opacity = 1;
    helper.position.y = -50
		helper.material.transparent = true;

    this.grid = helper

    this.add(helper)

    var pointLight = new PointLight( 0xff0000, 1, 100 );
    pointLight.position.set( 10, 10, 10 );
    // this.add( pointLight );

    var sphereSize = 1;
    var pointLightHelper = new PointLightHelper( pointLight, sphereSize );
    // this.add( pointLightHelper );
  }

  update (props) {
    this.grid.material.opacity = props.opacity
    this.grid.material.transparent = true

    if (Math.round(this.position.z) === 10) {
      this.position.z = 0
    } else {
      this.position.z += 0.1
    }
  }
}
