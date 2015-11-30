var Player = function (options) {
    this.options = options;
    if(this.options.daBillingId == undefined)
    this.options.daBillingId = 'empty';
};

Player.prototype.init = function () {
	var _this = this;
    this.hide();
    var html = '<div class="container player_container">';
    html += this.createPanel();
    _this.createTray(function(htmlout) {
    	html += htmlout;
    	html += '</div>';
        window.scrollTo(0, 0);
        $('body').append(html);
        _this.createFrame();
        _this.actions();
    });
    
};
Player.prototype.createPanel = function () {
	var url = "file:///sdcard/"+resource.logoFolder+"/"+resource.logoFileName;
    var html = '<div class="panel">';
    html += '<ul class="tabs-nav"><li class="brand-logo" style="position:absolute;"><img height="50px" alt="" src="'+url+'"></li><li class="close_btn" style="font-size: 40px; text-decoration: none; color: black; float:right;margin-top: 9px; padding-left:10px;"><a class="fa fa-close"></a></li></ul>';
    html += '<div class="tabs-stage"><div id="tab-1" class="tabs-cont" style="display: block; min-height: 100%;">';
    html += '<iframe id="myIframe" style="background:#fff; display: none;" frameborder="0" scrolling="auto" ></iframe>';
    
    html += '<img id="img-viewer" alt="" height="100%" style="display: none;"/>';
    html += '<video poster="http://buildingbeyondthefourwalls.files.wordpress.com/2011/08/video-icon.jpg" preload="none" ' +
        'controls="" id="video" tabindex="0" style="display:none; width: 100%;">' +
        '<source type="video/mp4" id="vdo" /><source type="video/x-ms-wmv" id="vdomwv" />' +
        '<p>Your user agent does not support the HTML5 Video element.</p>' +
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
Player.prototype.createTray = function (success) {
	var _this = this;
	coreView.getThumbnailURL(_this.options.asset, function (thumbnailURL) {
		//alert(thumbnailURL);
		var html = '<div class="tray" style="display:none;"><div class="asset_action"><div id="player_back" onclick="return false"></div>' +
	    '</div><div class="asset_slider"><ul class="item_div">' +
        '<li class="item" id='+_this.options.asset.daCode+' onclick="return false"><img class="asset_thumb" src='+thumbnailURL+' /></li>'+
        '</ul></div><span class="toggle-tray"></span><p class="copy_right"> � Powered by SwaaS</p></div>';
		success(html);
	});
};
Player.prototype.createFrame = function () {
    var _this = this;
    var ext = this.getExtension();
    var hgt = $('.tabs-stage').height();
    $('#img-viewer, #myIframe, #video, #objSwf').hide();
    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
        localStorage.setItem("mviewer", "false");
        localStorage.setItem("mObj", undefined);
    }
    if(device.platform=='iOS'){
        if(this.options.asset.documentType == 'VIDEO'){
            fileUtil.getFileEntry(this.options.asset.downloadedFileName, function(fileEntry){
              if (fileEntry != null){
              assetURL = fileEntry.nativeURL;
              $("#myIframe").show().attr('src', assetURL);
              }
            });
            $('#myIframe,#objSwf').width('100%').height(hgt);
            $('#video').height(hgt);
        }else{
        if (ext == 'pdf'){
            //$("#img-viewer").show().attr("src","../images/doctype/pdf.png");
            var ref = window.open(this.options.asset.offLineURL, '_blank', 'location=yes');
            //ref.addEventListener('exit', com.swaas.hidoctor.edetailing.ui.view.story.backFromDocOpen);
        }else if (ext == 'docx' || ext == 'doc' || ext == 'xlsx' || ext == 'xls') {
            if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                localStorage.setItem("mviewer", "true");
                localStorage.setItem("daCode", this.options.asset.daCode);
                localStorage.setItem("startTime", this.options.startTime);
            }
            window.plugins.fileOpener.open(this.options.asset.offLineURL);
            //var ref = window.open(this.options.asset.offLineURL, '_blank', 'location=yes');
        } else if((ext == 'ppt') || (ext == 'pptx')) {
            var assetURL;
            fileUtil.getFileEntry(this.options.asset.downloadedFileName, function(fileEntry){
                 assetURL=fileEntry.nativeURL;
                 window.plugins.fileOpener.open(assetURL,'application/ppt');
            });
        } else if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp') {
            //$('.panel').css('position','static');
            var img = $('<img/>');
            //alert(_this.options.asset.offLineURL);
            img.load(function () {
                     var imgWid = this.width,
                     imgHgt = this.height;
                     var tWid = $('.tabs-stage').outerWidth(),
                     tHgt = $('.tabs-stage').height();
                     if(imgWid < tWid) {
                     $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).width(imgWid);
                     if(imgHgt > tHgt) {
                     var hgt = imgWid/imgHgt;
                     $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).height(imgWid*hgt);
                     }
                     } else {
                     if(imgHgt > tHgt) {
                     $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).height(tHgt);
                     $("#img-viewer").css('max-width', '100%');
                        }
                     }
                /*if (this.width > this.height) {
                    $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).height(hgt);
                } else {
                    $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).width($('.tabs-stage').width());
                }*/
            }).attr('src', this.options.asset.offLineURL);
        } else if (ext == 'zip') {
            $("#myIframe").show().attr('src', this.options.asset.offLineURL);
        } else if (ext == 'html') {
            $("#myIframe").show().attr('src', this.options.asset.offLineURL);
        }
         
        $('#myIframe,#objSwf').width('100%').height(hgt);
        $('#video').height(hgt);
      }
        
    }else if(device.platform=='Android'){
    	var fileOpener = new FileOpener();
        if (ext == 'pdf'){
        	window.plugins.fileOpener.open(this.options.asset.offLineURL);
        }else if (ext == 'docx' || ext == 'doc' || ext == 'ppt' || ext == 'pptx' || ext == 'xlsx' || ext == 'xls') {
            if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                localStorage.setItem("mviewer", "true");
                localStorage.setItem("daCode", this.options.asset.daCode);
                localStorage.setItem("startTime", this.options.startTime);
            }
            window.plugins.fileOpener.open(this.options.asset.offLineURL);
        } else if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp') {
            var bTask = new BulkTask({ spinner: null });
            bTask.showLoading();
            var img = $('<img/>');
            img.load(function () {
                     var imgWid = this.width,
                     imgHgt = this.height;
                     var tWid = $('.tabs-stage').outerWidth(),
                     tHgt = $('.tabs-stage').height();
                     if (imgWid < tWid) {
                     $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).width(imgWid);
                     if (imgHgt > tHgt) {
                     var hgt = imgWid / imgHgt;
                     $("#img-viewer").show().attr('src', _this.options.asset.offLineURL).height(imgWid * hgt);
                     }
                     } else {
                     if (imgHgt > tHgt) {
                     $("#img-viewer").show().attr('src', _this.options.asset.offLineURL);//.height(tHgt);
                     $("#img-viewer").css('max-width', "100%");
                     }
                     }
                     bTask.hideLoading();
                     }).attr('src', this.options.asset.offLineURL);
            window.plugins.fileOpener.open(this.options.asset.offLineURL);
        } else if (ext == 'zip') {
            $("#myIframe").show().attr('src', this.options.asset.offLineURL);
        } else if (ext == 'html') {
            $("#myIframe").show().attr('src', this.options.asset.offLineURL);
        } else if (ext == 'mp4') {
            $('#video').show();
            //window.plugins.videoPlayer.play([this.options.asset.offLineURL, 0]);
            window.plugins.fileOpener.open(this.options.asset.offLineURL);
        } else if (ext == 'wmv') {
            $('#video').show();
            //window.plugins.videoPlayer.play([this.options.asset.offLineURL, 0]);
            window.plugins.fileOpener.open(this.options.asset.offLineURL);
        } else if (ext == 'swf') {
            $('#objSwf').show();
            window.plugins.fileOpener.open(this.options.asset.offLineURL);
        } else {
        	window.plugins.fileOpener.open(this.options.asset.offLineURL);
        }
        
        $('#myIframe,#objSwf').width('100%').height(hgt);
        $('#video').height(hgt);
        
    }
        
};
Player.prototype.insertAnalytics = function () {
    fnGetPlayTimeAndUpdate(this.options.asset.daCode, this.options.asset, this.options.startTime);
};
Player.prototype.actions = function () {
    var _this = this;
   
    var ext = this.getExtension();
    //console.log(this.options.asset.onlineURL);
    $('#player_back').bind('click', function () {
        _this.hide();
        eLearningAPP.showAsset(_this.options.asset);
        setTimeout(function() {
            //hideLoader();
            _this.insertAnalytics();
        }, 5000);
        _this.insertAnalytics();
        return false;
    });
    $('.close_btn').bind('click', function () {
        $('#player_back').trigger('click');
        return false;
    });
    $('#tab_flip').unbind('click').bind('click', function () {
		var actEl = $('.tabs-cont:visible'), nxtEl = $('.tabs-cont:hidden');
		actEl.hide();
		nxtEl.show();
	});
};
Player.prototype.getExtension = function () {
    var asset = this.options.asset;
    var index = asset.offLineURL.lastIndexOf(".");
    var ext = asset.offLineURL.substring(index + 1);
    
    return ext;
};
Player.prototype.show = function () {
    this.init();
    $('body').addClass('page-player');
};
Player.prototype.hide = function () {
    $('body').removeClass('page-player');
    $('.container.player_container').remove();
};

function fnGetPlayTimeAndUpdate(daCode, asset, startTime) {
    var date1 = new Date(startTime); // 9:00 AM
    var date2 = new Date(); // 5:00 PM
    if (date2 < date1) {
        date2.setDate(date2.getDate() + 1);
    }
    var diff = date2 - date1; // playtime in millisecond.
    //alert(diff);
    //insert billing
    var user = eLearningAPP.currentUser;
   // alert(JSON.stringify(asset));
    coreView.getGeoPosition(function (position) {
    	var d = new Date();
    	var assetBilling = {
	        companyCode: user.companyCode,
	        daCode: asset.daCode,
	        userCode: user.userCode,
	        userName: user.userName,
	        regionCode: user.regionCode,
	        regionName: user.regionName,
	        divisionCode: user.divisionCode,
	        divisionName: user.divisionName,
	        dateTime: new Date(),
	        offlineClick: 1,
            downloaded: 0,
            onlinePlay: 0,
	        latitude: position.latitude,
	        longitude: position.longitude,
	        playTime: diff
	    };

    	assetService.insertAssetBilling(assetService, assetBilling, function (daBillingId) {
	        //alert(daBillingId);
	    }, function (data) { });
    });
}