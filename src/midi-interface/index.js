// key hierarchy: channel, control type, number
const emptyBindings = {
  1: {
    K: {}, // knobs
    F: {}, // faders
    S: {}, // sliders
    B: {}, // buttons
    P: { // pads
      A: {},
      B: {}
    }
  },
  2: {
    K: {}, // knobs
    F: {}, // faders
    S: {}, // sliders
    B: {}, // buttons
    P: { // pads
      A: {},
      B: {}
    }
  }
}

// need to use module.exports so that the module can be
// conditionally required
module.exports = class MidiInterface {
  constructor () {
    const webmidi = require('webmidi')
    webmidi.enable(err => {
      if (err) console.error(err)

      if (webmidi.inputs.length === 0) {
        console.warn('No midi controller detected')
      } else {
        if (webmidi.inputs.length > 1) {
          console.warn('Multiple midi inputs detected. You may want to log webmidi.inputs to be sure the right input is being used.')
        }

        // const input = webmidi.inputs[0]

        webmidi.inputs.forEach(input => {
          input.addListener('controlchange', 'all', ev => {
            this.parseMessage(ev.data)
          })
          input.addListener('noteon', 'all', ev => {
            this.parseMessage(ev.data)
          })
          input.addListener('noteoff', 'all', ev => {
            this.parseMessage(ev.data)
          })
        })
      }
    })

    // store of onChange handlers
    this.bindings = emptyBindings
  }

  parseMessage (message) {
    console.log(message)

    const status = message[0]
    const note = message[1] // TODO: temp hack to "let" channel append to end of note
    const val = message[2]

    let bindingAction = () => null

    // CC
    if (status === 176 || status === 177) {
      const pct = Math.round((val / 127) * 100)

      const channel = status === 176 ? 1 : 2

      if (note < 10) {
        // knob
        console.log(`CH${channel}: turning K${note}, ${pct}%`)
        bindingAction = this.bindings[channel]['K'][note]
      } else if (note < 20) {
        // fader
        const noteTrans = note % 10
        console.log(`CH${channel}: sliding F${noteTrans}, ${pct}%`)
        bindingAction = this.bindings[channel]['F'][noteTrans]
      } else if (note < 30) {
        // switch
        const noteTrans = note % 20
        console.log(`CH${channel}: toggled S${noteTrans} ${val === 0 ? 'off' : 'on'}`)
        bindingAction = this.bindings[channel]['S'][noteTrans]
      } else if (note > 110 && note < 120) {
        // transport button
        // mapped to CC 115 - 119 on the mpd32, couldn't change them
        const noteTrans = note % 110 - 4
        console.log(`CH${channel}: pressed B${noteTrans}`)
        bindingAction = this.bindings[channel]['B'][noteTrans]
      } else {
        console.log('unrecognized input')
      }
    }

    // keyboard note on
    if (status === 144) {
      console.log(`note ${note} on, velocity: ${val}`)
    }

    // keyboard note off
    if (status === 128) {
      console.log(`note ${note} off`)
    }

    // pad hit
    if (status === 145 || status === 129) {
      // TODO: deal with channel for pads?
      const bank = note < 9 ? 'A' : 'B'
      const pad = note < 9 ? note : (note - 8)
      const action = status === 145 ? 'on' : 'off'

      console.log(`pad ${bank}${pad} ${action}, velocity: ${val}`)

      bindingAction = this.bindings['P'][bank][pad]
    }

    // fire action
    if (bindingAction != null) {
      bindingAction(val)
    } else {
      console.warn('binding not found')
    }
  }

  /**
  * control: string representing physical midi control, ex: K7, PA3
  * onChange: handler function for the value to be updated
  */
  bind (controlString, onChange) {
    const split = controlString.split('-')
    console.log(split)
    const channel = split[0]
    const control = split[1]
    const controlType = control.charAt(0)

    if (['K', 'F', 'S', 'B'].includes(controlType)) {
      // knobs, faders, switches, buttons
      // TODO: this assumes the rest of the string represents the number. That may change.
      const number = control.substr(1)
      this.bindings[channel][controlType][number] = onChange
    } else if (controlType === 'P') {
      // pads
      const bank = control.charAt(1)
      const number = control.charAt(2)
      this.bindings[channel]['P'][bank][number] = onChange
    } else {
      console.log(`could not properly bind ${control}`)
    }
  }

  clearBindings () {
    this.bindings = emptyBindings
  }

  logBindings () {
    console.log(this.bindings)
  }
}
