export default class AfterImage {
  constructor () {
    const effect = new THREE.AfterimagePass()

    // effect.renderToScreen = true
    effect.enabled = true

    this.effect = effect
  }
}
