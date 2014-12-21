
var fs = require("fs");


function debugWrap(obj){
    for (var k in obj){
        if (obj.hasOwnProperty(k)){
            // Add a wrapper to each function that logs it's input
            (function(k){
                var oldFunction = obj[k];
                obj[k] = function(){
                    var result = oldFunction.apply(null, arguments);
                    console.log("session." + k, arguments, "=>", result);
                    return result;
                };
            })(k);
        }
    }
    return obj;
}

module.exports = function(){

    var currentState;
    var active;
    var projectRoot;

    function init(){
        active = false;
        currentState = {};
        projectRoot = atom.project.getPath();
        agcRoot = atom.project.getPath() + "/.agc";

        // Create agc directory if it doesn't exist
        try{
            fs.mkdirSync(agcRoot);
        }catch(e){}
    }

    function isArchivedSession(sessionID){
        return fs.existsSync("/.agc/" + currentState.sessionID);
    }

    function getStateRevision(){
        return currentState.revision;
    }

    function getSessionID(){
        return currentState.sessionID;
    }

    function isActive(){
        return active;
    }

    function save(){

        // Directory to save session data
        var sessionRoot = agcRoot + "/" + currentState.sessionID;

        try{
            fs.mkdirSync(sessionRoot);
        }catch(e){}

        // TODO error handling
        fs.writeFileSync(sessionRoot + "/.state.json",
                JSON.stringify(currentState));

        // TODO save synced files
    }

    function activate(){
        active = true;
    }

    function load(sessionID){
        active = false;
        currentState = {
            "revision": 0,
            "sessionID" : sessionID
        };
    }

    function loadState(state, callback){
        currentState = state;
        callback(true);
    }

    function create(sessionID){
        currentState = {
            "revision": 0,
            "sessionID": sessionID
        };
    }

    function getState(){
        return currentState;
    }

    function serializeState(){
        return JSON.stringify(currentState);
    }

    function loadSerializedState(serializedState, callback){
        loadState(JSON.parse(serializedState), callback);
    }

    return debugWrap({
        init:init,
        isArchivedSession:isArchivedSession,
        getStateRevision:getStateRevision,
        getSessionID:getSessionID,
        isActive:isActive,
        save:save,
        activate:activate,
        load:load,
        create:create,
        loadState:loadState,
        getState: getState,
        serializeState:serializeState,
        loadSerializedState:loadSerializedState
    });
}();
