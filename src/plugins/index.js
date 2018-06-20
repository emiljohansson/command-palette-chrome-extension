import youtubePlugin from './youtubePlugin'
import notesPlugin from './notesPlugin'
import webdevPlugin from './webdevPlugin'

const plugins = [
  youtubePlugin,
  notesPlugin,
  webdevPlugin
]

export const queryActions = plugins.reduce((queries, plugin) => {
  plugin.actions.forEach(action => {
    const query = `${plugin.name}: ${action.name}`
    queries[query] = action
  })
  return queries
}, {})

export const queryStrings = Object.keys(queryActions)
