import AfterImage from './afterimage'
import Dotify from './dotify'
import Edgey from './edgey'
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

    this.addEffect(new Dotify().effect)
    // this.addEffect(new RGBShift().effect) // 1
    // this.addEffect(new AfterImage().effect) // 1
    this.addEffect(new Edgey().effect) // 1

    const refractor = new Refractor(scene)

    this.refractor = refractor

    console.log('effect composer', this.composer)

    if (midi != null) {
      this.initializeMidiBindings(midi)
    }
  }

  initializeMidiBindings (midi) {
    // speedA
    midi.bind('K3', val => {
      this.state.speedA = val / 127
    })

    // speedB
    midi.bind('K4', val => {
      this.state.speedB = val / 127
    })
  }

  addEffect (effect) {
    console.log(effect)
    this.composer.addPass(effect)
  }

  render (time) {
    this.composer.passes[2].uniforms.resolution.value.x = this.state.speedA * 1920
    this.composer.passes[1].uniforms.scale.value = this.state.speedB * 4

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
