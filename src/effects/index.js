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

    // setup dummy placeholder effect
    // this essentially does nothing
    this.dummyEffect = new RGBShift().effect
    this.dummyEffect.uniforms.amount.value = 0
    this.dummyEffect.id = 'dummy'

    const composer = new THREE.EffectComposer(renderer)
    composer.addPass(new THREE.RenderPass(scene, camera))

    this.composer = composer

    this.addEffect.bind(this)
    this.render.bind(this)

    // TODO: bind each effect to (this)
    this.dotify = new Dotify().effect
    this.rgb = new RGBShift().effect
    this.afterImage = new AfterImage().effect
    this.edgey = new Edgey().effect
    this.kaleido = new Kaleido().effect
    this.mirror = new Mirror(1).effect
    this.mirror2 = new Mirror(2).effect
    this.refractor = new Refractor(scene)

    this.dotify.id = 'dotify'
    this.rgb.id = 'rgb'
    this.afterImage.id = 'after'
    this.edgey.id = 'edge'
    this.kaleido.id = 'kscope'
    this.mirror.id = 'mirror'
    this.mirror2.id = 'mirror2'

    this.effects = [
      this.afterImage,
      this.dotify,
      this.edgey,
      this.kaleido,
      this.rgb,
      this.mirror,
      this.mirror2
    ]

    // // this works
    // this.effects = [
    //   this.afterImage,
    //   this.dotify,
    //   this.edgey,
    //   this.kaleido,
    //   this.rgb,
    //   this.mirror,
    //   this.mirror2
    // ]

    this.effects.forEach(effect => {
      this.composer.addPass(this.dummyEffect)
    })

    console.log('effect composer', this.composer)

    // pick last effect in chain to render to screen
    // this.composer.passes[this.composer.passes.length - 1].renderToScreen = true

    if (midi != null) {
      this.initializeMidiBindings(midi)
    }
  }

  initializeMidiBindings (midi) {
    const passes = this.composer.passes
    this.effects.forEach((effect, idx) => {
      midi.bind(`2-S${idx + 1}`, val => {
        if (val === 0) {
          this.composer.setPass(this.dummyEffect, idx + 1)
        } else {
          this.composer.setPass(effect, idx + 1)
          console.log(`set ${effect.id} to ${idx + 1}`)
          effect.renderToScreen = true
        }

        let lastActive = 0
        passes.forEach((pass, idx) => {
          pass.renderToScreen = false
          if (pass.id !== 'dummy') {
            lastActive = idx
          }
        })
        passes[lastActive].renderToScreen = true
      })
    })

    // TODO: knobs and pads

    // speedA
    midi.bind('2-K1', val => {
      this.state.speedA = val / 127
    })

    // speedB
    midi.bind('2-K2', val => {
      this.state.speedB = val / 127
    })

    // TODO: faders

    // TODO: buttons
    midi.bind('2-B1', val => {
      console.log(this.composer.passes)
    })
  }

  addEffect (effect) {
    this.composer.addPass(effect)
  }

  render (time) {
    // this.composer.passes[2].uniforms.resolution.value.x = this.state.speedA * 1920
    this.rgb.uniforms.amount.value = this.state.speedB
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
