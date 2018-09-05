import Effect from './effect'

export default class RGBShift extends Effect {
  constructor () {
    super()
    const effect = new THREE.ShaderPass(THREE.RGBShiftShader)

    effect.uniforms['amount'].value = 0.01 // 0.0015, 0.4,

    this.effect = effect
  }

  update (params) {
    this.effect.uniforms.amount.value = params[3].val / 100
    this.effect.uniforms.angle.value = params[4].val / 50
  }
}
