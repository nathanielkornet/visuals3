import {
  Group, Mesh, SphereGeometry, MeshBasicMaterial, MeshNormalMaterial
} from 'three'
import bind from '@dlmanning/bind'

function generateSprite () {
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

    this.radius = 75 // 40
    this.tube = 28.2
    this.radialSegments = 600
    this.tubularSegments = 12
    this.p = 5 // 5 // 13
    this.q = 4// 4 // 11
    this.heightScale = 4

        // create the particle variables
    var particleCount = 17800, // 1800
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
          color: 0xffffff,
          size: 3,
          transparent: true,
          blending: THREE.AdditiveBlending,
          map: generateSprite()
        });

    // now create the individual particles
    for (var i = 0; i < particleCount; i++) {

      var u = i / Math.PI * 2;

      // create a particle with random
      // position values, -250 -> 250
      const { x, y, z } = calculatePositionOnCurve(u, this.p, this.q, this.radius)
      const particle = new THREE.Vector3(x,y,z);

      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    var particleSystem = new THREE.Points(
        particles,
        pMaterial);

    // add it to the scene
    this.add(particleSystem);

    this.particles = particles
    this.particleSystem = particleSystem
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

    this.rotation.y -= 0.001
    // this.rotation.x = Math.sin(time / 1200) / 2

    this.particles.vertices.forEach((v, i) => {
      var u = i / Math.PI * 2 + time / 500
      const { x, y, z } = calculatePositionOnCurve(u, this.p, this.q, this.radius)
      v.x = x
      v.y = y
      v.z = z + Math.sin(time / 5000 + i) * (this.radius / 5)
    })

    this.particleSystem.geometry.verticesNeedUpdate = true;
  }
}
