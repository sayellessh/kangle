var ArrowPopup = function (parent, options) {
	$.extend({}, options);
	this.parent = parent;
	this.container = options.container;
	this.bodyDiv = options.bodyDiv;
	this.contents = options.contents;
	//this.offset = options.offset;
	this.width = (options.width?options.width:200);
	this.popupId = this.container + '-' + this.bodyDiv + '-arrow-div';
	this.popupelem = $('#' + this.popupId);
	this.containerelem = $('#' + this.container);
	this.type = options.type;
	this.types = ['ap-actions', 'ap-notification', 'ap-html'];
	this.backgroundCss = options.backgroundCss;
	this.title = options.title;
	this.onAccept = options.onAccept;
	this.onReject = options.onReject;
	this.onSuccess = options.onSuccess;
	this.onShow = options.onShow;
	this.init();
};

ArrowPopup.prototype.init = function() {
    var _this = this;
	this.popupelem = $('#' + this.popupId);
	this.containerelem = $('#' + this.container);
	this.popupelem.remove();

	var divelement = '<div class="arrow-wrapper" id="' + this.popupId + '">';
    divelement += '<div class="arrow-container">';
	divelement += '<div class="arrow-content">';
	if (this.title != null && this.title != '')
	    divelement += '<div class="arrow-content-title">' + this.title + '</div>';
	divelement += '<ul class="' + (this.type!=null?this.type:'') + '">';
	divelement += '</ul>';
	divelement += '</div>';
	divelement += '</div>';
	divelement += '</div>';
	var divobj = $(divelement);
	
    // # start of center align arrow div
	if (_this.parent.length > 0) {
	    var $this = _this.parent;
	    var offset = $this.offset();
	    var width = $this.width();
	    var height = $this.height();

	    var centerX = offset.left + width / 2;
	    var centerY = offset.top + height / 2;
	    var offsetArrow = centerX - 10;

	    var bodyWidth = this.popupelem.width();
	    if (this.width)
	        bodyWidth = this.width;

	    var offsetBody = offsetArrow - (bodyWidth / 2);
	}
    // # end of center align arrow div

	if (_this.type == _this.types[0]) {
        // type requests
		//alert('the contents length ' + _this.contents.length);
	    if (_this.contents != null && _this.contents.length > 0) {
	        for (var i = 0; i <= _this.contents.length - 1; i++) {
	            var actionMsg = _this.contents[i];
	            var arrowLiId = 'arrow-req-li-' + i;
	            var $lielem = $('<li id="' + arrowLiId + '"></li>');
	            $lielem.data('actionMsg', actionMsg);
	            var $container = $('<div class="request"></div>');
	            var $thumb = $('<img src="' + (actionMsg.Profile_Photo_BLOB_URL != null ? actionMsg.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '">');
	            var $msg = $('<div class="message">' + actionMsg.Message_Text + '</div>');
	            var $actions = $('<div class="actions">' + '</div>');
	            var $acceptBtn = $('<a class="fa fa-check notf-accept-btn">&nbsp;</a>');
	            $acceptBtn.bind('click', function (e) {
	            	var _this = this;
	            	$(_this).hide();
	                if ($(this).parents('li').length > 0) {
	                    if (_this.onAccept) _this.onAccept($(this).parents('li').data('actionMsg'));
	                }
	            }, function(){
	            	$(_this).show();
	            });
	            var $rejectBtn = $('<a class="fa fa-close notf-reject-btn"></a>');
	            $rejectBtn.bind('click', function (e) {
	                if ($(this).parents('li').length > 0) {
	                    if (_this.onReject) _this.onReject($(this).parents('li').data('actionMsg'));
	                }
	            });
	            $actions.append($acceptBtn);
	            $actions.append($rejectBtn);

	            $container.append($thumb);
	            $container.append($msg);
	            if (actionMsg.Suffix != null)
	                $container.append('<div class="message suffix">' + actionMsg.Suffix + '</div>');

	            $container.append($actions);

	            $lielem.append($container);

	            divobj.find('.arrow-container .arrow-content ul').append($lielem);

	            console.log(divobj.find('.arrow-container .arrow-content ul').html());
	        }
	    } else {
	        // empty feeds
			divobj.find('.arrow-container .arrow-content ul').append('<div class="ap-empty">Nothing Found</div>');
	    }
	    this.containerelem.append(divobj);

	    this.popupelem = $('#' + this.popupId);
	    this.containerelem = $('#' + this.container);
	    this.popupelem.hide();

	    //this.popupelem.append('<style>#' + this.popupId + ':after{margin-left: ' + (parseInt(_this.offset, 10)) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .arrow-container { background-color: ' + _this.backgroundCss + '; } @media screen and (min-width:240px) and (max-width:770px) { #' + this.popupId + ':after{margin-left: ' + (parseInt(_this.offset, 10) + 15) + 'px} } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	    this.popupelem.append('<style>#' + this.popupId + ':after{ left: ' + (offsetArrow) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .arrow-container { background-color: ' + _this.backgroundCss + '; } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	} else if (_this.type == _this.types[1]) {
	    // type notifications
	    if (_this.contents != null && _this.contents.length > 0) {
	        for (var i = 0; i <= _this.contents.length - 1; i++) {
	            var actionMsg = _this.contents[i];
	            var arrowLiId = 'arrow-notif-li-' + i;
	            var $lielem = $('<li id="' + arrowLiId + '"></li>');
	            $lielem.data('actionMsg', actionMsg);
	            var $container = $('<div class="request"></div>');
	            var $thumb = $('<img src="' + (actionMsg.Profile_Photo_BLOB_URL != null ? actionMsg.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '">');
	            var $msg = $('<div class="description">' + actionMsg.Message_Text + '</div>');
	            
	            $container.append($thumb);
	            $container.append($msg);
	            $lielem.append($container);

	            divobj.find('.arrow-container .arrow-content ul').append($lielem);
	        }
	    } else {
	        // empty feeds
	        divobj.find('.arrow-container .arrow-content ul').append('<div class="ap-empty">Nothing Found</div>');
	    }
	    this.containerelem.append(divobj);

	    this.popupelem = $('#' + this.popupId);
	    this.containerelem = $('#' + this.container);
	    this.popupelem.hide();

	    //this.popupelem.append('<style>#' + this.popupId + ':after{margin-left: ' + (parseInt(_this.offset, 10)) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .arrow-container { background-color: ' + _this.backgroundCss + '; } @media screen and (min-width:240px) and (max-width:770px) { #' + this.popupId + ':after{margin-left: ' + (parseInt(_this.offset, 10) + 15) + 'px} } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	    this.popupelem.append('<style>#' + this.popupId + ':after{ left: ' + (offsetArrow) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .arrow-container { background-color: ' + _this.backgroundCss + '; } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	} else if (_this.type == _this.types[2]) {
	    divobj.find('.arrow-container .arrow-content ul').append('<div class="ap-html">' + _this.contents + '</div>');
	    this.containerelem.append(divobj);

	    this.popupelem = $('#' + this.popupId);
	    this.containerelem = $('#' + this.container);
	    this.popupelem.hide();
	    this.popupelem.append('<style>#' + this.popupId + ':after{ left: ' + (offsetArrow) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .arrow-container { background-color: ' + _this.backgroundCss + '; } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	    if (_this.onSuccess) {
	        _this.onSuccess();
	    }
	} else {
	    $.each(this.contents, function (ind, obj) {
	        var arrowLiId = 'arrow-li-' + ind;
	        if (obj != null && obj.isSeparator) {
	            var lielem = '<li class="separator"></li>';
	            divobj.find('.arrow-container .arrow-content ul').append(lielem);
	        } else if (obj != null) {
	            var lielem = $('<li id="' + arrowLiId + '"><a href="' + (obj.href == undefined ? "#" : obj.href) + '">' + obj.displaytitle + '</a></li>');
	            if (obj.iconclass != null)
	                lielem.addClass(obj.iconclass);
	            if (!obj.isVisible)
	                lielem.addClass('hidden');
	            lielem.bind('click', function (e) {
	                obj.onclick();
	            });
	            divobj.find('.arrow-container .arrow-content ul').append(lielem);
	        }
	    });
	    this.containerelem.append(divobj);

	    this.popupelem = $('#' + this.popupId);
	    this.containerelem = $('#' + this.container);
	    this.popupelem.hide();
	    //this.popupelem.append('<style>#' + this.popupId + ':after{margin-left: ' + (parseInt(_this.offset, 10)) + 'px} #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	    this.popupelem.append('<style>#' + this.popupId + ':after{ left: ' + (offsetArrow) + 'px} #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
	}

	_this.parent.click(function (e) {
	    _this.toggle();
	    if (_this.onSuccess) _this.onSuccess();
	});
	$(document).mouseup(function(e) {
	    var container = _this.parent;
		if(_this.parent.has(e.target).length === 0 && _this.popupelem.has(e.target).length === 0) {
		    _this.hide();
		}
	});
};

ArrowPopup.prototype.centerAlign = function () {
    var _this = this;
    // # start of center align arrow div
    if (_this.parent.length > 0) {
        var $this = _this.parent;
        var offset = $this.offset();
        var width = $this.width();
        var height = $this.height();

        var centerX = offset.left + width / 2;
        var centerY = offset.top + height / 2;
        var offsetArrow = centerX - 10;

        var bodyWidth = this.popupelem.width();
        if (this.width)
            bodyWidth = this.width;

        var offsetBody = offsetArrow - (bodyWidth / 2);
    }
    // # end of center align arrow div

    this.popupelem.find('style').remove();
    if ($(document).width() < offsetBody + this.width) {
        this.containerelem.find('.arrow-wrapper').css('left', $(document).outerWidth() - this.width);
    } else {
        this.containerelem.find('.arrow-wrapper').css('left', offsetBody);
    }
    this.popupelem.append('<style>#' + this.popupId + ':after{ left: ' + (offsetArrow) + 'px; border-bottom-color: ' + _this.backgroundCss + '} #' + this.popupId + ' > .arrow-container { background-color: ' + _this.backgroundCss + '; } #' + this.popupId + ' { width: ' + _this.width + 'px; }</style>');
};
ArrowPopup.prototype.show = function () {
    this.centerAlign();
    this.popupelem.slideDown();
    if (this.onShow) this.onShow();
};

ArrowPopup.prototype.hide = function() {
	this.popupelem.slideUp();
};

ArrowPopup.prototype.toggle = function() {
	if(this.popupelem.is(':visible')) {
		this.hide();
	} else {
		this.show();
	}
}