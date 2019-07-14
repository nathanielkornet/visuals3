import {
  Group, Mesh, SphereGeometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'

function generateSprite() {
    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function calculatePositionOnCurve( u, p, q, radius ) {

		var cu = Math.cos( u );
		var su = Math.sin( u );
		var quOverP = q / p * u;
		var cs = Math.cos( quOverP );

    const position = {}

		position.x = radius * ( 2 + cs ) * 0.5 * cu;
		position.y = radius * ( 2 + cs ) * su * 0.5;
		position.z = radius * Math.sin( quOverP ) * 0.5;

    return position
	}

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

    this.radius = 40
    this.tube = 28.2
    this.radialSegments = 600
    this.tubularSegments = 12
    this.p = 5
    this.q = 4
    this.heightScale = 4

    const geom = new THREE.TorusKnotGeometry(
      this.radius,
      this.tube,
      Math.round(this.radialSegments),
      Math.round(this.tubularSegments),
      Math.round(this.p),
      Math.round(this.q),
      this.heightScale
    )

    var material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3,
      transparent: true,
      blending: THREE.AdditiveBlending,
      map: generateSprite()
    });

    const system = new THREE.ParticleSystem(geom, material);
    system.geometry.verticesNeedUpdate = true;

    this.add(system)

    console.log(system)

    // // SPLINE
    //
    // var curve = new THREE.SplineCurve(system.geometry.vertices);
    // var points = curve.getPoints( 500 );
    // var geometry = new THREE.BufferGeometry().setFromPoints( points );
    // var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    //
    // // Create the final object to add to the scene
    // var spl = new THREE.Line( geometry, material );
    //
    // this.add(spl)
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

    this.rotation.y += 0.001
    this.rotation.x = Math.sin(time / 1200) / 2
  }
}
