import Effect from './effect'

export default class BadTV extends Effect {
  constructor () {
    super()
    const effect = new THREE.ShaderPass(THREE.BadTVShader)

    console.log(effect)
    this.originalScale = 1

    this.clock = new THREE.Clock()

    this.effect = effect
  }

  update (params) {
    // this.effect.uniforms['time'].value += this.clock.getDelta()
  }
}
