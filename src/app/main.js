////////////////////////////////////////////////////////////////////////////////
// GLOBAL CONFIG
////////////////////////////////////////////////////////////////////////////////
global.DEBUG = false;

////////////////////////////////////////////////////////////////////////////////
// REQUIREJS CONFIG
////////////////////////////////////////////////////////////////////////////////
requirejs.config({
    paths: {
        // libs
        "tools": "libs/tools",
        "jquery": "libs/vendor/jquery/dist/jquery",
        "bootstrap": "libs/vendor/bootstrap/dist/js/bootstrap.min",
        "text": "libs/vendor/requirejs-text/text",
        "handlebars": "libs/vendor/handlebars/handlebars",
        "highcharts": "libs/vendor/highcharts-release/highcharts-all",
        "moment": "libs/vendor/moment/moment",
        "throbber": "libs/vendor/throbber.js/throbber",
        // controllers
        "reports": "controllers/reports"
    },
    shim: {
        "bootstrap": ["jquery"],
        "throbber": ["jquery"],
        "tools": ["jquery", "throbber"],
        "messenger": ["jquery"],
        "messenger-theme": ["messenger"]
    }
});

//////////////////////////////////////////////////////////////////////////////        
// ENTRY POINT
////////////////////////////////////////////////////////////////////////////////
requirejs(["jquery", "tools", "reports", "bootstrap"], function($, tools, reports) {

    function main() {
        reports.initReportsLists();
    }    

    $(function() {
        if(global.DEBUG) {
            $("#splash").remove();
            main();
        }
        else {
            cjsModule.test();
            setTimeout(function() { 
                $("#console").hide();
                main();
                $("#splash").fadeOut(300, function() {
                    $("#splash").remove();
                });
            }, 3000);
        }
    });
});