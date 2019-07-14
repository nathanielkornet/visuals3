// base class for effects

export default class Effect {
  constructor () {
    if (!(typeof this.update === 'function')) {
      console.err('Effect must have an update method.')
    }
  }
  setRenderToScreen (val) {
    this.effect.renderToScreen = val
  }
}
