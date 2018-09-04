
export default class Refractor {
  constructor (scene) {
    this.render.bind(this)

    const refractorGeometry = new THREE.BoxBufferGeometry(15, 15, 15) // 15, 15
    // const refractorGeometry = new THREE.PlaneBufferGeometry(15, 15)

    console.log('ref', THREE.Refractor)

    const refractor = new THREE.Refractor(refractorGeometry, {
      color: 0x999999,
      textureWidth: 1024, // fun to mess with, init 1024
      textureHeight: 1024, // fun to mess with, init 1024
      shader: THREE.WaterRefractionShader
    })

    // allows effect to render on inside of sphere
    refractor.material.side = THREE.DoubleSide

    refractor.position.set(0, 0, 80) // 0, 0, 80 w sphere is dope
    scene.add(refractor)
    // load dudv map for distortion effect

    // TODO: load proper path
    const dudvMap = new THREE.TextureLoader().load('waterdudv.jpg')

    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
    refractor.material.uniforms.tDudv.value = dudvMap

    this.refractor = refractor

    this.clock = new THREE.Clock()

    console.log(this.refractor)
  }

  render (camera) {
    this.refractor.material.uniforms.time.value += this.clock.getDelta()

    // set to camera position


    var zCamVec = new THREE.Vector3(0,0,-15);
    var position = camera.localToWorld(zCamVec);

    const { x, y, z } = position
    this.refractor.position.setX(x)
    this.refractor.position.setY(y)
    this.refractor.position.setZ(z)
    //
    this.refractor.lookAt(camera.position);

  }
}
