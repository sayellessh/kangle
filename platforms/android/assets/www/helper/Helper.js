//var wh = new WebsiteHelper({
//    container: "body",
//    bodyDiv: "helptext",
//    width: 300,
//    contents: [
//        {
//            parent: ".k-logo",
//            messageHtml: "See your categories and tags."
//        }, {
//            parent: ".search_sec",
//            messageHtml: "See your categories and tags."
//        }, {
//            parent: "#notificationhub-btn",
//            messageHtml: "See your categories and tags."
//        }
//    ],
//    onSuccess: function () {
//        console.log("Complete Init");
//        //this.start();
//    }
//});

var WebsiteHelper = function (options) {
    $.extend({}, options);
    this.container = options.container;
    this.bodyDiv = options.bodyDiv;
    this.contents = options.contents;
    //this.offset = options.offset;
    this.width = (options.width ? options.width : 200);
    //this.popupId = this.container + '-' + this.bodyDiv + '-helper-div';
    //this.popupelem = $('#' + this.popupId);
    this.popupId = null;
    this.popupelem = null;
    this.containerelem = $(this.container);
    //this.type = options.type;
    //this.types = ['ap-actions', 'ap-notification', 'ap-html', 'ap-checkbox'];
    this.backgroundCss = options.backgroundCss;
    this.beforeNextAction = options.beforeNextAction;
    this.afterNextAction = options.afterNextAction;
    this.endOfActions = options.endOfActions;
    this.onSuccess = options.onSuccess;
    this.onShow = options.onShow;
    this.init();
};

WebsiteHelper.prototype.init = function () {
    var _this = this;
    this.containerelem = $(this.container);
    if (this.containerelem.length <= 0)
        this.containerelem = $("body");

    if (_this.contents != null && _this.contents.length > 0) {
        for (var i = 0; i <= _this.contents.length - 1; i++) {
            var content = _this.contents[i];
            var parent = $(content.parent);
            var popupId = i + '-' + this.bodyDiv + '-helper-div';
            var popupelem = $('#' + popupId);
            popupelem.remove();

            var $helperWrapper = $('<div class="helper-wrapper" id="' + popupId + '">');
            if (this.width != null && this.width > 0) {
                $helperWrapper.width(this.width);
            }
            var $helperArrow = $("<div class=\"helper-arrow-up\"></div>");
            $helperWrapper.append($helperArrow);
            var $helperContainer = $('<div class="helper-container">');
            var $helperContent = $('<div class="helper-content">');
            if (content.title != null && content.title != '') {
                var $helperTitle = $('<div class="helper-content-title">' + content.title + '</div>');
                $helperContent.append($helperTitle);
            }
            var $helperBody = $('<div class="helper-helper-body">');
            if (!content.messageHtml.indexOf(">") >= 0) {
                // is not html
                var $helperText = $('<div class="helper-helper-content">');
                $helperText.append(content.messageHtml);
                $helperBody.append($helperText);
            } else {
                $helperBody.append(content.messageHtml);
            }
            var $helperActions = $('<div class="helper-helper-actions">');
            if (i != 0) {
                // show previous button
                var $helperPrev = $('<span class="btn-helper-prev">Prev</span>');
                $helperActions.append($helperPrev);
                $helperPrev.data("index", i);
                $helperPrev.bind("click", function (e) {
                    var pos = parseInt($(this).data("index"));
                    --pos;
                    var popupId = pos + '-' + _this.bodyDiv + '-helper-div';
                    _this.show(popupId, _this.contents[pos].parent);
                });
            }
            if (i != _this.contents.length - 1) {
                // show next button
                var $helperNext = $('<span class="btn-helper-next">Next</span>');
                $helperActions.append($helperNext);
                $helperNext.data("index", i);
                $helperNext.bind("click", function (e) {
                    var pos = parseInt($(this).data("index"));
                    ++pos;
                    var popupId = pos + '-' + _this.bodyDiv + '-helper-div';
                    _this.show(popupId, _this.contents[pos].parent);
                });
            }
            $helperBody.append($helperActions);
            $helperContent.append($helperBody);
            $helperContainer.append($helperContent);
            $helperWrapper.append($helperContainer);

            this.containerelem.append($helperWrapper);

            popupelem = $('#' + popupId);
            this.containerelem = $(this.container);
            if (this.containerelem.length <= 0)
                this.containerelem = $("body");
            popupelem.hide();
            //popupelem.append('<style>#' + this.popupId + ':after{ left: ' + (offsethelper) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .helper-container { background-color: ' + _this.backgroundCss + '; } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
        }
    }
    if (_this.onSuccess) {
        _this.onSuccess();
    }
};

WebsiteHelper.prototype.start = function () {
    var _this = this;
    if (_this.contents != null && _this.contents.length > 0) {
        var popupId = 0 + '-' + this.bodyDiv + '-helper-div';
        _this.show(popupId, _this.contents[0].parent);
    }
};

WebsiteHelper.prototype.centerAlign = function (popupId, parent) {
    var _this = this;
    var popupElem = $("#" + popupId);
    // # start of center align helper div
    if ($(parent).length > 0) {
        var $this = $(parent);
        var offset = $this.offset();
        var width = $this.width();
        var height = $this.height();

        var centerX = offset.left - (width / 2);
        var centerY = offset.top + height;
        var offsethelper = centerX - 10;

        var bodyWidth = popupElem.width();
        if (this.width)
            bodyWidth = this.width;

        var offsetBody = offsethelper - (bodyWidth / 2);
    }
    // # end of center align helper div

    //$('head').find('style#style-' + popupId).remove();
    if ($(document).width() < offsetBody + this.width) {
        popupElem.css('left', $(document).outerWidth() + this.width);
    } else if ($(document).width() > offsetBody + this.width) {
        //popupElem.css('left', $(document).outerWidth() + this.width);
    } else {
        popupElem.css('left', offsetBody);
    }
    //popupElem.find(".helper-arrow-up").css('left', centerX);
    popupElem.css('top', centerY + 20);
    //$("head").append('<style id="style-' + popupId + '">#' + popupId + ':after{ right: ' + (offsethelper) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + popupId + ' > .helper-container { background-color: ' + _this.backgroundCss + '; } #' + popupId + ' { width: ' + _this.width + 'px; }</style>');
};
WebsiteHelper.prototype.show = function (popupId, parent) {
    $(".helper-wrapper").hide();
    this.centerAlign(popupId, parent);
    $("#" + popupId).show();
    if (this.onShow) this.onShow();
};

WebsiteHelper.prototype.hide = function () {
    this.popupelem.slideUp();
};

WebsiteHelper.prototype.toggle = function () {
    if (this.popupelem.is(':visible')) {
        this.hide();
    } else {
        this.show();
    }
}

var webHelper = {};
webHelper.loadHelpPopup = function (imageUrl, helps, beforeShow, afterClose) {
    var $body = $("body");
    var $helpWrapperMain = $("<div class=\"helper-wrapper-main\">");
    var $helpBg = $("<div class=\"helper-bg\">");
    var $helpContent = $("<div class=\"help-content\">");
    $helpContent.css({
        "background-image": "url(" + imageUrl + ")",
        //"background-position": "center",
        "background-repeat": "no-repeat"
    });
    $helpWrapperMain.append($helpBg);
    $helpWrapperMain.append($helpContent);

    for (var i = 0; i <= helps.length - 1; i++) {
        var content = helps[i];
        var popupId = "helper-popup-" + i;
        var $helperWrapper = $('<div class="helper-wrapper" id="' + popupId + '">');
        $helperWrapper.hide();
        var wrapperCss = {};
        if (content.left != null)
            wrapperCss.left = content.left;
        if (content.right != null)
            wrapperCss.right = content.right;
        if (content.top != null)
            wrapperCss.top = content.top;
        $helperWrapper.css(wrapperCss);

        if (content.downArrow) {
            var $helperArrow = $("<div class=\"helper-arrow-down\"></div>");
            $helperArrow.css("left", content.arrowLeft);
        } else {
            var $helperArrow = $("<div class=\"helper-arrow-up\"></div>");
            $helperArrow.css("left", content.arrowLeft);
        }
        $helperWrapper.append($helperArrow);
        var $helperContainer = $('<div class="helper-container">');
        var $helperContent = $('<div class="helper-content">');
        if (content.title != null && content.title != '') {
            var $helperTitle = $('<div class="helper-content-title">' + content.title + '</div>');
            $helperContent.append($helperTitle);
        }
        var $helperBody = $('<div class="helper-helper-body">');
        if (!content.message.indexOf(">") >= 0) {
            // is not html
            var $helperText = $('<div class="helper-helper-content">');
            $helperText.append(content.message);
            $helperBody.append($helperText);
        } else {
            $helperBody.append(content.message);
        }
        var $helperActions = $('<div class="helper-helper-actions">');
        if (i != 0) {
            console.log("sow prev");
            // show previous button
            var $helperPrev = $('<span class="btn-helper-prev">Prev</span>');
            $helperActions.append($helperPrev);
            $helperPrev.data("index", i);
            $helperPrev.bind("click", function (e) {
                var pos = parseInt($(this).data("index"));
                --pos;
                $(".helper-wrapper").hide();
                $("#helper-popup-" + pos).show();
            });
        }
        if (i != helps.length - 1) {
            // show next button
            var $helperNext = $('<span class="btn-helper-next">Next</span>');
            $helperActions.append($helperNext);
            $helperNext.data("index", i);
            $helperNext.bind("click", function (e) {
                var pos = parseInt($(this).data("index"));
                ++pos;
                $(".helper-wrapper").hide();
                $("#helper-popup-" + pos).show();
            });
        }
        //if (i == helps.length - 1) {
        // show next button
        var $helperNext = $('<span class="btn-helper-next">End</span>');
        $helperActions.append($helperNext);
        $helperNext.data("index", i);
        $helperNext.bind("click", function (e) {
            $(".helper-wrapper-main").remove();
            if (afterClose) afterClose();
        });
        //}
        $helperBody.append($helperActions);
        $helperContent.append($helperBody);
        $helperContainer.append($helperContent);
        $helperWrapper.append($helperContainer);
        $helpContent.append($helperWrapper);
    }

    $body.append($helpWrapperMain);
    $("#helper-popup-" + 0).show();
    //var marginHgt = ($(window).height() - $helpContent.height()) / 2;
    //if (marginHgt < 0) {
        marginHgt = (window.innerHeight - $helpContent.height()) / 2;
    //}
    $helpContent.css("margin-top", marginHgt);
    if (beforeShow) beforeShow();
};