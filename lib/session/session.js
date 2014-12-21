
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
        return fs.existsSync(agcRoot + "/" + currentState.sessionID);
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

    function load(sessionID, callback){
        active = false;

        // TODO reload initial session "blank slate"

        if (isArchivedSession(sessionID)){
            var stateDataPath = agcRoot + "/" + sessionID + "/.state.json";
            var archivedState = JSON.parse(fs.readFileSync(stateDataPath, "utf8"));
            loadState(archivedState, callback);
        }else{
            currentState = {
                "revision": 0,
                "sessionID" : sessionID,
                "syncedFiles": {}
            };
        }
    }

    function loadState(state, callback){
        currentState = state;

        // Sync all the files from the state
        var syncedFiles = state.syncedFiles;
        for (var path in syncedFiles){
            var fileInfo = syncedFiles[path];
            fs.writeFileSync(projectRoot + path, fileInfo.content);
        }

        callback(true);
    }

    function create(sessionID){
        currentState = {
            "revision": 0,
            "sessionID": sessionID,
            "syncedFiles": {}
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

    function loadModification(changeInfo){
        if (currentState.revision + 1 != changeInfo.newRevision){
            if (currentState.revision == changeInfo.newRevision){
                // I could have sent this state, so ignore
                // TODO race condition, what if another client sent the same
                // revision number?
                return;
            }else{
                console.error("State not loaded in proper order");
            }
        }

        if (changeInfo.changeType == "done"){
            var filePath = changeInfo.filePath;
            var newContent = changeInfo.newContent;

            if (!currentState.syncedFiles[filePath]){
                currentState.syncedFiles[filePath] = {};
            }

            fs.writeFileSync(projectRoot + filePath, newContent);
            currentState.syncedFiles[filePath].content = newContent;
            currentState.revision = changeInfo.newRevision;
        }

    }

    function fileDone(filePath, changeInfoCallback){
        currentState.revision ++;
        if (!currentState.syncedFiles[filePath]){
            currentState.syncedFiles[filePath] = {};
        }
        var fileContent = fs.readFileSync(projectRoot + filePath, "utf8");
        currentState.syncedFiles[filePath].content = fileContent;

        changeInfoCallback({
            "newRevision": currentState.revision,
            "changeType": "done",
            "filePath": filePath,
            "newContent": fileContent
        });
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
        loadSerializedState:loadSerializedState,
        loadModification: loadModification,
        fileDone:fileDone
    });
}();
