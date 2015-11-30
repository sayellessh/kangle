var firstPlay = true;
var Player = function (options) {
    this.options = options;
    this.selectedAsset = null;
    this.selectedAssetStartTime = null;
};

Player.prototype.init = function () {
	this.hide();
    var html = $('<div class="container player_container">');
    html.append(this.createPanel());
    html.append(this.createTray());
    window.scrollTo(0, 0);
    $('body').append(html);
    this.createFrame(this.options.assets[0]);
    this.actions();
};
Player.prototype.createPanel = function () {
    var html = '<div class="panel">';
    html += '<div class="tabs-stage"><div id="tab-1" class="tabs-cont" style="display: block; min-height: 100%;">';
    html += '<iframe id="myIframe" style="background:#fff; display: none;" frameborder="0" scrolling="auto" ></iframe>';
    html += '<img id="img-viewer" alt="" height="100%" style="display: none;"/>';
    html += '<video autoplay poster="http://buildingbeyondthefourwalls.files.wordpress.com/2011/08/video-icon.jpg" preload="none" ' +
        'controls id="video" tabindex="0" style="display:none; width: 100%;">' +
        '<source src="" type="video/mp4" id="vdo" /><source src="" type="video/x-ms-wmv" id="vdomwv" />' +
        'Your user agent does not support the HTML5 Video element' +
        '</video>';
    html += '<object type="application/x-shockwave-flash" id="objSwf" style="width: 100%; ">' +
        '<param name="allowfullscreen" value="true">' +
        '<param name="allowscriptaccess" value="always">' +
        '</object>';
    html += '</div><div id="tab-2" class="tabs-cont" style="display: none;">' +
        '</div></div>';
    html += '</div>';
    return html;
};
Player.prototype.createTray = function () {
    var $tray = $('<div class="tray">');
    var $assetAction = $('<div class="asset_action">');
    $assetAction.append('<div id="player_back" title="Back" onclick="return false"></div>');
    var $assetSlider = $('<div class="asset_slider">');
    var $itemDiv = $('<ul class="item_div">');
    var assets = this.options.assets;
    for (var i = 0; i <= assets.length - 1; i++) {
        var $item = $('<li class="item" id="' + assets[i].DA_Code + '" style="cursor: pointer;" onclick="return false"><img style="height: 50px;" class="asset_thumb" src="' + assets[i].DA_Thumbnail_URL + '" /><p style="margin: 0px; font-size: 11px; width: 75px; text-overflow: ellipsis; overflow: hidden;">' + assets[i].Asset_Name + '</p></li>');
        $item.data('asset', assets[i]);
        $itemDiv.append($item);
    }
    $assetSlider.append($itemDiv);
    $tray.append($assetAction);
    $tray.append($assetSlider);
    return $tray;
};
Player.prototype.createFrame = function (asset) {
	app.showLoading();
    var _this = this;
    var ext = this.getExtension(asset);
    var hgt = $('.tabs-stage').height() - 90;
    $('#img-viewer, #myIframe, #video, #objSwf').hide();
    
    if (ext == 'pdf' || ext == 'docx' || ext == 'doc' || ext == 'ppt' || ext == 'pptx' 
    	|| ext == 'xlsx' || ext == 'xls') {
    	courseFile.start(_this.options.course.Course_ID, asset, function(fileUrl){
    		app.hideLoading();
    		_this.analyticsInsert(asset);    	
    		window.plugins.fileOpener.open(fileUrl);
    	});
    } else if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp') {
    	app.hideLoading();
    	_this.analyticsInsert(asset);
    	var img = $('<img/>');
        img.load(function () {
        	app.hideLoading();
            var imgWid = this.width,
            imgHgt = this.height;
            var tWid = $('.tabs-stage').outerWidth(),
             tHgt = $('.tabs-stage').height();
            if (imgWid < tWid) {
                $("#img-viewer").show().attr('src', asset.File_Path).width(imgWid);
                if (imgHgt > tHgt) {
                    var hgt = imgWid / imgHgt;
                    $("#img-viewer").show().attr('src', asset.File_Path).height(tHgt);
                }
            } else {
                if (imgHgt > tHgt) {
                    $("#img-viewer").show().attr('src', asset.File_Path).height(tHgt);
                    //$("#img-viewer").css('max-width', "100%");
                }
            }
        }).attr('src', asset.File_Path);
    } else if (ext == 'mp4' || ext == 'wmv') {
        $('#video').show(); 
        courseFile.start(_this.options.course.Course_ID, asset, function(fileUrl){
        	app.hideLoading();
    		_this.analyticsInsert(asset);
    		window.plugins.fileOpener.open(fileUrl);
    		//$('#video #vdo').attr('src', asset.File_Path);
    	});
    } else if (ext == 'swf') {
    	app.hideLoading();
    	_this.analyticsInsert(asset);
        $('#objSwf').show();
        $('#objSwf').attr('data', asset.File_Path);
    }
    //TODO have to add zip and html5
    var hgtChkInt = setInterval(function () {
        if ($('.tabs-stage').height() == 200) {
            //alert(1);
        } else {
            var hgt = $('.tabs-stage').height() - 90;
            $('#myIframe,#objSwf').width('100%').height(hgt);
            $('#video').height(hgt);
            clearInterval(hgtChkInt);
        }
    }, 500);
    $('#myIframe,#objSwf').width('100%').height(hgt);
    $('#video').height(hgt);
};
Player.prototype.insertAnalytics = function (onSuccess) {
    var _this = this;
    if (_this.selectedAsset != null) {
    	var currentUser = window.localStorage.getItem('user');
    	var analytics = {};
        analytics.Course_ID = _this.options.course.Course_ID;        
        analytics.Publish_ID = _this.options.course.Publish_ID;
        analytics.Company_ID = _this.options.course.Company_ID;      
        analytics.User_Id = _this.options.course.User_Id;
        analytics.DA_Code = _this.selectedAsset.DA_Code;
        analytics.Publish_ID = _this.options.course.Publish_ID;
        analytics.Play_Time = new Date().getTime() - _this.selectedAssetStartTime;
        analytics.Offline_Play = 0;
        analytics.Online_Play = 1;
        analytics.Is_Preview = false;      
        analytics.Region_Code = JSON.parse(currentUser).regionCode;
        analytics.User_Name = JSON.parse(currentUser).userName;    
        
        Services.insertCourseViewAnalytics(analytics, function(data){ 
        	if(onSuccess) onSuccess();
        }, function(){});
    }
};
Player.prototype.actions = function () {
    var _this = this;

    $('#player_back').bind('click', function () {
        _this.hide();
        _this.insertAnalytics(function () {
            window.location.reload();
        });
        return false;
    });
    //$('#tab_flip').unbind('click').bind('click', function () {
    //    var actEl = $('.tabs-cont:visible'), nxtEl = $('.tabs-cont:hidden');
    //    actEl.hide();
    //    nxtEl.show();
    //});
    $('.item_div .item').unbind().bind('click', function (e) {
        _this.createFrame($(this).data('asset'));
    });

    $(window).on("orientationchange", function (event) {
        $("#orientation").text("This device is in " + event.orientation + " mode!");
    });

    var maxSlides = 7;
    if ($(window).width() <= 800) maxSlides = 5;
    if ($(window).width() <= 700) maxSlides = 3;
    if ($(window).width() <= 400) maxSlides = 1;
    $('.item_div').bxSlider({
        minSlides: 1,
        maxSlides: maxSlides,
        slideWidth: 100,
        slideMargin: 10,
        height: 75,
        controls: true,
        onSliderLoad: function() {
        	app.hideLoading();
        }
    });
};
Player.prototype.getExtension = function (asset) {
    //var asset = this.options.asset;
    var index = asset.File_Path.lastIndexOf(".");
    var ext = asset.File_Path.substring(index + 1);

    return ext;
};
Player.prototype.show = function () {
    /*if (firstPlay && this.options.asset.downloaded == 'Y') {
        alert("Due to privacy policy, we donot allow loading assets offline when in online mode. Anyway this asset is downloaded and can be viewed in offline mode.");
        firstPlay = false;
    }*/
    //if (!this.options.asset.onlineURL.endsWith('.zip')) {
    //    this.init();
    //    $('body').addClass('page-player');
    //} else {
    //    alert('This asset can only be viewed on offline mode.');
    //}
    this.init();
    $('body').addClass('page-player');
};
Player.prototype.hide = function () {
    $('body').removeClass('page-player');
    $('.container.player_container').remove();
};
Player.prototype.analyticsInsert = function(asset) {
	var _this = this;
	if (_this.selectedAsset != null) {
        _this.insertAnalytics();
    }

    _this.selectedAsset = asset;
    _this.selectedAssetStartTime = new Date().getTime();
}