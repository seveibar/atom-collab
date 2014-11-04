JoinServerView = require './join-server-view'

module.exports =
  atomCollabView: null

  activate: (state) ->
    @joinServerView = new JoinServerView(state.joinServerView)

  deactivate: ->
    @joinServerView.destroy()

  serialize: ->
    joinServerView: @joinServerView.serialize()
