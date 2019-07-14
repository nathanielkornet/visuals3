import Effect from './effect'

export default class Mirror extends Effect {
  constructor (side = 1) {
    super()
    const effect = new THREE.ShaderPass(THREE.MirrorShader)

    // (0 = left, 1 = right, 2 = top, 3 = bottom)
    effect.uniforms.side.value = side

    this.effect = effect
  }

  update (params) {

  }
}
