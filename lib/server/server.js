
var network = require("./git-collab/client-server/SocketListener.js");

module.exports = function(){

    // Event callbacks
    var agc;

    var connected = false;

    function init(eventCallbacks){
        agc = eventCallbacks;
    }

    function connectTo(serverURL){
        network.connect(serverURL, function(){
            console.log("Connected");
            connected = true;
            agc.connectedToServer({
                "serverURL": serverURL,
                "sessionID": network.getSessionID(),
                "sessionSize": network.getSessionSize(),
                "stateRevision": network.getStateRevision()
            });
        });

        // TODO agc.failedToConnectToServer, agc.disconnectedFromServer
    }

    function renameSession(newSessionName){
        if (connected)
            network.setSessionDescription(newSessionName);
    }

    function changeSession(newSessionID){
        network.joinSession(newSessionID, function(){
            agc.joinedSession({
                "sessionID" : newSessionID,
                "sessionSize": network.getSessionSize(),
                "stateRevision": network.getStateRevision()
            });
        });
    }

    var messageHandler = {};

    messageHandler.stateRequest = function(msg){

        // agc.stateRequested should return a serialized session
        var result = agc.stateRequested();

        if (result){
            return {
                "type": "latestState",
                "state": result
            };
        }
    };

    messageHandler.latestState = function(msg){
        if (latestStateCallback)
            latestStateCallback(msg.state);
        latestStateCallback = null;
    };

    var latestStateCallback;
    function getLatestState(callback){
        latestStateCallback = callback;
        network.sendSessionMessage({
            "type": "stateRequest"
        });
    }

    function onSessionMessage(msg){
        // Call the associated message handler and return it's result
        if (messageHandler[msg.type]){
            var returnMessage = messageHandler[msg.type](msg);
            if (returnMessage){
                network.sendSessionMessage(returnMessage);
            }
        }else{
            console.error("Received unknown message type", msg.type, msg);
        }
    }

    network.addSessionMessageListener(onSessionMessage);

    return {
        init: init,
        connectTo: connectTo,
        renameSession: renameSession,
        changeSession: changeSession,
        getLatestState: getLatestState,
        getSessionMap: network.getSessionsInfo,
        getStateRevision: network.getStateRevision,
        getSessionSize: network.getSessionSize,
        isConnected: function(){ return connected; }
    };
}();
