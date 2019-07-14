import Effect from './effect'

export default class Sn8 extends Effect {
  constructor (renderer) {
    super()
    const effect = new THREE.ShaderPass(THREE.Sn8Shader2)

    effect.uniforms['u_resolution'] = { type: 'v2', value: new THREE.Vector2(renderer.domElement.height, renderer.domElement.width) }

    console.log(effect)
    this.originalScale = 1

    this.clock = new THREE.Clock()

    this.effect = effect
  }

  update (params) {
    this.effect.uniforms['time'].value += this.clock.getDelta()
    this.effect.uniforms.amount.value = 0.7 + params[6].val / 5000
  }
}
