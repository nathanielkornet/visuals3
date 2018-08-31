import {
  Group
} from 'three'
import bind from '@dlmanning/bind'

// blank slate!

export default class Sandbox extends Group {
  constructor (props = {}) {
    super()

    this.initialize = bind(this, this.initialize)
    this.update = bind(this, this.update)

    this.initialize(props)
  }

  initialize (props) {

  }

  update (props) {

  }
}
