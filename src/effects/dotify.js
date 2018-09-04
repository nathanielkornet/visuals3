import Effect from './effect'

export default class Dotify extends Effect {
  constructor () {
    super()
    const effect = new THREE.ShaderPass(THREE.DotScreenShader)

    effect.uniforms['scale'].value = 4 // 4, 1, 0.5, 0.1

    this.effect = effect

    console.log(this.effect.uniforms)
  }

  update (params) {
    this.effect.uniforms.scale.value = params[1].val / 100
    this.effect.uniforms.angle.value = params[2].val / 100
  }
}
