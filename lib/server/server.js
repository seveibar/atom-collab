
var network = require("./git-collab/client-server/SocketListener.js");

module.exports = function(){

    // Event callbacks
    var events;

    var connected = false;

    function init(eventCallbacks){
        events = eventCallbacks;
    }

    function connectTo(serverURL){
        network.connect(serverURL, function(){
            connected = true;
            events.connectedToServer({
                "serverURL": serverURL
            });
        });

        // TODO events.failedToConnectToServer, events.disconnectedFromServer
    }

    function renameSession(newSessionName){
        if (connected)
            network.setSessionDescription(newSessionName);
    }

    function getSessionMap(callback){
        network.getSessionsInfo(callback);
    }

    function changeSession(newSessionID){
        network.joinSession(newSessionID, function(){
            events.joinedSession({
                "sessionID" : newSessionID
            });
        });
    }


    return {
        init: init,
        connectTo: connectTo,
        renameSession: renameSession,
        changeSession: changeSession,
        getSessionMap: getSessionMap,
        isConnected: function(){ return connected; }
    }
}();
