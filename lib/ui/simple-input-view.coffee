{View} = require 'atom'

module.exports =
class SimpleInputView extends View
  @content: ->
    view = this
    @div class: 'atom-collab overlay from-top', =>
        @div "Enter a value", class: "input-label"
        @input value:"", class:"native-key-bindings input-text"
        @div class:"input-buttons", =>
            @button "OK", class:"input-button ok"
            @button "Cancel", class:"input-button cancel"

  initialize: (info, responseCallback) ->
    view = this

    this.find(".input-label").text(info.title)
    this.find(".input-text").val(info.default || "");

    this.on "click", ".ok", (event) ->
        responseCallback view.find(".input-text").val()
        view.detach()

    this.on "keydown", ".input-text", (event) ->
        if event.keyCode == 13
            responseCallback view.find(".input-text").val()
            view.detach()

    this.on "click", ".cancel", (event) ->
        responseCallback null
        view.detach()

    atom.workspaceView.append(this)
    @find(".input-text")[0].focus();

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()
