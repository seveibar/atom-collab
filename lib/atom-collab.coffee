AtomCollabView = require './atom-collab-view'

module.exports =
  atomCollabView: null

  activate: (state) ->
    @atomCollabView = new AtomCollabView(state.atomCollabViewState)

  deactivate: ->
    @atomCollabView.destroy()

  serialize: ->
    atomCollabViewState: @atomCollabView.serialize()
