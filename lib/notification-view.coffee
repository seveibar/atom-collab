{View} = require 'atom'

# TODO reduce delay between notifications
module.exports =
class NotificationView extends View

    @content: ->
        view = this
        @div id:"notification", class: 'from-bottom overlay', =>

    initialize: (serializeState, joinServer) ->
        atom.workspaceView.command "atom-collab:notification-test", =>
            @notify "hello world!"

        view = this
        @notificationQueue = []

        @on "click", "#notification", =>
            @detach()

        setInterval =>
            @checkQueue()
        , 2000

    checkQueue: ->
        if @notificationQueue.length > 0

            # Attach view if detached
            if !@hasParent()
                atom.workspaceView.append(this)

            # Get oldest message in queue
            msg = @notificationQueue[0]

            # Remove oldest item from queue
            @notificationQueue = @notificationQueue[1..]

            @stop()
            @css({
                "bottom": "-100px"
            })
            @text msg
            @animate {
                "bottom" : "+=100"
            },500
        else if @hasParent()
            setTimeout =>
                @animate {
                    "bottom":"-=100"
                }, 1000, =>
                    @detach()
            ,1000

    # Returns an object that can be retrieved when package is activated
    serialize: ->

    # Tear down any state and detach
    destroy: ->
      @detach()

    notify: (msg, color="") ->
        @notificationQueue.push(msg)
