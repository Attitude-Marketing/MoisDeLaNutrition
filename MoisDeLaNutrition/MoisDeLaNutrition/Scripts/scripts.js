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

var format = "desktop",
    isMobile = false,
    countpage = 0,
    interval,
    countInterval = 0,
    totems = 0,
    mobileThreshold = 768,
    listcount = 0;


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
}
if (window.innerWidth < mobileThreshold) {
    format = "mobile";
}
//if(window.matchMedia('(min-width: 1024px) and (orientation: portrait)').matches) {
//    format = "ipadpro";
//}


history.navigationMode = 'compatible';

/**********************************************************************************************
END GLOBAL PROPERTIES
**********************************************************************************************/
$(document).ready(function () {
    const clickx = document.getElementById('pencet');

    clickx.addEventListener('click', function () {
        clickx.classList.toggle('Diam');
    });



    $("#hamburger").click(function () {
        $("#panel").toggle();
        $("#panel").toggleClass("visible");
    });

    $(".quickFacts").click(function (e) {
        e.preventDefault();
        var tgtId = $(this).data("fact"),
            $panel = $("#" + tgtId),
            $overlay = $("#overlay");

        if ($panel.css("display") == "none") {

            $(".factPanel").each(function () {
                if ($(this).css("display") !== "none") {
                    $(this).find(".btnClose").trigger("click");
                }
            });
            $panel.css("display", "block").animate({ "right": 0 }, 300);
            $overlay.animate({ 'opacity': '0.25'}, 400, function () {
                $(this).css('pointer-events', 'all');
            });
        }

    });

    $(".factPanel").find(".btnClose").click(function () {

        var $panel = $(this).parent(".factPanel"),
            $overlay = $("#overlay");

        $panel.animate({ "right": -600 }, 300, function () {
            $panel.css("display","none");
        });
        $overlay.animate({ 'opacity': 0 }, 300, function () {
            $(this).css('pointer-events', 'none');
        });
    });

    $("#newsletter-form").on("submit", function (e) {

        e.preventDefault();

        var $email = $('#email'),
            $form = $(this),
            errEmpty = $form.data("mssg"),
            errInvalid = $email.data("invalid"),
            err = errEmpty;

        if ($email.val() == "") {
            $email.css("border-color", "#F75A58").on("change", function () {
                $(this).css("border-color", "#113961");
                $form.parent('div').find(".errMss").html("&nbsp;");
            });
            $form.parent('div').find(".errMss").html(err);
        } else if (!echeck($email.val())) {
            $email.css("border-color", "#F75A58").on("change", function () {
                $(this).css("border-color", "#113961");
                $form.parent('div').find(".errMss").html("&nbsp;");
            });
            err = errInvalid;
            $form.parent('div').find(".errMss").html(err);
        } else {
            getToken($email, $form);
        }
    });

    $("#print").click(function () {
        window.print();
    });

    /* mobile switch */
    if (window.innerWidth <= mobileThreshold) {
        console.log(format);
        mobileSwitch($(".mobile-switch"), format);
    }
    $(window).resize(function () {
        if ($(document).width() <= mobileThreshold) {
            console.log(format);
            if (format == "desktop") {
                format = "mobile";
                mobileSwitch($(".mobile-switch"), format);
            }
        } else if ($(document).width() > mobileThreshold) {
            console.log(format);
            if (format == "mobile") {
                format = "desktop";
                mobileSwitch($(".mobile-switched"), format);
            }
        }
    });
}); // end doc ready

/* == FUNCTIONS == */

function getToken($email, $form) {

    var url = "/umbraco/surface/api/gettoken";

    $.ajax({
        dataType: "json",
        url: url,
        success: function (response) {
            if (response.IsSuccess) {

                submitNewsletterOptIn($email, $form, response.Result)
            } else {
                $form.parent('div').find(".errMss").html($form.data("ajfail"));
            }


        },
        error: function (xhr, status, error) {
            console.log(xhr);
            console.log(status);
            console.log(error);
            $form.parent('div').find(".errMss").html($form.data("ajfail"));
        }
    });
}

function submitNewsletterOptIn($email, $form, tokenObj) {

    var url,
        data = new FormData(),
        parsedTokenJson = "",
        url = "/umbraco/surface/api/newsletteroptin";

    if (tokenObj != "undefined") {
        parsedTokenJson = JSON.parse(JSON.parse(tokenObj));

        token = parsedTokenJson.access_token;

        data.append("Email", $email.val());
        data.append("Captcha", $form.find(".captcha").val());
        data.append("Token", token);
        data.append("Userlang", $("#userlang").val());

        $.ajax({
            method: "POST",
            processData: false,  // tell jQuery not to process the data
            contentType: false,   // tell jQuery not to set contentType
            dataType: "json",
            url: url,
            data: data,
            success: function (response) {

                if (response.IsSuccess) {

                    var $container = $form.parent('div'),
                        thks = $form.data('thks');

                    $container.html('<p class="thks">' + thks + '</p>');
                } else {
                    $container.find(".errMss").html($form.data("ajfail"));
                }

            },
            error: function (xhr, status, error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
                $form.parent('div').find(".errMss").html($form.data("ajfail"));
            }
        });
    } else {
        console.log("error in getting token : " + tokenObj.response);
    }
}

function echeck(str) {
    var emailRegEx = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-\.])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (str.match(emailRegEx)) {
        return true;
    } else {
        return false;
    }
}

function mobileSwitch($target, platform) {

    console.log("in function");

    $target.each(function () {
        var $self = $(this),
            elt = $self.prop('nodeName'),
            $ostyle;

        if (elt != "IMG") {
            $ostyle = $self.attr("style");
        } else {
            $ostyle = $self.attr("src");
        }


        if ($self.data("mobile") != "" && $self.data("mobile") != undefined) {

            console.log("data-mobile exists " + $self.data("mobile"));

            if (elt == "IMG") {
                $self.attr("src", $self.data("mobile"));
            } else {
                $self.attr("style", $self.data("mobile"));
            }

            $self.data("mobile", $ostyle);

            console.log("platform : " + platform);

            if (platform == "mobile") {
                $self.addClass("mobile-switched").removeClass("mobile-switch");
            } else if (platform == "desktop") {
                $self.addClass("mobile-switch").removeClass("mobile-switched");
            }
        }

    });
}