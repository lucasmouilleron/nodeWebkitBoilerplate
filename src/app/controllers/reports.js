var REPORTS_ROOT_FOLDER = "./data";
var PROSPECTUS_NAME = "prospectus";
var fs = require("fs");
var request = require("request");
// custom common js module
var cjsModule = require("./app/libs/cjsModule"); 

define("reports", ["jquery", "moment", "tools", "handlebars", "highcharts"], function($, moment, tools) {

    return {

        //////////////////////////////////////////////////////////////////////////////
        initReportsLists: function() {
            $("#main-hook").append(Handlebars.compile(fs.readFileSync("app/tpls/reports.html").toString()));
            this.testNetwork();
            this.initReportsList(PROSPECTUS_NAME, this.prospectus);
        },

        ////////////////////////////////////////////////////////////////////////////////
        initReportsList: function(reportType, reportCallback) {
            tools.displayMainLoader();
            var that = this;
            var view = {title: reportType};
            var template = Handlebars.compile(fs.readFileSync("app/tpls/reports-list.html").toString());
            var list = fs.readdirSync(REPORTS_ROOT_FOLDER+"/"+reportType);
            view.reports = tools.removeHiddenFiles(list);
            $("#reports-lists-hook").append(template(view));
            var reportsList = $("#reports-" + reportType);
            
            reportsList.find(" li.list").each(function(index, element) {
                $(element).click(function() {
                    tools.displayMainLoader();
                    var reportName = $(this).find("a").data("report");
                    that.processReportFile(REPORTS_ROOT_FOLDER + "/" + reportType + "/" + reportName, reportName, reportCallback);
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
                        that.processReportFile(this.value, bits[bits.length-1], reportCallback);
                    }, false);
                    customFileInput.click();
                });
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        processReportFile: function(filePath, reportName, reportCallback) {
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
        },

        //////////////////////////////////////////////////////////////////////////////
        testNetwork: function() {
            tools.console("testing network ...");
            $.ajax({
                url: "https://api.github.com/users/lucasmouilleron/repos",
            }).done(function(data) {
                tools.console(JSON.stringify(data));
            });
        },

        ////////////////////////////////////////////////////////////////////////////////
        prospectus: function(reportName, report) {

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
            var template = Handlebars.compile(fs.readFileSync("app/tpls/reports-prospectus.html").toString());
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
    }
});
