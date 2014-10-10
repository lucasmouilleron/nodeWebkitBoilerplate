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
        "jquery": "vendor/jquery/dist/jquery",
        "bootstrap": "vendor/bootstrap/dist/js/bootstrap.min",
        "text": "vendor/requirejs-text/text",
        "handlebars": "vendor/handlebars/handlebars",
        "highcharts": "vendor/highcharts-release/highcharts-all",
        "moment": "vendor/moment/moment",
        "throbber": "vendor/throbber.js/throbber",
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