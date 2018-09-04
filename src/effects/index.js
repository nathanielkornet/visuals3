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
    this.state.params = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => {
      return {
        val: 1,
        speed: 0,
        apply: 0,
        fader: 0
      }
    })

    // to be passed to refreactor later
    this.camera = camera

    const composer = new THREE.EffectComposer(renderer)

    this.renderPass = new THREE.RenderPass(scene, camera)
    composer.addPass(this.renderPass)

    this.composer = composer

    this.dotify = new Dotify()
    this.rgb = new RGBShift()
    this.afterImage = new AfterImage()
    this.edgey = new Edgey()
    this.kaleido = new Kaleido()
    this.mirror = new Mirror(1)
    this.mirror2 = new Mirror(2)
    this.refractor = new Refractor(scene, midi)

    this.effects = [
      this.mirror,
      this.mirror2,
      this.kaleido,
      this.afterImage,
      this.dotify,
      this.edgey,
      this.rgb
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

        this.populateComposer()
      })
    })

    // set knob and pad controls
    this.state.params.forEach((param, idx) => {
      if (idx === 0) {
        // 0th param is just a placeholder.
        return
      }
      const num = idx

      // params 5-8 will translate to 9-12
      const padBank = num > 4 ? 'A' : 'B'

      // knob
      midi.bind(`2-K${num}`, val => {
        this.state.params[idx].speed = val / 127
      })
      // fader
      midi.bind(`2-F${num}`, val => {
        this.state.params[idx].fader = val / 127
      })
      // dec pad
      midi.bind(`2-P${padBank}${num < 5 ? num : num - 4}`, val => {
        this.state.params[idx].apply = val > 0 ? -1 : 0
      })
      // inc pad
      midi.bind(`2-P${padBank}${num < 5 ? num + 4 : num}`, val => {
        this.state.params[idx].apply = val > 0 ? 1 : 0
      })
    })

    // TODO: buttons
    midi.bind('2-B1', val => {
      console.log('composer', this.composer.passes)
      console.log('params', this.state.params)
    })
  }

  effectOn (idx) {
    this.state.effectOn[idx] = true
  }

  effectOff (idx) {
    this.state.effectOn[idx] = false
  }

  populateComposer () {
    this.effects.forEach(effect => {
      effect.setRenderToScreen(false)
    })

    // re-initialize composer
    this.composer.passes = [this.renderPass]

    this.state.effectOn.forEach((effectOn, idx) => {
      // add enabled effects to the composer
      if (effectOn) {
        this.composer.passes.push(this.effects[idx].effect)
      }
    })

    // set last effect in chain to render to screen
    if (this.composer.passes.length > 1) {
      this.composer.passes[this.composer.passes.length - 1].renderToScreen = true
    }
  }

  render (time) {
    const { params } = this.state
    // update params
    params.forEach(param => {
      if (param.apply !== 0) {
        param.val += param.speed * param.apply
      }
    })

    // apply params to effects (maybe move to each file)
    this.effects.forEach(effect => effect.update(params))
    this.refractor.update(params)

    // render
    this.composer.render()
    this.refractor.render(this.camera)
  }
}
