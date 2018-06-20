console.log('installed command palette extension')

chrome.commands.onCommand.addListener(function (command) {
  chrome.tabs.getSelected(function (tab) {
    chrome.tabs.executeScript(tab.id, {
      file: 'webcomponents.js'
    }, () => {
      chrome.tabs.executeScript(tab.id, {
        file: 'view.js'
      })
    })
  })
})
