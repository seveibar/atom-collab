{SelectListView} = require 'atom'

module.exports =
class JoinSessionView extends SelectListView

    joinSession: null

    initialize: (state, joinSession) ->
        super

        @joinSession = joinSession

        @addClass('overlay from-top')
        @setItems(['Loading...'])

    viewForItem: (item) ->
        "<li>#{item.split(",")[1]}<span style='float:right'>#{item.split(",")[0]}</span></li>"

    confirmed: (item) ->
        console.log("Joining session \"#{item}\"")
        @joinSession(parseInt(item.split(",")[0]))
        @cancel()

    open: (descriptionMap)->
        console.log "Join Session View Triggered"
        console.log descriptionMap
        descriptionList = []
        for k,v of descriptionMap
            descriptionList.push k + "," + v
        @setItems descriptionList
        if !@hasParent()
            atom.workspaceView.append(this)
            @focusFilterEditor()
