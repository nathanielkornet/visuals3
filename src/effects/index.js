import AfterImage from './afterimage'
import Dotify from './dotify'
import Edgey from './edgey'
import RGBShift from './rgb-shift'

export default class Effects {
  constructor (renderer, scene, camera) {
    const composer = new THREE.EffectComposer(renderer)
    composer.addPass(new THREE.RenderPass(scene, camera))

    this.composer = composer

    this.addEffect.bind(this)
    this.render.bind(this)

    this.addEffect(new Dotify().effect)
    // this.addEffect(new RGBShift().effect)
    // this.addEffect(new AfterImage().effect)
    this.addEffect(new Edgey().effect)

    console.log('effect composer', this.composer)
  }

  addEffect (effect) {
    this.composer.addPass(effect)
  }

  render () {
    this.composer.render()
  }
}

/*
// old way
export default class Effects {
  constructor (renderer, scene, camera) {
    const composer = new THREE.EffectComposer(renderer)
    composer.addPass(new THREE.RenderPass(scene, camera))

    this.composer = composer

    this.addEffect.bind(this)
    this.render.bind(this)
  }

  addEffect (effectType, params, renderToScreen, isShaderPass) {
    // TODO: not everything uses ShaderPass
    const effect = new THREE.ShaderPass(effectType)

    // TODO: this may not always be the best way to init parms
    Object.keys(params).forEach(param => {
      effect.uniforms[param].value = params[param]
    })

    effect.renderToScreen = renderToScreen

    this.composer.addPass(effect)
  }

  render () {
    this.composer.render()
  }
}
*/
