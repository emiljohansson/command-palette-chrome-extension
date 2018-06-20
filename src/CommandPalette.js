import jQuery from 'jquery'
import { queryActions, queryStrings } from './plugins'
import { BaseElement, html } from './BaseElement'
import './CommandPaletteField'
import './DomRepeat'

class CommandPalette extends BaseElement {
  static get template () {
    return html`
      <style>
      * {
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
      }

      :host {
        position: fixed;
        top: 1rem;
        left: 0;
        width: 100%;
        z-index: 9999;
      }

      article {
        margin: 0 auto;
        width: 500px;
      }

      .list {
        background-color: white;
        display: none;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .active .list {
        display: block;
      }

      .item {
        border-bottom: 1px solid #333;
        padding: 8px 16px;
      }

      .item.focus {
        background-color: #1e272e;
        color: white;
      }

      command-palette-field {
        position: relative;
        top: -100px;
        transition: top 400ms ease-out;
      }

      .active command-palette-field {
        top: 0px;
      }
      </style>
      <article on-click="onClick">
        <command-palette-field></command-palette-field>
        <dom-repeat class="list" items="items">
          <template id="repeat">
            <div class="item"></div>
          </template>
        </dom-repeat>
      </article>
    `
  }

  static get data () {
    return {
      items: {
        type: Array,
        value () {
          return []
        }
      }
    }
  }

  created () {
    const itemTemplate = this.$el.querySelector('#repeat')
    const parentEl = itemTemplate.parentElement
    this.viewSubject.subscribe(data => {
      let index
      if (data.inserted.length > 0) {
        index = 0
        if (data.method === 'splice') {
          // TODO move around elements
          // TODO remove elements
          return
        } else if (data.method === 'push') {
          index = this.items.length - 1
        }
        const newChild = itemTemplate.content.cloneNode(true)
        newChild.firstElementChild.innerText = this.items[index]
        parentEl.appendChild(newChild)
        return
      }
      const children = [...parentEl.children].slice(1)
      const oldChild = children[data.arg[0]]
      parentEl.removeChild(oldChild)
    })
  }

  mounted () {
    const el = this.$el.querySelector('article')
    const $el = jQuery(el)
    const field = el.querySelector('command-palette-field')
    const list = el.querySelector('.list')
    let focusedIndex = 0
    let prevValue = ''

    setTimeout(() => {
      el.classList.add('active')
    })

    const destroy = () => {
      el.classList.remove('active')
      list.style.display = ''
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent('destroy', {
          bubbles: true
        }))
      }, 500)
    }

    const updateList = value => {
      const words = value.split(' ').filter(word => word.length)
      const newList = queryStrings.filter(query =>
        words.filter(word =>
          query.toLowerCase().indexOf(word) > -1
        ).length === words.length
      )
      let index = this.items.length
      while (--index >= 0) {
        if (newList.indexOf(this.items[index]) < 0) {
          this.items.splice(index, 1)
        }
      }
      newList.forEach(query => {
        if (this.items.indexOf(query) < 0) {
          this.items.push(query)
        }
      })
    }

    const onValueChange = event => {
      const hasValue = event.detail.value.length > 0
      list.style.display = hasValue
        ? 'block'
        : 'none'
      if (event.detail.value !== prevValue) {
        if (hasValue) {
          if (this.items.length > 0) {
            list.children[focusedIndex + 1].classList.remove('focus')
          }
          updateList(event.detail.value.toLowerCase())
          focusedIndex = 0
          if (this.items.length > 0) {
            list.children[focusedIndex + 1].classList.add('focus')
          }
        }
      }
      prevValue = event.detail.value
      if (event.detail.key === 'Escape') {
        destroy()
        return
      }
      if (this.items.length < 1) {
        return
      }
      if (event.detail.key === 'Enter') {
        const doDestroy = queryActions[this.items[focusedIndex]].action($el)
        if (doDestroy !== false) {
          destroy()
        }
        return
      }
      if (event.detail.key === 'ArrowDown') {
        list.children[focusedIndex + 1].classList.remove('focus')
        focusedIndex++
        if (focusedIndex >= this.items.length) {
          focusedIndex = 0
        }
        list.children[focusedIndex + 1].classList.add('focus')
        return
      }
      if (event.detail.key === 'ArrowUp') {
        list.children[focusedIndex + 1].classList.remove('focus')
        focusedIndex--
        if (focusedIndex < 0) {
          focusedIndex = this.items.length - 1
        }
        list.children[focusedIndex + 1].classList.add('focus')
      }
    }

    field.addEventListener('valueChange', onValueChange)
  }

  destroyed () {}

  onClick () {}

  repeatList () {
  }
}

customElements.define('command-palette', CommandPalette)
