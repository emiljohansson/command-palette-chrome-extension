import jQuery from 'jquery'

export default {
  name: 'Web Dev',
  actions: [{
    name: 'Insert render block',
    template: `<div style="
  position: fixed;
  background: green;
  z-index: 999;
  height: 100px;
  width: 100px;
  left: 100px;
  top: 100px;
"></div>`,
    action () {
      jQuery(document.body).append(this.template)
    }
  }]
}
