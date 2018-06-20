import Subject from './Subject'

const onTypes = [
  'click',
  'mousedown',
  'mousemove',
  'mouseup',
  'keydown',
  'keyup'
]

const removeListeners = {}
let idCounter = 0

const uniqueId = () => 'base' + ++idCounter

function linkListeners () {
  const listeners = []
  onTypes.forEach(type => {
    const attrSelector = `on-${type}`
    const elements = [...this.shadowRoot.querySelectorAll(`[${attrSelector}]`)]
    if (elements.length < 1) {
      return
    }
    elements.forEach(el => {
      const methodName = el.getAttribute(attrSelector)
      const handler = this[methodName].bind(this)
      el.addEventListener(type, handler)
      listeners.push(() => {
        el.removeEventListener(type, handler)
      })
    })
  })
  removeListeners[this.$id] = listeners
}

function ObserverArray (array, viewSubject) {
  // console.log('ObserverArray', array, viewSubject)
  const subject = Subject()
  subject.subscribe(inserted => {
    // console.log('next', inserted)
    // callHook(vm, vm.beforeUpdate)
    viewSubject.next(inserted)
    // callHook(vm, vm.updated)
  })
  ;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ].forEach(function (method) {
    array[method] = function (...args) {
      const data = {
        arg: args,
        method,
        inserted: []
      }
      // console.log(method)
      switch (method) {
        case 'push':
        case 'unshift':
          data.inserted = args
          break
        case 'splice':
          data.inserted = args.slice(2)
          // console.log('sliced:', args, this[args[0]])
          break
      }
      const result = Array.prototype[method].apply(this, args)
      subject.next(data)
      return result
    }
  })
}

export const html = string => string

export class BaseElement extends HTMLElement {
  static get template () {
    return html``
  }

  static get data () {
    return {}
  }

  constructor () {
    super()
    this.beforeCreate()
    // this.beforeMount()

    const template = document.createElement('template')
    template.innerHTML = this.constructor.template
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.$el = this.shadowRoot

    const id = uniqueId()
    Object.defineProperty(this, '$id', {
      get: function () {
        return id
      }
    })

    linkListeners.call(this)

    this.viewSubject = Subject()

    const data = this.constructor.data
    const propKeys = Object.keys(data)
    propKeys.forEach(propKey => {
      const prop = data[propKey]
      const type = prop.type
      this[propKey] = prop.value()
      if (type === Array) {
        ObserverArray.call(this, this[propKey], this.viewSubject)
      }
      // console.log(this[propKey])
    })
    // console.log(propKeys)

    this.created()
  }

  connectedCallback () {
    this.mounted()
  }

  disconnectedCallback () {
    removeListeners[this.$id].forEach(listener => {
      listener()
    })
    delete removeListeners[this.$id]
    this.destroyed()
  }

  beforeCreate () {}
  created () {}
  beforeMount () {}
  mounted () {}
  beforeUpdate () {}
  updated () {}
  activated () {}
  deactivated () {}
  beforeDestroy () {}
  destroyed () {}
  errorCaptured () {}
}
