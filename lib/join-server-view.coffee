{View} = require 'atom'

module.exports =
class JoinServerView extends View
  @content: ->
    view = this
    @div class: 'atom-collab overlay from-top', =>
        @div "Join Server", class: "input-label"
        @input value:"http://localhost:4444", class:"native-key-bindings input-text server"
        @div class:"input-buttons", =>
            @button "Join", class:"input-button join"
            @button "Cancel", class:"input-button cancel"

  initialize: (serializeState, joinServer) ->
    atom.workspaceView.command "atom-collab:join-server", => @triggered()

    view = this

    this.on "click", ".join", (event) ->
        joinServer view.find(".server").val()
        view.detach()

    this.on "keydown", ".server", (event) ->
        if event.keyCode == 13
            joinServer view.find(".server").val()
            view.detach()

    this.on "click", ".cancel", (event) ->
        view.detach()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  triggered: ->
    console.log "Join Server View Triggered"
    if !@hasParent()
      atom.workspaceView.append(this)
      @find(".server")[0].focus();
