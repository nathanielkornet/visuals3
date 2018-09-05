import Effect from './effect'

/*
UNIFORMS
- damp: (intensity?) 0.9 - 1.0 is the visible range
- tOld: (texture)
- tNew: (texture)
*/

export default class AfterImage extends Effect {
  constructor () {
    super()
    const effect = new THREE.AfterimagePass()

    effect.enabled = true

    this.effect = effect
  }

  update (params) {
    // const x = (Math.tanh(params[4].fader) / 10) + 0.9238405844

    // lol this function. Values between 0.9 and 1.0 work best for this field.
    // The effect is more "extreme" per step at the upper end of this spectrum. Played
    // around with some math until I found a function that would map well to the fader
    // such that it incremented the value quickly at the bottom and slowly at the top.
    // This produced the "smoothest" application of the effect.
    const x = ((((Math.log10(Math.tanh(params[4].fader)) + 2) / 2) + 0.05913819857) / 10) + 0.9

    this.effect.uniforms.damp.value = x
  }
}
