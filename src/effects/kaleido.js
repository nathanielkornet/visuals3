import Effect from './effect'

export default class Kaleido extends Effect {
  constructor () {
    super()
    const effect = new THREE.ShaderPass(THREE.KaleidoShader)

    // effect.uniforms['scale'].value = 0.5 // 4, 1, 0.5, 0.1

    // effect.renderToScreen = true
    effect.uniforms.sides.value = 6
    effect.uniforms.angle.value = Math.PI

    this.effect = effect
  }

  update (params) {
    const x = Math.round(params[3].fader / 0.0625)

    this.effect.uniforms.sides.value = x
  }
}
