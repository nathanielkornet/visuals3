export default class Dotify {
  constructor () {
    const effect = new THREE.ShaderPass(THREE.DotScreenShader)

    effect.uniforms['scale'].value = 1 // 4, 1

    this.effect = effect
  }
}
