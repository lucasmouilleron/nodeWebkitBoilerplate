
module.exports = {

    ////////////////////////////////////////////////////////////////////////////////
    test: function() {
        console.log("this is a test");
    },

    ////////////////////////////////////////////////////////////////////////////////
    otherTest: function() {
        var jf = require("jsonfile");
        var gui = global.window.nwDispatcher.requireNwGui();
        console.log(gui);
        global.window.alert("this is a test");
    }
}