export default class Kaleido {
  constructor () {
    const effect = new THREE.ShaderPass(THREE.KaleidoShader)

    // effect.uniforms['scale'].value = 0.5 // 4, 1, 0.5, 0.1

    // effect.renderToScreen = true
    effect.uniforms.sides.value = 6
    effect.uniforms.angle.value = Math.PI

    this.effect = effect
  }
}
