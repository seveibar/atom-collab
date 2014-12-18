
var fs = require("fs");
var SimpleInputView = require("./simple-input-view.coffee");
var NotificationView = require("./notification-view.coffee");

module.exports = function(){

    var notificationView;

    function init(){

        notificationView = new NotificationView();

    }

    function addCommand(cmd, callback, type){

        type = type || "selection";

        // Add package prefix to command
        cmd = "agcollab:" + cmd;

        if (type == "selection"){
            atom.workspaceView.command(cmd, callback);
        }else if (type.class == "input"){
            // Create a simple input view
            atom.workspaceView.command(cmd, function(){
                new SimpleInputView(type.title, function(response){
                    var responseObject = {};
                    responseObject[type.responseName] = response;
                    callback(responseObject);
                });
            });
        }
    }

    function notify(msg){
        notificationView.notify(msg);
    }

    return {
        init: init,
        addCommand: addCommand,
        notify: notify
    };
}();
