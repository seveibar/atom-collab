JoinServerView = require './join-server-view'
JoinSessionView = require './join-session-view'
NotificationView = require './notification-view'
conn = require("./git-collab/client-server/SocketListener.js");

module.exports =
    joinServerView: null
    joinSessionView: null
    notificationView: null
    connected: false

    activate: (state) ->
        @joinServerView = new JoinServerView(state.joinServerView, (url) => @joinServer(url))
        @joinSessionView = new JoinSessionView(state.joinSessionView, (sid) => @joinSession(sid))
        @notificationView = new NotificationView(state.notificationView);
        atom.workspaceView.command "atom-collab:join-session", => @displaySessions()
        atom.workspaceView.command "atom-collab:sync-filesystem", =>
        atom.workspaceView.command "atom-collab:ghost-session", =>
        atom.workspaceView.command "atom-collab:sync-file", =>
        atom.workspaceView.command "atom-collab:file-done", =>


    joinServer: (url) ->
        console.log("Joining",url);
        console.log @notificationView
        @notificationView.notify "Joining URL: #{url}"
        conn.connect url,  =>
            conn.sendLogMessage "Connected!"
            @notificationView.notify "Successfully joined server!"
            @connected = true

    joinSession: (sessionID) ->
        conn.joinSession sessionID, =>
            console.log "Successfully joined session"
            @notificationView.notify "Joined session[#{sessionID}]!"

    displaySessions: () ->
        joinSessionView = @joinSessionView
        conn.getSessionsInfo (descriptionMap)->
            joinSessionView.open descriptionMap

    deactivate: ->
        @joinServerView.destroy()
        @joinSessionView.destroy()

    serialize: ->
        joinServerView: @joinServerView.serialize()
        joinSessionView: @joinSessionView.serialize()
