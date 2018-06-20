const plugin = 'youTube'
const name = 'YouTube'

const openQualityMenu = () => new Promise(resolve => {
  const settingsBtn = document.querySelector('.ytp-settings-button')
  settingsBtn.click()
  let menuItems = document.querySelectorAll('.ytp-menuitem')
  menuItems[menuItems.length - 1].click()
  setTimeout(() => {
    resolve(document.querySelectorAll('.ytp-menuitem'))
  }, 1000)
})

const focusVideoElement = () => {
  document.querySelector('video').focus()
}

const commandAction = command => {
  chrome.runtime.sendMessage({
    plugin,
    command
  }, response => {
    console.log(response)
  })
}

export default {
  name,
  actions: [{
    name: 'Quality Low',
    async action () {
      const menuItems = await openQualityMenu()
      menuItems[menuItems.length - 2].click()
      focusVideoElement()
    }
  }, {
    name: 'Quality High',
    async action () {
      const menuItems = await openQualityMenu()
      menuItems[0].click()
      focusVideoElement()
    }
  }, {
    name: 'Focus Video',
    action () {
      focusVideoElement()
    }
  }, {
    name: 'Pause',
    action () {
      commandAction('pause')
    }
  }, {
    name: 'Play',
    action () {
      commandAction('play')
    }
  }, {
    name: 'Next',
    action () {
      commandAction('next')
    }
  }, {
    name: 'Previous',
    action () {
      commandAction('prev')
    }
  }, {
    name: 'Focus Tab',
    action () {
      commandAction('focusTab')
    }
  }, {
    name: 'Test',
    action () {
      commandAction('test')
    }
  }]
}
