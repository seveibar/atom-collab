{View} = require 'atom'

module.exports =
class AtomCollabView extends View
  @content: ->
    @div class: 'atom-collab overlay from-top', =>
      @div "The AtomCollab package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "atom-collab:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "AtomCollabView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
