import Effect from './effect'

export default class Edgey extends Effect {
  constructor () {
    super()
    const effect = new THREE.ShaderPass(THREE.SobelOperatorShader)

    // TODO: messing with these is funnnnnnnn
    effect.uniforms.resolution.value.x = 1920
    effect.uniforms.resolution.value.y = 1080

    this.effect = effect
  }

  update (params) {
    const val = params[5].val
    this.effect.uniforms.resolution.value.x = 1920 / val
    this.effect.uniforms.resolution.value.y = 1080 / val
  }
}
