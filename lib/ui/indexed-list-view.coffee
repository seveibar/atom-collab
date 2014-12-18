{SelectListView} = require 'atom'

module.exports =
class IndexedListView extends SelectListView

    callback: null

    initialize: (callback) ->
        super

        @callback = callback

        @addClass('overlay from-top')
        @setItems(['Loading...'])

    viewForItem: (item) ->
        "<li>#{item.split(",")[1]}<span style='float:right'>#{item.split(",")[0]}</span></li>"

    confirmed: (item) ->
        @callback(parseInt(item.split(",")[0]))
        @cancel()

    setCallback: (callback) ->
        @callback = callback;

    open: (data)->
        descriptionList = []
        for k,v of data.indexMap
            descriptionList.push k + "," + (v || "_")
        @setItems descriptionList
        if !@hasParent()
            atom.workspaceView.append(this)
            @focusFilterEditor()
