/*----------------------------------------------------------------------------*/
var c = console.log.bind(console);

/*----------------------------------------------------------------------------*/
function displayLoaderForElement(elementID, fixed) {
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
            "z-index": 9999
        });

        function size() {
            $loadingElement.width($t.outerWidth());
            $loadingElement.height($t.outerHeight());
            c($t.outerHeight());
            c($t);
            if (/(iPhone|iPad|iPod)\sOS/.test(navigator.userAgent)) {
                $loadingElement.height($t.outerHeight() + 60);
            }
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
}

/*----------------------------------------------------------------------------*/
function hideLoaderForElement(elementID, callback) {
    if (elementID.substr(0, 1) !== "#") {
        elementID = "#" + elementID;
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
}

/*----------------------------------------------------------------------------*/
function displayMainLoader() {
    displayLoaderForElement("body", true);
}

/*----------------------------------------------------------------------------*/
function hideMainLoader(callback) {
    hideLoaderForElement("body", callback);
}