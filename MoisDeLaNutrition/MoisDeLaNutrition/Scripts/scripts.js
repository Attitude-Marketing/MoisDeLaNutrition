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
}); // end doc ready