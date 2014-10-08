////////////////////////////////////////////////////////////////////////////////
// CONFIG
////////////////////////////////////////////////////////////////////////////////
var REPORTS_ROOT_FOLDER = "./data";
var PROSPECTUS_NAME = "prospectus";

//////////////////////////////////////////////////////////////////////////////
var $ = require("jquery");
var Handlebars = require("handlebars");
var fs = require("fs");
var  moment = require("moment");
var tools = require("./tools.js");
var request = require("request");


//////////////////////////////////////////////////////////////////////////////
initView();
initReportsLists();
testNetwork();

//////////////////////////////////////////////////////////////////////////////
function initView() {
    $("#console").hide();
    Messenger.options = {
        theme: 'flat'
    };
}

//////////////////////////////////////////////////////////////////////////////
function testNetwork() {
    console("testing network ...");
    request("http://feeds.wired.com/wired/index", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console(body);
        }
    });
}

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
    view.reports = removeWrongFiles(list);
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
            error("Can't read report file " + filePath);
            console.log(e);
        }
        else {
            info("Report " + filePath + " loaded");
            reportCallback(reportName, JSON.parse(data));
            tools.hideMainLoader();
        }
    });
}

////////////////////////////////////////////////////////////////////////////////
function removeWrongFiles(listFiles) {
    var listCleanFiles = new Array();
    for (var i=0; i < listFiles.length; i++) {
        if(listFiles[i].charAt(0) != ".") {
            listCleanFiles.push(listFiles[i]);
        }
    }
    return listCleanFiles;
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
function console(text) {
    $("#console").fadeIn();
    $("#console").html(text);
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