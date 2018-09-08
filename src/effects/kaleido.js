import Effect from './effect'

export default class Kaleido extends Effect {
  constructor (midi) {
    super()
    const effect = new THREE.ShaderPass(THREE.KaleidoShader)

    // effect.uniforms['scale'].value = 0.5 // 4, 1, 0.5, 0.1

    // effect.renderToScreen = true
    effect.uniforms.sides.value = 3
    effect.uniforms.angle.value = 0

    this.effect = effect

    // console.log(this.effect.uniforms)

    midi.bind('2-B1', () => {
      this.effect.uniforms.sides.value = 3
    })
    midi.bind('2-B2', () => {
      this.effect.uniforms.sides.value = 6
    })
    midi.bind('2-B3', () => {
      this.effect.uniforms.sides.value = 16
    })
    midi.bind('2-B4', () => {
      this.effect.uniforms.sides.value = 1000
    })



  }

  update (params) {
    // const x = Math.round(params[3].fader / 0.0625)
    const x = params[5].val / 1000

    // this.effect.uniforms.sides.value = x

    this.effect.uniforms.angle.value += (Math.PI / 500 * (params[3].fader - 0.5))
  }
}
