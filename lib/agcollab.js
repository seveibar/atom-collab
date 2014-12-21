
// All IDE interfaces
ui = require("./ui/ui.js");

// Server controls connection to the external server
server = require("./server/server.js");

// Session is in charge of tracking the state of the user's sessions
session = require("./session/session.js");

var debugEvents = true;

module.exports = function(){

    // Callbacks for agc
    var agc = {};

    agc.doJoinServer = function(e){
        ui.notify("Attempting to connect to " + e.serverURL + "!");
        server.connectTo(e.serverURL);
    };

    agc.doNameSession = function(e){
        if (!server.isConnected()){
            ui.notify("Not connected to a server");
            return;
        }
        server.renameSession(e.newSessionName);
    };

    agc.doListSessions = function(){
        server.getSessionMap(function(indexMap){
            ui.createWindow({
                "class" : "indexed-list",
                "indexMap": indexMap,
                "responseName": "newSessionID"
            }, agc.doChangeSession);
        });
    };

    agc.doChangeSession = function(e){
        server.changeSession(e.newSessionID);
    };

    agc.joinedSession = function(e){

        var lastSession = session.getSessionID();
        if (session.isActive()){
            session.save();
        }

        if (e.sessionSize < 2){

            // This is an empty session

            if (session.isArchivedSession(e.sessionID)){

                session.load(e.sessionID);

                if (session.getStateRevision() == e.stateRevision){
                    // We're good! Our archived session is the latest!
                    session.activate();
                }else{
                    // We have an old session state, we need to ask for a patch
                    // or the latest version.
                    // TODO prompt user, their current data will be changed if
                    // they get another client's state, they can also create a
                    // new session with this state


                    // for now we'll just switch back to the last session
                    server.changeSession(lastSession);
                }

            }else if (e.stateRevision === 0){

                // I'm the first person in this session (I created it)
                session.create(e.sessionID);
                session.activate();

            }else{
                // Cannot join session, somebody else owns it
                // TODO check if that person is on the network and ask for their
                // state

                // for now we'll just switch back to the last session
                server.changeSession(lastSession);

            }

        }else{
            // Get the latest state from someone in the session

            session.load(e.sessionID);

            server.getLatestState(function(state){
                session.loadSerializedState(state, function(success){
                    if (success){
                        session.activate();
                    }else{
                        console.error("Cannot load session, state not possible");
                        server.changeSession(lastSession);
                    }
                });
            });

        }
    };

    agc.stateRequested = function(){
        return session.serializeState();
    };

    agc.connectedToServer = function(e){
        ui.notify("Successfully connected to " + e.serverURL + "!");
        agc.joinedSession(e);
    };

    agc.failedToConnectToServer = function(e){
        ui.notify("Failed to connect to " + e.serverURL + "!");
    };

    agc.disconnectedFromServer = function(e){
        ui.notify("Disconnected from " + e.serverURL);
    };

    // Events debugging
    if (debugEvents){
        for (var k in agc){
            if (agc.hasOwnProperty(k)){
                // Add a wrapper to each function that logs it's input
                (function(k){
                    var oldFunction = agc[k];
                    agc[k] = function(e,u){
                        console.log("agc." + k, e);
                        if (u){
                            console.error("agc only takes one object parameter");
                        }
                        return oldFunction(e);
                    };
                })(k);
            }
        }
    }

    function init(){

        console.log("Initializing agcollab");

        ui.init();
        session.init();
        server.init(agc);

        ui.addCommand("join-server", agc.doJoinServer,{
            "class": "input",
            "title": "Join Server",
            "responseName": "serverURL",
            "default": "http://localhost:4444"
        });

        ui.addCommand("name-session", agc.doNameSession,{
            "class": "input",
            "title": "Name Session",
            "responseName": "newSessionName"
        });

        ui.addCommand("join-session", agc.doListSessions);

        // REMOVE
        agc.doJoinServer({
            "serverURL": "http://localhost:4444"
        });

    }


    return {
        init: init,
        activate: init,
        deactivate: function(){},
        serialize: function(){}
    };
}();
