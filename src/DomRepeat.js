import { BaseElement, html } from './BaseElement'

class DomRepeat extends BaseElement {
  static get template () {
    return html`<slot></slot>`
  }

  mounted () {
    console.log('mounted dom repeat')
  }
}

customElements.define('dom-repeat', DomRepeat)
