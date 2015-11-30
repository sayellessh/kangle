/* Version: 7 */
var PlayerTouches = {};
var Player = function (options) {
    this.options = options;
    this.assets = this.options.assets;
    
    Player.CoreREST._defaultServer = this.options.defaultServer;
    Player.Services.defaults.subdomainName = this.options.subdomainName;
    
    this.selectedAsset = null;
    this.selectedAssetStartTime = null;
    this.headerLogo = this.options.headerLogo;
    this.asset = this.options.asset,
    this.assetIdProperty = this.options.assetIdProperty,
    this.assetThumbnailProperty = this.options.assetThumbnailProperty,
    this.assetURLProperty = this.options.assetURLProperty,
    this.assetDescriptionProperty = this.options.assetDescriptionProperty,
    this.encodedDoc = this.options.encodedDoc;

    this.videoUrlProperty = this.options.videoUrlProperty;

    this.beforeShow = this.options.beforeShow;
    this.onPlayerClose = this.options.onPlayerClose;
    this.onAssetChange = this.options.onAssetChange;

    this.beforeSlideChange = this.options.beforeSlideChange;
    this.afterSlideChange = this.options.afterSlideChange;

    this.onlineLoad = this.options.onlineLoad;

    this.bindStart = 0;
    this.bindLimit = 10;

    this.containerHeight = 0;
    this.selectedAsset = null;
    this.previousSelectedAsset = null;
    this.$header = null;
    this.$container = null;
    this.$trayWrapper = null;
    this.$trayContainer = null;

    this.assetScrolltype = null;

    this.scrolltype = this.options.scrolltype;
    this.totalHeightToRemove = 40;
    this.scrolltypes = { document: "document", slide: "slide", other: "other" };

    this.defaultAjaxMethod = "GET";
    this.trayElementHeight = 150;
    this.outerLiWidthAdjustment = 114;
    this.msgEmptyPages = "No Pages available to display.";
    this.msgMinimizeTray = "Minimize Tray";
    this.msgVideoNotSupported = "Your user agent does not support the HTML5 Video element.";
    this.msgZoomBlocked = "Zoom not allowed until image is fully loaded.";
};

Player.defaultScrolltype = [ {
	type : "slide",
	extensions : [ "ppt", "pptx" ]
}, {
	type : "document",
	extensions : [ "xls", "xlsx", "doc", "docx", "pdf" ]
} ];

Player.getAssetImages = function(assets, idProperty, success, failure) {
	var daCodes = new Array();
	for(var i=0;i<=assets.length-1;i++) {
		var a = assets[i];
		daCodes.push(a[idProperty]);
	}
	Player.Services.getAssetImages(daCodes, assets, idProperty, function(data, idProperty, assets) {
		var assets = Player.overrideAssetsWithImages(assets, idProperty, data);
		if(success) success(assets);
	}, function(e) {
		if(failure) failure(e);
	});
};
Player.overrideAssetsWithImages = function(assets, idProperty, imagesArray) {
	if(assets != null && assets.length > 0) {
		var result = new Array();
		for(var i=0;i<=assets.length-1;i++) {
			var asset = assets[i];
			for(var j=0;j<=imagesArray.length-1;j++) {
				var imageArray = imagesArray[j];
				if(asset[idProperty] == imageArray[idProperty]) {
					$.extend(true, asset, imageArray);
				}
			}
			result.push(asset);
		}
		return result;
	} else {
		return assets;
	}
};

Player.getAssetImagesAlt = function (assets, idProperty, cIdProperty, success, failure) {
    var daCodes = new Array();
    for (var i = 0; i <= assets.length - 1; i++) {
        var a = assets[i];
        daCodes.push(a[idProperty]);
    }
    Player.Services.getAssetImagesAlt(daCodes, assets, idProperty, cIdProperty, function (data, idProperty, cIdProperty, assets) {
        var assets = Player.overrideAssetsWithImages(assets, idProperty, cIdProperty, data);
        if (success) success(assets);
    }, function (e) {
        if (failure) failure(e);
    });
};
Player.overrideAssetsWithImagesAlt = function (assets, idProperty, cIdProperty, imagesArray) {
    if (assets != null && assets.length > 0) {
        var result = new Array();
        for (var i = 0; i <= assets.length - 1; i++) {
            var asset = assets[i];
            for (var j = 0; j <= imagesArray.length - 1; j++) {
                var imageArray = imagesArray[j];
                if (asset[idProperty] == imageArray[cIdProperty]) {
                    $.extend(true, asset, imageArray);
                }
            }
            result.push(asset);
        }
        return result;
    } else {
        return assets;
    }
};

Player.CoreREST = {
	_defaultServer : null,

	_addContext : function(url, context) {
		if (context != null && context.length > 0) {
			for ( var key in context) {
				url += context[key] + '/';
			}
		}
		return url;
	},
	
	_raw : function(url, requestType, context, data, success, failure) {
		$.support.cors = true;
		url = this._addContext(url, context);
		if (data == null) {
			data = {};
		}
		$.ajax({
			url : url,
			type : requestType,
			crossDomain : true,
			data : data,
			dataType : "json",
			timeout: 10000,
			async : true,
			cache : false,
			success : function(response) {
				success(response);
			},
			error : function(a, b, c) {
				if (failure)
					failure(a);
			},
			complete : function(xhr, status) {
			}
		});
	},
	
	_rawAlt : function(url, requestType, context, data, success, failure) {
		$.support.cors = true;
		url = this._addContext(url, context);
		if (data == null) {
			data = {};
		}
		data = JSON.stringify(data);
		$.ajax({
			url : url,
			type : requestType,
			crossDomain : true,
			timeout: 10000,
			contentType : 'application/json',
			data : data,
			async : true,
			cache : false,
			beforeSend : function(jqXHR, settings) {

			},
			success : function(response) {
				success(response);
			},
			error : function(a, b, c) {
				console.log('failure due to network connection');
				if (failure)
					failure(a);
			},
			complete : function(xhr, status) {
			}
		});
	},
	
	post : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'POST', context, data, success, failure);
	},

	postArray : function(restClass, context, data, success, failure) {
		this._rawAlt(this._defaultServer, 'POST', context, data, success,
				failure);
	},

	put : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'POST', context, data, success, failure);
	},

	remove : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'POST', context, data, success, failure);
	},

	get : function(restClass, context, data, success, failure) {
		this._raw(this._defaultServer, 'GET', context, data, success, failure);
	}
};

Player.Services = {
	defaults: {
	    subdomainName: "",
	    companyId: ""
	},
	context: {
        asset: 'AssetApi'
    },
    getAssetImages: function (data, assets, idProperty, success, failure) {
        var _this = Player.Services;
        var context = [_this.context.asset, 'getAssetImages', _this.defaults.subdomainName, _this.defaults.companyId];
        Player.CoreREST.postArray(_this, context, data, function(returnData) {
        	if(success) success(returnData, idProperty, assets);
        }, failure);
    },
    getAssetImagesAlt: function (data, assets, idProperty, cIdProperty, success, failure) {
        var _this = Player.Services;
        var context = [_this.context.asset, 'getAssetImages', _this.defaults.subdomainName, _this.defaults.companyId];
        Player.CoreREST.postArray(_this, context, data, function (returnData) {
            if (success) success(returnData, idProperty, cIdProperty, assets);
        }, failure);
    }
};

Player.prototype.init = function () {
    var _this = this;
    this.hide();
    _this.containerHeight = window.innerHeight;
    var $body = $("body");
    $body.addClass("s-player-open");

    var $player = $("<div class=\"s-player\">");

    // loading header contents
    var $header = $("<div class=\"s-player-header\" id=\"s-player-header\">");
    var $headerSlide = $("<a href=\"#\" class=\"fa fa-ellipsis-v\" style=\"font-size: 40px; text-decoration: none; color: black;\" id=\"sTrayRightElem\"></a>");
    $headerSlide.bind("click", function (e) {
        if ($(".s-player-rightelem:visible").length > 0) {
            return _this.showOrHideRightElem(false);
        } else {
            return _this.showOrHideRightElem(true);
        }
    });
    $header.append($headerSlide);
    this.$header = $header;

    if (this.headerLogo != null) {
        var $headerLogo = $("<img src=\"" + this.headerLogo + "\">");
        $header.bind("click", function (e) {
            if ($(".s-player-rightelem:visible").length > 0) {
                return _this.showOrHideRightElem(false);
            } else {
                return _this.showOrHideRightElem(true);
            }
        });
        $header.append($headerLogo);
    }
    
    //close button
    var $headerClose = $("<a href=\"#\" class=\"fa fa-close\" style=\"font-size: 40px; text-decoration: none; color: black; float:right;margin-top: 1px; padding-left:10px;\" id=\"sTrayCloseElem\"></a>");
    $header.append($headerClose);
    //close button
    
    // loading container contents
    var $container = $("<div class=\"s-player-container\" id=\"s-player-container\">");

    // binding tray elements
    this.$container = $container;
    this.bindAsset($container, this.assets[0]);
    
    // loading tray contents
    var $tray = $("<div class=\"s-player-tray\" id=\"s-player-tray\">");
    var $trayMinimizeDiv = $("<div class=\"s-player-tray-minimize\">");
    var $trayMinimizeBtn = $("<a href=\"#\" id=\"sTrayMinimizeTray\">" + this.msgMinimizeTray + "</a>");
    $trayMinimizeBtn.bind("click", function (e) {
        return _this.showOrHideTray();
    });
    
    var $trayCloseDiv = $("<div class=\"s-player-close\">");
    var $trayCloseBtn = $("<span class=\"player-close-btn\" style=\"cursor: pointer; font-size: 30px; color: #00AFF0;\"></span>");
    $trayCloseBtn.bind("click", function (e) {
        if (_this.beforeSlideChange) {
            var $prevElement = $(".s-player-element:visible");
            _this.beforeSlideChange(null, $prevElement);
        }
        if (_this.onPlayerClose)
            _this.onPlayerClose(_this.selectedAsset, _this.previousSelectedAsset);
        return _this.hide();
    });
    // binding tray ready
    this.bindTray($tray);
    $trayMinimizeDiv.append($trayMinimizeBtn);
    $trayCloseDiv.append($trayCloseBtn);
    $tray.append($trayMinimizeDiv);
    $tray.append($trayCloseDiv);
    
    //close button 
    $headerClose.bind("click",function(e) {
    	$trayCloseBtn.trigger("click");
    });
    //close button
    
    // loading footer contents
    if (_this.options.footerText != null)
        footerText = _this.options.footerText;
    else
        footerText = "Powered by Swaas";
    var $footer = $("<div class=\"s-player-footer\" id=\"s-player-footer\">");
    $footer.append(footerText);

    $player.append($header);
    $player.append($container);
    $player.append($tray);
    //$player.append($footer);

    $body.append($player);
    this.fitContainerHeight();
    this.showOrHideTray();
    this.initResizeEvents();
    this.showOrHideRightElem(true);
};

Player.prototype.bindAsset = function ($container, asset) {
    var _this = this;
    
    if (this.selectedAsset != null)
        this.previousSelectedAsset = this.selectedAsset;
    this.selectedAsset = asset
    this.assetScrolltype = this.scrolltypes.other;

    if (this.onlineLoad != null && _this.encodedDoc != null) {
        var _onlineLoad = this.onlineLoad;
        var url = _onlineLoad.url;
        var method = ((_onlineLoad.method != null && _onlineLoad.method.length > 0) ? _onlineLoad.method : _this.defaultAjaxMethod);
        var data = _onlineLoad.getData(asset);
        _this.loadAjax(url, method, data, function (data) {
            asset[_this.encodedDoc.encodedProperty] = data;
            _this.bindLoadedAsset($container, asset);
        }, function (e) {
            _this.bindLoadedAsset($container, asset);
        });
    } else {
        _this.bindLoadedAsset($container, asset);
    }
};

Player.prototype.bindLoadedAsset = function ($container, asset) {
    var _this = this;
    var ext = this.getExtension(asset);

    if (this.encodedDoc != null && asset[this.encodedDoc.encodedProperty] != null
            && asset[this.encodedDoc.encodedProperty].length > 0) {
        if (this.scrolltype != null && this.scrolltype.length > 0) {
            var scrolltype = null;
            for (var i = 0; i <= this.scrolltype.length - 1; i++) {
                var cScrollType = this.scrolltype[i];
                if (cScrollType.extensions != null && cScrollType.extensions.indexOf(ext) >= 0) {
                    scrolltype = cScrollType.type;
                    break;
                }
            }
            if (scrolltype != null) {
                this.assetScrolltype = scrolltype;
                this.bindDocument($container, asset, scrolltype, 0, 10);
            } else {
                this.assetScrolltype = this.scrolltypes.other;
                this.bindDefaultDocument($container, asset);
            }
        } else {
            this.assetScrolltype = this.scrolltypes.document;
            this.bindDocument($container, asset, this.scrolltypes.document, 0, 10);
        }
    } else {
        this.assetScrolltype = this.scrolltypes.other;
        this.bindDefaultDocument($container, asset);
    }
    this.showOrHideRightElem(true);
    if (this.assetScrolltype == this.scrolltypes.slide
            || this.assetScrolltype == this.scrolltypes.other)
        $(".s-player-container").addClass("s-noscroll");
    else
        $(".s-player-container").removeClass("s-noscroll");

    if (this.onAssetChange)
        this.onAssetChange(this.selectedAsset, this.previousSelectedAsset);
};

Player.prototype.getExtension = function (asset) {
    var index = asset[this.assetURLProperty].lastIndexOf(".");
    var ext = asset[this.assetURLProperty].substring(index + 1);
    return ext;
};

Player.prototype.bindTray = function ($tray) {
    var _this = this;
    var assets = this.assets;
    if (assets != null && assets.length > 0) {
        this.$trayWrapper = $("<div class=\"s-player-tray-wrapper\">");
        this.$trayContainer = $("<ul class=\"s-player-tray-container\">");
        var outerLiWidth = 0;
        for (var i = 0; i <= assets.length - 1; i++) {
            var iAsset = assets[i];
            var $trayElem = $("<li class=\"s-player-tray-element" + (i == 0 ? " active" : "") + "\"><img src=\""
                + iAsset[this.assetThumbnailProperty] + "\"><p>" + iAsset[this.assetDescriptionProperty] + "</p></li>");
            $trayElem.data("asset", iAsset);
            $trayElem.bind("click", function (e) {
                var cAsset = $(this).data("asset");
                $(".s-player-tray-element").removeClass("active");
                $(this).addClass("active");
                //$(".s-player-element").hide();
                //$("#s-player-element-" + cAsset[_this.assetIdProperty]).show();
                _this.bindAsset(_this.$container, cAsset);
            });
            this.$trayContainer.append($trayElem);
            outerLiWidth += _this.outerLiWidthAdjustment;
        }
        this.$trayWrapper.append(this.$trayContainer);
        $tray.append(this.$trayWrapper);
        
        var docWidth = $(document).width();
        this.$trayWrapper.width(docWidth - 60);
        this.$trayContainer.width(outerLiWidth);
    }
    if (assets != null && assets.length <= 1){
    	$tray.hide();
    }
};

Player.prototype.bindDefaultDocument = function ($container, asset) {
    $container.empty();
    var _this = this;
    var ext = this.getExtension(asset);
    if (ext == "pdf") {
        if (_this.isMobile()) {
            window.open("https://docs.google.com/viewer?url=" + asset[this.assetURLProperty] + "&embedded=true", "_blank", "directories=no,location=no,status=no,scrollbars=no,resizable=no");
        } else {
            var $iframe = $("<iframe>");
            $iframe.attr("src", "https://docs.google.com/viewer?url=" + asset[this.assetURLProperty] + "&embedded=true");
            $container.append($iframe);
        }
    } else if (ext == "docx" || ext == "doc" || ext == "ppt" || ext == "pptx" || ext == "xlsx" || ext == "xls") {
        if (_this.isMobile()) {
            window.open("http://view.officeapps.live.com/op/view.aspx?src=" + asset[this.assetURLProperty], "_blank", "directories=no,location=no,status=no,scrollbars=no,resizable=no");
        } else {
            var $iframe = $("<iframe>");
            $iframe.attr("src", "http://view.officeapps.live.com/op/view.aspx?src=" + asset[this.assetURLProperty]);
            $container.append($iframe);
        }
    } else if (ext == "jpg" || ext == "png" || ext == "jpeg" || ext == "gif" || ext == "bmp") {
        var $page = $("<div class=\"s-player-element\" id=\"s-player-element-" + asset[this.assetIdProperty] + "\">");
        var $img = $("<img src=\"" + asset[this.assetURLProperty] + "\">");
        $page.append($img);
        $container.append($page);
    } else if (ext == "zip") {
        alert("This asset can only be viewed on offline mode.");
    } else if (ext == "html") {
        alert("This asset can only be viewed on offline mode.");
    } else if (ext == "mp4") {
        if (asset[this.videoUrlProperty] != null && asset[this.videoUrlProperty].length > 0) {
            _this.putEncodedVideo($container, asset, "video/mp4");
        } else {
            var $video = $("<video autoplay poster=\"http://buildingbeyondthefourwalls.files.wordpress.com/2011/08/video-icon.jpg\" preload=\"none\" controls=\"\" id=\"video-player\" tabindex=\"0\">");
            var $vdo = $("<source type=\"video/mp4\" id=\"vdo\" />");
            var $noSupport = $("<p>" + this.msgVideoNotSupported + "</p>");
            $video.height(_this.containerHeight - _this.totalHeightToRemove);
            $video.append($vdo);
            $video.append($noSupport);
            $vdo.attr("src", asset[this.assetURLProperty]);
            $container.append($video);
        }
    } else if (ext == "wmv") {
        if (asset[this.videoUrlProperty] != null && asset[this.videoUrlProperty].length > 0) {
            _this.putEncodedVideo($container, asset, "video/mp4");
        } else {
            var $video = $("<video autoplay poster=\"http://buildingbeyondthefourwalls.files.wordpress.com/2011/08/video-icon.jpg\" preload=\"none\" controls=\"\" id=\"video-player\" tabindex=\"0\">");
            var $vdo = $("<source type=\"video/x-ms-wmv\" id=\"vdowmv\" />");
            var $noSupport = $("<p>" + this.msgVideoNotSupported + "</p>");
            $video.height(_this.containerHeight - _this.totalHeightToRemove);
            $video.append($vdo);
            $video.append($noSupport);
            $vdo.attr("src", asset[this.assetURLProperty]);
            $container.append($video);
        }
    } else if (ext == "swf") {
        $("#objSwf").show();
        $("#objSwf").attr("data", asset[this.assetURLProperty]);
    }
};

Player.prototype.putEncodedVideo = function ($container, asset, type) {
    var _this = this;
    $("#labelVideoQuality").remove();
    $("#selectVideoQuality").remove();
    $(".s-player-hint").remove();
    var $resolutionLabel = $("<label id=\"labelVideoQuality\">Video Quality<label>");
    var $resolutionSelect = $("<select id=\"selectVideoQuality\">");
    //var $resolutionLabel = $("<label>Video Quality<label>");
    //var $resolutionSelect = $("<select>");
    var cnt = 0;
    for (var i = 0; i <= asset[this.videoUrlProperty].length - 1; i++) {
        var resolutionProp = asset[this.videoUrlProperty][i];
        console.log(resolutionProp);
        var sResProp = resolutionProp.split("~");
        if (sResProp.length >= 2) {
            var $resolutionOption = $("<option value=\"" + sResProp[1] + "\">" + (cnt == 0 ? "Low":("High " + cnt)) + "</option>");
            $resolutionSelect.append($resolutionOption);
            cnt++;
        }
    }
    this.$header.append($resolutionSelect);
    this.$header.append($resolutionLabel);
    this.putVideo($container, $resolutionSelect.val(), type);
    $resolutionSelect.bind("change", function (e) {
        _this.putVideo($container, $resolutionSelect.val(), type);
    });
    $container.append("<span class=\"s-player-hint\"><span class=\"arrow-up\"></span><label>Change Video Quality Here</label><a href=\"#\" onclick=\"return false;\" class=\"s-player-hint-close\">Close</a></span>");
    $(".s-player-hint-close", $container).bind("click", function (e) {
        $(".s-player-hint").remove();
        return false;
    });
};

Player.prototype.putVideo = function ($container, url, type) {
    var _this = this;
    var $video = $("<video autoplay poster=\"http://buildingbeyondthefourwalls.files.wordpress.com/2011/08/video-icon.jpg\" preload=\"none\" controls=\"\" id=\"video-player\" tabindex=\"0\">");
    var $vdo = $("<source type=\"" + type + "\" id=\"vdo\" />");
    var $noSupport = $("<p>" + this.msgVideoNotSupported + "</p>");
    $video.height(_this.containerHeight - _this.totalHeightToRemove);
    $video.append($vdo);
    $video.append($noSupport);
    $vdo.attr("src", url);
    $container.html($video);
    
    this.initResizeEvents();
}

Player.prototype.bindDocument = function ($container, asset, scrolltype, offset, limit) {
    var _this = this;
    var fresh = false;
    if (offset == 0) {
        fresh = true;
        $container.empty();
    }
    var assetEncoded = asset[this.encodedDoc.encodedProperty];
    if (assetEncoded != null && assetEncoded.length > 0) {
        var showMore = true;
        if (offset + limit >= assetEncoded.length) {
            showMore = false;
        }
        if (offset < asset.length) {
            return;
        }
        // binding contents to container
        if ($("#s-player-rightelem").length <= 0) {
            var $rightElem = $("<div class=\"s-player-rightelem\" id=\"s-player-rightelem\">");
        } else {
            var $rightElem = $("#s-player-rightelem");
            $rightElem.find("#btnShowMore").remove();
        }
        for (var i = offset; i <= assetEncoded.length - 1; i++) {
            if (i < offset + limit) {
                var iAsset = assetEncoded[i];
                var docImg = iAsset[this.encodedDoc.encodedUrlProperty];
                if (docImg == null) {
                    docImg = iAsset;
                }
                var $page = $("<div class=\"s-player-thumbnail\" id=\"s-player-thumbnail-" + asset[this.assetIdProperty] + "-" + i + "\">");
                $page.data("asset-index", i);
                $page.data("asset", asset);
                $page.bind("click", function (e) {
                    var assetIndex = $(this).data("asset-index");
                    var assetId = $(this).data("asset")[_this.assetIdProperty];
                    var elementId = "#s-player-element-" + assetId + "-" + assetIndex;
                    if (scrolltype == _this.scrolltypes.slide) {
                        _this.showSlideElement($(elementId));
                    } else {
                        $('.s-player-container').scrollTo(elementId, { duration: 'slow', offsetTop: '50' });
                    }
                });
                var $img = $("<img src=\"" + docImg + "\">");
                var $p = $("<p>Page " + (i + 1) + "</p>");
                $page.append($img);
                $page.append($p);
                $rightElem.append($page);
            } else {
                break;
            }
        }
        if (showMore) {
            var $divShowMore = $("<div class=\"s-player-thumbnail s-player-btnshowmore\" id=\"btnShowMore\">");
            var $btnShowMore = $("<p>Show More</p>");
            _this.nextOffset = offset + limit;
            $btnShowMore.bind("click", function (e) {
                _this.bindDocument(_this.$container, _this.selectedAsset, _this.assetScrolltype, _this.nextOffset, _this.bindLimit);
            });
            $divShowMore.append($btnShowMore);
            $rightElem.append($divShowMore);
        }
        if (fresh) {
            $container.append($rightElem);
        }

        // binding pages
        for (var i = offset; i <= assetEncoded.length - 1; i++) {
            if (i < offset + limit) {
                var iAsset = assetEncoded[i];
                var docImg = iAsset[this.encodedDoc.encodedUrlProperty];
                if (docImg == null) {
                    docImg = iAsset;
                }
                var $page = $("<div class=\"s-player-element " + (scrolltype) + "\" id=\"s-player-element-" + asset[this.assetIdProperty] + "-" + i + "\">");
//                var $pageImg = $("<div class=\"s-player-element-image\">");
                
                //if (scrolltype == this.scrolltypes.slide) {
//                    var $zoomContainer = $("<div class=\"zoom-player\">");
//                    var $zoomIn = $("<a href=\"#\" class=\"fa fa-search-plus\"></a>");
//                    $zoomIn.bind("click", function (e) {
//                        var $playerElem = $($(this).parents(".s-player-element").find("img"));
//                        var cZoom = $playerElem.data("ratio");
//                        if (cZoom == null)
//                            cZoom = 1;
//                        else
//                            cZoom = parseFloat(cZoom);
//                        if (cZoom != null && cZoom >= 0 && cZoom < 10)
//                            $playerElem.data("ratio", cZoom + 0.5);
//                        else
//                            $playerElem.data("ratio", 0);
//                        _this.zoomImage($playerElem, 0.5);
//                    });
//
//                    var $zoomOut = $("<a href=\"#\" class=\"fa fa-search-minus\"></a>");
//                    $zoomOut.bind("click", function (e) {
//                        var $playerElem = $($(this).parents(".s-player-element").find("img"));
//                        console.log($playerElem);
//                        var cZoom = $playerElem.data("ratio");
//                        if (cZoom == null)
//                            cZoom = 1;
//                        else
//                            cZoom = parseFloat(cZoom);
//                        if (cZoom != null && cZoom > 1 && cZoom <= 10)
//                            $playerElem.data("ratio", cZoom - 0.5);
//                        else
//                            $playerElem.data("ratio", 0);
//                        _this.zoomImage($playerElem, 0);
//                    });
//                    $zoomContainer.append($zoomIn);
//                    $zoomContainer.append($zoomOut);
//                    $page.append($zoomContainer);
                //}

                var $img = $("<img src=\"" + docImg + "\">");
                var width = $img.width(); // Current image width
                var height = $img.height(); // Current image height

                $img.data("img-size", [width, height]);
                $img.load(function (e) {
                    var width = $(this).width(); // Current image width
                    var height = $(this).height(); // Current image height

                    $(this).data("img-ready", true);
                    $(this).data("img-size", [width, height]);
                    if (scrolltype == _this.scrolltypes.slide)
                        _this.fitElementHeight($(this).parent(), $(this));
                });
//                $pageImg.append($img);
                $page.append($img);
                if (fresh) {
                    $container.append($page);
                } else {
                    $container.find(".s-player-element").last().after($page);
                }
                if (scrolltype == this.scrolltypes.slide) {
                    //this.fitElementHeight($page, $img);
                    if (i != 0)
                        $page.hide();
                }
            } else {
                break;
            }
        }
        if (scrolltype == this.scrolltypes.slide) {
            _this.fitElementHeight($(".s-player-element:visible"), $(".s-player-element:visible img"));
        }
        if (fresh && scrolltype == this.scrolltypes.slide) {
            var $leftSideNav = $("<div class=\"s-player-slide left\"></div>");
            $leftSideNav.bind("click", function (e) {
                var visibleElement = $(".s-player-element:visible");
                var nextElem = visibleElement.prev();
                _this.showSlideElement(nextElem);
            });
            var $rightSideNav = $("<div class=\"s-player-slide right\"></div>");
            $container.append($leftSideNav);
            $container.append($rightSideNav);
            $rightSideNav.bind("click", function (e) {
                var visibleElement = $(".s-player-element:visible");
                var nextElem = visibleElement.next();
                _this.showSlideElement(nextElem);
            });
        }
    } else {
        var $empty = $("<div class=\"empty\">" + this.msgEmptyPages + "</div>");
        $container.append($empty);
    }
    this.showOrHideRightElem(true);
    this.initResizeEvents();
    this.fitContainerHeight();
};

Player.prototype.showSlideElement = function ($element) {
    var _this = this;
    if (this.beforeSlideChange) {
        var $prevElement = $(".s-player-element:visible");
        this.beforeSlideChange($element, $prevElement);
    }
    if ($element.length > 0 && $element.hasClass("s-player-element")) {
        $(".s-player-element").hide();
        $element.show();
        _this.fitElementHeight($(".s-player-element:visible"), $(".s-player-element:visible img"));
        //_this.onSlideVisible($(".s-player-element:visible"));
    }
    if (this.afterSlideChange) {
        var $afterElement = $(".s-player-element:visible");
        this.afterSlideChange($afterElement);
    }
    _this.showOrHideRightElem(false);
};

Player.prototype.fitContainerHeight = function () {
    var _this = this;
    var totalHeightToRemove = (0);
	//var totalHeightToRemove = _this.totalHeightToRemove;
    var totalBodyHeight = window.innerHeight;
    this.containerHeight = (totalBodyHeight - totalHeightToRemove);
    $(".s-player-container").height(this.containerHeight);
    $(".s-player-rightelem").height(this.containerHeight - _this.totalHeightToRemove);
    if ($(".s-player-element").hasClass(this.scrolltypes.slide)
            || $(".s-player-element").hasClass(this.scrolltypes.other)) {
        $(".s-player-container").css("overflow", "hidden");
    } else {
        $(".s-player-container").css("overflow", "auto");
    }
};

Player.prototype.fitElementHeight = function ($page, $img) {
    var _this = this;
//    var elemHeight = this.containerHeight - 40;
//    var elemWidth = $(document).width() - 50;
	var elemHeight = this.containerHeight - _this.totalHeightToRemove;
	var elemWidth = $(document).width();
    if (elemWidth > 900)
        elemWidth = 900;
    $page.width(elemWidth);
    $page.height(elemHeight);
//    console.log($page.find(".s-player-element-image"));
//    $page.find(".s-player-element-image").height(elemWidth);
//    $page.find(".s-player-element-image").height(elemHeight);
    $img.width(elemWidth);
    $img.css("height", "auto");
    
    var maxWidth = elemWidth; // Max width for the image
    var maxHeight = elemHeight; // Max height for the image
    var ratio = 0; // Used for aspect ratio
    var width = $img.width(); // Current image width
    var height = $img.height(); // Current image height

    var scaleSize = this.scaleSize(0, maxHeight, width, height);

    $page.width(scaleSize[0]);
    $page.height(scaleSize[1]);
    $page.css("overflow", "hidden");
//    $page.find(".s-player-element-image").height(elemWidth);
//    $page.find(".s-player-element-image").height(elemHeight);
    $img.width(scaleSize[0]);
    $img.height(scaleSize[1]);
    
    width = $img.width(); // Current image width
    height = $img.height(); // Current image height
    
    $img.data("img-size", [width, height]);
    
    var topMargin = ($(window).height() - _this.totalHeightToRemove - $page.height()) / 2;
    $page.css("margin-top", topMargin + "px");
    
    var leftMargin = ($(window).width() - $page.width()) / 2;
    $page.css("margin-left", leftMargin + "px");
};

Player.prototype.showOrHideTray = function (toShow) {
    if (document.getElementById("s-player-tray").style.bottom == 0 || document.getElementById("s-player-tray").style.bottom == "0px") {
        document.getElementById("sTrayMinimizeTray").innerHTML = "Maximize Tray";
        document.getElementById("s-player-tray").style.bottom = "-" + this.trayElementHeight + "px";
    } else {
        document.getElementById("sTrayMinimizeTray").innerHTML = "Minimize Tray";
        document.getElementById("s-player-tray").style.bottom = "0px";
    }
    this.showOrHideRightElem(false);
    return false;
};

Player.prototype.showOrHideRightElem = function (toShow) {
    if (document.getElementById("s-player-rightelem") != null) {
        if (toShow) {
            document.getElementById("s-player-rightelem").style.display = "block";
        } else {
            document.getElementById("s-player-rightelem").style.display = "none";
        }// else {
        //    document.getElementById("s-player-rightelem").style.display = "block"
        //}
    }
    return false;
}

Player.prototype.zoomImage = function ($img, ratio, zoomType) {
	var _this = this;
	if($img.data("img-ready") == true) {
		if (ratio >= 0.5) {
	    	var imgSize = $img.data("img-size");
	        var currW = imgSize[0];
	        var currH = imgSize[1];
	        var parent = $img.parent();
	        //var currParHgt = parent.height();
	        parent.css("overflow", "auto");
//	        if (zoomType) {
	            $img.width(currW * ratio);
	            $img.height(currH * ratio);
//	        } else {
//	            $img.width(currW / ratio);
//	            $img.height(currH / ratio);
//	        }
	        //if (_this.assetScrolltype == _this.scrolltypes.slide)
	        //	parent.height(currParHgt);
	    } else {
	        var imgSize = $img.data("img-size");
	        var currW = imgSize[0];
	        var currH = imgSize[1];
	        var parent = $img.parent();
	        parent.css("overflow", "hidden");
//	        $img.width(parent.width());
//	        $img.height(parent.height());
//	        if (this.assetScrolltype == this.scrolltypes.slide) {
//	            $img.width(parent.width());
//	            $img.height(parent.height());
//	        } else {
	            $img.width(currW);
	            $img.height(currH);
//	        }
	    }
	} else {
		alert(_this.msgZoomBlocked);
	}
};
Player.prototype.scaleSize = function (maxW, maxH, currW, currH) {
    var ratio = (currH / currW);

    if(maxW > 0 && currW >= maxW && ratio <= 1){
        currW = maxW;
        currH = currW * ratio;
    } else if(currH >= maxH){
        currH = maxH;
        currW = currH / ratio;
    }
    return [currW, currH];
};
Player.prototype.hide = function () {
    $("body").removeClass("s-player-open");
    $(".s-player").remove();
};

Player.prototype.show = function () {
    if (this.beforeShow) this.beforeShow();
    this.init();
};

Player.prototype.initResizeEvents = function () {
    var _this = this;
    $(document).unbind("click").bind("click", function (e) {
        if (!$(e.target).parent().hasClass("s-player-btnshowmore"))
            _this.showOrHideRightElem(false);
    });

//    $('.s-player-element-image').bind('doubletap swiperight swipeleft', function(e) { 
//    	if (e.type == "doubletap") {
//        	console.log('doubletap'); 
//    	} else if (e.type == "swiperight") {
//        	console.log('swiperight');
//    	} else if (e.type == "swipeleft") {
//        	console.log('swipeleft'); 
//    	}
//    });
    PlayerTouches.startPointX = 0;
    PlayerTouches.startPointY = 0;
    PlayerTouches.finalEndPointX = 0;
    PlayerTouches.finalEndPointY = 0;
    PlayerTouches.threshold = 50;
    PlayerTouches.tapped = null;
    PlayerTouches.swipeMode = false;
//    $(".s-player-element").mousedown(function (e) {
//        
//    });
//    $(".s-player-element").mouseup(function (e) {
//        
//    });
    
    $(".s-player-element").unbind("touchstart touchmove touchend").bind("touchstart touchmove touchend", function (e) {
    	var playerElement = $(e.target).parent();
        if (e.type == "touchstart") {
        	if (e.originalEvent.touches[0] != null) {
                PlayerTouches.startPointX = e.originalEvent.touches[0].pageX;
                PlayerTouches.startPointY = e.originalEvent.touches[0].pageY;
            }
        } else if (e.type == "touchmove") {
            PlayerTouches.swipeMode = true;
            setTimeout(function() {
            	PlayerTouches.swipeMode = false;
            }, 300);
            if (e.originalEvent.touches[0] != null) {
                PlayerTouches.finalEndPointX = e.originalEvent.touches[0].pageX;
                PlayerTouches.finalEndPointY = e.originalEvent.touches[0].pageY;
            }
        } else if (e.type == "touchend") {
        	if (playerElement.length > 0 && playerElement.css("overflow") == "auto") {
            	PlayerTouches.swipeMode = false;
            }
        	if(!PlayerTouches.swipeMode) {
        		if (!PlayerTouches.tapped) { // if tap is not set, set up single tap
            		PlayerTouches.tapped = setTimeout(function() {
            			console.log("timeout cleared");
            			PlayerTouches.tapped = null;
    					// insert things you want to do when single tapped
    				}, 500); // wait 500ms then run single click code
    			} else { // tapped within 500ms of last tap. double tap
    				clearTimeout(PlayerTouches.tapped); // stop single tap callback
    				PlayerTouches.tapped = null;
    				// insert things you want to do when double tapped
    				var $target = $(e.target);
    				if (playerElement.length > 0 && playerElement.css("overflow") == "auto") {
    					_this.zoomImage($target, 0);
    	            } else {
    	            	_this.zoomImage($target, 2);
    	            }
    			}
        	} else {
        		var currentThreshold = PlayerTouches.startPointY - PlayerTouches.finalEndPointY;
                currentThreshold = Math.abs(currentThreshold);
                
                if (currentThreshold <= PlayerTouches.threshold) {
                    if (PlayerTouches.startPointX > PlayerTouches.finalEndPointX) {
                    	console.log("swipe left");
                    	if (_this.assetScrolltype == _this.scrolltypes.slide) {
    	                    var visibleElement = $(".s-player-element:visible");
    	                    var nextElem = visibleElement.next();
    	                    _this.showSlideElement(nextElem);
                    	}
                    } else if (PlayerTouches.startPointX < PlayerTouches.finalEndPointX) {
                    	console.log("swipe right");
                    	if (_this.assetScrolltype == _this.scrolltypes.slide) {
    	                	var visibleElement = $(".s-player-element:visible");
    	                    var nextElem = visibleElement.prev();
    	                    _this.showSlideElement(nextElem);
                    	}
                    }
                }
        	}
        	
        	PlayerTouches.startPointX = 0;
            PlayerTouches.startPointY = 0;
            PlayerTouches.finalEndPointX = 0;
            PlayerTouches.finalEndPoinY = 0;
            PlayerTouches.swipeMode = false;
        }
        return true;
    });
    
    if (_this.assetScrolltype == _this.scrolltypes.slide) {
        //Firefox
        $('.s-player-container').unbind("DOMMouseScroll").bind('DOMMouseScroll', function (e) {
            if (_this.assetScrolltype != _this.scrolltypes.slide
                    || $(e.target).hasClass("s-player-rightelem")
                    || $(e.target).parents('.s-player-rightelem').length > 0)
                return true;
            var playerElement = $(e.target).parents(".s-player-element");
            if (playerElement.length > 0 && playerElement.css("overflow") == "auto") {
                return true;
            }
            if (e.originalEvent.detail > 0) {
                //scroll down
                var visibleElement = $(".s-player-element:visible");
                var nextElem = visibleElement.next();
                _this.showSlideElement(nextElem);
            } else {
                //scroll up
                var visibleElement = $(".s-player-element:visible");
                var nextElem = visibleElement.prev();
                _this.showSlideElement(nextElem);
            }
            //prevent page fom scrolling
            return false;
        });

        //IE, Opera, Safari
        $('.s-player-container').unbind('mousewheel').bind('mousewheel', function (e) {
            if (_this.assetScrolltype != _this.scrolltypes.slide
                    || $(e.target).hasClass("s-player-rightelem")
                    || $(e.target).parents('.s-player-rightelem').length > 0)
                return true;
            var playerElement = $(e.target).parents(".s-player-element");
            if (playerElement.length > 0 && playerElement.css("overflow") == "auto") {
                return true;
            }
            if (e.originalEvent.wheelDelta < 0) {
                //scroll down
                var visibleElement = $(".s-player-element:visible");
                var nextElem = visibleElement.next();
                _this.showSlideElement(nextElem);
            } else {
                //scroll up
                var visibleElement = $(".s-player-element:visible");
                var nextElem = visibleElement.prev();
                _this.showSlideElement(nextElem);
            }
            //prevent page fom scrolling
            return false;
        });
    } else {
    	$('.s-player-container').unbind('DOMMouseScroll');
    	$('.s-player-container').unbind('mousewheel');
    }
    $(window).off("resize");
    $(window).resize(function () {
        _this.fitContainerHeight();
        if(_this.assetScrolltype == _this.scrolltypes.slide)
            _this.fitElementHeight($(".s-player-element:visible"), $(".s-player-element:visible img"));

        var outerLiWidth = $(".s-player-tray-element").length * _this.outerLiWidthAdjustment;
        var docWidth = $(document).width();
        _this.$trayWrapper.width(docWidth - 100);
        _this.$trayContainer.width(outerLiWidth);
//    	if(_this.selectedAsset != null && _this.$container)
//    		_this.bindAsset(_this.$container, _this.selectedAsset);
    });
};

Player.prototype.onElementVisibleOnScreen = function () {
    var _this = this;
    $(window).scroll(function () {
        $(".s-player-element").each(function (i, el) {
            var el = $(el);
            if (el.visible(true)) {
                _this.onSlideVisible(el);
            }
        });
    });
};

Player.prototype.onSlideVisible = function ($element) {
    console.log($element);
};


Player.prototype.loadAjax = function (url, method, data, success, failure) {
    $.ajax({
        url: url,
        type: method,
        data: data,
        complete: function(data) {
            if (data != null && data.statusText == 200) {
                if (success) success(data.responseText);
            } else {
                if (failure) failure(data);
            }
        }
    });
};

Player.prototype.isMobile = function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
};

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// global jquery scrollto definition
$.fn.scrollTo = function (target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) { callback = options; options = target; }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 50,
        duration: 500,
        easing: 'swing'
    }, options);
    return this.each(function () {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({ scrollTop: scrollY }, parseInt(settings.duration), settings.easing, function () {
            if (typeof callback == 'function') { callback.call(this); }
        });
    });
};