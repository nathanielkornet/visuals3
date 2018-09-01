export default class Dotify {
  constructor () {
    const effect = new THREE.ShaderPass(THREE.DotScreenShader)

    effect.uniforms['scale'].value = 0.5 // 4, 1, 0.5, 0.1

    this.effect = effect
  }
}
