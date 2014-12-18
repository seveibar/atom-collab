
// All IDE interfaces
ui = require("./ui/ui.js");

// Server controls connection to the external server
server = require("./server/server.js");

// Session is in charge of tracking the state of the user's sessions
session = require("./session/session.js");

var debugEvents = true;

module.exports = function(){

    // Callbacks for events
    var events = {};

    events.doJoinServer = function(e){
        ui.notify("Attempting to connect to " + e.serverURL + "!");
        server.connectTo(e.serverURL);
    };

    events.doNameSession = function(e){
        if (!server.isConnected()){
            ui.notify("Not connected to a server");
            return;
        }
        server.renameSession(e.newSessionName);
    };

    events.doListSessions = function(){
        server.getSessionMap(function(indexMap){
            ui.createWindow({
                "class" : "indexed-list",
                "indexMap": indexMap,
                "responseName": "newSessionID"
            }, events.doChangeSession);
        });
    };

    events.doChangeSession = function(e){
        server.changeSession(e.newSessionID);
    };

    events.joinedSession = function(e){

    };

    events.connectedToServer = function(e){
        ui.notify("Successfully connected to " + e.serverURL + "!");
    };

    events.failedToConnectToServer = function(e){
        ui.notify("Failed to connect to " + e.serverURL + "!");
    };

    events.disconnectedFromServer = function(e){
        ui.notify("Disconnected from " + e.serverURL);
    };

    // Events debugging
    if (debugEvents){
        for (var k in events){
            if (events.hasOwnProperty(k)){
                // Add a wrapper to each function that logs it's input
                (function(k){
                    var oldFunction = events[k];
                    events[k] = function(e){
                        console.log(k, e);
                        oldFunction(e);
                    };
                })(k);
            }
        }
    }

    function init(){

        console.log("Initializing agcollab");

        ui.init();
        server.init(events);
        session.init();

        ui.addCommand("join-server", events.doJoinServer,{
            "class": "input",
            "title": "Join Server",
            "responseName": "serverURL",
            "default": "http://localhost:4444"
        });

        ui.addCommand("name-session", events.doNameSession,{
            "class": "input",
            "title": "Name Session",
            "responseName": "newSessionName"
        });

        ui.addCommand("join-session", events.doListSessions);

    }


    return {
        init: init,
        activate: init,
        deactivate: function(){},
        serialize: function(){}
    }
}();
