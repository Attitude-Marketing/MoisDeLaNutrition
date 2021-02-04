/**********************************************************************************************
GLOBAL PROPERTIES
**********************************************************************************************/
/**
*  Dummy console for IE, to avoid crashes.
**/
if (typeof console !== "object") {
    var console = {};
    console.log = function (text) { };
    console.warn = function (text) { };
    console.error = function (text) { };
    console.info = function (text) { };
}

var format = "",
    isMobile = false,
    countpage = 0,
    interval,
    countInterval = 0,
    totems = 0,
    listcount = 0;


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
}
if (window.innerWidth < 769) {
    format = "mobile";
}
if(window.matchMedia('(min-width: 1024px) and (orientation: portrait)').matches) {
    format = "ipadpro";
}


history.navigationMode = 'compatible';

/**********************************************************************************************
END GLOBAL PROPERTIES
**********************************************************************************************/
$(document).ready(function () {
    console.log("doc ready");
    $("#hamburger").click(function () {
        $("#panel").toggle();
        $("#panel").toggleClass("visible");
    });

    $(".quickFacts").click(function (e) {
        e.preventDefault();
        var tgtId = $(this).data("fact"),
            $panel = $("#" + tgtId);

        if ($panel.css("display") == "none") {

            $(".factPanel").each(function () {
                if ($(this).css("display") !== "none") {
                    $(this).find(".btnClose").trigger("click");
                }
            });
            $panel.css("display","block").animate({"right": 0}, 300);
        }

    });

    $(".factPanel").find(".btnClose").click(function () {

        var $panel = $(this).parent(".factPanel");

        $panel.animate({ "right": -600 }, 300, function () {
            $panel.css("display","none");
        });
    });
}); // end doc ready