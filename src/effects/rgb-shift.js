export default class RGBShift {
  constructor () {
    const effect = new THREE.ShaderPass(THREE.RGBShiftShader)

    effect.uniforms['amount'].value = 0.015 // 0.0015, 0.4,
    effect.renderToScreen = true

    this.effect = effect
  }
}
