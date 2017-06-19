import Midi from 'midi'

const emptyBindings = {
  // knobs
  K: {},
  // pads
  P: {
    A: {},
    B: {}
  }
}

// need to use module.exports so that the module can be
// conditionally required
module.exports = class MidiInterface {
  constructor () {
    // Set up a new input.
    const input = new Midi.input()

    if (input.getPortCount() > 0) {
      // set to parse message on receipt
      input.on('message', (deltaTime, message) => this.parseMessage(message))

      // open the first available input port
      input.openPort(0)
    }

    // store of onChange handlers
    this.bindings = emptyBindings
  }

  parseMessage (message) {
    console.log(message)

    const status = message[0]
    const note = message[1]
    const val = message[2]

    let bindingAction = () => null

    // knob turned
    if (status === 176) {
      const pct = Math.round((val / 127) * 100)

      console.log(`turning K${note}, ${pct}%`)

      bindingAction = this.bindings['K'][note]
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
  bind (control, onChange) {
    // knobs
    if (control.charAt(0) === 'K') {
      const number = control.substr(1)
      this.bindings['K'][number] = onChange
    }

    // pads
    if (control.charAt(0) === 'P') {
      const bank = control.charAt(1)
      const number = control.charAt(2)
      this.bindings['P'][bank][number] = onChange
    }
  }

  clearBindings () {
    this.bindings = emptyBindings
  }

  logBindings () {
    console.log(this.bindings)
  }
}
