if (customElements.get('command-palette') == null) {
  require('./CommandPalette')
}

if (document.querySelector('command-palette') == null) {
  const el = document.createElement('command-palette')
  const onDestroy = () => {
    document.body.removeChild(el)
    el.removeEventListener('destroy', onDestroy)
  }
  el.addEventListener('destroy', onDestroy)
  document.body.appendChild(el)
  // chrome.runtime.sendMessage('CommandPaletteAdded', message => {
  //   console.log('after added', message)
  // })
}
