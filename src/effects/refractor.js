
export default class Refractor {
  constructor (scene, midi) {
    this.render.bind(this)

    // const refractorGeometry = new THREE.PlaneBufferGeometry(15, 15)
    const refractorGeometry = new THREE.BoxBufferGeometry(15, 15, 15) // 15, 15
    // const refractorGeometry = new THREE.SphereBufferGeometry(15, 15)

    const refractor = new THREE.Refractor(refractorGeometry, {
      color: 0x999999,
      textureWidth: 1024, // fun to mess with, init 1024
      textureHeight: 1024, // fun to mess with, init 1024
      shader: THREE.WaterRefractionShader
    })

    // allows effect to render on inside of sphere
    // https://stackoverflow.com/questions/10889583/three-js-plane-visible-only-half-the-time
    refractor.material.side = THREE.DoubleSide

    refractor.position.set(0, 0, 80) // 0, 0, 80 w sphere is dope
    // load dudv map for distortion effect

    // TODO: load proper path
    const dudvMap = new THREE.TextureLoader().load('waterdudv.jpg')

    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
    refractor.material.uniforms.tDudv.value = dudvMap

    refractor.scale.x = 0.0001
    refractor.scale.y = 0.0001
    refractor.scale.z = 0.0001

    this.refractor = refractor

    this.clock = new THREE.Clock()

    // console.log(this.refractor)
    // console.log(this.refractor.material.uniforms)

    this.initializeMidiBindings(midi, scene)
  }

  initializeMidiBindings (midi, scene) {
    midi.bind('2-S8', val => {
      if (val === 0) {
        scene.remove(this.refractor)
      } else {
        scene.add(this.refractor)
      }
    })
  }

  update (params) {
    const scale = (params[8].val / 500)

    if (scale < 1.791968503937008 && scale > 0) {
      this.refractor.scale.x = scale
      this.refractor.scale.y = scale
      this.refractor.scale.z = scale
    }
  }

  render (camera) {
    this.refractor.material.uniforms.time.value += this.clock.getDelta()

    // set to camera position
    // https://stackoverflow.com/questions/27092201/object-always-in-front-of-camera

    const zCamVec = new THREE.Vector3(0, 0, -15)
    const position = camera.localToWorld(zCamVec)

    const { x, y, z } = position
    this.refractor.position.setX(x)
    this.refractor.position.setY(y)
    this.refractor.position.setZ(z)
    this.refractor.lookAt(camera.position)
  }
}
