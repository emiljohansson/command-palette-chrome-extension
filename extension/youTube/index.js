console.log('installed youTube plugin')

const youTube = {
  getTabId: () => new Promise(resolve => {
    chrome.tabs.query({}, tabs => {
      tabs.every(tab => {
        if (tab.url.indexOf('https://www.youtube.com/watch?') > -1) {
          resolve(tab.id)
          return false
        }
        return true
      })
    })
  }),
  async executeScript (file, callback) {
    const tabId = await this.getTabId()
    chrome.tabs.executeScript(tabId, {
      file
    }, () => {
      callback(tabId)
    })
  },
  pause (sendResponse) {
    this.executeScript('youTube/pause.js', () => {
      sendResponse('Video was paused')
    })
  },
  play (sendResponse) {
    this.executeScript('youTube/play.js', () => {
      sendResponse({
        message: 'Video was resumed'
      })
    })
  },
  next (sendResponse) {
    this.executeScript('youTube/next.js', () => {
      sendResponse({
        message: 'Next video was played'
      })
    })
  },
  prev (sendResponse) {
    this.executeScript('youTube/prev.js', () => {
      sendResponse({
        message: 'Previous video was played'
      })
    })
  },
  focusTab (sendResponse) {
    this.executeScript('youTube/noop.js', tabId => {
      chrome.tabs.get(tabId, tab => {
        chrome.windows.update(tab.windowId, {
          focused: true
        }, () => {
          chrome.tabs.highlight({
            tabs: tab.index
          })
        })
      })
      sendResponse({
        message: 'Test video'
      })
    })
  },
  test (sendResponse) {
    this.executeScript('youTube/test.js', tabId => {
      sendResponse({
        message: 'Test video'
      })
    })
  }
}

chrome.runtime.onMessage.addListener(function (args, sender, sendResponse) {
  if (args.plugin !== 'youTube' || youTube[args.command] == null) {
    return
  }
  youTube[args.command](sendResponse)
  return true
})
