////////////////////////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////////////////////////
var REPORTS_ROOT_FOLDER = "./data";
var PROSPECTUS_NAME = "prospectus";

////////////////////////////////////////////////////////////////////////////////
requirejs.config({
    paths: {
        "tools": "libs/tools",
        "jquery": "vendor/jquery/dist/jquery",
        "bootstrap": "vendor/bootstrap/dist/js/bootstrap.min",
        "text": "vendor/requirejs-text/text",
        "handlebars": "vendor/handlebars/handlebars",
        "highcharts": "vendor/highcharts-release/highcharts-all",
        "moment": "vendor/moment/moment",
        "throbber": "vendor/throbber.js/throbber"
    },
    shim: {
        "bootstrap": ["jquery"],
        "throbber": ["jquery"],
        "tools": ["jquery", "throbber"],
        "messenger": ["jquery"],
        "messenger-theme": ["messenger"]
    }
});

////////////////////////////////////////////////////////////////////////////////
requirejs(["jquery", "tools", "moment", "handlebars", "bootstrap", "highcharts"], function($, tools, moment) {

    var fs = require("fs");
    var request = require("request");

    //////////////////////////////////////////////////////////////////////////////        
    $(function() {
        tools.init();
        initReportsLists();
        testNetwork();
    });

    //////////////////////////////////////////////////////////////////////////////
    function initReportsLists() {
        initReportsList(PROSPECTUS_NAME, prospectus);
    }

    ////////////////////////////////////////////////////////////////////////////////
    function initReportsList(reportType, reportCallback) {
        var view = {title: reportType};
        tools.displayMainLoader();

        var reportsListTPL = fs.readFileSync("app/tpls/reports-list.html").toString();
        var template = Handlebars.compile(reportsListTPL);

        var list = fs.readdirSync(REPORTS_ROOT_FOLDER+"/"+reportType);
        view.reports = tools.removeHiddenFiles(list);
        $("#reports-lists-hook").append(template(view));
        var reportsList = $("#reports-" + reportType);
        reportsList.find(" li.list").each(function(index, element) {
            $(element).click(function() {
                tools.displayMainLoader();
                var reportName = $(this).find("a").data("report");
                processReportFile(REPORTS_ROOT_FOLDER + "/" + reportType + "/" + reportName, reportName, reportCallback);
            });
        });

        setupCustomFile(reportsList);
        tools.hideMainLoader();

        function setupCustomFile(reportsList) {
            var customFileInput = reportsList.find(".custom-json-file")[0];
            reportsList.find(".custom-json-file-link").click(function() {
                customFileInput.addEventListener("change", function(evt) {
                    tools.displayMainLoader();
                    var bits = this.value.split("/");
                    processReportFile(this.value, bits[bits.length-1], reportCallback);
                }, false);
                customFileInput.click();
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    function processReportFile(filePath, reportName, reportCallback) {
        fs.readFile(filePath, function(err, data) {
            if(err) {
                tools.error("Can't read report file", filePath);
                console.log(e);
            }
            else {
                tools.info("Report loaded", filePath);
                reportCallback(reportName, JSON.parse(data));
                tools.hideMainLoader();
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    function prospectus(reportName, report) {

        $("#report-name").html(PROSPECTUS_NAME + "/" + reportName);
        Handlebars.registerHelper('precision3', function(number) {
            return parseFloat(number).toFixed(3);
        });
        Handlebars.registerHelper('lookup', function(obj, index) {
            return obj[index];
        });
        Handlebars.registerHelper('lookupField', function(obj, index, field) {
            return obj[index][field];
        });
        var prospectusTPL = fs.readFileSync("app/tpls/prospectus.html").toString();
        var template = Handlebars.compile(prospectusTPL);
        $("#report-hook").html(template(report));

        var serieData = [];
        for (var i = 0; i < report.dailyIndexDate.length; i++)
        {
            serieData.push([moment(report.dailyIndexDate[i],"DD/MM/YYYY").valueOf(), report.dailyNetReturns[i]]);
        }

        var chart1 = new Highcharts.Chart({
            chart: {
                renderTo: "chart-example"
            },
            title: false,
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Net returns'
                }
            },
            legend: false,
            credits: {
                enabled: false
            },
            series: [{
                name: 'test',
                data: serieData
            }]
        });
    }

    //////////////////////////////////////////////////////////////////////////////
    function testNetwork() {
        tools.console("testing network ...");
        $.ajax({
            url: "https://api.github.com/users/lucasmouilleron/repos",
        }).done(function(data) {
            tools.console(JSON.stringify(data));
        });
    }
});