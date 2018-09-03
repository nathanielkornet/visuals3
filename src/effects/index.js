import AfterImage from './afterimage'
import Dotify from './dotify'
import Edgey from './edgey'
import Kaleido from './kaleido'
import Mirror from './mirror'
import Refractor from './refractor'
import RGBShift from './rgb-shift'

export default class Effects {
  constructor (renderer, scene, camera, midi) {
    this.state = {
      speedA: 1,
      speedB: 1
    }

    const composer = new THREE.EffectComposer(renderer)
    composer.addPass(new THREE.RenderPass(scene, camera))

    this.composer = composer

    this.addEffect.bind(this)
    this.render.bind(this)

    // TODO: bind each effect to (this)
    this.dotify = new Dotify().effect

    this.addEffect(this.dotify)
    // this.addEffect(new RGBShift().effect)
    // this.addEffect(new AfterImage().effect) // 1
    // this.addEffect(new Edgey().effect) // 1
    // this.addEffect(new Kaleido().effect)
    // this.addEffect(new Mirror(1).effect)
    // this.addEffect(new Mirror(2).effect)
    //  // 1

    const refractor = new Refractor(scene)

    this.refractor = refractor

    console.log('effect composer', this.composer)

    // pick last effect in chain to render to screen
    this.composer.passes[this.composer.passes.length - 1].renderToScreen = true

    if (midi != null) {
      this.initializeMidiBindings(midi)
    }
  }

  initializeMidiBindings (midi) {
    // speedA
    midi.bind('2-K1', val => {
      this.state.speedA = val / 127
    })

    // speedB
    midi.bind('2-K2', val => {
      this.state.speedB = val / 127
    })
  }

  addEffect (effect) {
    this.composer.addPass(effect)
  }

  render (time) {
    // this.composer.passes[2].uniforms.resolution.value.x = this.state.speedA * 1920
    this.dotify.uniforms.scale.value = this.state.speedA * 4

    this.composer.render()
    this.refractor.render(time)
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
