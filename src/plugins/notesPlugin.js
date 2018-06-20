import jQuery from 'jquery'

export default {
  name: 'Notes',
  actions: [{
    name: 'Add note',
    template: `
<div>
  <input />
</div>
`,
    action ($root) {
      console.log(this.template)
      console.log('todo add a field to add a note in')
      const $el = jQuery(this.template)
      const $field = $el.find('input')
      $field.on('keydown', event => {
        console.log(event)
      })
      $root.append($el)

      setTimeout(() => {
        $field.focus()
      }, 500)

      return false
    }
  }]
}
