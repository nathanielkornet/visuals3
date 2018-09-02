
export default class Refractor {
  constructor (scene) {
    this.render.bind(this)

    // const refractorGeometry = new THREE.PlaneBufferGeometry(15, 15)
    const refractorGeometry = new THREE.SphereBufferGeometry(15, 15) // 15, 15

    const refractor = new THREE.Refractor(refractorGeometry, {
      color: 0x999999,
      textureWidth: 1024, // fun to mess with, init 1024
      textureHeight: 1024, // fun to mess with, init 1024
      shader: THREE.WaterRefractionShader
    })

    refractor.position.set(0, 0, 80) // 0, 0, 80 w sphere is dope
    scene.add(refractor)
    // load dudv map for distortion effect

    // TODO: load proper path
    const dudvMap = new THREE.TextureLoader().load('waterdudv.jpg')

    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
    refractor.material.uniforms.tDudv.value = dudvMap

    this.refractor = refractor

    this.clock = new THREE.Clock();

    console.log(this.refractor)
  }

  render (time) {
    this.refractor.material.uniforms.time.value += this.clock.getDelta();

    // TODO: find a way to position it perfectly in front of or around the camera
  }
}
