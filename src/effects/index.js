import AfterImage from './afterimage'
import Dotify from './dotify'
import Edgey from './edgey'
import Kaleido from './kaleido'
import Mirror from './mirror'
import Refractor from './refractor'
import RGBShift from './rgb-shift'

export default class Effects {
  constructor (renderer, scene, camera, midi) {
    this.state = {}
    this.state.params = [1, 2, 3, 4, 5, 6, 7, 8].map(() => {
      return {
        val: 1,
        speed: 0,
        apply: 0
      }
    })

    const composer = new THREE.EffectComposer(renderer)

    this.renderPass = new THREE.RenderPass(scene, camera)
    composer.addPass(this.renderPass)

    this.composer = composer

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

    this.state.effectOn = this.effects.map(() => false)
    console.log('effect composer', this.composer)

    if (midi != null) {
      this.initializeMidiBindings(midi)
    }
  }

  initializeMidiBindings (midi) {
    this.effects.forEach((effect, idx) => {
      midi.bind(`2-S${idx + 1}`, val => {
        if (val === 0) {
          this.effectOff(idx)
        } else {
          this.effectOn(idx)
        }

        this.populateEffects()
      })
    })
    //
    // this.state.params.forEach((param, idx) => {
    //   const num = idx + 1
    //
    //   const pad = num > 4 ? 'A' : 'B'
    //   const numModify =
    //
    //   midi.bind(`2-K${num}`, val => {
    //     this.state.spreadSpeed = val / 127
    //   })
    //   // dec spread
    //   midi.bind(`2-P${pad}{num}`, val => {
    //     if (val > 0) {
    //       this.state.spreadSpeedApply = -1
    //     } else {
    //       this.state.spreadSpeedApply = 0
    //     }
    //   })
    //   // inc spread
    //   midi.bind(`2-P${pad}{num + 4}`, val => {
    //     if (val > 0) {
    //       this.state.spreadSpeedApply = 1
    //     } else {
    //       this.state.spreadSpeedApply = 0
    //     }
    //   })
    // })

    // TODO: faders

    // TODO: buttons
    midi.bind('2-B1', val => {
      console.log(this.composer.passes)
    })
  }

  effectOn (idx) {
    this.state.effectOn[idx] = true
  }

  effectOff (idx) {
    this.state.effectOn[idx] = false
  }

  populateEffects () {
    this.effects.forEach(effect => {
      effect.renderToScreen = false
    })
    this.composer.passes = [this.renderPass]
    this.state.effectOn.forEach((effectOn, idx) => {
      if (effectOn) {
        this.composer.passes.push(this.effects[idx])
      }
    })
    // pick last effect in chain to render to screen
    if (this.composer.passes.length > 1) {
      this.composer.passes[this.composer.passes.length - 1].renderToScreen = true
    }
  }

  render (time) {
    // // this.composer.passes[2].uniforms.resolution.value.x = this.state.speedA * 1920
    // this.rgb.uniforms.amount.value = this.state.speedB
    // this.dotify.uniforms.scale.value = this.state.speedA * 4

    this.composer.render()
    this.refractor.render(time)
  }
}
