
var SimpleInputView = require("./simple-input-view.coffee");
var NotificationView = require("./notification-view.coffee");
var IndexedListView = require("./indexed-list-view.coffee");

module.exports = function(){

    var notificationView, indexedListView;

    function init(){

        notificationView = new NotificationView();
        indexedListView = new IndexedListView();

    }

    function addCommand(cmd, callback, windowData){

        // Add package prefix to command
        cmd = "agcollab:" + cmd;

        if (!windowData){
            atom.workspaceView.command(cmd, callback);
        }else{
            // Create window with windowData when command is run
            atom.workspaceView.command(cmd, function(){
                createWindow(windowData, callback);
            });
        }
    }

    // Create a window from json data
    function createWindow(data, callback){
        if (data.class == "input"){
            new SimpleInputView({
                "title": data.title,
                "default": data.default
            }, function(response){
                var responseObject = {};
                responseObject[data.responseName] = response;
                callback(responseObject);
            });
        }else if(data.class == "indexed-list"){
            indexedListView.open({
                "indexMap" : data.indexMap
            });
            indexedListView.setCallback(function(index){
                var responseObject = {};
                responseObject[data.responseName] = index;
                callback(responseObject);
            });
        }else{
            console.error("undefined window class");
        }
    }

    function notify(msg){
        notificationView.notify(msg);
    }

    return {
        init: init,
        addCommand: addCommand,
        createWindow: createWindow,
        notify: notify
    };
}();
