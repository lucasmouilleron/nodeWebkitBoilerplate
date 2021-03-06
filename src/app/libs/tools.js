var notifier = require("node-notifier");
var path = require("path");

define("tools", ["jquery", "throbber"], function($, Throbber) {

    return {

        ////////////////////////////////////////////////////////////////////////////////
        info: function(title, message) {
            notifier.notify({
                "title": title,
                "subtitle": "",
                "message": message,
                "icon": false
            });
        },

        ////////////////////////////////////////////////////////////////////////////////
        error: function(title, message) {
            notifier.notify({
                "title": title,
                "message": message,
                "icon": path.join(process.cwd(), "assets/img/icon.png")
            });
        },

        //////////////////////////////////////////////////////////////////////////////
        console: function(text) {
            $("#console").fadeIn();
            $("#console").html(text);
        },

        ////////////////////////////////////////////////////////////////////////////////
        displayLoaderForElement: function(elementID, fixed) {
            if (elementID.substr(0, 1) !== "#") {
                elementID = "#" + elementID;
            }
            var elementIDWithoutHash = elementID.substr(1, elementID.length);
            var $t = $(elementID);
            var $parent = $t.parent();
            var $loadingElement = $("#loading" + elementIDWithoutHash);

            if (elementID === "#body") {
                $t = $("body");
                $parent = $("body");
            }

            if ($loadingElement.length === 0) {
                $parent.append("<div class='loading' id='loading" + elementIDWithoutHash + "'></div>");
                $loadingElement = $("#loading" + elementIDWithoutHash);
                var throb = new Throbber({
                    size: 20,
                    fallback: "../img/ajax-loader.gif"
                });
                throb.appendTo($loadingElement[0]);
                throb.start();
                $loadingElement.hide().fadeIn(100);
                var position = "absolute";
                if (fixed) {
                    position = "fixed";
                }
                $loadingElement.css({
                    position: position,
                    "z-index": 998
                });

                function size() {
                    $loadingElement.width($t.outerWidth());
                    $loadingElement.height($t.outerHeight());

                    $loadingElement.css({
                        top: $t.offset().top,
                        left: $t.offset().left
                    });
                }

                size();
                $(window).bind("resize." + elementIDWithoutHash, function() {
                    size();
                });
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        hideLoaderForElement: function(elementID, callback) {
            if (elementID.substr(0, 1) !== "#") {
                elementID = "#" + elementID;
            }

            if (elementID === "#body") {
                $t = $("body");
            }

            var $t = $(elementID);
            var elementIDWithoutHash = elementID.substr(1, elementID.length);
            var $loadingElement = $("#loading" + elementIDWithoutHash);
            if ($loadingElement.length > 0) {
                $(window).unbind("resize." + elementIDWithoutHash);
                $loadingElement.fadeOut(300, function() {
                    $loadingElement.hide();
                    $loadingElement.remove();
                    if (callback) {
                        callback();
                    }
                });
            }
        },

        ////////////////////////////////////////////////////////////////////////////////
        displayMainLoader: function() {
            this.displayLoaderForElement("body", true);
        },

        ////////////////////////////////////////////////////////////////////////////////
        hideMainLoader: function (callback) {
            this.hideLoaderForElement("body", callback);
        },

        ////////////////////////////////////////////////////////////////////////////////
        removeHiddenFiles: function (listFiles) {
            var listCleanFiles = new Array();
            for (var i=0; i < listFiles.length; i++) {
                if(listFiles[i].charAt(0) != ".") {
                    listCleanFiles.push(listFiles[i]);
                }
            }
            return listCleanFiles;
        }
    }
});
