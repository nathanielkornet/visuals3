import Effect from './effect'

export default class Dotify extends Effect {
  constructor () {
    super()
    const effect = new THREE.ShaderPass(THREE.DotScreenShader)

    effect.uniforms['scale'].value = 1 // 4, 1, 0.5, 0.1

    this.originalScale = 1

    this.effect = effect
  }

  update (params) {
    this.effect.uniforms.scale.value = this.originalScale + (params[1].val / 500)
    this.effect.uniforms.angle.value = params[2].val / 500

    this.effect.uniforms.tSize.value.x = params[5].fader * 1024
    this.effect.uniforms.tSize.value.y = params[5].fader * 1024
  }
}
