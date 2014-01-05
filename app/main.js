////////////////////////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////////////////////////
var REPORTS_ROOT_FOLDER = "data";
var PROSPECTUS_NAME = "prospectus";

//////////////////////////////////////////////////////////////////////////////
// LIBRARIES CONFIG
////////////////////////////////////////////////////////////////////////////////
require.config({
    // libraries paths
    paths: {
        // main libs
        "jquery": "vendor/jquery-1.8.2.min",
        "bootstrap": "vendor/bootstrap.min",
        "text": "vendor/text",
        "handlebars": "vendor/handlebars-v1.3.0",
        // utils
        "tools": "tools",
        "console": "vendor/console",
        "fileAPI": "vendor/FileAPI.min",
        "messenger": "vendor/messenger.min",
        "messenger-theme": "vendor/messenger-theme-flat",
        "highcharts": "vendor/highcharts",
        "moment": "vendor/moment.min",
        "hash":"vendor/hash.min",
        "base64":"vendor/base64",
        // miscs
        "throbber": "vendor/throbber"

    },
    // dependencies and exports
    shim: {
        "bootstrap": ["jquery"],
        "throbber": ["jquery"],
        "console": ["jquery"],
        "tools": ["jquery", "throbber"],
        "messenger": ["jquery"],
        "messenger-theme": ["messenger"]
    }
});

////////////////////////////////////////////////////////////////////////////////
// BOOTSRAP !!!!
////////////////////////////////////////////////////////////////////////////////
require(["jquery", "text!tpls/reports-list.html", "text!tpls/prospectus.html", "handlebars", "fileAPI", "bootstrap", "console", "messenger", "messenger-theme", "tools", "highcharts","moment","hash","base64"], function($, reportsListTPL, prospectusTPL) {

    ////////////////////////////////////////////////////////////////////////////////
    $(function() {

        initMessenger();
        initHighCharts();
        initReportsLists();
        initHashListening();
    });

    ////////////////////////////////////////////////////////////////////////////////
    function initReportsLists() {
        initReportsList(PROSPECTUS_NAME, prospectus);
    }

    ////////////////////////////////////////////////////////////////////////////////
    function initHashListening() {
        var reportType = hash.get('type');
        var report = hash.get('report');
        if(reportType !== undefined && report !== undefined) {
            try {
                report = jQuery.parseJSON(Base64.decode(report));
                switch (reportType) {
                    case "prospectus":
                        prospectus("unnamed",report);
                    break;
                    default:
                        error("Can't find a valid report type ("+reportType+")!");
                    break;
                }
            }
            catch(e) {
                error("Can't parse report data !");
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    function initReportsList(reportType, reportCallback) {
        var view = {title: reportType};
        displayMainLoader();
        var template = Handlebars.compile(reportsListTPL);
        $.getJSON("api/reports/" + reportType)
                .success(function(data) {
                    view.reports = data;
                    $("#reports-lists-hook").append(template(view));
                    var reportsList = $("#reports-" + reportType);
                    reportsList.find(" li.list").each(function(index, element) {
                        $(element).click(function() {
                            var reportName = $(this).find("a").data("report");
                            displayMainLoader();
                            $.getJSON(REPORTS_ROOT_FOLDER + "/" + reportType + "/" + reportName)
                                    .success(function(data) {
                                        info("Report " + reportType + "/" + reportName + " loaded");
                                        reportCallback(reportName, data);
                                        hideMainLoader();
                                    })
                                    .error(function() {
                                        error("Can't read report file " + reportType + "/" + reportName);
                                        hideMainLoader();
                                    });
                        });
                    });
                    setupCustomFile(reportsList);
                    setupDropZone(reportsList);
                    hideMainLoader();
                })
                .error(function() {
                    error("Can't load reports list for report type : " + reportType);
                    $("#reports-lists-hook").append(template(view));
                    var reportsList = $("#reports-" + reportType);
                    setupCustomFile(reportsList);
                    setupDropZone(reportsList);
                    hideMainLoader();
                });

        function setupCustomFile(reportsList) {
            var customFileInput = reportsList.find(".custom-json-file")[0];
            reportsList.find(".custom-json-file-link").click(function() {
                customFileInput.click();
            });
            FileAPI.event.on(customFileInput, "change", function(evt) {
                displayMainLoader();
                var files = FileAPI.getFiles(customFileInput);
                processFile(files[0], reportType, reportCallback);
            });

            /*$(window).keypress(function(e) {
                if(e.ctrlKey && e.keyCode == 15){
                    var customFileInput = reportsList.find(".custom-json-file")[0];
                    customFileInput.click();     
                }
            });*/
        }

        function setupDropZone(reportsList) {
            reportsList.find("button")[0].addEventListener('dragover', function handleDragOver(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy';
            }, false);
            reportsList.find("button")[0].addEventListener('drop', function handleFileSelect(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                displayMainLoader();
                processFile(evt.dataTransfer.files[0], reportType, reportCallback);
            }, false);
        }

        function processFile(file, reportType, reportCallback) {
            var file = files[0];
                FileAPI.readAsText(file, function(evt) {
                    if (evt.type === 'load') {
                        var text = evt.result;
                        info("Report " + reportType + "/" + file.name + " loaded");
                        reportCallback(file.name, $.parseJSON(text));
                        hideMainLoader();
                    }
                    else if (evt.type === 'progress') {
                    }
                    else {
                        error("Can't read file !");
                        hideMainLoader();
                    }
                });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    function prospectus(reportName, report) {
        setReportName(PROSPECTUS_NAME, reportName);
        Handlebars.registerHelper('precision3', function(number) {
            return parseFloat(number).toFixed(3);
        });
        Handlebars.registerHelper('lookup', function(obj, index) {
            return obj[index];
        });
        Handlebars.registerHelper('lookupField', function(obj, index, field) {
            return obj[index][field];
        });
        var template = Handlebars.compile(prospectusTPL);
        $("#report-hook").html(template(report));


        var serieData = [];
        for (var i = 0; i < report.dailyIndexDate.length; i++)
        {
            serieData.push([moment(report.dailyIndexDate[i],"DD/MM/YYYY").valueOf(), report.dailyNetReturns[i]]);
        }
        /*var serieData2 = [];
         for (var i = 0; i < report.dataTest2.times.length; i++)
         {
         serieData2.push([report.dataTest2.times[i], report.dataTest2.values[i]]);
         }*/

        $(".chart-example").highcharts({
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

    ////////////////////////////////////////////////////////////////////////////////
    function setReportName(category, reportName) {
        $("#report-name").html(category + "/" + reportName);
    }

    ////////////////////////////////////////////////////////////////////////////////
    function info(text) {
        Messenger().post({
            message: text,
            type: "info"
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    function error(text) {
        Messenger().post({
            message: text,
            type: "error"
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    function initMessenger() {
        Messenger.options = {
            theme: 'flat'
        };
    }

    ////////////////////////////////////////////////////////////////////////////////
    function initHighCharts() {
        Highcharts.setOptions({
            chart: {
                style: {
                    fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif",
                    color: "#333333"
                }
            },
            xAxis: {
                title: {
                    style: {
                        color: '#666'
                    }
                }
            },
            yAxis: {
                title: {
                    style: {
                        color: '#666'
                    }
                }
            }
        });
    }
});