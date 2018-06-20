import { BaseElement, html } from './BaseElement'

class CommandPaletteField extends BaseElement {
  static get template () {
    return html`
      <style>
        input {
          border: none;
          box-shadow: #333 0px 0px 16px 0px;
          box-sizing: border-box;
          color: #333;
          font-size: 1rem;
          height: 34px;
          width: 100%;
          line-height: 34px;
          margin: 0;
          outline: none;
          overflow: hidden;
          padding: 6px 16px;
        }
      </style>
      <input
        id="field"
        on-keyup="onKeyUp"
        on-keydown="onKeyDown"
      />
    `
  }

  mounted () {
    const field = this.$el.getElementById('field')
    field.focus()
  }

  destroyed () {}

  onKeyUp (event) {
    const value = event.currentTarget.value
    this.dispatchEvent(new CustomEvent('valueChange', {
      bubbles: true,
      detail: {
        value,
        key: event.key
      }
    }))
    event.preventDefault()
  }

  onKeyDown (event) {
    event.stopPropagation()
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
    }
  }
}

customElements.define('command-palette-field', CommandPaletteField, {
  extends: 'input'
})
