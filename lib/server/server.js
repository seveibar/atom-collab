
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


    return {
        init: init,
        connectTo: connectTo,
        isConnected: function(){ return connected; }
    }
}();
