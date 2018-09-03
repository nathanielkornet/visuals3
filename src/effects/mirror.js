export default class Mirror {
  constructor (side = 1) {
    const effect = new THREE.ShaderPass(THREE.MirrorShader)

    // (0 = left, 1 = right, 2 = top, 3 = bottom)
    effect.uniforms.side.value = side

    this.effect = effect
  }
}
