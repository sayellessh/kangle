/**
 * PENDING ITEMS 1. Integrate praffulla code - UpSync DAO (SyncGet, SyncPut,
 * Clean)
 */

var eLearningAPP = {}; 


eLearningAPP.docOpenDeatils = { docOpen: false, openTime: 0, daBillingId: null };

eLearningAPP.initApp = function () {
    document.addEventListener("resume", eLearningAPP.backFromDocOpen, false);
    document.addEventListener("backbutton", function () { }, false);
//    if(device.platform=='iOS'){
//        var  url = "cdvfile://localhost/persistent/"+resource.logoFolder+"/"+resource.logoFileName;
//    }else{
//        var  url = "file:///sdcard/"+resource.logoFolder+"/"+resource.logoFileName + '_t=' + new Date().getTime();
//    }
    var url = window.localStorage.getItem("companyLogoUrl");
    clientLogoURL_g = url;
    //$('.logo a').css({'background':'url('+url+') no-repeat center left'});
    $('.logo a').css({'background-image':'url('+url+')',
				        'background-position': '0% 50%',
				        'background-repeat': 'no-repeat',
				        'background-size': '100%'});
    //window.localStorage.setItem("companyLogoUrl", url);
    coreView.initializeGeoPosition();
    function beforeMenuShow() {
        var innMenuHgt = $('.menu#tag').height() + $('.slide_menu').height();
        var cateMenuHgt = $('.menu#category').height() + $('.slide_menu').height();
        var useHgt = (innMenuHgt > cateMenuHgt ? innMenuHgt : cateMenuHgt);
        
        var winHgt = $(window).height() - $('.header').height();
        useHgt = (useHgt > winHgt ? useHgt : winHgt);
        
        $("#menu-panel").css({'min-height': useHgt});
        $('.wrapper').css({'height': useHgt, 'overflow': 'hidden'});
    }
    function menuToggle() {
        $('.k-logo').bind('click', function(){
        beforeMenuShow();
        var bShow = $('#menu-panel').hasClass('show');
        $('#menu-panel').animate({
            left: (bShow ? '-330px' : '0px')
        }, 200, function(){
            if(bShow) {
                $('#menu-panel').removeClass('show');
                       // $('.progressBackground').remove();
            } else {
                $('#menu-panel').addClass('show');
                      
            }
        });
        if(!bShow) {
        $('.right-sec').css('position','relative').animate({'left': '330px'}, 200, function(){});
        } else {
        $('.right-sec').animate({ 'left': '0px' }, 200, function () {
                      $('.wrapper').css({ 'height': 'auto', 'overflow': '','position': '' });
                      $('#menu-panel').css({ 'min-height': 'initial', 'height' : '0', 'overflow': 'hidden' });
                      });
        }
        return false;
        });
    }
    /*$("body").swipe({
        // Generic swipe handler for all directions
        allowPageScroll: "vertical",
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if(direction == 'left' || direction == 'right') {
                $('.k-logo').trigger('click');
            }
        }
    });*/
    
    $(document).not($('.k-logo')).click(function(e) {
                                       // alert("not");
        $('#menu-panel').animate({ left: '-330px'}, 200, function(){
             $('#menu-panel').removeClass('show');
                                 // $('.progressBackground').remove();
        });
        $('.right-sec').animate({ 'left': '0px' }, 200, function () {
             $('.wrapper').css({ 'height': 'auto', 'overflow': '','position': '' });
             $('#menu-panel').css({ 'min-height': 'initial', 'height' : '0', 'overflow': 'hidden' });
        });
    });
    menuToggle();
    function assetAlign() {
        if ($(window).width() >= 1240) {
            var rightWidth = $(window).width() - $("#menu-panel").width() + 'px';
        }
        var hgt = $(window).height();
        var leftHeight = (hgt) - ($(".header").height() + $(".footer").height()) + 'px';
        $("#menu-panel").css("top", $(".header").height()+1);
        
    }
    assetAlign();
    $(window).resize(function(){
           assetAlign();
    });
    

    eLearningAPP.init();
};

eLearningAPP.playOrOpen = function (asset, downloadProgress) {
    digitalAssetLocalDAO.get(asset.daCode, function (returnedAsset) {

        if (returnedAsset != null && returnedAsset.downloaded == "Y") {
            asset.downloaded = "Y";
            // alert(asset.downloadedFileName);
            asset.downloadedFileName = returnedAsset.downloadedFileName;
            asset.downloadedThumbnail = returnedAsset.downloadedThumbnail;
            assetService.saveAssetDetailsAndAnalyticsHistory(asset, asset.analyticsHistory, function (data) {
                eLearningAPP._playOrOpenAsset(asset, downloadProgress);
            }, function (data) { });
        } else {
            assetService.saveAssetDetailsAndAnalyticsHistory(asset, asset.analyticsHistory, function (data) {
            	eLearningAPP._playOrOpenAsset(asset, downloadProgress);
            }, function (data) { });
        }
    }, function (data) { });


};

/**
 * This function should be invoked to download asset
 * 
 * e.g.: eLearningAPP.download(asset, function(progress){ // will give progress
 * in percentage console.log("Download progress is " + progress + "%"); });
 * 
 * 
 * The structure of Asset is as follows: - productCode (Optional) - daCode -
 * name - description - onlineURL (asset url) - offLineURL (asset url) -
 * thumbnailURL - documentType (VIDEO/DOCUMENT) - metaTag1 (# tags - delimeter
 * is #). (optional) - metaTag2 (# tags - delimeter is #). (mandatory) -
 * offLineURL (optional) - downloaded (optional) - downloadedFileName (optional) -
 * downloadedThumbnail (optional) - analyticalHistory (with following json
 * structure) - totalViewsCount - totalLikesCount - totalDislikesCount -
 * starValue
 * 
 */
eLearningAPP.download = function (asset, downloadProgress) {
    // alert(downloadProgress);
    if (eLearningAPP.isDownloading == true) {
        return;
    }
    eLearningAPP.isDownloading = true;
    eLearningAPP.showProgress(0);
    // alert('download');
    digitalAssetLocalDAO.get(asset.daCode, function (returnedAsset) {
                             // alert(returnedAsset);
        var existingAsset = (returnedAsset != null);
        if (existingAsset == true) {
                             // alert(returnedAsset.downloaded);
            if (returnedAsset.downloaded == 'Y') {
                fileUtil.checkIfFileExists(returnedAsset.downloadedFileName, function (fileEntry) {
                    asset.downloaded = returnedAsset.downloaded;
                    asset.downloadedFileName = returnedAsset.downloadedFileName;
                    asset.downloadedThumbnail = returnedAsset.downloadedThumbnail;
                    eLearningAPP.hideProgress();
                    alert(resource.alreadyDownloaded);
                    eLearningAPP.isDownloading = false;
                }, function (msg) {
                    AssetDownloader.downloadFile(asset, downloadProgress, function (data) {
                        var tag1 = asset.metaTag1;
                        var tag2 = asset.metaTag2;
                        metaTagService.saveMetaTag(tag1, tag2, function (data) { }, function (data) { });
                        coreView.getGeoPosition(function (position) {
                            assetService.populateAssetBilling(eLearningAPP.currentUser, position, asset, function (daBillingId) {
                                var assetBilling = {};
                                assetBilling.daBillingId = daBillingId;
                                assetBilling.downloaded = 1;
                                assetBilling.onlinePlay = 0;
                                assetBilling.offlineClick = 0;
                                digitalAssetBillingLocalDAO.update(assetBilling, function (data) { }, function (data) { });
                                eLearningAPP.isDownloading = false;
                            }, function (data) {
                                eLearningAPP.isDownloading = false;
                            });
                        });
                    }, function (data) {
                        eLearningAPP.isDownloading = false;
                    });
                });
            } else {
                AssetDownloader.downloadFile(asset, downloadProgress, function (data) {
                    var tag1 = asset.metaTag1;
                    var tag2 = asset.metaTag2;

                    metaTagService.saveMetaTag(tag1, tag2, function (data) { }, function (data) { });
                    coreView.getGeoPosition(function (position) {
                        assetService.populateAssetBilling(eLearningAPP.currentUser, position, asset, function (daBillingId) {
                            var assetBilling = {};
                            assetBilling.daBillingId = daBillingId;
                            assetBilling.downloaded = 1;
                            assetBilling.onlinePlay = 0;
                            assetBilling.offlineClick = 0;
                            digitalAssetBillingLocalDAO.update(assetBilling, function (data) { }, function (data) { });
                            eLearningAPP.isDownloading = false;
                        }, function (data) {
                            eLearningAPP.isDownloading = false;
                        });
                    });
                }, function (data) {
                    eLearningAPP.isDownloading = false;
                });
            }
        } else {
            assetService.saveAssetDetailsAndAnalyticsHistory(asset, asset.analyticsHistory, function (data) {
                AssetDownloader.downloadFile(asset, downloadProgress, function (data) {
                    var tag1 = asset.metaTag1;
                    var tag2 = asset.metaTag2;

                    metaTagService.saveMetaTag(tag1, tag2, function (data) { }, function (data) { });
                    coreView.getGeoPosition(function (position) {
                        assetService.populateAssetBilling(eLearningAPP.currentUser, position, asset, function (daBillingId) {
                            var assetBilling = {};
                            assetBilling.daBillingId = daBillingId;
                            assetBilling.downloaded = 1;
                            assetBilling.onlinePlay = 0;
                            assetBilling.offlineClick = 0;
                            digitalAssetBillingLocalDAO.update(assetBilling, function (data) { }, function (data) { });
                            eLearningAPP.isDownloading = false;
                        }, function (data) {
                            eLearningAPP.isDownloading = false;
                        });
                    });
                }, function (data) {
                    eLearningAPP.isDownloading = false;
                });
            }, function (data) {
                eLearningAPP.isDownloading = false;
            });
        }
    }, function (data) {
        eLearningAPP.isDownloading = false;
    });
};

eLearningAPP.docOpenDeatils = {};
eLearningAPP._playOrOpenAsset = function (asset, downloadProgress) {
    var isConnected = coreNET.isConnected();
    var documentType = asset.documentType;
    if (asset.downloaded != 'Y' && isConnected == false) {
        if (documentType == 'VIDEO') {
            alert(resource.networkMessage.video);
        } else {
            alert(resource.networkMessage.document);
        }
        return;
    }
    var daBillingId = UUIDUtil.getUID();
    if (documentType == 'VIDEO') {
        var assetBilling = {};
        assetBilling.daBillingId = daBillingId;
        assetBilling.downloaded = 0;
        if (asset.downloaded == 'Y') {
            assetBilling.onlinePlay = 0;
            assetBilling.offlinePlay = 1;
        } else {
            assetBilling.onlinePlay = 1;
            assetBilling.offlinePlay = 0;
        }
        coreView.getAssetURL(asset, function (downloadedAssetURL) {
            asset.offLineURL = downloadedAssetURL;
            var ply = new Player({ asset: asset, startTime: new Date(), assetBilling: assetBilling });
            ply.show();
        });
    } else {
        eLearningAPP.docOpenDeatils.daBillingId = daBillingId;
        if (asset.downloaded == 'Y') {
            fileUtil.checkIfFileExists(asset.downloadedFileName, function (fileEntry) {
                var d = new Date();
                eLearningAPP.docOpenDeatils.openTime = d.getTime();
                eLearningAPP.docOpenDeatils.docOpen = true;
                var assetBilling = {
                    daBillingId: daBillingId,
                    downloaded: 0,
                    offlinePlay: 1,
                    onlinePlay: 0
                };
                coreView.getAssetURL(asset, function (downloadedAssetURL) {
                    asset.offLineURL = downloadedAssetURL;
                    var ply = new Player({ asset: asset, startTime: new Date(),assetBilling: assetBilling });
                    ply.show();
                });
            }, function (msg) {
                AssetDownloader.downloadFile(asset, downloadProgress, function (returnedAsset) {
                    var tag1 = asset.metaTag1;
                        var tag2 = asset.metaTag2;
                        metaTagService.saveMetaTag(tag1, tag2, function (data) { }, function (data) { });
                        var assetBilling = {};
                        assetBilling.daBillingId = daBillingId;
                        assetBilling.downloaded = 1;
                        assetBilling.onlinePlay = 0;
                        assetBilling.offlinePlay = 1;
                        digitalAssetBillingLocalDAO.update(assetBilling, function (data) { }, function (data) { });
                        var d = new Date();
                        eLearningAPP.docOpenDeatils.openTime = d.getTime();
                        eLearningAPP.docOpenDeatils.docOpen = true;
                        coreView.getAssetURL(returnedAsset, function (downloadedAssetURL) {
                            asset.offLineURL = downloadedAssetURL;
                            var ply = new Player({ asset: asset, startTime: new Date(),assetBilling: assetBilling });
                            ply.show();
                        });
                }, function (data) { });
            });
        } else {
            AssetDownloader.downloadFile(asset, downloadProgress, function (returnedAsset) {
            	var tag1 = asset.metaTag1;
				var tag2 = asset.metaTag2;
				metaTagService.saveMetaTag(tag1, tag2, function (data) { }, function (data) { });
				var assetBilling = {};
				assetBilling.daBillingId = daBillingId;
				assetBilling.downloaded = 1;
				assetBilling.onlinePlay = 0;
				assetBilling.offlinePlay = 1;
				digitalAssetBillingLocalDAO.update(assetBilling, function (data) { }, function (data) { });
				var d = new Date();
				eLearningAPP.docOpenDeatils.openTime = d.getTime();
				eLearningAPP.docOpenDeatils.docOpen = true;
				coreView.getAssetURL(returnedAsset, function (downloadedAssetURL) {
				    asset.offLineURL = downloadedAssetURL;
				    var ply = new Player({ asset: asset, startTime: new Date(),assetBilling: assetBilling });
				    ply.show();
				});
            }, function (data) { });
        }
    }
};

eLearningAPP.backFromDocOpen = function () {
    if (eLearningAPP.docOpenDeatils.docOpen == true && eLearningAPP.docOpenDeatils.openTime > 0) {
        var d = new Date();
        eLearningAPP.docOpenDeatils.docOpen = false;
        var assetBilling = {};
        assetBilling.daBillingId = eLearningAPP.docOpenDeatils.daBillingId;
        assetBilling.playTime = (d.getTime() - eLearningAPP.docOpenDeatils.openTime);
        assetService.updateAssetBilling(assetBilling, function (data) { }, function (data) { });
        eLearningAPP.docOpenDeatils.openTime = 0;
    }
};

eLearningAPP.getHieght = function () {
    var height = $(window).height();
    if ($(".browseTag").height() > height) {
        height = $(".browseTag").height();
    }
    if ($(".assetList").height() > height) {
        height = $(".assetList").height();
    }
    if ($(".assetDetail").height() > height) {
        height = $(".assetDetail").height();
    }
    return height;
};

eLearningAPP.showProgress = function (progressDetails, success) {
    if (eLearningAPP.progressBar == null) {
        eLearningAPP.progressBackground = $("<div class='progressBackground'></div>");
        // eLearningAPP.progressBackground.height($(window).height());
        $("body").append(eLearningAPP.progressBackground);
        eLearningAPP.progressBar = $("<div class='progressBar'></div>");
        $("body").append(eLearningAPP.progressBar);
        eLearningAPP.progress = $("<div class='progress'>&nbsp;</div>");
        eLearningAPP.progressBar.append(eLearningAPP.progress);
        eLearningAPP.progressPercent = $("<div class='progressPercent'>&nbsp;</div>");
        $("body").append(eLearningAPP.progressPercent);
    }
    // eLearningAPP.progressBackground.height(eLearningAPP.getHieght());


    if (typeof progressDetails == 'object') {
        progress = progressDetails.progress;
        progressMessage = progressDetails.message;
    } else {
        progress = progressDetails;
    }
    // alert(isNaN(progress));
    if (isNaN(progress)) {
        // alert(alert(isNaN(progress));
        eLearningAPP.progressBar.addClass("progessError");
        setTimeout(function () {
            if (progress != 'NON-DOWNLOAD-ERROR') {
                   // alert(typeof progressDetails);
                if (typeof progressDetails == 'object') {
                    if (progressDetails.error == true) {
                        alert(progressDetails.message);
                    } else {
                   alert(progressDetails.error);
                       // alert("Errror downloading asset, please check the
						// internet availablity and try again.");
                    }
                } else {
                   // alert("Errror downloading asset, please check the
					// internet availablity and try again.");
                }
            }
            eLearningAPP.progressBar.hide();
            eLearningAPP.progressPercent.hide();
            eLearningAPP.progressBackground.hide();
            eLearningAPP.progress.empty();
            eLearningAPP.progressPercent.empty();
            eLearningAPP.progressBar.removeClass("progessError");
        }, 500);
    } else {
        eLearningAPP.progress.removeClass("progessError");
        eLearningAPP.progress.width(progress * 2);
        eLearningAPP.progressPercent.html(progress + "%");
    }

    // eLearningAPP.progressBar.screenCenter();
    // eLearningAPP.progressPercent.screenCenter();

    if (progress >= 100) {
        if (typeof success == 'function') success();
        setTimeout(function () {
            eLearningAPP.progressBar.hide();
            eLearningAPP.progressPercent.hide();
            eLearningAPP.progressBackground.hide();
            eLearningAPP.progress.empty();
            eLearningAPP.progressPercent.empty();
        }, 300);
    } else {
        eLearningAPP.progressBackground.show();
        eLearningAPP.progressBar.show();
        eLearningAPP.progressPercent.show();
    }

};

eLearningAPP.hideProgress = function() {
	// alert(eLearningAPP.progressBar);
	eLearningAPP.progressBar.hide();
    eLearningAPP.progressPercent.hide();
    eLearningAPP.progressBackground.hide();
    eLearningAPP.progress.empty();
    eLearningAPP.progressPercent.empty();
}

eLearningAPP.showToast = function (message) {
    var toast = $(".toast");
    if (toast.length == 0) {
        toast = $("<div class='toast'><div class='close'>X</div><div class='title'>Info</div><div class='message'></div></div>");
        $("body").append(toast);
        toast.click(function () {
            toast.hide();
        });
        $('body').click(function () {
            toast.hide();
        });

        $('document').click(function () {
            toast.hide();
        });

        $('.header').click(function () {
            toast.hide();
        });
        $('.showBrowseTag').click(function () {
            toast.hide();
        });
        $('.sideMenu').click(function () {
            toast.hide();
        });
        $('.breadcrumb').click(function () {
            toast.hide();
        });
        $('.content').click(function () {
            toast.hide();
        });
        $('.assetList').click(function () {
            toast.hide();
        });

        $('.assetDetail').click(function () {
            toast.hide();
        });
    }
    toast.find(".message").html(message);
    toast.screenCenter();
    toast.css("top", ($(window).height() - toast.height() - 50) + "px");
    toast.show();
};

eLearningAPP.hideToast = function () {
    var toast = $(".toast");
    if (toast.length > 0) {
        toast.hide();
    }

};

// UI Components

/*
 * Inputs - container (jquery object) - menuItems (array with following
 * structure) - onSelection function (optional) - popupMenuItems (optional)
 * 
 * MenuItem Structure
 *  - name - dependentClass (optional) - defaultSelected (boolean) (optional)
 * 
 * popupMenuItems Structure - name - onSelection (function)
 */


function Menu(settings) {
    this.settings = $.extend({}, settings);
    this.container = this.settings.container;
    this.menuItems = this.settings.menuItems;
    this.menuBar = $("<div class='menubar' />");
    this.container.append(this.menuBar);
    this.onSelection = this.settings.onSelection;
};

Menu.prototype.show = function () {
    var that = this;
    this.menuBar.empty();
    $.each(this.menuItems, function (index, menuItem) {

        var menu = $("<div class='menu' />");
        that.menuBar.append(menu);
        if (menuItem.defaultSelected == true) {
            menu.addClass("active");
        }

        menu.html(menuItem.name);
        menu.click(function (e) {
            var currentMenu = menuItem;
            that.menuBar.find(".active").removeClass("active");
            menu.addClass("active");
            $.each(that.menuItems, function (i, item) {
                if (item.name != currentMenu.name) {
                    if (item.dependentClass != null) {
                        $("." + item.dependentClass).hide();
                    }
                } else {
                    if (item.dependentClass != null) {
                        $("." + item.dependentClass).show();
                    }
                }
            });

            if (typeof that.onSelection == 'function') {
                that.onSelection(currentMenu);
            }
        });
    });


    /*
	 * var li = $('<li>Quit</li>'); popupUL.append(li); li.click(function(){
	 * navigator.app.exitApp(); });
	 */


    $("body").append(menuPopup);
    menuPopup.hide();
    menuButton.click(function () {
        if (menuPopup.is(':visible') == true) {
            menuPopup.hide();
        } else {
            menuPopup.css("left", $(window).width() - menuPopup.width());
            menuPopup.show();
        }
    });
};

/*
 * Inputs - container (jquery object) - metaTags (array with following
 * structure) - onSelection function (optional)
 * 
 * MetaTag Structure
 *  - tag (name of the tag) - tagCount (optional) - defaultSelected (boolean)
 * (optional)
 */
function TagList(settings) {
    this.settings = $.extend({}, settings);
    this.container = this.settings.container;
    this.categories = $('#category', this.container);
    this.tags = $('#tag', this.container);
    this.metaTags = this.settings.metaTags;
    this.taggedAssets = this.settings.taggedAssets;
    this.categories.empty();
    this.tags.empty();
    this.isPhone = false;
    this.breadcrumbContainer = this.settings.breadcrumbContainer;
    this.onSelection = this.settings.onSelection;
    this.onTagSelection = this.settings.onTagSelection;
    this.selectedTag = null;
}

TagList.prototype.show = function () {
    
    var that = this;
    this.categories.empty();

    if (this.metaTags == null || this.metaTags.length == 0) {
        this.categories.append('<li class="asset-empty">No assets found</li>');
    }
    var cateTags = this.parseMetaTags(this.metaTags);
    this.metaTags = sortByKey(cateTags, 'metaTag');
    this.taggedAssets = this.parseTagged(this.taggedAssets);
    $.each(this.taggedAssets, function (key, taggedAsset) {
        var li = $("<li></li>");
        that.tags.append(li);
        var tagName = key.replace(' ', '').toLowerCase();
          // if(tagName !='udtags'){
              li.append('<a href="#" id="' + tagName + '">' + key + '</a> <span class="count">' + taggedAsset.length + '</span>');
          // }
        li.bind('click', function (e) {
            if (typeof that.onSelection == 'function') {
                $('.menu#tag li').removeClass('active');
                li.addClass('active');
                // that.breadcrumb(key);
                $('.bread-crum').removeClass('right');
                that.breadcrumb("Filtered by <span>"+'"'+key+'"'+"</span>");
                that.onTagSelection(taggedAsset);
                hideMenu();
                $('.asset-detail').hide();
                if ($(window).width() < 768) {
                    $("#menu-panel").addClass("menu-collapse");
                }
            }
        });
    });

    $.each(this.metaTags, function (index, metaTag) {
        var li = $("<li></li>");
        that.categories.append(li);

        var tagDisplayName = metaTag.metaTag;
        if (metaTag.metaTag.split("~").length > 1) {
            tagDisplayName = metaTag.metaTag.split("~")[1];
        }

        if (metaTag.tagCount === null || metaTag.tagCount === undefined) {
            metaTag.tagCount = 0;
        }
        li.attr('id', 'cat_' + tagDisplayName.replace(/ /g, ''));
          li.append('<a href="#">' + tagDisplayName + '</a> <span class="count">' + metaTag.tagCount + '</span><span class="subTagButton arrow-down"></span>');
        var subTagButton = $(".subTagButton", li);
        if (typeof that.settings.getSubTags == 'function') {
            subTagButton.click(function (e) {
                if (li.hasClass('selected')) {
                    li.removeClass('selected'); 
                    $('.child', li).hide();
                    return false;
                }

                that.categories.find('.selected').removeClass('selected');
                $('.child').hide();
                li.addClass('selected');

                var subTag = $('.child', li);
                subTag.hide();
                if (subTag.length == 0) {
                    subTag = $('<ul class="child"></ul>');
                    li.append(subTag);
                    subTag.show();
                } else {
                    subTag.empty();
                    subTag.show();
                }

                that.settings.getSubTags(metaTag, function (sTags) {
                    sTags = sortByKey(sTags, 'subTag');
                    if (sTags != null && sTags.length > 0) {
                        $.each(sTags, function (jndex, sTag) {
                            var subTagLi = $("<li />");
                            subTag.append(subTagLi);
                            if (sTag.tagCount == null || sTag.tagCount == undefined) {
                                sTag.tagCount = 0;
                            }
                            // if(sTag.subTag !='UDTAGS'){
                            subTagLi.append('<a href="#">' + sTag.subTag + '</a> <span class="count">' + sTag.tagCount + '</span>');
                            // }

                            subTagLi.click(function (e) {
                                e.stopPropagation();
                                that.categories.find('.active').removeClass('active');
                                // $(".child li").removeClass("active");
                                subTagLi.addClass("active");
                                // check iphone code
                                if (that.isPhone == true) {
                                    that.browseTag.css('display', 'none');
                                    that.sideMenu.addClass("closed");
                                    $(".content").css('left', "30px");
                                    $(".assetDetail").css('left', "30px");
                                    $(".breadcrumb").css('left', "30px");
                                }

                                if (typeof that.onSelection == 'function') {
                                    $(window).scrollTop(0);
                                    that.breadcrumb(metaTag, sTag);
                                    that.onSelection(metaTag, sTag);
                                    hideMenu();
                                    $('.asset-detail').hide();
                                    if ($(window).width() < 768) {
                                        $("#menu-panel").addClass("menu-collapse")
                                    }
                                }
                            });
                        });
                    }
                });
                return false;
            });
        }

        if (metaTag.defaultSelected == true) {
            li.addClass('selected');
            that.selectedTag = metaTag;
        }

        li.click(function (e) {
            that.categories.find('.active').removeClass('active');
            $('.child').hide();
            li.addClass('active');
            that.categories.find('.selected').removeClass('selected');
            that.selectedTag = metaTag;
            if (that.isPhone == true) {
                that.browseTag.css('display', 'none');
                that.sideMenu.addClass("closed");
                $(".asset-result").css('left', "30px");
                $(".assetDetail").css('left', "30px");
                // fix breadcrumb
                $(".breadcrumb").css('left', "30px");
            }

            if (typeof that.onSelection == 'function') {
                // that.breadcrumb(metaTag);
            	$('.bread-crum').removeClass('right');
                 that.breadcrumb("Filtered by <span>"+'"'+ metaTag.metaTag+'"'+"</span>");
                that.onSelection(metaTag);
                hideMenu();
                $('.asset-detail').hide();
                if ($(window).width() < 768) {
                    $("#menu-panel").addClass("menu-collapse")
                }
            }
        });
    });

}

TagList.prototype.breadcrumb = function (metaTag, subTag) {
    this.breadcrumbContainer.empty();
    if (metaTag != null) {
        if (typeof metaTag == 'string') {
            this.breadcrumbContainer.append('<li>' + metaTag + '</li>');
            if (metaTag != 'All Assets') {

                var anchorClose = $('<li style="width: 30px !important;"><a class="fa fa-close"></a></li>');

                anchorClose.bind('click', function (e) {
                    $('.search_sec input').val('');
                    eLearningAPP.refresh();
                    $('.asset-menu li:visible a').trigger('click');

                });

                this.breadcrumbContainer.append(anchorClose);

            }
        } else {
            var tagDisplayName = metaTag.metaTag;
            if (metaTag.metaTag.split("~").length > 1) {
                tagDisplayName = metaTag.metaTag.split("~")[1];
            }
            this.breadcrumbContainer.append('<li>' + tagDisplayName + '</li>');
            if (subTag != null) {
                this.breadcrumbContainer.append('<li>&gt;</li><li>' + subTag.subTag + '</li>');
            }
        }
    }
}
TagList.prototype.parseMetaTags = function (tags) {
    var newArray = new Array();
    for (var i = 0; i < tags.length; i++) {
        var curObj = tags[i], ind = curObj.metaTag.indexOf('~');
        if (ind > -1) {
            curObj.metaTag = curObj.metaTag.substring(ind + 1, curObj.metaTag.length);
        }
        newArray.push(curObj);
    }
    return newArray;
}
TagList.prototype.parseTagged = function (o) {
    var sorted = {},
    key, a = [];
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }
    a.sort();
    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}
/*
 * Inputs - container (jquery object) - assets (array with following structure) -
 * onSelection function (optional)
 * 
 * Asset Structure
 *  - thumbnailURL (name of the tag) - downloadedThumbnail (for offline assets) -
 * description (optional) - defaultSelected (boolean) (optional) -
 * analyticsHistory - starValue
 */

function AssetList(settings) {
    this.settings = $.extend({}, settings);
    this.container = this.settings.container;
    this.assestContainer = this.settings.assestContainer;
    this.assets = this.settings.assets;
    this.onSelection = this.settings.onSelection;
    this.container.show();
    this.bAssetView = this.settings.bAssetView;
    this.onDownload = this.settings.onDownload;
    this.onView = this.settings.onView;
    this.onCompleteRender = this.settings.onCompleteRender;
}

AssetList.prototype.show = function () {
    var that = this;
    this.container.empty();
    this.assestContainer.empty();
    var selectedTag = $('#category li.active');
    if (this.assets == null || this.assets.length == 0) {
        if (this.settings.isOnline == false) {
            this.container.append("<li>You have not downloaded any assets to display. Please go online, download assets and visit this again</li>");
             $('.asset-menu').hide();
            this.container.addClass("noassetfound");
        } else {
	/*filter assets*/
            this.container.append('<span class="no-asset" style="padding: 10px; font-size: 16px; line-height: 20px; ">No assets found.</span>');
            this.assestContainer.append('<span class="no-asset" style="padding: 10px; font-size: 16px; line-height: 20px; ">No assets found.</span>');
            this.container.addClass("noassetfound");
            this.assestContainer.addClass("noassetfound");
        }
        return;
    } else {
    /*filter assets*/
        this.container.removeClass("noassetfound");
        this.assestContainer.removeClass("noassetfound");
    }
    that.createAssetView(this.assets);
    that.createListView(this.assets);
};

AssetList.prototype.createListView = function (assets) {
    var that = this;
    var url = '';
    // var thumnailURL =
    $.each(assets, function (index, asset) {
        coreView.getThumbnailURL(asset, function (thumnailURL) {
        	//alert(JSON.stringify(asset));
        	var assetDiv = $("<li class='asset' id='asset-list-view-" + asset.daCode + "'></li>");
        	/* if (isApp()) { */
                digitalAssetLocalDAO.get(asset.daCode, function (returnedAsset) {
                	var existingAsset = (returnedAsset != null && returnedAsset.downloaded == 'Y');
                    var downloadableAsset = false;
                    if(asset.downloadable == 'Y') downloadableAsset = true;
                    var isViewable = (asset.isViewable == 'Y');
                    //assetDiv.append('<img src="' + thumnailURL + '" />');
                    assetDiv.append('<img  class="lazy" data-original="' + asset.thumbnailURL + '" alt="' + asset.name + '" />');
                    var ratingDiv = '<div class="rating_div">';
                    ratingDiv += '<div class="rating fa fa-star">' + asset.analyticsHistory.starValue  + '</div><div class="like fa fa-heart">' + asset.analyticsHistory.totalLikesCount +
                        '</div><div class="views fa fa-eye">' + asset.analyticsHistory.totalViewsCount + '</div>';
                    ratingDiv += '</div>';
                    var thumbImg = '';
                    thumbImg = getRespectiveThumbnail(asset);
                    thumbImg = '<img src= "online/newdoctype/'+thumbImg+'" alt=""/>';
                    assetDiv.append('<div class="asset-name"><div class="asset-thumb">' + thumbImg + '</div><div class="asset-descr"><p>' + asset.name +
                    		'</p><p class="asset-type"><span style="float: right;">' + asset.uploadedDate + '</span>' + (!existingAsset?'<span class="_globe" style="float: left;width: 16px;height: 16px;"><img src="online/images/web.png" style="width:100%; height:100%;"/></span>':'<span class="_hdd-o" style="float: left;width: 16px;height: 16px;"><img src="online/images/Memory_Card.png" style="width:100%; height:100%;"/></span>') + 
                    		//'</p><p class="asset-type">' + (!existingAsset?'<span class="_globe" style="float: left;width: 16px;height: 16px;"><img src="online/images/web.png" style="width:100%; height:100%;"/></span>':'<span class="_hdd-o" style="float: left;width: 16px;height: 16px;"><img src="online/images/Memory_Card.png" style="width:100%; height:100%;"/></span>') +
                    		'&nbsp;' + asset.fileSize + ' MB </p>' + ratingDiv + '</div></div>');                    		
                    //assetDiv.append('<span class="shade-bg"></span><div class="overlay"><ul>' +
                    //	(isViewable ?'<li class="play"><a href="#" title="Play" data-code="' + asset.daCode + '">1</a></li>'  : '') +
                        // (!existingAsset ? '<li class="down"><a href="#"
						// title="Download" data-code="' + asset.daCode +
						// '">2</a></li>' : '') +
                    //((!existingAsset && downloadableAsset) ?'<li class="down"><a href="#" title="Download" data-code="' + asset.daCode + '">2</a></li>' : '') +
                    //    '<li class="view"><a href="#" title="View" data-code="' + asset.daCode + '">3</a></li></ul></div>');
                    
                    var iconCnt = 1;
                    var shadeHtml = '<span class="shade-bg"></span>';
                    var iconHtml = '';
//                    if (asset.isViewable == 'Y') {
//                        iconCnt = iconCnt + 1;
//                        iconHtml += '<li class="play"><a href="#" title="Play" data-code="' + asset.daCode + '">1</a></li>';
//                    }
//                    if (asset.downloadable == 'Y') {
//                        iconCnt = iconCnt + 1;
//                        iconHtml += '<li class="down"><a href="' + asset.onlineURL + '" title="Download" data-code="' + asset.daCode + '">2</a></li>';
//                    }
//                    iconHtml += '<li class="view"><a href="#" title="View" data-code="' + asset.daCode + '">3</a></li>';
                    
                    iconHtml = '<span>';
                    if (asset.isViewable == 'Y') {
                        iconCnt = iconCnt + 1;
                        iconHtml += '<a href="#" class="play" title="Play" data-code="' + asset.daCode + '"></a>';
                    }
                    if (asset.downloadable == 'Y' && !existingAsset) {
                        iconCnt = iconCnt + 1;
                        iconHtml += '<a class="down" href="#" title="Download" data-code="' + asset.daCode + '"></a>';
                    }
                    iconHtml += '<a class="view" href="#" title="View" data-code="' + asset.daCode + '"></a>';
                    
                    if (asset.isShareable == 'Y' && asset.isAssetShareable == 'Y') {
                        iconHtml += '<a class="share" href="#" title="Share" data-code="' + asset.daCode + '"></a>';
                    }
                    assetDiv.append(shadeHtml + '<div class="overlay overlay_icons_' + iconCnt + '">' + iconHtml + '</div>');
                        if (asset.unReadComments !== undefined && asset.unReadComments !== null) {
                            assetDiv.append('<span class="disc-count">' + asset.unReadComments + '</span>');
                        }
                    that.container.append(assetDiv);
                    if (existingAsset) {
                        assetDiv.css('font-weight', 'bold');
                    }
                    that.listActions(assetDiv, asset);
                    if (index == (assets.length - 1)) {
                        that.onCompleteRender();
                         $(" li.asset").unbind('click').bind('click',function (e) {
                            e.preventDefault();
                            if ($(this).hasClass('visited')) {
                                $(this).removeClass('visited');
                            } else {
                                $(" li.asset").removeClass('visited');
                                $(this).addClass('visited');
                            }
                        });
                        $(window).resize(function () {
                            that.onCompleteRender();
                        });
                    }
                });
        });
    });

    // $(" li.asset").click(function (e) {
    // e.preventDefault();
    // if ($(this).hasClass('visited')) {
    // $(this).removeClass('visited');
    // } else {
    // $(" li.asset").removeClass('visited');
    // $(this).addClass('visited');
    // }
    // });
};

AssetList.prototype.createAssetView = function (assets) {
    var that = this;
    var url = '';
    /*
	 * function centerView() { var listEl = $('li.asset', that.assestContainer),
	 * cListEl = listEl.length, totEl = 0, listElWid = listEl.outerWidth(); var
	 * pLeft = parseInt(that.assestContainer.css('padding-left').replace('px',
	 * '')), pRight =
	 * parseInt(that.assestContainer.css('padding-right').replace('px', ''));
	 * var pWid = $('.right-sec').width() - (pLeft+pRight); var mLeft =
	 * parseInt(listEl.css('margin-left').replace('px', '')), mRight =
	 * parseInt(listEl.css('margin-right').replace('px', '')); listElWid =
	 * listElWid + mLeft + mRight; var totFit = parseInt(pWid / listElWid, 10);
	 * totEl = (cListEl < totFit ? cListEl : totFit); that.assestContainer.css({
	 * 'width': (totEl * listElWid) + 'px', 'margin-left': 'auto',
	 * 'margin-right': 'auto' }); }
	 */
    $.each(assets, function (index, asset) {
        coreView.getThumbnailURL(asset, function (thumnailURL) {
        	var assetDiv = $("<li class='asset' id='asset-asset-view-" + asset.daCode + "'></li>");
            var assetImg = $('<div class="assetimg_div"><img class="thumb_img" src="' + thumnailURL + '"></div>');
            assetDiv.append(assetImg);
            var extIcon = '';
            extIcon = getRespectiveThumbnail(asset);
            /*
			 * var i = asset.offLineURL.lastIndexOf("."); var ext =
			 * asset.offLineURL.substring(i + 1); var extIcon = '';
			 * 
			 * if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext ==
			 * 'gif') extIcon = 'online/doctype/image.png'; else if (ext ==
			 * 'pdf') extIcon = 'online/doctype/pdf.png'; else if (ext == 'docx' ||
			 * ext == 'doc') extIcon = 'online/doctype/word.png'; else if(ext ==
			 * 'ppt' || ext == 'pptx') extIcon = 'online/doctype/PPT.png'; else
			 * if(ext == 'xls' || ext == 'xlsx') extIcon =
			 * 'online/doctype/excel.png'; else if (ext == 'zip') extIcon =
			 * 'online/doctype/zip.png'; else extIcon =
			 * 'online/doctype/playNew.png';
			 */

            var btmDiv = $('<div class="bottom_div"></div>');
            btmDiv.append('<div class="doc_type"><img class="player_thumb" src="online/newdoctype/' + extIcon + '"></div>');

            var assetDesc = $('<div class="asset_name"></div>');

            /* if (isApp()) { */
                digitalAssetLocalDAO.get(asset.daCode, function (returnedAsset) {
                	var existingAsset = (returnedAsset != null && returnedAsset.downloaded == 'Y');
                    if (existingAsset) {
                        assetDiv.css('font-weight', 'bold');
                    }
                    var downloadableAsset = false;
                    if(asset.downloadable == 'Y') downloadableAsset = true;
                    var isViewable = (asset.isViewable == 'Y');
                    
                    assetDesc.append('<div class="asset_div"><p class="name">' + asset.name + '</p><p class="status">' + 
            		(!existingAsset?'<span class="_globe" style="float: right;width: 16px;height: 16px;"><img src="online/images/web.png" style="width:100%; height:100%;"/></span>':'<span class="_hdd-o" style="float: right;width: 16px;height: 16px;"><img src="online/images/Memory_Card.png" style="width:100%; height:100%;"/></span>') + '&nbsp;' + asset.fileSize + ' MB</p></div>');
                    
                    /*var ratingDiv = '<div class="rating_div"><ul class="rating">';
                    for (var i = 0; i < 5; i++) {
                        var className = '';
                        if ((asset.analyticsHistory.starValue - 1) > -1)
                            className = 'full-img';
                        ratingDiv += '<li><a href="#" class="' + className + '" title="' + i + '"></a></li>';
                    }*/
                    // asset.analyticsHistory.starValue
                    /*ratingDiv += '</ul>';
                    ratingDiv += '<div class="like">' + asset.analyticsHistory.totalLikesCount + '</div><div class="views">' +
                        asset.analyticsHistory.totalViewsCount + '</div>';
                    ratingDiv += '</div>';*/
                    var ratingDiv = '<div class="rating_div">';
                    ratingDiv += '<div class="like">' + asset.analyticsHistory.totalLikesCount + '</div><div class="views">' +
                    asset.analyticsHistory.totalViewsCount + '</div><div class="rating_new" >' + asset.analyticsHistory.starValue + '</div>';
                    ratingDiv += '</div>';
                    
                    assetDesc.append(ratingDiv);// rating
                    assetDesc.append('<div class="button-div">' +
                    (isViewable ? '<input id="view-asset" type="button" value="View"/>' : '') +
                    ((!existingAsset && downloadableAsset) ? '<input id="down-asset" type="button" value="Download"/>' : ''));
                    btmDiv.append(assetDesc);
                    assetDiv.append(btmDiv);
                    that.assestContainer.append(assetDiv);
                    that.assetActions(assetDiv, asset);
                    if (index == (assets.length - 1)) {
                        /* centerView(); */
                        $(window).resize(function () {
                            /* centerView(); */
                        });
                    }
                });
           });
    });
};
AssetList.prototype.listActions = function (assetDiv, asset) {
    var that = this;
    $('.down', assetDiv).click(function (e) {
        e.stopPropagation();
        that.settings.onDownload(asset);
        return false;
    });
    $('.play', assetDiv).click(function () {
        if (typeof that.onSelection == 'function') {
            that.onView(asset);
        }
        return false;
    });
    $('.view', assetDiv).click(function () {
    	if($('.bread-crum li').hasClass('discussion')) {
            $(this).parent().parents().eq(1).hide();
        }
        $('.right-sec').attr('style', '');
        if (typeof that.onSelection == 'function') {
            that.onSelection(asset);
        }
        return false;
    });
    $('.share', assetDiv).click(function () {
        SharePop.showLoader();
        var assetId = $(this).data("code");
        customertableLocalDAO.getAll(function(user){
            SharePop.hideLoader();
            eLearningAPP.showSharePopup(user, assetId);
        });
        return false;
    });    
}

AssetList.prototype.assetActions = function (assetDiv, asset) {
    // alert(assetDiv.length);
    var that = this;
    $('.assetimg_div',assetDiv).unbind('click').bind('click',function (evt) {
        evt.preventDefault();
        $('.right-sec').attr('style', '');
        if (typeof that.onSelection == 'function') {
            that.onSelection(asset);
        }
        return false;
    });
    $('.bottom_div',assetDiv).unbind('click').bind('click',function (evt) {
         evt.preventDefault();
         $('.right-sec').attr('style', '');
         if (typeof that.onSelection == 'function') {
            that.onSelection(asset);
         }
         return false;
    });

    $('#view-asset', assetDiv).click(function (evt) {
        evt.preventDefault();
        if (typeof that.onSelection == 'function') {
            that.onView(asset);
        }
        evt.stopPropagation();
        return false;
    });

    $('#down-asset', assetDiv).click(function (evt) {
        evt.stopPropagation();
        that.settings.onDownload(asset);
        return false;
    });
}

/*
 * Inputs - container (jquery object) - asset (with following structure) -
 * onView function (optional ) - onLike function (optional ) - onDislike
 * function (optional ) - onRating function (optional ) - onComment function
 * (optional )
 * 
 * Asset Structure
 *  - thumbnailURL (name of the tag) - downloadedThumbnail (for offline assets) -
 * name - description (optional) - documentType (optional) - analyticsHistory -
 * starValue - totalViewsCount - totalLikesCount - totalDislikesCount
 */

function AssetDetail(settings) {
    this.settings = $.extend({}, settings);
    this.container = this.settings.container;
    this.asset = this.settings.asset;
    this.onSelection = this.settings.onSelection;
    this.onRatingSelected = this.settings.onRated;
    this.onAssetLiked = this.settings.onAssetLike;
    this.onAssetUnliked = this.settings.onAssetUnliked;
    this.isPhone = false;
    this.onView = this.settings.onView;
    this.onDownload = this.settings.onDownload;
    if ($(window).width() < 720) {
        this.isPhone = true;
    }
}
AssetDetail.prototype.intiRating = function (id, rating, isBig) {
    var that = this;
    ratings(id, 5, rating, true, isBig).bind(
			'ratingchanged',
			function (event, data) {
			    // $(".star").hide();
			    $(".ratingText").html("Thank you for Rating");

			    if (typeof that.onRatingSelected == 'function') {
			        that.onRatingSelected(that.asset, data.rating);
			    }
			});
};
AssetDetail.prototype.setRating = function (id, rating, isBig) {
    ratings(id, 5, rating, false, isBig);
};
AssetDetail.prototype.show = function () {
//	$('#pop-home').addClass('show-home-popup');
//	var arrowPopuphome = new ArrowPopup ($('.show-home-popup'),{
//        container: "headersection",
//        bodyDiv: "home",
//        contents: [
//            {
//                displaytitle: "Kangle Home",
//                iconclass: 'arrow-wire',
//                onclick: function () {
//                    //window.changeActivity.change();
//                      window.location.href = 'homePage.html';
//                },
//                isVisible: true
//            },{
//                displaytitle: "Asset page",
//                iconclass: 'arrow-offline',
//                onclick: function () {
//                    //window.changeActivity.change();
//                       window.location.reload();
//                },
//                isVisible: true
//                   }
//       ]
//	});
    this.container.empty();
    var that = this;
    var asset = this.asset;
    $(".bottom-sec").css('display','none');
    // var thumnailURL =
    coreView.getThumbnailURL(asset, function (thumnailURL) {
        var tagDisplayName = asset.metaTag1.replace(/#/g, '');
        if (tagDisplayName.split("~").length > 1) {
            tagDisplayName = tagDisplayName.split("~")[1];
        }
        // var subTag = asset.metaTag2.split('#');
        // var subTag = new Array();
        // subTag.push(asset.metaTag2);
        var subTag = new Array();
        var mtAry = asset.metaTag2.toString().split(',')
        if (mtAry != null && mtAry.length > 0) {
            for (var i = 0; i <= mtAry.length-1; i++) {
                subTag.push(mtAry[i]);
            }
        }

        /*
		 * if (asset.analyticsHistory.starValue > 5) {
		 * asset.analyticsHistory.starValue = 5; }
		 */
        digitalAssetLocalDAO.get(asset.daCode, function (returnedAsset) {
            var existingAsset = (returnedAsset != null && returnedAsset.downloaded == 'Y');
            var downloadableAsset = false;
            if(asset.downloadable == 'Y') downloadableAsset = true;
            var isViewable = (asset.isViewable == 'Y');

        var html = '<a class="back-detail">Back</a><div class="asset-desc"><div style="height: 2px; width: 100%; clear: both;"></div>' + 
					'<div class="desc-image"><div class="desc-left"><div class="desc-img-rgt"><div class="desc-img">'+
					'<span class="asset-shade"> <img src="' + thumnailURL + '" alt="'+ asset.name +'"/>'+
                    '<span class="shade-bg"></span>';
                    
                    if(isViewable || (!existingAsset && downloadableAsset)) {
                        html += '<div class="actions" >'+
                        '<ul>'+
                        (isViewable ? '<li> <a id="asset-view" href="#" title="view"></a></li>' : '') +
                        ((!existingAsset && downloadableAsset) ? '<li> <a id="asset-download" href="#" title="Download"></a></li>' : '') +
                        /* '<li style="width: 50px; height: 40px; padding-top:10px; "> <a href="" style="width:50px; height:32px; display:none; padding:5px; background: url(online/imgs/download.png) 13px 0 no-repeat;"></a></li>' + */
                        '</ul>'+
                        '</div>';
                    }
                   html += '</span></div>'+
                    '</div></div>'+
                    /*'<div class="asset-action" style="display:none;"><a id="asset-view" href="#" title="view">View</a>' +
                    ('<a id="asset-download" href="#" title="Download">Download</a>') + '</div>' +
					'</div>'+*/
					

					'<div class="tab">'+
					'<ul class="tag_ul" >'+
					'<li id="Details" class="active_div">Details</li>'+
					'<li id="Discuss">Discuss</li>'+
					'<li id="Related">Related</li>'+
					'</ul></div>'+
                    
                    '<div class="desc-right" style="display:block;"><div class="desc-cont" style="padding-top:10px;" ><div class="desc-cont-tlft">'+
					'<h2>'+ asset.name + '</h2><div><span>Category :</span><span>' + tagDisplayName + '</span>'+
					'</div><div class="asset-desc-el"><b>Description: </b>' + asset.description +
					'</div></div><div class="desc-cont-trig"><ul><li class="asset-rat">' + asset.analyticsHistory.starValue + '</li>' +
                    '<li class="asset-like">' + asset.analyticsHistory.totalLikesCount + '</li><li class="asset-cmt">'+
                    '</li></ul></div>';
        if (subTag.length > 0) {
            html += '<div class="desc-cont-tags"><ul>';
            for (var i = 0; i < subTag.length; i++) {
                html += '<li><a href="#" title="' + subTag[i] + '">' + subTag[i] + '</a></li>';
            }
		    html += '</ul></div>';
        }

        html += '</div></div><div style="clear: both;"></div></div>';

        
                             html += '<div class="asset-action clearfix">';
                             // var assetLikeDiv = '<div
								// class="action-left"><ul class="asset-like">';
                             // assetLikeDiv += '<li id="asset-like"><a
								// href="#" title="Like"></a></li>' +
                             // '<li id="asset-unlike"><a href="#"
								// title="Unlike"></a></li></ul>' +
                             // '<div class="likeOrDislikeText"
								// style="display: none"></div>';
                             
                             // var rateDiv = '<p>Rate this</p><div
								// class="asset-rate"></div></div>';
                             
                             var assetLikeDiv = '<div class="action-left">';
                             assetLikeDiv += '<div class="col-md-5" id="dv_asset_like_dislike">';
                             
                             assetLikeDiv += '<div class="like_sec" id="asset-like" >';
                             assetLikeDiv += '<a class="fa fa-thumbs-o-up cls_i_like_dislike" style="cursor: pointer;"></a>';
                             assetLikeDiv += '<div class="pull-left" id="dv_likes">Like</div>';
                             assetLikeDiv += '</div>';
                             
                             assetLikeDiv += '<div class="dislike_sec" id="asset-unlike" >';
                             assetLikeDiv += '<a class="fa fa-thumbs-o-down cls_i_like_dislike" style="cursor: pointer;"></a>';
                             assetLikeDiv += '<div class="pull-left" id="dv_dislikes">Dislike</div>';
                             assetLikeDiv += '</div>';
                             
                             assetLikeDiv += '</div>';
                             
                             assetLikeDiv += '<p>Rate This: </p><div class="asset-rate">';
                             // assetLikeDiv += '<div class="big
								// jquery-ratings-star
								// jquery-ratings-full"></div><div class="big
								// jquery-ratings-star
								// jquery-ratings-full"></div><div class="big
								// jquery-ratings-star
								// jquery-ratings-full"></div><div class="big
								// jquery-ratings-star"></div><div class="big
								// jquery-ratings-star"></div>';
                             assetLikeDiv += '</div>';
                             
                             assetLikeDiv += '</div>';
                             
                             assetLikeDiv += '<div style="display: none" class="likeOrDislikeText"></div>';
                             
                             html += assetLikeDiv;
                             
                             /*
								 * html += '<div class="asset-action
								 * clearfix">'; var assetLikeDiv = '<div
								 * class="action-left"><ul class="asset-like">';
								 * assetLikeDiv += '<li id="asset-like"><a
								 * href="#" title="Like"></a></li>' + '<li id="asset-unlike"><a
								 * href="#" title="Unlike"></a></li></ul>'+ '<div
								 * class="likeOrDislikeText" style="display:
								 * none"></div>';
								 * 
								 * var rateDiv = '<p>Rate this</p><div
								 * class="asset-rate"></div></div>'; html +=
								 * assetLikeDiv + rateDiv;
								 */

        /** comments * */
        /*
		 * var commentDiv = '<div class="action-right">'; commentDiv += '<h3>Comments</h3><div
		 * class="asset-comments">'; commentDiv += '<div class="comment-box"><span>'+ '<img
		 * src="online/images/profile_icon.png" alt="" /></span><form
		 * action="#" method="post">' + '<textarea name="comment"
		 * class="tag-comment" placeholder="Share your comments"></textarea>'+ '<input
		 * type="button" class="form-submit" value="save" /></form></div>' + '</div><div
		 * class="comment-success" style="display:none;"></div></div></div>';
		 */
                             
                             var commentDiv = '<div class="comment_div">';
                             commentDiv += '<div class="col-lg-12 cls-sub-header1" id="dv_comments_header">Comments</div>';
                             commentDiv += '<div class="col-lg-12" id="dvDiscuss">';
                             commentDiv += '<div class="publishContainer">';
                             // commentDiv += '<div
								// class="comment">Comments</div>';
                             commentDiv += '<textarea class="msgTextArea" id="txtMessage" maxlength="100" onkeypress="assetPlay.onPostEntry()" onkeydown="assetPlay.onPostEntry()" onkeyup="assetPlay.onPostEntry()" data-bind="value: newMessage, jqAutoresize: {}" style="height: 3em;" placeholder="What\'s on your mind?"></textarea><p>(<span id="spnCntRemaining">100</span> characters remaining)</p>';
                             /*
								 * commentDiv += '<input type="button"
								 * data-url="http://kangle.swaas.net/Wall/SavePost"
								 * value="Post" id="btnShare" data-bind="click:
								 * addPost">';
								 */
                             commentDiv += '<input type="button" data-url="http://'+DOMAIN+'/Wall/SavePost" value="Post" id="btnShare" data-bind="click: addPost">';
                             commentDiv += ' </div>';
                             commentDiv += '<ul id="msgHolder" data-bind="foreach: posts">';
                             commentDiv += ' <li class="postHolder">';
                             commentDiv += '<img class="img_post_header" data-bind="attr: { src: PostedByAvatar }"><p><a data-bind="    text: PostedByName"></a>: <span data-bind="    html: Message"></span></p>';
                             commentDiv += ' <div class="postFooter">';
                             commentDiv += ' <span class="timeago" data-bind="text: PostedDate"></span>&nbsp;<a class="linkComment" href="#" data-bind="    click: toggleComment">Comment</a>';
                             commentDiv += ' <div class="commentSection">';
                             commentDiv += ' <ul data-bind="foreach: PostComments">';
                             commentDiv += ' <li class="commentHolder">';
                             commentDiv += ' <img class="img_post_header" data-bind="attr: { src: CommentedByAvatar }"><p><a data-bind="    text: CommentedByName"></a>: <span data-bind="    html: Message"></span></p>';
                             commentDiv += ' <div class="commentFooter"><span class="timeago" data-bind="text: CommentedDate"></span>&nbsp;</div>';
                             commentDiv += ' </li>';
                             commentDiv += '</ul>';
                             commentDiv += ' <div style="display: block" class="publishComment">';
                             commentDiv += '<textarea maxlength="100" class="commentTextArea" data-bind="value: newCommentMessage, jqAutoresize: {}" placeholder="write a comment..." onkeypress="assetPlay.onCommentEntry(this)" onkeydown="assetPlay.onCommentEntry(this)" onkeyup="assetPlay.onCommentEntry(this)"></textarea>';
                             commentDiv += ' <input type="button" value="Post" class="btnComment" data-bind="click: addComment" />';
                             commentDiv += '</div>';
                             commentDiv += '</div>';
                             commentDiv += '</div>';
                             commentDiv += '</li>';
                             commentDiv += '</ul>';
                             commentDiv += '</div>';
                             commentDiv += '</div>';

        html += commentDiv + '</div>';
        that.container.html(html);
        $(".comment-box span img").attr("src", eLearningAPP.currentUser.userImg).css("height","65px");

        that.intiRating($('.asset-rate'), 0, true);
        
        /** Tab section clicks **/
        $('.tab ul li').bind('click',function(){
        	$( ".tab ul li" ).removeClass("active_div");
			$(this).addClass("active_div");
			if(this.id == "Details") {
				$('.desc-right, .action-left').css('display','block');
				$('.comment_div, .categ-sec').css('display','none');
			} else if(this.id == "Discuss") {
				$('.desc-right, .action-left, .categ-sec').css('display','none');
				$('.comment_div').css('display','block');
			} else if(this.id == "Related") {
				$('.desc-right, .action-left, .comment_div').css('display','none');
				$('.categ-sec').css('display','block');
			}
        });
        /** Tab section clicks **/
        
        /** Asset like or dislike * */
        var onAssetLikeCallback = that.onAssetLiked;
        var onAssetUnlikeCallback = that.onAssetUnliked;
        $('#asset-unlike').click(function (e) {
            $(".likeOrDislikeText").show().html("Thank you for Like/Dislike");
            $(".asset-like").addClass('hidden');
            onAssetUnlikeCallback(asset);
            return false;
        });
        $('#asset-like').click(function (e) {
            $(".likeOrDislikeText").show().html("Thank you for Like/Dislike");
            $(".asset-like").addClass('hidden');
            onAssetLikeCallback(asset);
            return false;
        });

        $('#asset-view').click(function (evt) {
            evt.preventDefault();
            if (typeof that.onView == 'function') {
                that.onView(asset);
            }
            evt.stopPropagation();
            return false;
        });

        $('#asset-download').click(function (e) {
                                   // alert("clcikc");
            e.stopPropagation();
            that.settings.onDownload(asset);
            return false;
        });
        /*new back button*/
        //$('.bread-crum').append('<li style="width:50px;"><span class="back-detail">Back</span></li>');
        $('.back-detail').unbind('click').bind('click', function () {
        	if($('.bread-crum li').hasClass('discussion')){
        		$('.asset-disc-count').trigger('click');
        	}
            $('.asset-detail').hide(); 
            $(this).remove();
            var viewState = $('.asset-menu li a:visible');
            $('.asset-holder').show();
            $('.bottom-sec').css('display','block');
            $('body').addClass('bg-wood');
//			$('#pop-home').removeClass('show-home-popup');
        });
        /*$('.back-detail').unbind('click').bind('click', function () {
            window.location.reload();
        });*/
        /*new back button end*/
        $('.desc-cont-tags ul li a').bind('click', function () {
        	$('.bottom-sec').css('display','block');
            var tagName = $(this).attr('title').replace(' ', '').toLowerCase();
            $('ul.slide_menu li#categorys').removeClass('active');
            $('ul.slide_menu li#tags').addClass('active');
            $('.menu#category').hide();
            $('.menu#tag').show();
            var tagEl = '#tag li a#' + tagName;
            $(tagEl).click();
            return false;
        });

        /** Asset comment section * */
        var saveTagText = $('.form-submit');
        var tagTextArea = $('.tag-comment');
        if (typeof that.settings.onSaveComments == 'function') {
            saveTagText.click(function (e) {
                e.stopPropagation();
                var comments = tagTextArea.val();
                if (comments != null && comments.trim() != "") {
                    // that.showMessage(comments);
                    $('.comment-success').show().html('Thanks for sharing your comments');
                    tagTextArea.val('').empty();
                    tagTextArea.attr('placeholder', 'Share your comments');
                    that.settings.onSaveComments(asset, comments);
                } else {
                    alert("Please enter your comments and try saving again");
                }
            });
        }
                             assetPlay.defaults.assetId = asset.daCode;
                             ko.applyBindings(new viewModel());
        that.container.show();
        
        /*discussion forum count*/
        //var notifUserId = window.localStorage.getItem('userId');
        //alert(notifUserId);
        /*Services.updateIsHubReadForAssetDiscussion(userId, asset.daCode, function (data) {
            if (data == true || data == 'true') {
                Services.getUnReadAssetDiscussionCount(userId, function (data) {
                    if (data && data > 0) {
                        $('.asset-disc-count').show();
                        $('.asset-disc-count span').text(data);
                    } else {
                        $('.asset-disc-count').hide();
                    }
                    }, function () { });
            }
        }, function () { });*/
        /*discussion forum count*/
        
        var rAssets = new RelatedAssets({ assetId: asset.daCode, asset: that.asset});
        /*actions play new div*/
        var actHgt = $(".actions").height();
        var ulHgt = $(".actions ul").height();
        var marginHgt = (actHgt - ulHgt) / 2;
        $(".actions ul").css("margin-top", marginHgt);
        }, function(e) {
            alert("Error occured, please try again.");
        });
    });
};

AssetDetail.prototype.showMessage = function (comment) {
    var cHtml = '<li class="comment-item"><div class="comment-desc"><h4>' + userNameWeb_g +
        '</h4><h5>' + new Date() + '</h5><p>' + comment + '</p></div></li>';
    $('.comments ul').append(cHtml);
}

/* Related Assets - right section  */
function RelatedAssets(options) {
    this.options = options;
    this.asset = options.asset;
    this.load();
}
RelatedAssets.prototype.checkMobile = function () {
    var mobileJs = new MobileDetect(window.navigator.userAgent);
    function resetClass() {
        $('.categ-sec').removeClass('mobile-right');
        $('.categ-sec').removeClass('tablet-right');
        $('.asset-detail').removeClass('padd-right');
        $('.asset-details').removeClass('tablet-content');
    }
    if (mobileJs.mobile() == null || mobileJs.phone() == null || mobileJs.tablet()) {
        if ($(window).width() < 1024) {
            resetClass();
            $('.asset-detail').addClass('padd-right');
        } else {
            resetClass();
        }
    }
    if (mobileJs.mobile() || mobileJs.phone()) {
        resetClass();
        $('.categ-sec').addClass('mobile-right');
    }
    if (mobileJs.tablet()) {
        resetClass();
        $('.asset-detail').addClass('tablet-content');
        $('.categ-sec').addClass('tablet-right');
    }
}
RelatedAssets.prototype.load = function () {
    var self = this;
    var categoryName = self.asset.metaTag1.replace(/#/g, '');
    var assetId = this.options.assetId;
    var html = '<div class="categ-sec"><div class="catg-hold" style="display:none;"></div><div class="content"><h3>Related Assets</h3>';
    var data = {};
    var categoryContext = ['WebAPI', 'GetSelectedCategoryWiseTop3Assets', subDominWeb_g, assetId, companyId_g,
        eLearningAPP.currentUser.companyCode, eLearningAPP.currentUser.userCode, eLearningAPP.currentUser.regionCode, eLearningAPP.currentUser.userTypeCode];
    CoreREST.get(self, categoryContext, null, function (categories) {
        if (categories == null || categories == undefined) {
            categories = new Array();
        }
        html += self.getAssetsByCategories(categories, categoryName);
        var tagContext = ['WebAPI', 'GetSelectedTagwiseTop3Assets', subDominWeb_g, assetId, companyId_g,
        eLearningAPP.currentUser.companyCode, eLearningAPP.currentUser.userCode, eLearningAPP.currentUser.regionCode, eLearningAPP.currentUser.userTypeCode];
        CoreREST.get(self, tagContext, null, function (tags) {
            var newTags = {};
            if (tags && tags.length > 0) {
                for (var i = 0; i < tags.length; i++) {
                    var curTag = tags[i];
                    newTags[curTag.Tag_Name] = curTag.lstAssets;
                }
            }
            html += self.getAssetsByKeyword(newTags);

            html += '</div></div>';
            $('.asset-desc').append(html);
            self.bindActions(categories, newTags);
            $('.categ-sec').niceScroll();
            self.checkMobile();
        });
    });

    $(window).resize(function () {
        self.checkMobile();
    });
}

RelatedAssets.prototype.getAssetsByCategories = function (categories, categoryName) {
    var self = this;
    var html = '';
    console.log(categories);
    if (categories && categories.length > 0) {
        html += '<h4 class="right-block-title categ-title"><b>Category: </b><a href="#" title="' + categories[0].DA_Category_Name +
            '" onclick="return false;">' + categories[0].DA_Category_Name + '</a></h4>';
        html += '<ul>';
        $.each(categories, function (index, category) {
            if (index < 3) {
                html += '<li class="asset-block" data-dacode="' + category.DA_Code + '">';
                html += '<div class="img-url"><img src="' + category.DA_Thumbnail_URL + '" alt=""/></div>';
                html += '<div class=details><h4>' + category.DA_Name + '</h4><div class="view-likes"><span class="asset-view">' +
                    '<span class="fa fa-eye"></span>' + category.TotalViews + '</span><span class="asset-like">' +
                    '<span class="fa fa-heart"></span>' + category.TotalLikes + '</span><span class="asset-rating">' +
                    '<span class="fa fa-star"></span>' + self.getRating(category.TotalRatings) + '</span></div></div>';
                html += '</li>';
            }
        });
        html += '</ul>';
        if (categories.length > 3) {
            html += '<div class="show-more"><a href="#cat_' + categories[0].DA_Category_Name + '" class="">Show More</a></div>';
        }
    } else {
        html += '<div>No more items found in the category - ' + categoryName.split('~')[1] + '</div>';
    }
    return html;
}

RelatedAssets.prototype.getAssetsByKeyword = function (tags) {
    var self = this;
    var html = '';
    if (tags != undefined) {
        for (var tg in tags) {
            html += '<h4 class="right-block-title keywd-title"><b>Keyword: </b><a href="#" title="' + tg + '" onclick="return false;">' + tg + '</a></h4>';
            var curTag = tags[tg];
            html += '<ul>';
            var len = curTag.length > 3 ? 3 : curTag.length;
            for (var i = 0; i < len; i++) {
                var curTagAsset = curTag[i];
                html += '<li class="asset-block"  data-dacode="' + curTagAsset.DA_Code + '">';
                html += '<div class="img-url"><img src="' + curTagAsset.DA_Thumbnail_URL + '" alt=""/></div>';
                html += '<div class=details><h4>' + curTagAsset.DA_Name + '</h4><div class="view-likes"><span class="asset-view">' +
                    '<span class="fa fa-eye"></span>' + curTagAsset.TotalViews + '</span><span class="asset-like">' +
                    '<span class="fa fa-heart"></span>' + curTagAsset.TotalLikes + '</span><span class="asset-rating">' +
                    '<span class="fa fa-star"></span>' + self.getRating(curTagAsset.TotalRatings) + '</span></div></div>';
                html += '</li>';
            }
            html += '</ul>';
            if (curTag.length > 3) {
                html += '<div class="show-more"><a href="#' + tg.toLowerCase() + '" class="">Show More</a></div>';
            }
        }
    }
    return html;
};
RelatedAssets.prototype.bindActions = function (categories, tags) {
    var self = this;
    $('.show-more a').unbind('click').bind('click', function () {
    	$('.bottom-sec').css('display','block');
        var assetName = $(this).attr('href');
        assetName = assetName.replace(/ /g, '');
        if (assetName.indexOf('tagast') == 1)
            $('a', $(assetName)).click();
        else
            $(assetName).click();
        return false;
    });

    $('.catg-hold').unbind('click').bind('click', function () {
        var right = $('.categ-sec').css('right');
        $('.categ-sec').animate({
            right: (right == '0px' ? '-250px' : '0px')
        }, 600);
        return false;
    });
    
    $('li.asset-block').unbind('click').bind('click', function () {
        var daCode = $(this).data('dacode');
        if (daCode != null || daCode !== undefined) {
            var asset = self.getAssetByCode(daCode);
            console.log(asset);
            eLearningAPP.showAsset(asset);
        }
        return false;
    });
};
RelatedAssets.prototype.getAssetByCode = function (daCode) {
    var neededAsset = {};
    console.log(eLearningAPP.FullAssets);
    if (eLearningAPP.FullAssets && eLearningAPP.FullAssets.length > 0) {
        for (var i = 0 ; i < eLearningAPP.FullAssets.length; i++) {
            var curCategAsset = eLearningAPP.FullAssets[i];
            console.log(curCategAsset.daCode + '==' + daCode);
            if (curCategAsset.daCode == daCode)
                neededAsset = curCategAsset;
        }
    }
    return neededAsset;
};
RelatedAssets.prototype.getRating = function (rating) {
    var newRating = rating;
    if (rating > 1000) {
        newRating = newRating / 1000;
        newRating = newRating + 'k';
    }
    return newRating;
};
/** Related Assets **/
// UI Components ends
var resource = {
    edtAnalysisJS: 'http://wideanglebuilds.blob.core.windows.net/htmlanalytics/EdtAnalysisService.js',
    oneLibFolder: 'Kangle',
    assetsFolder: 'assets',
    appAndroidPlatform: 'ANDROID',
    appIOSPlatform: 'IOS',
    webPlatform: 'web',
    assetDownloadFolder: "Kangle/assets",
    assetCategoryFolder: "Kangle/categoryIcons",
    alreadyDownloaded: "Asset already downloaded.",
    logoFolder: "Kangle/companyLogo",
    //nomediaFolder : "Kangle/nomedia",
    logoFileName: "companyLogo.jpg",
    defaultLogoPath: "../images/EL/logo.png",
    assetBaseFolder: "Kangle",
    tagSeparator: "#",
    correlationId: 1,
    networkMessage: {
        video: "Video cannot be played as the internet connection is not available",
        document: "Document cannot be opened as the internet connection is not available",
        noNetwork: "Your device is not connected to the internet. Please connect to the internet and retry the operation"
    },
    login: {
        failed: 'Login failed, please try again!'
    },

    ssoDetail: {
        reasonId: 2,
        appSuiteId: 1,
        appId: 3,
        appPlatForm: "ANDROID"
    },
    download: {
        tempFolder: "eLearning/temp",
        categoryImageFormat: "jpg",
        logoFormat: "jpg"
    },
    //onlineURL
    onlineURL: "http://" + DOMAIN + "/",
    
    userValidationMessage: "You are not an authorised user.",
    timeoutErrorMessage: "Error connecting to the server, please try again",
    application: {
        version: "2",
        release: "5",
        upToDate: "You have the latest version of APP",
        upgradingMessage: "Please wait, upgrading application...",
        upgradeAlertMessage: 'A newer version of APP is available. Please click on "Upgrade APP" to get the latest version',
        upgradeOption: "Upgrade APP"
    },
    confirmationBox: {
        title: "Confirm",
        yes: "yes",
        no: "no",
        deleteAssetMessage: "Are you sure you want to delete this Asset ?",
        message:"Logging Out from Kangle would result in loss of data and you will no longer be able to access the digital documents. Are you sure you want to continue?",
        /*
		 * message: "This action will erase all the digital assets that you have
		 * downloaded and stored in your memory card. If you need the digital
		 * assets you should download them again. Do you want to continue?",
		 * //As per CR Jul 10.
		 */
        messageUpSynchOnline: "You have some important data not uploaded to central data center, Do you want to Upload those data before you do Format Device ?",
        messageUpSynchOffline: "You have some important data not uploaded to central data center and your  not in online also.So you are not able to upload those data. Please connect to the internet and upload the data before Format Device"
    }

};

// Elearning specific serviices and DAOs

var assetService = {
    insertAssetBilling: function (context, assetBilling, success, failure) {
        assetBilling.daBillingId = UUIDUtil.getUID();
        var daBillingId = assetBilling.daBillingId;
        digitalAssetBillingLocalDAO.insert(assetBilling, function (assetBilling) {
            success(daBillingId);
        }, failure);
    },

    updateAssetBilling: function (assetBilling, success, failure) {
        digitalAssetBillingLocalDAO.update(assetBilling, success, failure);
    },

    saveAssetDetailsAndAnalyticsHistory: function (assetDetails, daAnalyticsHistory, success, failure) {
        assetService.saveAssetDetails(assetDetails, function (data) {
            assetService.saveOrUpdateAnalyticalHistory(daAnalyticsHistory, success, failure);
        }, function (data) { });
    },

    saveAssetDetails: function (assetDetails, success, failure) {
        digitalAssetLocalDAO.get(assetDetails.daCode, function (returnedAsset) {
            if (returnedAsset != null) {
                digitalAssetLocalDAO.update(assetDetails, success, failure);
            } else {
                digitalAssetLocalDAO.insert(assetDetails, success, failure);
            }
        }, function (data) { });
    },

    saveOrUpdateAnalyticalHistory: function (daAnalyticsHistory, success, failure) {
        daAnalyticHistoryLocalDAO.getByAsset(daAnalyticsHistory.daCode, function (analyticsHistory) {
            if (analyticsHistory != null) {
                daAnalyticHistoryLocalDAO.update(null, daAnalyticsHistory, success, failure);
            } else {
                daAnalyticHistoryLocalDAO.insert(daAnalyticsHistory, success, failure);
            }

        }, function (data) {
        	//alert(JSON.stringify(data));
        });
    },

    populateAssetBilling: function (user, position, asset, success, failure) {
        var division = user.division;
        var offline = 0;
        var online = 0;
        if (asset.downloaded == 'Y') {
            offline = 1;
        } else {
            online = 1;
        }
        if (division == null) {
            division = {};
        }

        if (asset != null, user != null) {
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
                offlineClick: offline,
                downloaded: 0,
                onlinePlay: online,
                latitude: position.latitude,
                longitude: position.longitude
            };
            this.insertAssetBilling(this, assetBilling, function (daBillingId) {
                success(daBillingId);
            }, function (data) { });


        } else {
            success({});
        }
    },

    persistAnalytics: function (analytics, success, failure) {
        if (analytics instanceof Array != true) {
            analytics.daTagAnalyticId = UUIDUtil.getUID();
        }
        if (eLearningAPP.currentUser != null) {
            if (analytics instanceof Array) {
                $.each(analytics, function (i, analytic) {
                    analytic.userName = eLearningAPP.currentUser.userName;
                    analytic.regionCode = eLearningAPP.currentUser.regionCode;
                    analytic.regionName = eLearningAPP.currentUser.regionName;
                });
            } else {
                analytics.userName = eLearningAPP.currentUser.userName;
                analytics.regionCode = eLearningAPP.currentUser.regionCode;
                analytics.regionName = eLearningAPP.currentUser.regionName;
            }
        }
        daTagAnalyticLocalDAO.insert(analytics, function (data) {
            success(analytics.daTagAnalyticId);
        }, function () { });
    },
};
// SynchronizeLocalDAO starts here

var assetMetaTagLocalDao = {

    metadata: {
        "tableName": "tbl_DIGASSETS_METADATA",
        "columns": [
                    { name: "category", columnName: "category" },
                    { name: "metaTag", columnName: "meta_tag", pk: true },
                    { name: "subTag", columnName: "sub_tag", pk: true },
                    { name: "tagCount", columnName: "Tag_Count" },
        ]
    },
    insert: function (metaTag, success, failure) {
        coreDAO.insert(this, metaTag, success, failure);
    },

    update: function (metaTag, success, failure) {
        coreDAO.update(this, metaTag, success, failure);
    },

    get: function (metaTag, subTag, success, failure) {
        var criteria = {};
        criteria.metaTag = metaTag;
        criteria.subTag = subTag;
        var result = null;
        coreDAO.getEquals(this, criteria, function (data) {
            if (data.length > 0) {
                result = data[0];
                console.log('result in metaTag' + JSON.stringify(result));
            } else {
                result = null;
            }
            success(result);
        }, failure);
    },

    getAll: function (success, failure) {
        var result = null;
        coreDAO.getEquals(this, null, function (data) {
            if (data.length > 0) {
                result = data;
            } else {
                result = null;
            }
            success(result);
        }, failure);
    },
    remove: function (metaTag, subTag, success, failure) {
        var criteria = {};
        criteria.metaTag = metaTag;
        criteria.subTag = subTag;
        coreDAO.remove(this, criteria, success, failure);
    },
    getMetaTags: function (success, failure) {
        var query = 'Select category, Meta_Tag, count(*) as Tag_Count from tbl_DIGASSETS_METADATA Group By category, Meta_Tag';
        coreDAO.executeCustomQuery(this, query, null, success, failure);
    },

    getSubTags: function (metaTag, success, failure) {
        var query = "Select Sub_Tag, count(*) as Tag_Count from tbl_DIGASSETS_METADATA Where Meta_Tag = '" + metaTag + "' Group By Sub_Tag";
        coreDAO.executeCustomQuery(this, query, null, success, failure);
    },

    clean: function (context, data, success, failure) {
        assetMetaTagLocalDao.remove(null, null, success, failure);
    }

};
var metaTagService = {
    saveMetaTag: function (metaTag, subTag, success, failure) {
        if (metaTag != null && metaTag.length > 0) {
            metaTag = metaTag.replace(/#/g, '');
        }
        // alert(JSON.stringify(subTag));
        // alert(subTag[1]);
        if (subTag != null && subTag.length > 0) {
            // subTag = subTag.replace(/#/g, '');
            subTag = subTag;
        }
        var category = null;
        if (metaTag != null) {
            var catAndTag1 = metaTag.split("~");
            category = catAndTag1[0];
            catAndTag1.splice(0, 1);
            metaTag = catAndTag1;
        }

        this.saveOrUpdateTagDetails(category, metaTag, subTag, success, failure);
    },

    saveOrUpdateTagDetails: function (category, metaTag, subTag, success, failure, index) {
        if (index == null) {
            index = 0;
        }
        if (index < metaTag.length) {
            var singleMetaTag = metaTag[index];
            assetMetaTagLocalDao.get(singleMetaTag, subTag, function (returnTag) {
                if (returnTag != null) {
                    returnTag.tagCount = parseInt(returnTag.tagCount) + 1;
                    assetMetaTagLocalDao.update(returnTag, function (data) {
                        index++;
                        metaTagService.saveOrUpdateTagDetails(category, metaTag, subTag, success, failure, index);
                    }, failure);

                } else {
                    returnTag = {};
                    returnTag.category = category;
                    returnTag.metaTag = singleMetaTag;
                    returnTag.subTag = subTag;
                    returnTag.tagCount = 1;
                    assetMetaTagLocalDao.insert(returnTag, function (data) {
                        index++;
                        metaTagService.saveOrUpdateTagDetails(category, metaTag, subTag, success, failure, index);
                    }, failure);

                }
            }, failure);
        } else {
            success();
        }
    },

    removeOrUpdateMetaTag: function (metaTag, subTag, success, failure) {
        if (metaTag != null && metaTag.length > 0) {
            metaTag = metaTag.replace(/#/g, '');
        }

        if (subTag != null && subTag.length > 0) {
            subTag = subTag.replace(/#/g, '');
        }
        var category = null;
        if (metaTag != null) {
            var catAndTag1 = metaTag.split("~");
            category = catAndTag1[0];
            catAndTag1.splice(0, 1);
            metaTag = catAndTag1;
        }
        this.updateOrRemoveTagDetails(category, metaTag, subTag, success, failure);
    },

    updateOrRemoveTagDetails: function (category, metaTag, subTag, success, failure, index) {
        if (index == null) {
            index = 0;
        }
        if (index < metaTag.length) {
            var singleMetaTag = metaTag[index];
            assetMetaTagLocalDao.get(singleMetaTag, subTag, function (returnTag) {
                if (returnTag != null && returnTag.tagCount > 1) {
                    returnTag.tagCount = parseInt(returnTag.tagCount) - 1;
                    assetMetaTagLocalDao.update(returnTag, function (data) {
                        index++;
                        metaTagService.updateOrRemoveTagDetails(category, metaTag, subTag, success, failure, index);
                    }, failure);

                } else {
                    assetMetaTagLocalDao.remove(singleMetaTag, subTag, function (returnTag) {
                        index++;
                        metaTagService.updateOrRemoveTagDetails(category, metaTag, subTag, success, failure, index);
                    }, failure);

                }
            }, failure);
        } else {
            success();
        }
    }

};



// UserLocalDAO starts here

// var userDivisionRemoteDAO = {
// metadata: {
// "service": "WLUserService",
// "properties": [
// { name: "userCode", inProperty: "User_Code", outProperty: "User_Code" },
// { name: "divisionCode", inProperty: "Division_Code", outProperty:
// "Division_Code" },
// { name: "divisionName", inProperty: "Division_Name", outProperty:
// "Division_Name" }
// ]
// },

// get: function (correlationId, companyCode, userCode) {
// var data = {
// correlationId: correlationId,
// companyCode: companyCode,
// userCode: userCode
// };
// var result = CoreSOAP.invokeGet(this, "GetUserDivision", data);
// return result;
// }

// };

var userLocalDAOTest = {
    metadata: {
        "tableName": "tbl_User_Info",
        "columns": [
                    { name: "companyCode", columnName: "Company_Code" },
                    { name: "userName", columnName: "User_Name" },
                    { name: "password", columnName: "Password" },
                    { name: "url", columnName: "URL" },
                    { name: "userCode", columnName: "User_Code", pk: true },
                    { name: "regionCode", columnName: "Region_Code" },
                    { name: "regionName", columnName: "Region_Name" },
                    { name: "divisionCode", columnName: "Division_Code" },
                    { name: "divisionName", columnName: "Division_Name" },
                    { name: "userTypeCode", columnName: "User_Type_Code" },
                    { name: "userTypeName", columnName: "User_Type_Name" },
                    { name: "regionHierarchy", columnName: "Region_Hierarchy" },
                    { name: "lastSyncDate", columnName: "Last_Sync_Date" },
                    { name: "ssoId", columnName: "SSO_Id" }
        ]
    },
    get: function (correlationId, userName, subDomine) {
        var data = {
            correlationId: correlationId,
            userName: userName,
            subDomainName: subDomine
        };
        var result = CoreSOAP.invokeGet(this, "GetUserInfo", data);
        return result;
    }

}


var userLocalDAO = {

    metadata: {
        "tableName": "tbl_User_Info",
        "columns": [
                    { name: "companyCode", columnName: "Company_Code" },
                    { name: "userName", columnName: "User_Name" },
                    { name: "password", columnName: "Password" },
                    { name: "url", columnName: "URL" },
                    { name: "userCode", columnName: "User_Code", pk: true },
                    { name: "regionCode", columnName: "Region_Code" },
                    { name: "regionName", columnName: "Region_Name" },
                    { name: "divisionCode", columnName: "Division_Code" },
                    { name: "divisionName", columnName: "Division_Name" },
                    { name: "userTypeCode", columnName: "User_Type_Code" },
                    { name: "userTypeName", columnName: "User_Type_Name" },
                    { name: "regionHierarchy", columnName: "Region_Hierarchy" },
                    { name: "lastSyncDate", columnName: "Last_Sync_Date" },
                    { name: "ssoId", columnName: "SSO_Id" },
					{name: "pushRegId", columnName:"PUSH_REG_ID"},
					{name:"companyId", columnName:"Company_Id"}
        ]
    },

    insert: function (user, success, failure) {
        userLocalDAO.remove(null);
        coreDAO.insert(this, user, success, failure);
    },

    update: function (user) {
        coreDAO.update(this, user, success, failure);
    },

    remove: function (userCode, success, failure) {
        var criteria = {};
        criteria.userCode = userCode;
        return coreDAO.remove(this, criteria, success, failure);
    },

    get: function (success, failure) {
        coreDAO.getEquals(this, null, function (users) {
            var result = null;
            if (users.length > 0) {
                result = users[0];
            }
            success(result);
        }, failure);

    },    

    clean: function (context, data, success, failure) {
        userLocalDAO.remove(null, success, failure);
    }
};
// UserLocalDAO ends here

// DigitalAssetLocalDAO starts here
var digitalAssetLocalDAO = {
    metadata: {
        "tableName": "tbl_DIGASSETS_MASTER",
        "columns": [
                    { name: "productCode", columnName: "Product_Code" },
                    { name: "daCode", columnName: "DA_Code", pk: true },
                    { name: "fileUploadDateTime", columnName: "DA_FileUploadDateTime" },
                    { name: "downloadDateTime", columnName: "DA_DownloadDateTime" },
                    { name: "mode", columnName: "Mode" },
                    { name: "name", columnName: "DAName" },
                    { name: "offLineOutPutId", columnName: "OfflineOutPutId" },
                    { name: "onLineOutPutId", columnName: "OnlineOutPutId" },
                    { name: "onlineURL", columnName: "OnlineURL" },
                    { name: "offLineURL", columnName: "OffLineURL" },
                    { name: "lastFileUpdatedTimeStamp", columnName: "LastFileUpdatedTimeStamp", isDate: true },
                    { name: "lastTagUpdatedTimeStamp", columnName: "LastTagUpdatedTimeStamp", isDate: true },
                    { name: "downloaded", columnName: "Downloaded" },
                    { name: "downloadedFileName", columnName: "DownloadedFileName" },
                    { name: "downloadedThumbnail", columnName: "DownloadedThumbnail" },
                    { name: "documentType", columnName: "DocumentType" },
                    { name: "downloadable", columnName: "IsDownloadable" },
                    { name: "thumbnailURL", columnName: "ThumnailURL" },
                    { name: "description", columnName: "DA_Description" },
                    { name: "metaTag1", columnName: "MetaTag_One" },
                    {name: "fileSize", columnName: "DB_Size_In_MB" },
                    { name: "metaTag2", columnName: "MetaTag_Two" }
        ]
    },

    insert: function (asset, success, failure) {
        JSON.stringify("asset inserted : " + JSON.stringify(asset));
        coreDAO.insert(this, asset, success, failure);
    },

    update: function (asset, success, failure) {
        JSON.stringify("asset updated : " + JSON.stringify(asset));
        coreDAO.update(this, asset, success, failure);
    },

    remove: function (daCode, success, failure) {
        var criteria = {};
        criteria.daCode = daCode;
        coreDAO.remove(this, criteria, success, failure);
    },

    clean: function (context, data, success, failure) {
        digitalAssetLocalDAO.remove(null, success, failure);
    },

    get: function (daCode, success, failure) {
        var criteria = {};

        criteria.daCode = daCode;
        var result = null;
        coreDAO.getEquals(this, criteria, function (data) {
            if (data.length > 0) {
                result = data[0];
            } else {
                result = null;
            }
            success(result);
        }, failure);
    },
    getByTag: function (metaTag1, metaTag2, success, failure) {

        var criteria = {};
        criteria.metaTag1 = metaTag1;
        criteria.metaTag2 = metaTag2;
        var result = null;
        coreDAO.getLike(this, criteria, function (data) {
            if (data.length > 0) {
                result = data;
            } else {
                result = null;
            }
            success(result);
        }, failure);
    },

    getByCode: function (daCode, success, failure) {
        var criteria = {};
        criteria.daCode = daCode;
        coreDAO.getEquals(this, criteria, function (data) {
            if (data.length > 0) {
                result = data[0];
            } else {
                result = null;
            }
            success(result);
        }, failure);
    },

    getAll: function (success, failure) {
        coreDAO.getEquals(this, {}, success, failure);
    },

    getAssetURL: function (correlationId, companyCode, userCode, onlineURL, networkType, success, failure) {
        var data = {
            userCode: userCode,
            url: onlineURL,
            networkType: networkType
        };

        var context = [correlationId, companyCode, 'WebAPI', 'getSecreatAuth'];
        var result = "";
        CoreREST.post(this, context, data, function (data) {
            result = data;
            console.log(result);
            success(result);
        }, function (data) { });
    },

    getByOutputId: function (onLineOutPutId, success, failure) {
        var criteria = {};
        criteria.onLineOutPutId = onLineOutPutId;
        coreDAO.getEquals(this, criteria, function (result) {
            if (result != null && result.length > 0) {
                success(result[0]);
            } else {
                success(null);
            }
        }, failure);

    }
};


var daTagAnalyticLocalDAO = {
    metadata: {
        "tableName": "tbl_DA_Tag_Analytics",
        "columns": [
                    { name: "daTagAnalyticId", columnName: "DA_Tag_Analysic_Id", pk: true },
                    { name: "companyCode", columnName: "Company_Code" },
                    { name: "daCode", columnName: "DA_ID" },
                    { name: "userCode", columnName: "User_Code" },
                    { name: "userName", columnName: "User_Name" },
                    { name: "regionCode", columnName: "Region_Code" },
                    { name: "regionName", columnName: "Region_Name" },
                    { name: "dateTime", columnName: "DateTime", isDate: true },
                    { name: "like", columnName: "Like" },
                    { name: "dislike", columnName: "Disike" },
                    { name: "rating", columnName: "rating" },
                    { name: "tagDescription", columnName: "Tag_Description" }
        ]
    },

    insert: function (daAnalytics, success, failure) {
        coreDAO.insert(this, daAnalytics, success, failure);
    },
    getCount: function (success, failure) {
        coreDAO.getEquals(this, {}, function (daTagAnalytics) {
            console.log('inside get analytics : ' + JSON.stringify(daTagAnalytics));
            if (daTagAnalytics != null && daTagAnalytics.length > 0) {
                success(daTagAnalytics.length);
            } else {
                success(0);
            }
        }, failure);
    },

    remove: function (daTagAnalyticId, success, failure) {
        var criteria = {};
        criteria.daTagAnalyticId = daTagAnalyticId;
        coreDAO.remove(this, criteria, success, failure);
    },

    clean: function (success, failure) {
        daTagAnalyticLocalDAO.remove(null, success, failure);
    },

    syncGet: function (params, success, failure) {
        var daTagAnalyicRecords = [];
        var columns = [
                        { name: "companyCode", columnName: "Company_Code" },
                        { name: "daCode", columnName: "DA_ID" },
                        { name: "userCode", columnName: "User_Code" },
                        { name: "userName", columnName: "User_Name" },
                        { name: "regionCode", columnName: "Region_Code" },
                        { name: "regionName", columnName: "Region_Name" },
                        { name: "dateTime", columnName: "DateTime", isDate: true },
                        { name: "like", columnName: "Like" },
                        { name: "dislike", columnName: "Disike" },
                        { name: "rating", columnName: "rating" },
                        { name: "tagDescription", columnName: "Tag_Description" }
        ];

        coreDAO.getEquals(this, {}, function (daTagAnalytics) {
            $.each(daTagAnalytics, function (index, daTagAnalyic) {
                var tagDetails = eLearningAPP.formatDataForSync(daTagAnalyic, columns);
                var daTagAnalyicRecord = {
                    daTagAnalyticId: daTagAnalyic.daTagAnalyticId,
                    correlationId: params.correlationId,
                    companyCode: params.companyCode,
                    userCode: params.userCode,
                    tagDetails: tagDetails
                };
                alert(tagDetails);
                daTagAnalyicRecords.push(daTagAnalyicRecord);
            });

            success(daTagAnalyicRecords);
        }, failure);


    }
};

// DAAnalyticHistoryLocalDAO starts here
var daAnalyticHistoryLocalDAO = {
    metadata: {
        "tableName": "tbl_DA_Analytics_History",
        "columns": [
                    { name: "daCode", columnName: "DA_ID", pk: true },
                    { name: "companyCode", columnName: "Company_Code" },
                    { name: "totalViewsCount", columnName: "TotalViewsCount" },
                    { name: "totalLikesCount", columnName: "TotalLikesCount" },
                    { name: "totalDislikesCount", columnName: "TotalDislikesCount" },
                    { name: "starValue", columnName: "StarValue" }
        ]
    },
    insert: function (daAnalyticsHistory, success, failure) {
        coreDAO.insert(this, daAnalyticsHistory, success, failure);
    },

    remove: function (daCode, success, failure) {
        var criteria = {};
        criteria.daCode = daCode;
        coreDAO.remove(this, criteria, success, failure);
    },

    clean: function (context, data, success, failure) {
        daAnalyticHistoryLocalDAO.remove(null, success, failure);
    },

    get: function (success, failure) {
        var criteria = {};
        var result = null;
        coreDAO.getEquals(this, criteria, function (data) {
            success(data);
        }, failure);
        return result;
    },
    
    getByAsset: function (daCode, success, failure) {
        var criteria = {};
        criteria.daCode = daCode;
        var result = null;
        coreDAO.getEquals(this, criteria, function (data) {
            if (data.length > 0) {
                result = data[0];
            } else {
                result = null;
            }
            success(result);
        }, failure);
        return result;
    },


    update: function (context, daAnalyticsHistory, success, failure) {
        if (daAnalyticsHistory instanceof Array) {
            daAnalyticHistoryLocalDAO._update(daAnalyticsHistory, success, failure);
        } else {
            coreDAO.update(daAnalyticHistoryLocalDAO, daAnalyticsHistory, function (data) {
                success();
            }, function (data) { });
        }
    },

    _update: function (daAnalyticsHistory, success, failure, index) {
        if (index == null) {
            index = 0;
        }
        if (index < daAnalyticsHistory.length) {
            var analyticsHistory = daAnalyticsHistory[index];
            coreDAO.update(daAnalyticHistoryLocalDAO, analyticsHistory, function (data) {
                index++;
                daAnalyticHistoryLocalDAO._update(daAnalyticsHistory, success, failure, index);
            }, success);
        } else {
            success();
        }
    }

};

// DigitalAssetBillingLocalDAO starts here
var digitalAssetBillingLocalDAO = {

		metadata : {
			"tableName" : "tbl_DA_Itemized_Billing",
			"columns" : [ {
				name : "daBillingId",
				columnName : "DA_Billing_Id",
				pk : true
			}, {
				name : "companyCode",
				columnName : "Company_Code"
			}, {
				name : "companyId",
				columnName : "Company_Id"
			}, {
				name : "daCode",
				columnName : "DA_id"
			}, {
				name : "userCode",
				columnName : "User_Code"
			}, {
				name : "userName",
				columnName : "User_Name"
			}, {
				name : "regionCode",
				columnName : "Region_Code"
			}, {
				name : "regionName",
				columnName : "Region_Name"
			}, {
				name : "divisionCode",
				columnName : "Division_Code"
			}, {
				name : "divisionName",
				columnName : "Division_Name"
			}, {
				name : "dateTime",
				columnName : "DateTime",
				isDate : true
			}, {
				name : "offlineClick",
				columnName : "Offline_Click"
			}, {
				name : "downloaded",
				columnName : "Downloaded"
			}, {
				name : "productCode",
				columnName : "Product_Code"
			}, {
				name : "productName",
				columnName : "Product_Name"
			}, {
				name : "onlinePlay",
				columnName : "Online_Play"
			}, {
				name : "longitude",
				columnName : "Longitude"
			}, {
				name : "latitude",
				columnName : "Latitude"
			}, {
				name : "playTime",
				columnName : "Play_Time"
			} ]

		},

		insert : function(digitalAssetBilling, success, failure) {
			digitalAssetBillingLocalDAO.companyId = window.localStorage
					.getItem("companyId");
			coreDAO.insert(this, digitalAssetBilling, success, failure);
		},

		remove : function(daBillingId, success, failure) {
			var criteria = {};
			criteria.daBillingId = daBillingId;
			coreDAO.remove(this, criteria, success, failure);
		},

		getCount : function(success, failure) {

			coreDAO.getEquals(this, null, function(data) {
				if (data.length > 0) {
					success(data.length);
				} else {
					success(0);
				}

			}, failure);
		},

		syncGet : function(params, success, failure) {
			// alert(JSON.stringify(params));
			var daBillingRecords = [];
			var columns = [ {
				name : "companyCode",
				columnName : "Company_Code"
			}, {
				name : "companyId",
				columnName : "Company_Id"
			}, {
				name : "daCode",
				columnName : "DA_id"
			}, {
				name : "userCode",
				columnName : "User_Code"
			}, {
				name : "userName",
				columnName : "User_Name"
			}, {
				name : "regionCode",
				columnName : "Region_Code"
			}, {
				name : "regionName",
				columnName : "Region_Name"
			}, {
				name : "divisionCode",
				columnName : "Division_Code"
			}, {
				name : "divisionName",
				columnName : "Division_Name"
			}, {
				name : "dateTime",
				columnName : "DateTime",
				isDate : true
			}, {
				name : "offlineClick",
				columnName : "Offline_Click"
			}, {
				name : "downloaded",
				columnName : "Downloaded"
			}, {
				name : "onlinePlay",
				columnName : "Online_Play"
			}, {
				name : "longitude",
				columnName : "Longitude"
			}, {
				name : "latitude",
				columnName : "Latitude"
			}, {
				name : "playTime",
				columnName : "Play_Time"
			} ];

			coreDAO.getEquals(this, {}, function(daBillingDetails) {

				$.each(daBillingDetails, function(index, daBillingDetail) {
					var elItemizedBillingDetails = eLearningAPP.formatDataForSync(
							daBillingDetail, columns);
					var daBillingRecord = {
						correlationId : params.correlationId,
						companyCode : params.companyCode,
						companyId : window.localStorage.getItem("companyId"),
						userCode : params.userCode,
						divisionCode : params.divisionCode,
						divisionName : params.divisionName,
						elItemizedBillingDetails : elItemizedBillingDetails
					};
					// alert(JSON.stringify(daBillingRecord));
					daBillingRecords.push(daBillingRecord);
				});
				success(daBillingRecords);
			}, failure);

		},

		clean : function(success, failure) {
			coreDAO.remove(this, null, success, failure);
		},

		update : function(assetBilling, success, failure) {
			coreDAO.update(this, assetBilling, success, failure);
		}
};

/*filter assets changes*/
var DigitalAssetAnalytics = {
	metadata : {
		"tableName" : "tbl_Dg_Assets_History",
		"columns" : [ 
			{
				name : "daCode",
				columnName : "DA_id"
			},	              
			{
				name : "companyId",
				columnName : "Company_Id",
			},
			{
				name : "userId",
				columnName : "User_Id",
			},
			{
				name : "regionCode",
				columnName : "Region_Code",
			},
			{
				name : "isRead",
				columnName : "IS_Read",
			},
			{
				name : "context1", 
				columnName : "Context_1"
			},	              
			{
				name : "context2",
				columnName : "Context_2",
			},
			{
				name : "context3",
				columnName : "Context_3"
			},	              
			{
				name : "context4",
				columnName : "Context_4",
			},
			{
				name : "context5",
				columnName : "Context_5"
			},	              
			{
				name : "context6",
				columnName : "Context_6",
			},
			{
				name : "context7",
				columnName : "Context_7"
			},	              
			{
				name : "context8",
				columnName : "Context_8",
			},
			{
				name : "context9",
				columnName : "Context_9"
			},	              
			{
				name : "context10",
				columnName : "Context_10",
			},
			{
				name : "context11",
				columnName : "Context_11"
			},	              
			{
				name : "context12",
				columnName : "Context_12",
			}
		]
	},
	insert : function(digitalAssetHistory, success, failure) {
		coreDAO.insert(this, digitalAssetHistory, success, failure);
	},
	get : function(daCode, success, failure) {
		var criteria = {};
		criteria.daCode = daCode;
		coreDAO.getEquals(this, criteria, function(data){
			if(data && data.length > 0) {
				if(success)
					success(data);
			} else {
				success([]);
			}
		}, function(){
			if(failure) failure();
		})
	},
	removeAll : function(sucess, failure) {
		coreDAO.remove(this, null, success, failure);
	},
	remove : function(daCode, success, failure) {
		var criteria = {};
		criteria.daCode = daCode;
		coreDAO.remove(this, criteria, success, failure);
	}
};
/*filter assets changes*/

var AssetDownloader = {
    downloadFile: function (asset, downloadProgress, success, failure) {
        AssetDownloader.progressCallbackMethod = downloadProgress;
        if (AssetDownloader.progressCallbackMethod == null || typeof AssetDownloader.progressCallbackMethod != 'function') {
            AssetDownloader.progressCallbackMethod = function (progress) { };
        }
        var ext = "mp4";
        var assetURLSplit = asset.offLineURL.split(".");
        if (assetURLSplit != null && assetURLSplit.length > 0) {
            ext = assetURLSplit.pop();
        }
        var fileName = "DA_" + asset.daCode + "." + ext;
        var assetFolder = resource.assetDownloadFolder;
        var downloadedFileName = assetFolder + "/" + fileName;
        // if(asset.downloadedFileName != null) {
        fileUtil.checkIfFileExists(asset.downloadedFileName, function (fileEntry) {
            if (asset.downloaded == 'Y' && downloadedFileName == asset.downloadedFileName) {
            	eLearningAPP.hideProgress();
                alert(resource.alreadyDownloaded);
                return;
            } else {
                var downloaderUtil = new Downloader();
                AssetDownloader.progressCallbackMethod({ progress: 0 });
                                   eLearningAPP.showProgress(0);
                downloaderUtil.downloadFile(asset.offLineURL, assetFolder, fileName, {}, function (progressStatus) {
                    if (isNaN(progressStatus.progress)) {
                        AssetDownloader.progressCallbackMethod(progressStatus);
                    } else {
                        if (progressStatus.progress == 100) {
                            progressStatus.progress = 50;
                            AssetDownloader.progressCallbackMethod(progressStatus);
                            asset.downloadedFileName = downloadedFileName;
                            asset.downloaded == 'Y';
                            AssetDownloader.downloadThumbnail(asset, downloadProgress, function(asset) { success(asset);}, function(e) { });
                                            } else {
                        
                            progressStatus.status = "ASSET_DOWNLOADING";
                            if (progressStatus.progress % 2 == 0) {
                                var progress = progressStatus.progress / 2;
                                progressStatus.progress = progress;
                                AssetDownloader.progressCallbackMethod(progressStatus);
                            }
                        }
                    }
                });
            }
        }, function (msg) {
            var downloaderUtil = new Downloader();
            AssetDownloader.progressCallbackMethod({ progress: 0 });
            downloaderUtil.downloadFile(asset.offLineURL, assetFolder, fileName, {}, function (progressStatus) {
                if (isNaN(progressStatus.progress)) {
                    AssetDownloader.progressCallbackMethod(progressStatus);
                } else {
                    if (progressStatus.progress == 100) {
                        progressStatus.progress = 50;
                        AssetDownloader.progressCallbackMethod(progressStatus);
                        asset.downloadedFileName = downloadedFileName;
                        asset.downloaded == 'Y';
                        AssetDownloader.downloadThumbnail(asset, downloadProgress, function(asset) { success(asset);}, function(e) { 
                        	// alert(JSON.stringify(e));
                        });
                    } else {
                        progressStatus.status = "ASSET_DOWNLOADING";
                        if (progressStatus.progress % 2 == 0) {
                            var progress = progressStatus.progress / 2;
                            progressStatus.progress = progress;
                            AssetDownloader.progressCallbackMethod(progressStatus);
                        }
                    }
                }
            });
        });
        /*
		 * } else {
		 * 
		 * var downloaderUtil = new Downloader();
		 * AssetDownloader.progressCallbackMethod({ progress: 0 });
		 * downloaderUtil.downloadFile(asset.offLineURL, assetFolder, fileName,
		 * {}, function (progressStatus) { if (isNaN(progressStatus.progress)) {
		 * AssetDownloader.progressCallbackMethod(progressStatus); } else { if
		 * (progressStatus.progress == 100) { progressStatus.progress = 50;
		 * AssetDownloader.progressCallbackMethod(progressStatus);
		 * asset.downloadedFileName = downloadedFileName; asset.downloaded ==
		 * 'Y'; AssetDownloader.downloadThumbnail(asset, downloadProgress,
		 * function(asset) { success(asset);}, function(e) {
		 * alert(JSON.stringify(e)); }); } else { progressStatus.status =
		 * "ASSET_DOWNLOADING"; if (progressStatus.progress % 2 == 0) { var
		 * progress = progressStatus.progress / 2; progressStatus.progress =
		 * progress; AssetDownloader.progressCallbackMethod(progressStatus); } } }
		 * }); }
		 */
    },

    downloadThumbnail: function (asset, downloadProgress, success, failure) {
    	var ext = "jpg";
        var thumbnailURLSplit = null;
        if (asset.thumbnailURL != null) {
            thumbnailURLSplit = asset.thumbnailURL.split(".");
        }

        if (thumbnailURLSplit != null && thumbnailURLSplit.length > 0) {
            ext = asset.thumbnailURL.split(".").pop();
        }
        var fileName = "TN_" + asset.daCode + "." + ext;
        var assetFolder = resource.assetDownloadFolder;
        var downloadedThumbnail = assetFolder + "/" + fileName;
        console.log('chekcing file exists');
            asset.downloadedThumbnail = downloadedThumbnail;
            var downloaderUtil = new Downloader();
            downloaderUtil.downloadFile(asset.thumbnailURL, assetFolder, fileName, {}, function (progressStatus) {
                if (isNaN(progressStatus.progress)) {
                    AssetDownloader.progressCallbackMethod(progressStatus);
                } else {
                    if (progressStatus.progress == 100) {
                        progressStatus.status = "THUMBNAIL_DOWNLOADED";
                        asset.downloaded = "Y";
                        AssetDownloader.makeAssetAsOffline(asset, function (returnedAsset) {
                            AssetDownloader.progressCallbackMethod({ progress: 100 });
                            success(returnedAsset);
                        }, failure);
                        // AssetDownloader.downloadAssetCategoryIcon(asset,
						// success, failure);
                    } else {
                        if (progressStatus.progress % 2 == 0) {
                            var progress = (50) + (progressStatus.progress / 2);
                            progressStatus.progress = progress;
                            AssetDownloader.progressCallbackMethod(progressStatus);
                        }
                    }
                }
            });
    },

    downloadAssetCategoryIcon: function (asset, success, failure) {
        var assetFolder = resource.assetCategoryFolder;
        var tag1 = asset.metaTag1;
        var category = null;
        if (tag1 != null) {
            tag1 = tag1.replace(/#/g, '');
            var catAndTag1 = tag1.split("~");
            category = catAndTag1[0];
        }
        var fileName = category + '.' + resource.download.categoryImageFormat;
        var downloadedThumbnail = assetFolder + "/" + fileName;
        fileUtil.checkIfFileExists(downloadedThumbnail, function (fileEntry) {
            AssetDownloader.makeAssetAsOffline(asset, function (data) {
                AssetDownloader.progressCallbackMethod({ progress: 100 });
                success(asset);
            }, failure);
        }, function (msg) {
            var downloaderUtil = new Downloader();
            var ext = resource.download.categoryImageFormat;
            var categoryUrl = assetCategoryService.getCategoryURL(asset);
            var categoryURLSplit = categoryUrl.split(".");
            if (categoryURLSplit != null) {
                ext = categoryURLSplit.pop();
            }
            var fileName = category + "." + ext;
            downloaderUtil.downloadFile(categoryUrl, assetFolder, fileName, {}, function (progressStatus) {
                if (progressStatus.progress == 100) {
                    AssetDownloader.progressCallbackMethod({ progress: 90 });
                    AssetDownloader.makeAssetAsOffline(asset, success, failure);
                }
            });
        });
    },

    makeAssetAsOffline: function (asset, success, failure) {
        if (asset.onlineURL.endsWith('.zip')) {
        	
        	var assetFolder = resource.assetDownloadFolder + '/' + asset.daCode;
            // start of unzip
            var zipUtil = new ZipUtil();
            zipUtil.extract(asset, function(zipFile) {
                zipUtil.copyEdetail(assetFolder, function(done) {
                    asset.documentType = "ZIP";
                    asset.downloadedFileName = zipFile;
                    asset.downloaded = 'Y';
                    digitalAssetLocalDAO.update(asset, function (data) {
                        AssetDownloader.progressCallbackMethod({ progress: 100 });
                        success(asset);
                    }, failure);
                });
            }, failure);
        } else {
            digitalAssetLocalDAO.update(asset, function (data) {
                AssetDownloader.progressCallbackMethod({ progress: 100 });
                success(asset);
            }, failure);
        }
    }
};

// Device utilities

var coreView = {
    geoPosition: {
        latitude: 0,
        longitude: 0
    },
    context: {},

    getAssetURL: function (asset, success, failure) {
        var assetURL = null;
        digitalAssetLocalDAO.get(asset.daCode, function (returnAsset) {
            if (returnAsset != null && asset.downloaded == 'Y') {
                fileUtil.getFileEntry(returnAsset.downloadedFileName, function (fileEntry) {
                    if (fileEntry != null) {
                        assetURL = fileEntry.nativeURL;
                        
                    }
                        if (assetURL == null) {
                            var user = eLearningAPP.currentUser;
                            if (coreNET.isConnected() && asset.documentType == 'VIDEO') {
                                digitalAssetLocalDAO.getAssetURL('1', user.companyCode, user.userCode, asset.onlineURL, coreNET.getNetworkType(), function (assetURL) {
                                     /*
										 * if(device.platform == 'Android'){
										 * assetURL='file:///sdcard/'+assetURL;
										 * }else{ assetURL=assetURL; }
										 */
                                    success(assetURL);
                                }, failure);
                            } else {
                                assetURL = asset.onlineURL;
                                success(assetURL);
                            }
                        } else {
                            success(assetURL);
                        }
                }, function (e) {
                    // alert(JSON.stringify(e));
                });

                 }else{
                     assetURL = asset.onlineURL;
                     success(assetURL);
                 
                 }
                                 
        });
    },

    getCategoryIconURL: function (category, success, failure) {
        var iconUrl = null;
        if (category != null) {
            var categoryIconUrl = resource.assetCategoryFolder + '/' + category + '.' + resource.download.categoryImageFormat;
            fileUtil.getFileEntry(categoryIconUrl, function (fileEntry) {
                if (fileEntry != null) {
                    iconUrl = fileEntry.fullPath;
                }
                success(iconUrl);
            }, failure);
        } else {
            success(null);
        }
    },

    getThumbnailURL: function (asset, onSuccess) {

        var thumbnailURL = null;
        try {
            if (coreNET.isConnected()) {
                thumbnailURL = asset.thumbnailURL;
                if (onSuccess) onSuccess(thumbnailURL);
            } else {
                digitalAssetLocalDAO.get(asset.daCode, function (returnAsset) {
                    if (returnAsset != null) {
                    // var fileEntry =
                    fileUtil.getFileEntry(returnAsset.downloadedThumbnail, function (fileEntry) {
                      if (fileEntry != null) {
                        thumbnailURL = fileEntry.fullPath;
                        if(onSuccess) onSuccess(thumbnailURL);
                      }else{
                          if (asset.documentType == 'VIDEO') {
                          thumbnailURL = "../images/EL/offlineThumnailVideo.png";
                          } else {
                          thumbnailURL = "../images/EL/offlineThumnail.png";
                          }
                          if(onSuccess) onSuccess(thumbnailURL);
                      }
                    });
                     }else{
                         if (asset.documentType == 'VIDEO') {
                         thumbnailURL = "../images/EL/offlineThumnailVideo.png";
                         } else {
                         thumbnailURL = "../images/EL/offlineThumnail.png";
                         }
                         if(onSuccess) onSuccess(thumbnailURL);
                     }
                }, function(e) {
                    if (asset.documentType == 'VIDEO') {
                    thumbnailURL = "../images/EL/offlineThumnailVideo.png";
                    } else {
                    thumbnailURL = "../images/EL/offlineThumnail.png";
                    }
                    if(onSuccess) onSuccess(thumbnailURL);
                });

            }
                /*
				 * if (thumbnailURL == null) { if (coreNET.isConnected()) {
				 * thumbnailURL = asset.thumbnailURL; } else { if
				 * (asset.documentType == 'VIDEO') { thumbnailURL =
				 * "../images/EL/offlineThumnailVideo.png"; } else {
				 * thumbnailURL = "../images/EL/offlineThumnail.png"; } } }
				 */
        } catch (exception) {
            thumbnailURL = asset.thumbnailURL;
            if(onSuccess) onSuccess(thumbnailURL);
            
        }

        

        
        // return thumbnailURL;
    },

    initializeGeoPosition: function () {
        // alert("geo");
        navigator.geolocation.getCurrentPosition(successFunction,
                                                 errorFunction);
        // , {
                    // enableHighAccuracy: true
                    // maximumAge: 30000,
                    // timeout: 5000
               // });
        function successFunction(position) {
            // alert(position.coords.latitude);
           coreView.geoPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            // onSuccess();
        }
        function errorFunction(position) {
            // alert("error");
            coreView.geoPosition = {
                latitude: 0,
                longitude: 0
            };
        }
    },

    getGeoPosition: function (afterGeoGot) {
        // alert("hai");
        // alert(coreView.geoPosition);
        afterGeoGot(coreView.geoPosition);
    },

    showLoading: function (message) {
        if (message == null && message == "undefined") {
            message = "Loading...";
        }
        $("#loading").remove();
        var div = $("#loading");
        if (div.length == 0) {
            div = $("<div id='loading' style='background-color:white;color:black;width:160px;text-align:center;z-index:9990;display:none;font-size: 35px;'>" + message + "</div>");
            $(document.body).append(div);
        }
        div.screenCenter();
        div.show();
    },

    hideLoading: function () {
        $("#loading").hide();
    }
};

jQuery.fn.screenCenter = function () {

    this.css("position", "absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
};

jQuery.fn.screenVirticalCenter = function () {

    this.css("position", "absolute");
    this.css("left", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) +
                                                $(window).scrollTop()) + "px");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerWidth()) / 2) +
                                                $(window).scrollLeft()) + "px");
    return this;
};

// coreView ends here core DAO starts here.

var coreDAO = {

    insert: function (entityClass, entity, success, failure) {
        var _this = this;
        this._initializeEntity(entityClass, true, function (response) {
            _this._insert(entityClass, entity, success, failure);
        }, failure);
    },

    _insert: function (entityClass, entity, success, failure) {
        if (entity instanceof Array) {
            this._insertMulti(entityClass, entity, success, failure);
        } else {
            this._insertSingle(entityClass, entity, success, failure);
        }
    },

    _insertSingle: function (entityClass, entity, success, failure) {
        var query = this._buildInsert(entityClass);
        var params = this._prepareInsertParams(entityClass, entity);
        this._execute(query, params, success, failure);
    },

    _insertMulti: function (entityClass, entites, success, failure) {
        var query = this._buildInsert(entityClass);
        var params = [];
        var _this = this;
        $.each(entites, function (index, entity) {
            params.push(_this._prepareInsertParams(entityClass, entity));
        });
        return this._executeMulti(query, params, success, failure);
    },

    _buildInsert: function (entityClass) {
        var columns = '';
        var paramPlaceHolders = '';
        var noOfColumns = entityClass.metadata.columns.length;
        for (var i = 0; i < noOfColumns; i++) {
            columns += entityClass.metadata.columns[i].columnName;
            paramPlaceHolders += '?';

            if (columns == null) {
                columns = '';
                paramPlaceHolders = '';
            } else {
                if (i != (noOfColumns - 1)) {
                    columns += ', ';
                    paramPlaceHolders += ', ';
                }

            }

        }

        var query = 'INSERT INTO ' + entityClass.metadata.tableName + ' ( ' + columns + ') VALUES (' + paramPlaceHolders + ');';
        return query;
    },

    _prepareInsertParams: function (entityClass, entity) {
        var params = [];
        var noOfColumns = entityClass.metadata.columns.length;
        for (var i = 0; i < noOfColumns; i++) {
            var currentName = entityClass.metadata.columns[i].name;
            value = entity[currentName];
            if (value == null) {
                value = '';
            }
            params.push(value);
        }

        return params;
    },

    update: function (entityClass, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._update(entityClass, entity, success, failure);
        }, failure);
        result;
    },

    excuteUpdate: function (query, success, failure) {
        this._execute(query, [], success, failure);
    },

    _update: function (entityClass, entity, success, failure) {

        var query = 'UPDATE ' + entityClass.metadata.tableName + ' SET ';
        var columns = null;
        var params = [];
        var noOfColumns = entityClass.metadata.columns.length;
        for (var i = 0; i < noOfColumns; i++) {
            if (entityClass.metadata.columns[i]['pk'] == null
                    || !entityClass.metadata.columns[i].pk) {
                var currentName = entityClass.metadata.columns[i].name;
                if (entity[currentName] != null) {
                    if (columns == null) {
                        columns = '';
                    } else {
                        columns += ', ';
                    }
                    columns += entityClass.metadata.columns[i].columnName
                            + ' = ?';
                    params.push(entity[currentName]);
                }
            }
        }
        query += columns;
        var whereClause = null;
        for (var i = 0; i < noOfColumns; i++) {
            if (entityClass.metadata.columns[i]['pk'] != null
                    && entityClass.metadata.columns[i].pk) {
                var currentName = entityClass.metadata.columns[i].name;
                if (entity[currentName] != null) {
                    if (whereClause == null) {
                        whereClause = ' WHERE ';
                    } else {
                        whereClause += ' AND ';
                    }
                    whereClause += entityClass.metadata.columns[i].columnName
                            + ' = ?';
                    params.push(entity[currentName]);
                }
            }
        }
        if (whereClause != null) {
            query += whereClause;
        }

        return this._execute(query, params, success, failure);
    },

    remove: function (entityClass, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._remove(entityClass, entity, success, failure);
        }, failure);
        return result;
    },

    _remove: function (entityClass, criteria, success, failure) {
        // DANGER: Passing NULL criteria or the Criteria with no element in it,
        // will remove all the records.
        // If need this has to be separated (remove and removeAll);
        var query = 'DELETE FROM ' + entityClass.metadata.tableName;
        var params = [];
        if (criteria != null) {
            var whereClause = null;
            var noOfColumns = entityClass.metadata.columns.length;

            for (var i = 0; i < noOfColumns; i++) {
                var currentName = entityClass.metadata.columns[i].name;
                if (criteria[currentName] != null) {
                    if (whereClause == null) {
                        whereClause = ' WHERE ';
                    } else {
                        whereClause += ' AND ';
                    }
                    whereClause += entityClass.metadata.columns[i].columnName
                            + ' = ?';
                    params.push(criteria[currentName]);
                }
            }
            if (whereClause != null) {
                query += whereClause;
            }
        }
        return this._execute(query, params, success, failure);
    },

    executeQuery: function (query, rowMapperCallback, success, failure) {
        this._initialize();
        var params = [];
        var result = [];
        this._execute(query, params, function (response) {
            if (response != null && response.result != null
                    && response.result.rows != null) {

                for (var j = 0; j < response.result.rows.length; j++) {

                    var row = response.result.rows.item(j);
                    var record = rowMapperCallback(row);
                    result.push(record);
                }
            }
            if (typeof success == 'function') {
                success(result);
            }
        }, failure);

        return result;
    },

    getEquals: function (entityClass, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._getEquals(entityClass, entity, success, failure);
        }, failure);
        return result;
    },

    _getEquals: function (entityClass, criteria, success, failure) {
        var query = 'SELECT ';
        var columns = null;
        var params = [];
        var noOfColumns = entityClass.metadata.columns.length;
        for (var i = 0; i < noOfColumns; i++) {
            var currentColumnName = entityClass.metadata.columns[i].columnName;
            if (columns == null) {
                columns = '';
            } else {
                columns += ', ';
            }
            columns += currentColumnName;
        }
        query += columns;
        query += ' FROM ' + entityClass.metadata.tableName + ' ';
        if (criteria != null) {
            var whereClause = null;
            for (var i = 0; i < noOfColumns; i++) {
                var currentName = entityClass.metadata.columns[i].name;
                if (criteria[currentName] != null) {
                    if (whereClause == null) {
                        whereClause = ' WHERE ';
                    } else {
                        whereClause += ' AND ';
                    }
                    whereClause += entityClass.metadata.columns[i].columnName
                            + ' = ?';
                    params.push(criteria[currentName]);
                }
            }
            if (whereClause != null) {
                query += whereClause;
            }
        }
        var result = [];
        var _this = this;
        this._execute(query, params, function (response) {
            result = _this._prepareResponse(entityClass, response);
            if (typeof success == 'function') {
                success(result);
            }
        }, failure);


        return result;
    },

    _prepareResponse: function (entityClass, response) {
        var result = [];
        var noOfColumns = entityClass.metadata.columns.length;
        if (response != null && response.result != null
                && response.result.rows != null) {

            for (var j = 0; j < response.result.rows.length; j++) {
                var record = {};
                var row = response.result.rows.item(j);
                for (var i = 0; i < noOfColumns; i++) {
                    if (row[entityClass.metadata.columns[i].columnName] != null) {
                        if (entityClass.metadata.columns[i].isDate == true) {
                            if (row[entityClass.metadata.columns[i].columnName] != "") {
                                record[entityClass.metadata.columns[i].name] = new Date(
                                        row[entityClass.metadata.columns[i].columnName]);
                            }
                        } else {
                            record[entityClass.metadata.columns[i].name] = row[entityClass.metadata.columns[i].columnName];
                        }
                    }
                }
                result.push(record);
            }
        }

        return result;
    },

    getNotEquals: function (entityClass, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._getNotEquals(entityClass, entity, success, failure);
        }, failure);
        return result;
    },

    _getNotEquals: function (entityClass, criteria, success, failure) {
        var query = 'SELECT ';
        var columns = null;
        var params = [];
        var noOfColumns = entityClass.metadata.columns.length;
        for (var i = 0; i < noOfColumns; i++) {
            var currentColumnName = entityClass.metadata.columns[i].columnName;
            if (columns == null) {
                columns = '';
            } else {
                columns += ', ';
            }
            columns += currentColumnName;
        }
        query += columns;
        query += ' FROM ' + entityClass.metadata.tableName + ' ';
        if (criteria != null) {
            var whereClause = null;
            for (var i = 0; i < noOfColumns; i++) {
                var currentName = entityClass.metadata.columns[i].name;
                if (criteria[currentName] != null) {
                    if (whereClause == null) {
                        whereClause = ' WHERE ';
                    } else {
                        whereClause += ' AND ';
                    }
                    whereClause += entityClass.metadata.columns[i].columnName
                            + ' != ?';
                    params.push(criteria[currentName]);
                }
            }
            if (whereClause != null) {
                query += whereClause;
            }
        }

        var result = [];
        var _this = this;
        this._execute(query, params, function (response) {
            result = _this._prepareResponse(entityClass, response);
            if (typeof success == 'function') {
                success(result);
            }
        }, failure);


        return result;
    },

    removeNotEquals: function (entityClass, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._removeNotEquals(entityClass, entity, success, failure);
        }, failure);
        return result;
    },

    _removeNotEquals: function (entityClass, criteria, success, failure) {
        // DANGER: Passing NULL criteria or the Criteria with no element in it,
        // will remove all the records.
        // If need this has to be separated (remove and removeAll);
        this._initializeEntity(entityClass, true);
        var query = 'DELETE FROM ' + entityClass.metadata.tableName;
        var params = [];
        if (criteria != null) {
            var whereClause = null;
            var noOfColumns = entityClass.metadata.columns.length;

            for (var i = 0; i < noOfColumns; i++) {
                var currentName = entityClass.metadata.columns[i].name;
                if (criteria[currentName] != null) {
                    if (whereClause == null) {
                        whereClause = ' WHERE ';
                    } else {
                        whereClause += ' AND ';
                    }
                    whereClause += entityClass.metadata.columns[i].columnName
                            + ' != ?';
                    params.push(criteria[currentName]);
                }
            }
            if (whereClause != null) {
                query += whereClause;
            }
        }
        return this._execute(query, params, success, failure);
    },

    getLike: function (entityClass, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._getLike(entityClass, entity, success, failure);
        }, failure);
        return result;
    },

    _getLike: function (entityClass, criteria, success, failure) {
        var query = 'SELECT ';
        var columns = null;
        var params = [];
        var noOfColumns = entityClass.metadata.columns.length;
        for (var i = 0; i < noOfColumns; i++) {
            var currentColumnName = entityClass.metadata.columns[i].columnName;
            if (columns == null) {
                columns = '';
            } else {
                columns += ', ';
            }
            columns += currentColumnName;
        }
        query += columns;
        query += ' FROM ' + entityClass.metadata.tableName + ' ';
        if (criteria != null) {
            var whereClause = null;
            for (var i = 0; i < noOfColumns; i++) {
                var currentName = entityClass.metadata.columns[i].name;
                if (criteria[currentName] != null) {
                    if (whereClause == null) {
                        whereClause = ' WHERE ';
                    } else {
                        whereClause += ' AND ';
                    }
                    whereClause += entityClass.metadata.columns[i].columnName
                            + ' LIKE ? ';
                    params.push('%' + criteria[currentName] + '%');
                }
            }
            if (whereClause != null) {
                query += whereClause;
            }
        }

        var result = [];
        var _this = this;
        this._execute(query, params, function (response) {
            result = _this._prepareResponse(entityClass, response);
            if (typeof success == 'function') {
                success(result);
            }
        }, failure);

        return result;
    },
    _connection: null,

    _initialize: function () {
        if (this._connection == null) {
            this._connection = window.openDatabase("ELEARNING_DB", "1.0",
                    "iLearing Database", 200000);
        }
    },

    _execute: function (query, params, success, failure) {
        var response = {
            statusCode: 0,
            result: null,
            error: null
        };


        this._connection.transaction(function (tx) {
            tx.executeSql(query, params, function (tx, queryResult) {
                response.statusCode = 0;
                response.result = queryResult;
                if (typeof success == 'function') {
                    success(response);
                }
            }, function (error) {
                response.statusCode = -1;
                response.error = error;
                if (typeof failure == 'function') {
                    failure(response);
                }
            });
        }, function (error) {
            response.statusCode = -1;
            response.error = error;
            if (typeof failure == 'function') {
                failure(response);
            }
        });
        return response;

    },

    _executeMulti: function (query, params, success, failure) {
        var response = {
            statusCode: 0,
            result: null,
            error: null
        };

        this._connection.transaction(function (tx) {
            var responses = [];
            $.each(params, function (index, param) {
                response = {
                    statusCode: 0,
                    result: null,
                    error: null
                };
                tx.executeSql(query, param, function (tx, queryResult) {
                    response.statusCode = 0;
                    response.result = queryResult;
                    responses.push(response);
                }, function (error) {
                    response.statusCode = -1;
                    response.error = error;
                    responses.push(response);
                });
            });
            if (typeof success == 'function') {
                success(responses);
            }
        }, function (error) {
            response.statusCode = -1;
            response.error = error;
            if (typeof failure == 'function') {
                failure(response);
            }
        });
        return response;

    },

    executeCustomQuery: function (entityClass, query, entity, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            _this._executeCustomQuery(entityClass, query, entity, success, failure);
        }, failure);
        return result;
    },

    _executeCustomQuery: function (entityClass, query, params, success, failure) {
        if (params == null) {
            params = [];
        }
        var result = [];
        var _this = this;

        this._execute(query, params, function (response) {
            result = _this._prepareResponse(entityClass, response);
            if (typeof success == 'function') {
                success(result);
            }
        }, failure);
        return result;
    },

    _initializeEntity: function (entityClass, createTableRequired, success, failure) {
        this._initialize();
        if (createTableRequired == null) {
            createTableRequired = false;
        }
        if (createTableRequired == true) {
            var query = 'CREATE TABLE IF NOT EXISTS '
                + entityClass.metadata.tableName + ' ( ';
            var uniqueKeys = null;

            var noOfColumns = entityClass.metadata.columns.length;
            for (var i = 0; i < noOfColumns; i++) {
                if (i != 0) {
                    query += ", ";
                }
                query += entityClass.metadata.columns[i].columnName;
                if (entityClass.metadata.columns[i]['pk'] != null) {
                    if (entityClass.metadata.columns[i].pk) {
                        if (uniqueKeys == null) {
                            uniqueKeys = entityClass.metadata.columns[i].columnName;
                        } else {
                            uniqueKeys += ("," + entityClass.metadata.columns[i].columnName);
                        }
                    }
                }
            }

            if (uniqueKeys != null) {
                query += ", CONSTRAINT " + entityClass.metadata.tableName
                        + "_pk UNIQUE (" + uniqueKeys + ")";
            }

            query += ")";
            this._execute(query, [], success, failure);
        }

    },

    getBetween: function (entityClass, criteria, success, failure) {
        var _this = this;
        var result = [];
        this._initializeEntity(entityClass, true, function (response) {
            result = _this._getBetween(entityClass, criteria, success, failure);
        }, failure);
        return result;
    },

    _getBetween: function (entityClass, criteria, success, failure) {
        this._initializeEntity(entityClass, true);
        var query = 'SELECT ';
        var columns = null;
        var params = [];
        var noOfColumns = entityClass.metadata.columns.length;
        var dbColumnName = null;
        for (var i = 0; i < noOfColumns; i++) {
            var currentColumnName = entityClass.metadata.columns[i].columnName;
            if (columns == null) {
                columns = '';
            } else {
                columns += ', ';
            }
            columns += currentColumnName;
            if (criteria.columnName == entityClass.metadata.columns[i].name) {
                dbColumnName = currentColumnName;
            }
        }
        query += columns;
        query += ' FROM ' + entityClass.metadata.tableName + ' ';
        var whereClause = ' WHERE ' + dbColumnName + " BETWEEN ? AND ? ";

        params.push(criteria.start);
        params.push(criteria.end);

        if (whereClause != null) {
            query += whereClause;
        }

        var result = [];
        var _this = this;
        this._execute(query, params, function (response) {
            result = _this._prepareResponse(entityClass, response);
            if (typeof success == 'function') {
                success(result);
            }
        }, failure);

        return result;
    },

    updateTable: function (entityClass, success, failure) {
        var _this = coreDAO;
        _this._initialize();
        this._initializeEntity(entityClass, true);
        var columns = entityClass.metadata.columns;
        var tableName = entityClass.metadata.tableName;
        var colLength = 0;
        if (columns != null) {
            colLength = columns.length - 1;
        }

        $.each(columns, function (index, column) {
            var colName = column.columnName;
            console.log("Table: " + tableName + "  Column: " + colName);
            _this._connection.transaction(function (tx) {
                tx.executeSql("select " + colName + " from " + tableName + " LIMIT 1", [], querySuccess, queryFail);
            }, function errorFunction(err) {
                console.log("Transaction failure => errorcb-->error msg " + err.error + " error code " + err.code);
            }, function successFunction() {
                console.log("success!");
            });

            function querySuccess(tx, results) {
                console.log("querySuccess!");
                // console.log(JSON.stringify(results.rows));
            }
            function queryFail(err) {
                console.log("Query Failure => errorcb-->error msg " + err.error + " error code " + err.code);
                // IF queryFail reached column not found so again use
				// executeSql() function for add new column
                addColumn();
            }
            function addColumn() {
                var query = "ALTER TABLE " + tableName + " ADD COLUMN " + colName;
                console.log('in alter table....' + query);
                _this._execute(query, []);
            }

            console.log(' column index' + index + 'total colLength' + colLength);
            if (colLength == index) {
                success();
            }
        });
    }
};

// coreDAO ends here and CoreNet starts Here

var coreNET = {
    /*
	 * Connection.UNKNOWN Connection.ETHERNET Connection.WIFI Connection.CELL_2G
	 * Connection.CELL_3G Connection.CELL_4G Connection.NONE
	 */
    isConnected: function () {
        try {
            var connectionType = navigator.network.connection.type;
            if (connectionType == Connection.NONE || connectionType == Connection.UNKNOWN) {
                return false;
            } else {
                return true;
            }
        } catch (ex) {
            return true;
        }

    },

    getNetworkType: function () {
        return navigator.network.connection.type.toUpperCase();
    }
};

// coreNet ends and utils starts here

var fileUtil = {
    fileObject: null,
    deleteDirectory: function (directoryName, success, failure) {
        // var directoryEntry =
        fileUtil.getDirectoryEntry(directoryName, function (directoryEntry) {
            if (directoryEntry != null) {
                directoryEntry.removeRecursively(successCallback, errorCallback);
                function successCallback() {
                    success(true);
                }
                function errorCallback(FileError) {
                    failure(true);
                }
            } else {
                // alert("directory not found");
                failure(true);
            }
        }, function () { failure(true); });
        

    },

    getDirectoryEntry: function (directoryName, success, failure) {
        var dirEntry = null;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
        function gotFS(fileSystem) {
            fileSystem.root.getDirectory(directoryName, { create: false, exclusive: false }, onGetDirectorySuccess, function () { });
        }
        function onGetDirectorySuccess(dir) {
            if (dir.isDirectory) {
                dirEntry = dir;
                success(dirEntry);
            }
        }

        function fail() {
        }
    },
    getFileSize: function (fileName, success, failure) {
        this.getFileEntry(fileName, function (fileEntry) {
            this.getFileFromFileEntry(fileEntry, function (file) {
                if (file != null) {
                    var size = 0;
                    size = (file.size / 1024);
                    size = size / 1024;
                    success(size.toFixed(2));
                } else {
                    success(0);
                }
            }, failure);
        }, failure);
    },

    deleteFile: function (fileName, success, failure) {
        console.log('file name to be deleted ' + fileName);
        // var fileEntry =
        fileUtil.getFileEntry(fileName, function (fileEntry) {
            if (fileEntry != null) {
                console.log('got file entry' + fileEntry.fullPath);
                fileEntry.remove(function () {
                    success(true);
                }, function () {
                    failure();
                });
            } else {
                console.log('no file entry found');
                success(false);
            }
        }, null);
    },
    checkIfFileExists: function (path, success, fail) {
        /*
		 * if ((typeof path == 'undefined')) { path = ''; } var fileExists =
		 * false; window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		 * function (fileSystem) { alert('filesystem' + fileSystem);
		 * fileSystem.root.getFile(path, { create: false }, function (fileEntry) {
		 * alert('fent' + fileEntry); if (fileEntry != null) { //fileExists =
		 * true; success(fileEntry); } else fail('File doesnot exists'); },
		 * function (fileEntry) { alert('f pers'); fail('File doesnot exists');
		 * }); }, function (fileEntry) { alert('e pers'); fail('File doesnot
		 * exists'); });
		 */
        if(path != undefined) {
        	/*
			 * console.log('path no def ' + path); console.log(window);
			 * console.log(window.requestFileSystem);
			 * console.log(LocalFileSystem.PERSISTENT);
			 * window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function
			 * (fileSystem) { console.log('file system root check');
			 * fileSystem.root.getFile(path, { create: false }, function
			 * (fileEntry) { if (fileEntry != null) { //fileExists = true;
			 * success(fileEntry); } else fail('File doesnot exists'); },
			 * function (fileEntry) { fail('File doesnot exists'); }); },
			 * function (fileEntry) { console.log('no file system present');
			 * fail('File doesnot exists'); });
			 */
        	function win(result) {
        		success(result);
        	}
        	function failure(result) {
        		fail('File doesnot exists');
        	}
        	cordova.exec(win, failure, "Downloader", "checkFileExists", [path]);
        } else {
        	fail('Undefined');
        }
    },


    getFileEntry: function (filePath, success, failure) {
        var fileEntryForUse = null;
        function getFilePath() {
            // "dam/"+fileName;
            return filePath;
        }

        function fail(e) {
            // alert('getting fileEntry failed');
            failure(e);
        }


        function gotFileEntry(fileEntry) {
            fileEntryForUse = fileEntry;
            success(fileEntryForUse);
        }

        function gotFS(fileSystem) {
            var filePath = getFilePath();
            fileSystem.root.getFile(filePath, { create: false }, gotFileEntry, fail);
        }

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    },

    getFileFromFileEntry: function (fileEntry, success, failure) {
        var fileTobeReturn = null;
        if (fileEntry != null) {
            fileEntry.file(gotFile, fail);
        }

        function gotFile(file) {
            fileTobeReturn = file;
            success(fileTobeReturn);
        }
        function fail(e) {
            failure(e);
        }
    }

};

var UUIDUtil = {
    s4: function () {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    },

    getUID: function () {
        var _i = UUIDUtil;
        return _i.s4() + _i.s4() + '-' + _i.s4() + '-' + _i.s4() + '-' + _i.s4() + '-' + _i.s4() + _i.s4() + _i.s4();
    }
};

eLearningAPP.formatDataForSync = function (data, columns) {
    var params = {};
    params.correlationId = resource.correlationId;
    params.companyCode = eLearningAPP.currentUser.companyCode;
    params.userCode = eLearningAPP.currentUser.userCode;
    params.appPlatForm = resource.ssoDetail.appPlatForm;
    params.appSuiteId = resource.ssoDetail.appSuiteId;
    params.appId = resource.ssoDetail.appId;
    var configSettings = configurationRemoteDAO.syncGet(params);
    var formatedData = "";
    var dateFormat = "yyyy-mm-dd HH:MM";
    if (configSettings != null && configSettings.Action == "DATE_SETTINGS" && configSettings.Intent != null) {
        dateFormat = configSettings.Intent;
    }
    var dataArray = null;
    if (data instanceof Array) {
        dataArray = data;
    } else {
        dataArray = [];
        dataArray.push(data);
    }
    for (var index = 0; index < dataArray.length; index++) {
        var element = dataArray[index];
        if (index > 0) {
            formatedData += "#"; // row delimiter
        }
        for (var jndex = 0; jndex < columns.length; jndex++) {
            var name = columns[jndex].name;

            if (jndex > 0) {
                formatedData += "^"; // column delimiter
            }
            var value = element[name];
            if (value == null) {
                value = "";
            }
            if (value instanceof Date) {
                value = value.format(dateFormat);
            }
            formatedData += value;
        }
    }

    return formatedData;

};

if (platform === resource.appAndroidPlatform) {
    function Downloader() { };
    Downloader.prototype.downloadFile = function(downloadURL, directoryName, fileName, params, progressCallBack) {
        if (params == null) {
            params = {};
        }
        params.dirName = directoryName;
        params.fileName = fileName;

        var win = function (progressStatus) {
        	console.log(JSON.stringify(progressStatus));
        	var perc = progressStatus.progress;
            progressStatus.status = 1;
            progressStatus.dirName = directoryName;
            progressStatus.fileName = fileName;
            progressStatus.progress = perc;
            if (progressCallBack != null) progressCallBack(progressStatus);
        };

        var fail = function (progressFailed) {

            if (progressCallBack != null) {
                progressFailed.status = -1;
                progressFailed.progress = 0;
                progressCallBack(progressFailed);
            }
        };

        var fileTransfer = new FileTransfer(); 
        var uri = encodeURI(downloadURL); //alert(FileTransfer);
        fileTransfer.download(uri, cordova.file.externalRootDirectory +
        		directoryName + '/' + fileName, win, fail, false, params);
        fileTransfer.onprogress = function (progressStatus) { 
        	if (progressStatus.lengthComputable) {
        		var perc = Math.floor(progressStatus.loaded / progressStatus.total * 100);
        		progressStatus.status = 1; progressStatus.dirName = directoryName;
        		progressStatus.fileName = fileName; 
        		progressStatus.progress = perc;
        		progressCallBack(progressStatus);
        	}
        };
        //cordova.exec(win, fail, "Downloader", "downloadFile", [downloadURL, params]);
    };
} else if (platform === resource.appIOSPlatform) {
    function Downloader() { };

    Downloader.prototype.downloadFile = function (downloadURL, directoryName, fileName, params, progressCallBack) {
        // alert(downloadURL);
        if (params == null) {
            params = {};
        }
        params.dirName = directoryName;
        params.fileName = fileName;

        var win = function (progressStatus) {
            if (progressCallBack != null) {
                progressCallBack(progressStatus);
            }
        };

        var fail = function (progressFailed) {
            if (progressCallBack != null) {
                progressFailed.status = -1;
                progressFailed.progress = 0;
                progressCallBack(progressFailed);
            }
        };
        var fileTransfer = new FileTransfer();
        var uri = encodeURI(downloadURL);
        
        // return false;
        fileTransfer.download(uri, 'cdvfile://localhost/persistent/' + directoryName + '/' + fileName, win, fail, false, params);
        fileTransfer.onprogress = function (progressStatus) {
            if (progressCallBack != null) {
                // alert(progressStatus.lengthComputable);
                if (progressStatus.lengthComputable) {
                    var perc = Math.floor(progressStatus.loaded / progressStatus.total * 100);
                    progressStatus.status = 1;
                    progressStatus.dirName = directoryName;
                    progressStatus.fileName = fileName;
                    progressStatus.progress = perc;
                    console.log(progressStatus.progress);
                    progressCallBack(progressStatus);
                }
            }
        }
        // PhoneGap.exec(win, fail, "Downloader", "downloadFile", [downloadURL,
		// params]);
    };
}


function FileOpener() {
};

FileOpener.prototype.open = function (url) {
    cordova.exec(null, null, "FileOpener", "openFile", [url]);
};
var deviceInfo = {

    getDeviceId: function () {
        return device.uuid;
    }
};


if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.fileOpener) {
    window.plugins.fileOpener = new FileOpener();
}

if (window['cordova'] != 'undefined' && window['cordova'] != null) {
    // Native Player
    cordova.define("cordova/plugin/videoplayer", function (require, exports, module) {
        var exec = require("cordova/exec");
        var VideoPlayer = function () { };

        VideoPlayer.prototype.play = function (url) {
            exec(null, null, "VideoPlayer", "playVideo", url);
        };

        var videoPlayer = new VideoPlayer();
        module.exports = videoPlayer;
    });

    if (!window.plugins) {
        window.plugins = {};
    }
    if (!window.plugins.videoPlayer) {
        window.plugins.videoPlayer = cordova.require("cordova/plugin/videoplayer");
    }
}

/* Start - Plugin added by Vinoth Kannah MP */
var zip = {
    unzip: function (fileName, outputDirectory, thumbnail, callback, progressCallback) {
        var win = function (result) {
            if (result && typeof result.loaded != "undefined") {
                if (progressCallback) {
                    return progressCallback(newProgressEvent(result));
                }
            } else if (callback) {
                callback(result, thumbnail);
            }
        };
        var fail = function (result) {
            if (callback) {
                callback(-1);
            }
        };
        PhoneGap.exec(win, fail, 'Zip', 'unzip', [fileName, outputDirectory]);
    }
}; 
/* End - Plugin added by Vinoth Kannah MP */

/**
 * Task framework
 */
function CoreTask(options) {
    this.settings = $.extend({
        task: function (context, data, success, failure) {
            success();
        },
        context: {},
        data: {},
        success: function () { },
        failure: function () { },
        title: options != null && options.task != null ? options.task.name : "Untitled",
        waitPeriod: 100
    }, options);

    this.id = UUIDUtil.getUID();
    this.title = this.settings.title;
    this.context = this.settings.context;
    this.data = this.settings.data;
    this.success = this.settings.success;
    this.failure = this.settings.failure;

    this.task = this.settings.task;
    this.waitPeriod = this.settings.waitPeriod;

};

CoreTask.prototype.execute = function (_this) {
    if (_this == null) {
        _this = this;
    }
    setTimeout(function () {
        _this.executeTask(_this);
    }, _this.waitPeriod);
};

CoreTask.prototype.executeTask = function (_this) {
    this.task(_this.context, _this.data, _this.success, _this.failure);
};


function BulkTask(options) {
    CoreTask.call(this, options);
    this.tasks = [];
    this.spinner = options.spinner;
};

BulkTask.prototype = new CoreTask();

BulkTask.prototype.constructor = CoreTask;

BulkTask.prototype.addTask = function (task) {
    this.tasks.push(task);
};

BulkTask.prototype.executeTask = function (_this) {
    if (_this == null) {
        _this = this;
    }
    if (_this.tasks.length > 0) {
        var lastIndex = this.tasks.length - 1;
        // alert("lastIndex"+lastIndex.length);
        $.each(_this.tasks, function (index, task) {
            task.context = _this.context;
            if (index == lastIndex) {
                task.success = function (data) {
                    _this.hideLoading();
                    _this.success(data);
                };
                task.failure = task.failure = function (data) {
                    _this.hideLoading();
                    _this.failure(data);
                };
            } else {
                task.success = function (data) {
                    _this.tasks[index + 1].data = data;
                    _this.tasks[index + 1].execute(_this.tasks[index + 1]);
                };
                task.failure = function (data) {
                    _this.hideLoading();
                    _this.failure(data);
                };
            }
        });
        _this.tasks[0].data = _this.data;
        if (_this.spinner != false) {
            _this.showLoading();
        }
        _this.tasks[0].execute(_this.tasks[0]);
    }
};

BulkTask.prototype.showLoading = function () {

    var loader = $('#BulkTaskLoader');
    if (loader.length == 0) {
        loader = $('<div id="BulkTaskLoader" class="loader" ><img src="../images/EL/loader.gif" /></div>');
        $('body').append(loader);
    }
    loader.screenCenter();
    loader.show();

};

BulkTask.prototype.hideLoading = function () {
    var loader = $('#BulkTaskLoader');
    loader.hide();
};

function PairTask(options) {
    CoreTask.call(this, options);
    this.settings = $.extend({
        firstTask: new CoreTask({}, {}, function () { }, function () { }),
        secondTask: new CoreTask({}, {}, function () { }, function () { }),
        waitPeriod: 100
    }, options);

    this.firstTask = this.settings.firstTask;
    this.secondTask = this.settings.secondTask;

};

PairTask.prototype = new CoreTask();

PairTask.prototype.constructor = CoreTask;

PairTask.prototype.executeTask = function (_this) {
    if (_this == null) {
        _this = this;
    }
    _this.firstTask.context = _this.context;
    _this.firstTask.data = _this.data;
    _this.firstTask.success = function (data) {
        _this.secondTask.data = data;
        _this.secondTask.execute(_this.secondTask);
    };
    _this.firstTask.failure = _this.failure;

    _this.secondTask.context = _this.context;
    _this.secondTask.data = _this.data;
    _this.secondTask.success = _this.success;
    _this.secondTask.failure = _this.failure;

    _this.firstTask.execute(_this.loadTask);
};

function TaskUtil(taskSpecifications) {
    this.taskSpecifications = taskSpecifications;
};

TaskUtil.prototype.execute = function (context, data, success, failure) {
    if (success == null) {
        success = function (data) { };
    }

    if (failure == null) {
        failure = function (data) { };
    }
    if (this.taskSpecifications != null) {
        var bulkTask = this._buildTasks(this.taskSpecifications, context, data, success, failure);
        bulkTask.execute();
    }
};

TaskUtil.prototype._buildTasks = function (taskSpecifications, context, data, success, failure) {
    var bulkTask = new BulkTask({
        data: data,
        context: context,
        success: success,
        failure: failure,
        spinner: data.spinner
    });
    var _this = this;
    $.each(taskSpecifications, function (index, taskSpecification) {
        var task = null;
        if (taskSpecification instanceof Array) {
            task = _this._buildTasks(taskSpecification, context, data, success, failure);
        } else if (taskSpecification.firstTask != null) {
            task = new PairTask({
                firstTask: new CoreTask({ task: taskSpecification.firstTask, title: taskSpecification.title }),
                secondTask: new CoreTask({ task: taskSpecification.secondTask, title: taskSpecification.title }),
                title: taskSpecification.title
            });

        } else {
            task = new CoreTask({ task: taskSpecification.task, title: taskSpecification.title });
        }
        bulkTask.addTask(task);
    });
    return bulkTask;
};

var CoreSOAP = {
	server :"http://"+SERVERNAME+"/",
	
    errorHandler: null,
    invoke: function (daoClass, operation, params, returnType) {
        var _this = CoreSOAP;
        if (returnType == null || returnType == 'undefined') {
            returnType = 'json';
        }
        var bhRequest = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://tempuri.org/\" xmlns:ns2=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\"> " +
        "<s:Body>" +
        "<ns1:" + operation + ">";
        var paramString = "";
        params.appId = 3;
        params.appSuiteId = 1;

        params.appPlatForm = "web";
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                if (params[key] instanceof Array) {
                    paramString += ("<ns1:" + key + ">");
                    var arrayValues = params[key];
                    for (var index = 0; index < arrayValues.length; index++) {
                        paramString += ("<ns2:string>" + $('<div/>').text(arrayValues[index]).html() + "</ns2:string>");
                    }
                    paramString += ("</ns1:" + key + ">");
                } else {
                    paramString += ("<ns1:" + key + ">" + $('<div/>').text(params[key]).html() + "</ns1:" + key + ">");
                }
            }
        }

        bhRequest += paramString;
        bhRequest += "</ns1:" + operation + ">" +
        "</s:Body>" +
    "</s:Envelope>";

        var result = null;
        var server = CoreSOAP.server;
        if (daoClass.metadata.server != null) {
            server = daoClass.metadata.server;
        }
        var url = server + daoClass.metadata.service + ".svc";
        var soapAction = "http://tempuri.org/I" + daoClass.metadata.service + "/" + operation;
        var responseTag = operation + "Response";
        var resultTag = operation + "Result";
        console.log(JSON.stringify(bhRequest));
        console.log(url);
        CoreSOAP.isError = false;
        $.ajax({
            type: "POST",
            url: url,
            data: bhRequest,
            timeout: 30000,
            contentType: "text/xml",
            async: false,
            cache: false,
            dataType: "xml",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("SOAPAction", soapAction);
            },
            success: function (data) {
                $(data).find(responseTag).each(function () {
                    if (returnType == 'json') {
                        var value = $(this).find(resultTag).text();
                        if (value == null || value == '') {
                            result = null;
                        } else {
                            result = JSON.parse(value);
                        }
                    } else if (returnType == 'text') {
                        result = $(this).find(resultTag).text();
                    } else {
                        result = $(this).find(resultTag);
                    }
                });
                CoreSOAP.outputMsg = null;
                $(data).find("outputMsg").each(function () {
                    CoreSOAP.outputMsg = $(this).text();
                });
                console.log('result : ' + JSON.stringify(result));
            },
            error: function (xhr, status, error) {
                var arguments = {
                    url: url,
                    data: bhRequest,
                    status: status,
                    xhr: xhr,
                    error: error
                };
                console.log(JSON.stringify(arguments));
                CoreSOAP.isError = true;

                if (_this.errorHandler != null) {
                    _this.errorHandler(arguments);
                }
            }
        });
        console.log(JSON.stringify(result));
        return result;
    },
    
    invokeAsync: function (daoClass, operation, params, returnType, success, failure) {
        // alert('invokeasync');
        var _this = CoreSOAP;
        if (returnType == null || returnType == 'undefined') {
            returnType = 'json';
        }
        var bhRequest = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://tempuri.org/\" xmlns:ns2=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\"> " +
        "<s:Body>" +
        "<ns1:" + operation + ">";
        var paramString = "";
        params.appId = 3;
        params.appSuiteId = 1;

        params.appPlatForm = "web";
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                if (params[key] instanceof Array) {
                    paramString += ("<ns1:" + key + ">");
                    var arrayValues = params[key];
                    for (var index = 0; index < arrayValues.length; index++) {
                        paramString += ("<ns2:string>" + $('<div/>').text(arrayValues[index]).html() + "</ns2:string>");
                    }
                    paramString += ("</ns1:" + key + ">");
                } else {
                    paramString += ("<ns1:" + key + ">" + $('<div/>').text(params[key]).html() + "</ns1:" + key + ">");
                }
            }
        }

        bhRequest += paramString;
        bhRequest += "</ns1:" + operation + ">" +
        "</s:Body>" +
    "</s:Envelope>";

        var result = null;
        var server = CoreSOAP.server;
        if (daoClass.metadata.server != null) {
            server = daoClass.metadata.server;
        }
        var url = server + daoClass.metadata.service + ".svc";
        var soapAction = "http://tempuri.org/I" + daoClass.metadata.service + "/" + operation;
        var responseTag = operation + "Response";
        var resultTag = operation + "Result";
        console.log(JSON.stringify(bhRequest));
        console.log(url);
        CoreSOAP.isError = false;
        $.ajax({
            type: "POST",
            url: url,
            data: bhRequest,
            timeout: 30000,
            contentType: "text/xml",
            async: true,
            cache: false,
            dataType: "xml",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("SOAPAction", soapAction);
            },
            success: function (data) {
                $(data).find(responseTag).each(function () {
                    if (returnType == 'json') {
                        var value = $(this).find(resultTag).text();
                        if (value == null || value == '') {
                            result = null;
                        } else {
                            result = JSON.parse(value);
                        }
                    } else if (returnType == 'text') {
                        result = $(this).find(resultTag).text();
                    } else {
                        result = $(this).find(resultTag);
                    }
                });
                CoreSOAP.outputMsg = null;
                $(data).find("outputMsg").each(function () {
                    CoreSOAP.outputMsg = $(this).text();
                });
               if(success) success(result);
            },
            error: function (xhr, status, error) {
                var arguments = {
                    url: url,
                    data: bhRequest,
                    status: status,
                    xhr: xhr,
                    error: error
                };
                CoreSOAP.isError = true;

                if (_this.errorHandler != null) {
                    _this.errorHandler(arguments);
                }
               if(failure) failure(error);
            }
        });
    },

    invokeGet: function (daoClass, operation, params, returnType, rootElement) {
        if (returnType == null || returnType == 'undefined') {
            returnType = 'json';
        }
        var result = this.invoke(daoClass, operation, params, returnType);

        if (returnType == 'json') {
            if (result != null && result != '') {
                if (result.hasOwnProperty("Tables")) {
                    var table = this._getFirstElement(result.Tables);
                    if (table.hasOwnProperty("Rows")) {
                        return this.unmarshallJSON(daoClass, table.Rows);
                    }
                } else {
                    if (result.length > 0) {
                        return this.unmarshallJSON(daoClass, result);
                    } else {
                        result = [];
                    }
                }
            } else {
                result = [];
            }
        } else if (returnType == 'xml') {
            return this.unmarshallXML(daoClass, result, rootElement);
        }
        return result;
    },

    _getFirstElement: function (array) {
        if (array instanceof Array) {
            if (array.length > 0) {
                return array[0];
            } else {
                return null;
            }
        } else {
            return array;
        }
    },

    unmarshallXML: function (daoClass, result, rootElement) {
        var marshlledRecords = [];
        if (rootElement != null && result != null && result != "") {
            result.find(rootElement).each(function () {
                var unmashalledRecord = $(this);
                var marshallRecord = {};
                var noOfColumns = daoClass.metadata.properties.length;
                var value = null;
                for (var i = 0; i < noOfColumns; i++) {
                    var paramName = daoClass.metadata.properties[i].outProperty;
                    if (paramName != null) {
                        value = unmashalledRecord.find(paramName).text();
                        if (value != null) {
                            if (daoClass.metadata.properties[i].isDate != null && daoClass.metadata.properties[i].isDate == true) {
                                value = new Date(value);
                            }
                            marshallRecord[daoClass.metadata.properties[i].name] = value;
                        }
                    }
                }
                marshlledRecords.push(marshallRecord);
            });
        }
        return marshlledRecords;
    },

    unmarshallJSON: function (daoClass, result) {
        if (typeof result == 'object') {

            var records = [];
            if (result instanceof Array) {
                records = result;
            } else {
                records.push(result);
            }

            var marshlledRecords = [];
            $.each(records, function (index, record) {
                var marshallRecord = {};
                var noOfColumns = daoClass.metadata.properties.length;
                var value = null;
                for (var i = 0; i < noOfColumns; i++) {
                    var paramName = daoClass.metadata.properties[i].outProperty;
                    if (paramName != null && record[paramName] != null) {
                        value = record[paramName];
                        if (daoClass.metadata.properties[i].isDate != null && daoClass.metadata.properties[i].isDate == true) {
                            value = new Date(value);
                        }
                        marshallRecord[daoClass.metadata.properties[i].name] = value;
                    }
                }
                marshlledRecords.push(marshallRecord);

            });
            return marshlledRecords;
        } else {
            return result;
        }
    },

    invokeGetSingle: function (daoClass, operation, params) {
        var resultArray = this.invokeGet(daoClass, operation, params);
        if (resultArray instanceof Array) {
            if (resultArray.length > 0) {
                return resultArray[0];
            } else {
                return null;
            }
        } else {
            return resultArray;
        }
    }
};

var CoreREST = {

   // _defaultServer: "http://kanglesales.hidoctor.in/",
    // _defaultServer: "http://192.168.0.26:8083/",
    // _defaultServer: "http://kangle.swaas.net/",
    // _defaultServer: "http://kangle.me/",
    _defaultServer: "http://"+DOMAIN+"/",
    accessKey: "dummy",

    _addContext: function (url, context) {
        if (context != null && context.length > 0) {
            for (var key in context) {
                url += context[key] + '/';
            }
        }
        return url;
    },

    _raw: function (url, requestType, context, data, success, failure) {
        // TODO $.mobile.allowCrossDomainPages = true; un - comment code
        // $.support.cors = true;
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        console.log(url);
        // alert(url);
        data.accessKey = this.accessKey;
        $.ajax({
            url: url,
            type: requestType,
            data: data,
            dataType: "json",
            async: true,
            crossDomain: true,
            success: function (response) {
                console.log("Success:" + JSON.stringify(response));
                success(response);
            },
            error: function (a, b, c) {
                console.log(JSON.stringify(a) + " - " + JSON.stringify(b) + " - " + JSON.stringify(c));
                failure(a);
            }
        });
    },
    
    _rawAlt: function (url, requestType, context, data, success, failure) {
        // TODO $.mobile.allowCrossDomainPages = true; un - comment code
        // $.support.cors = true;
        url = this._addContext(url, context);
        if (data == null) {
            data = {};
        }
        data = JSON.stringify(data);
        $.ajax({
            url: url,
            type: requestType,
            data: data,
            dataType: "json",
            contentType: "application/json",
            async: true,
            crossDomain: true,
            success: function (response) {
                console.log("Success:" + JSON.stringify(response));
                success(response);
            },
            error: function (a, b, c) {
                console.log(JSON.stringify(a) + " - " + JSON.stringify(b) + " - " + JSON.stringify(c));
                failure(a);
            }
        });
    },

    post: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },

    postArray: function (restClass, context, data, success, failure) {
        this._rawAlt(this._defaultServer, 'POST', context, data, success, failure);
    },
    
    put: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'POST', context, data, success, failure);
    },

    remove: function (restClass, context, data, success, failure) {
        this._raw(this._defaultServer, 'DELETE', context, data, success, failure);
    },

    get: function (restClass, context, data, success, failure) {
        // alert(JSON.stringify(data));
        this._raw(this._defaultServer, 'GET', context, data, success, failure);
    },


};
var userRemoteDAO = {
    metadata: {
        "service": "WLUserService",
        "properties": [
                   /*
					 * { name: "companyCode", inProperty: "companyCode",
					 * outProperty: "Company_Code" }, { name: "userName",
					 * inProperty: "userName", outProperty: null }, { name:
					 * "password", inProperty: "password", outProperty: null }, {
					 * name: "url", inProperty: "url", outProperty: null }, {
					 * name: "userCode", inProperty: "userCode", outProperty:
					 * "User_Code" }, { name: "regionCode", inProperty:
					 * "regionCode", outProperty: "Region_Code" }, { name:
					 * "regionName", inProperty: "regionName", outProperty:
					 * "Region_Name" }, { name: "userTypeCode", inProperty:
					 * "userTypeCode", outProperty: "User_Type_Code" }, { name:
					 * "regionHierarchy", inProperty: "regionHierarchy",
					 * outProperty: "User_Hierarchy" }, { name: "userTypeName",
					 * inProperty: "userTypeName", outProperty: "User_Type_Name" }, {
					 * name: "lastSyncDate", inProperty: "lastSyncDate",
					 * outProperty: null }, {name:"companyId",
					 * inProperty:"companyId", outProperty:"COMPANY_ID"}
					 */
                   		{name: "companyCode", inProperty: "companyCode", outProperty: "Company_Code"},
                        {name: "userId", inProperty: "userId", outProperty: "User_Id"},
						{name: "userName",  inProperty: "userName", outProperty: null},
						{name: "password",  inProperty: "password", outProperty: null},
                        {name: "blobUrl",  inProperty: "blobUrl", outProperty: "Profile_Photo_BLOB_URL"},
						{name: "url",  inProperty: "url", outProperty: null},
						{name: "userCode",  inProperty: "userCode", outProperty: "User_Code"},
						{name: "regionCode",  inProperty: "regionCode", outProperty: "Region_Code"},
						{name: "regionName",  inProperty: "regionName", outProperty: "Region_Name"},
						{name: "userTypeCode",  inProperty: "userTypeCode", outProperty: "User_Type_Code"},
						{name: "regionHierarchy",  inProperty: "regionHierarchy", outProperty: "User_Hierarchy"},
						{name: "userTypeName",  inProperty: "userTypeName", outProperty: "User_Type_Name"},
						{name: "lastSyncDate",  inProperty: "lastSyncDate", outProperty: null},
						{name: "companyId", inProperty: "companyId", outProperty: "Company_Id"}
        ]
    },

    login: function (userName, password, url) {
        // TODO make the rest call
        var data = {
            correlationId: 1,
            userName: userName,
            password: password,
            subDomainName: url
        };
        // var result = CoreSOAP.invoke(this, "CheckUserAuthentication", data);
        var result = CoreSOAP.invoke(this, "CheckUserAuthenticationByEmail", data);
        consuole.log(JSON.stringify(data));
        return (result);
    },

    get: function (userName, url) {
        var data = {
            correlationId: 1,
            userName: userName,
            subDomainName: url
        };
        // var result = CoreSOAP.invokeGetSingle(this, "GetUserInfo", data);
        var result = CoreSOAP.invokeGetSingle(this, "GetUserInfoByEmail", data);
        console.log('user RemoteDAO : ' + JSON.stringify(result));
        return result;

    },
};

/*
 * Date Format 1.2.3 (c) 2007-2009 Steven Levithan <stevenlevithan.com> MIT
 * license
 * 
 * Includes enhancements by Scott Trenda <scott.trenda.net> and Kris Kowal
 * <cixar.com/~kris.kowal/>
 * 
 * Accepts a date, a mask, or a date and a mask. Returns a formatted version of
 * the given date. The date defaults to the current date/time. The mask defaults
 * to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask
		// prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

// Utils ends

// Upsynch service starts here
var daTagAnalyticRemoteDAO = {
    metadata: {
        "service": "ELTagServices"
    },

    syncPut: function (context, params, success, failure) {
        var result = null;
        if (params instanceof Array) {
            for (var index = 0; index < params.length; index++) {
                var param = params[index];
                var daTagAnalyicRecord = {
                    correlationId: param.correlationId,
                    companyCode: param.companyCode,
                    userCode: param.userCode,
                    tagDetails: param.tagDetails
                };
                result = CoreSOAP.invoke(daTagAnalyticRemoteDAO, "PutTag", daTagAnalyicRecord);
                if (CoreSOAP.isError == true) {
                    failure();
                    return;
                } else if (result == false) {
                    success(false);
                    return;
                }
            };
            success(result);
        } else {
            var daTagAnalyicRecord = {
                correlationId: params.correlationId,
                companyCode: params.companyCode,
                userCode: params.userCode,
                tagDetails: params.tagDetails
            };
            result = CoreSOAP.invoke(daTagAnalyticRemoteDAO, "PutTag", daTagAnalyicRecord);
            if (CoreSOAP.isError == true) {
                failure();
            } else {
                success(result);
            }
        }
    }
};

var digitalAssetBillingRemoteDAO = {
    metadata: {
        "service": "ELBillingService"
    },

    insertBilling: function (context, params, success, failure) {
        var result = null;
        var daBillingRecord = {
        correlationId: params.correlationId,
        companyCode: params.companyCode,
        userCode: params.userCode,
        elItemizedBillingDetails: params.elItemizedBillingDetails
        };
        CoreSOAP.invokeAsync(digitalAssetBillingRemoteDAO, "InsertELItemizedBilling", daBillingRecord, success, failure);
    },
    
    syncPut: function (context, params, success, failure) {
        var result = null;
        if (params instanceof Array) {
            for (var index = 0; index < params.length; index++) {
                var param = params[index];
                var daBillingRecord = {
                    correlationId: param.correlationId,
                    companyCode: param.companyCode,
                    userCode: param.userCode,
                    elItemizedBillingDetails: param.elItemizedBillingDetails
                };
                result = CoreSOAP.invoke(digitalAssetBillingRemoteDAO, "InsertELItemizedBilling", daBillingRecord);
                if (CoreSOAP.isError == true) {
                    failure();
                    return;
                } else if (result == false) {
                    success(false);
                    return;
                }
            };
            success(result);
        } else {
            var daBillingRecord = {
                correlationId: params.correlationId,
                companyCode: params.companyCode,
                userCode: params.userCode,
                elItemizedBillingDetails: params.elItemizedBillingDetails
            };
            result = CoreSOAP.invoke(digitalAssetBillingRemoteDAO, "InsertELItemizedBilling", daBillingRecord);
            if (CoreSOAP.isError == true) {
                failure();
            } else {
                success(result);
            }
        }
    }
};

// upsync service starts here
var eLearningUpsyncService = {
    params: null,
    startUpsync: function (success, failure, overallPercentage) {
        eLearningUpsyncService.overallPercentage = 100;
        if (overallPercentage != null) {
            eLearningUpsyncService.overallPercentage = overallPercentage;
        }

        if (coreNET.isConnected() == true) {
            var percentageProgress = (eLearningUpsyncService.overallPercentage * 2) / 100;
            eLearningAPP.showProgress(percentageProgress);
            setTimeout(function () {
                eLearningUpsyncService.checkUserLoginAndCorrelationId(function (isLoggedinAndHasCorelationalId) {
                    if (isLoggedinAndHasCorelationalId == true) {
                        var taskSpecifications = [
                                                  { firstTask: eLearningUpsyncService.getDATagAnalytics, secondTask: eLearningUpsyncService.upSyncDATagAnalytics },
                                                  { firstTask: eLearningUpsyncService.getDABillingData, secondTask: eLearningUpsyncService.upSyncDABillingData }
                        ];

                        var taskUtil = new TaskUtil(taskSpecifications);
                        taskUtil.execute(eLearningUpsyncService, { spinner: false }, function (data) {
                            synchronizeRemoteDAO.endSync(eLearningUpsyncService.params);
                            var percentageProgress = (eLearningUpsyncService.overallPercentage * 100) / 100;
                            eLearningAPP.showProgress(percentageProgress);
                            if (eLearningUpsyncService.overallPercentage == 100) {
                                eLearningAPP.showToast("Data has been sucessfully uploaded");
                            }
                            success(true);
                        }, function (data) {
                            eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
                            failure();
                        });
                    } else {
                        eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
                        alert(resource.userValidationMessage);
                    }
                }, function (data) {
                    eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
                    alert(resource.networkMessage.noNetwork);
                });
            }, 100);

        } else {
            eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
            alert(resource.networkMessage.noNetwork);
            return;
        }
    },

    getDATagAnalytics: function (context, data, success, failure) {
        daTagAnalyticLocalDAO.syncGet(eLearningUpsyncService.params, success, failure);
    },

    upSyncDATagAnalytics: function (context, data, success, failure) {
        var percentageProgress = (eLearningUpsyncService.overallPercentage * 10) / 100;
        // percentageProgress = parseInt(percentageProgress);
        eLearningAPP.showProgress(percentageProgress);
        if (data != null && data.length > 0) {
            var taskSpecifications = [
                                      { task: daTagAnalyticRemoteDAO.syncPut }
            ];
            var taskUtil = new TaskUtil(taskSpecifications);
            data.spinner = false;
            taskUtil.execute(eLearningUpsyncService, data, function (isSyncPutSuccessful) {
                var percentageProgress = (eLearningUpsyncService.overallPercentage * 35) / 100;
                eLearningAPP.showProgress(percentageProgress);
                if (isSyncPutSuccessful == true) {
                    daTagAnalyticLocalDAO.clean(function (data) {
                        var percentageProgress = (eLearningUpsyncService.overallPercentage * 50) / 100;
                        eLearningAPP.showProgress(percentageProgress);
                        success();
                    }, failure);
                } else {
                    eLearningAPP.showToast("Error uploading data, please try later");
                    failure();
                }
            }, function (data) {
                alert(resource.networkMessage.noNetwork);
                failure(data);
            });
        } else {
            var percentageProgress = (eLearningUpsyncService.overallPercentage * 50) / 100;
            eLearningAPP.showProgress(percentageProgress);
            success();
        }
    },

    getDABillingData: function (context, data, success, failure) {
        digitalAssetBillingLocalDAO.syncGet(eLearningUpsyncService.params, success, failure);
    },

    upSyncDABillingData: function (context, data, success, failure) {
        var percentageProgress = (eLearningUpsyncService.overallPercentage * 60) / 100;
        eLearningAPP.showProgress(percentageProgress);
        if (data != null && data.length > 0) {
            var taskSpecifications = [
                                      { task: digitalAssetBillingRemoteDAO.syncPut }
            ];
            var taskUtil = new TaskUtil(taskSpecifications);
            data.spinner = false;
            taskUtil.execute(eLearningUpsyncService, data, function (isSyncPutSuccessful) {
                eLearningAPP.showProgress(85);
                if (isSyncPutSuccessful == true) {
                    digitalAssetBillingLocalDAO.clean(function (data) {
                        var percentageProgress = (eLearningUpsyncService.overallPercentage * 95) / 100;
                        eLearningAPP.showProgress(percentageProgress);
                        success();
                    }, failure);
                } else {
                    alert("Error uploading data, please try later");
                    failure();
                }
            }, function (data) {
                alert(resource.networkMessage.noNetwork);
                failure(data);
            });
        } else {
            var percentageProgress = (eLearningUpsyncService.overallPercentage * 95) / 100;
            eLearningAPP.showProgress(percentageProgress);
            success();
        }
    },

    showUploadProgress: function () {
        success();
    },

    checkUserLoginAndCorrelationId: function (success, failure) {
        userLocalDAO.get(function (user) {
            console.log('user : ' + JSON.stringify(user));

            if (user != null && user.ssoId != null) {
                var correlationId = synchronizeRemoteDAO.getCorrelationId(user.companyCode, user.userCode);
                if (correlationId != null) {
                    eLearningUpsyncService.params = {};
                    eLearningUpsyncService.params.companyCode = user.companyCode;
                    eLearningUpsyncService.params.userCode = user.userCode;
                    eLearningUpsyncService.params.divisionCode = user.divisionCode;
                    eLearningUpsyncService.params.divisionName = user.divisionName;
                    eLearningUpsyncService.params.correlationId = correlationId;
                    success(true);
                } else {
                    failure();
                }
            } else {
                success(false);
            }
        }, failure);
    },

    isUpsyncDataAvailable: function (success, failure) {
        daTagAnalyticLocalDAO.getCount(function (count) {
            if (count != 0) {
                success(true);
            } else {
                digitalAssetBillingLocalDAO.getCount(function (count) {
                    if (count != 0) {
                        success(true);
                    } else {
                        success(false);
                    }
                }, failure);
            }
        }, failure);
    }


};

var synchronizeRemoteDAO = {
    metadata: {
        "service": "ELInfrastructureService"
    },

    getCorrelationId: function (companyCode, userCode) {
        var data = {
            companyCode: companyCode,
            userCode: userCode
        };
        var result = CoreSOAP.invoke(this, "StartSync", data, 'text');
        if (CoreSOAP.isError == true) {
            return null;
        } else {
            return result;
        }
    },

    endSync: function (params) {
        var data = {
            correlationId: params.correlationId,
            companyCode: params.companyCode,
            userCode: params.userCode
        };
        var result = CoreSOAP.invoke(this, "EndSync", data, 'text');
        return eval(result);
    }
};

var userDivisionRemoteDAO = {
    metadata: {
        "service": "WLUserService",
        "properties": [
                    { name: "userCode", inProperty: "User_Code", outProperty: "User_Code" },
                    { name: "divisionCode", inProperty: "Division_Code", outProperty: "Division_Code" },
                    { name: "divisionName", inProperty: "Division_Name", outProperty: "Division_Name" }
        ]
    },

    get: function (correlationId, companyId,companyCode, userCode) {
        var data = {
            correlationId: correlationId,
            companyCode: companyCode,
            userCode: userCode,
            companyId: companyId
        };
        var result = CoreSOAP.invokeGet(this, "GetUserDivision", data);
        return result;
    }

};
var configurationRemoteDAO = {
    metadata: {
        "service": "ELInfrastructureService",
        "properties": [
                    { name: "companyCode", inProperty: "Company_Code", outProperty: "Company_Code" },
                    { name: "dateSettings", inProperty: "DATE_SETTINGS", outProperty: "DATE_SETTINGS" },
                    { name: "Action" },
                    { name: "Intent" },
                    { name: "Intent_Type" },
                    { name: "Is_Active" }
        ]
    },

    get: function (params) {
        var result = CoreSOAP.invoke(this, "GetELConfiguration", params);
        var configuration = {};
        if (result != null && result.length > 0) {
            configuration = result[0];
        }
        return configuration;
    },

    syncGet: function (params) {
        return this.get(params);
    }
};

var eLearningUpgradeService = {
    startUpgrade: function () {
        if (coreNET.isConnected() == false) {
            alert(resource.networkMessage.noNetwork);
            return;
        }
        var availabeDetail = eLearningUpgradeService.isNewVersionAvailable();
        if (availabeDetail.isNewAvailabe == true) {
            var fileName = UUIDUtil.getUID() + ".apk";
            var tempFolder = resource.download.tempFolder;
            var downloadedFileName = "file:///sdcard/" + tempFolder + "/" + fileName;
            var downloaderUtil = new Downloader();
            var apkURL = availabeDetail.apkURL;
            downloaderUtil.downloadFile(apkURL, tempFolder, fileName, {}, function (progressStatus) {
                eLearningAPP.showProgress(progressStatus.progress);
                if (progressStatus.progress >= 100) {
                    window.plugins.fileOpener.open(downloadedFileName);
                }
            });
        } else {
            eLearningAPP.showProgress(100);
            alert(resource.application.upToDate);
        }
    },

    isNewVersionAvailable: function () {
        var version = resource.application.version + '.' + resource.application.release;
        var platform = resource.application.platform;
        var apkURL = null;
        if (eLearningAPP.currentUser != null) {
            apkURL = upgradeRemoteDAO.get('1', eLearningAPP.currentUser.url, eLearningAPP.currentUser.companyCode, version, platform);
        }
        var newVersion = {};
        if (apkURL != null) {
            if (apkURL.indexOf('http') == 0) {
                newVersion.isNewAvailabe = true;
                newVersion.apkURL = apkURL;
                return newVersion;
            } else {
                return newVersion;
            }
        } else {
            return newVersion;
        }

    },


    isUpgradeRequired: function (success, failure) {
        var differentVersion = false;
        upgradeLocalDAO.get(function (currentVersion) {
            var newVersion = {
                version: resource.application.version,
                release: resource.application.release
            };
            if (currentVersion == null) {
                differentVersion = true;
            } else {
                if (newVersion.version != currentVersion.version || newVersion.release != currentVersion.release) {
                    differentVersion = true;
                }
            }
            success(differentVersion);
        }, failure);
    },

    updateTables: function (success, failure) {
        coreView.showLoading(resource.application.upgradingMessage);
        var entities = eLearningUpgradeService._getAllEntities();
        eLearningUpgradeService._updateTables(entities, success, failure);
    },

    _updateTables: function (entities, success, failure, index) {

        if (index == null) {
            index = 0;
        }
        if (index < entities.length) {
            var entity = entities[index];
            var localDAO = eval(entity);
            console.log(localDAO);
            coreDAO.updateTable(localDAO, function (data) {
                index++;
                eLearningUpgradeService._updateTables(entities, success, failure, index);
            }, function (data) { });
        } else {
            eLearningUpgradeService.completeUpgrade(success, failure);
        }
    },

    completeUpgrade: function (success, failure) {
        var newVersion = {
            version: resource.application.version,
            release: resource.application.release
        };
        upgradeLocalDAO.remove(function (data) {
            upgradeLocalDAO.insert(newVersion, function (data) {
                userLocalDAO.get(function (user) {
                    if (user != null && user.ssoId != null) {
                        var sendVersion = newVersion.version + '.' + newVersion.release;
                        upgradeRemoteDAO.sendVersion('1', user.url, user.companyCode, user.userCode, user.userName,
								sendVersion);
                        coreView.hideLoading();
                        success(true);
                    } else {
                        success(false);
                    }
                }, failure);
            }, failure);
        }, failure);
    },

    _getAllEntities: function (onSyncBatchComplete) {
        var entities = ["userLocalDAO", "assetMetaTagLocalDao", "digitalAssetLocalDAO", "daTagAnalyticLocalDAO", "digitalAssetBillingLocalDAO", "daAnalyticHistoryLocalDAO", "upgradeLocalDAO"];
        return entities;
    },

    alertAndHighLightUpgradeOption: function () {
        if (coreNET.isConnected()) {
            var availabeDetail = eLearningUpgradeService.isNewVersionAvailable();
            if (availabeDetail.isNewAvailabe == true) {
                alert(resource.application.upgradeAlertMessage);
                var option = $(".upgradeOption");
                option.empty();
                option.append("<div class='hightedUpgradeOption'>" + resource.application.upgradeOption + "</div>");
            }
        }
    }
};

var upgradeRemoteDAO = {
    metadata: {
        "service": "ELInfrastructureService"
    },

    get: function (correlationId, subDomain, companyCode, waVersion, platform) {
        var data = {
            correlationId: correlationId,
            subdomainName: subDomain,
            companyCode: companyCode,
            waVersion: waVersion,
            platform: platform
        };
        var result = CoreSOAP.invokeGet(this, "CheckNewVersion", data, 'text');
        return result;
    },

    sendVersion: function (correlationId, subDomain, companyCode, userCode, userName, waVersion) {
        var data = {
            correlationId: correlationId,
            subdomainName: subDomain,
            companyCode: companyCode,
            userCode: userCode,
            userName: userName,
            waVersion: waVersion
        };
        var result = CoreSOAP.invokeGet(this, "InstallBack", data, 'text');
    }
};


var upgradeLocalDAO = {

    metadata: {
        "tableName": "tbl_Upgrade",
        "columns": [
                    { name: "version", columnName: "Version" },
                    { name: "release", columnName: "Release" }
        ]
    },

    insert: function (version, success, failure) {
        coreDAO.insert(this, version, success, failure);
    },

    update: function (version, success, failure) {
        coreDAO.update(this, version, success, failure);
    },

    remove: function (success, failure) {
        coreDAO.remove(this, null, success, failure);
    },

    get: function (success, failure) {
        var criteria = {};
        coreDAO.getEquals(this, criteria, function (result) {
            if (result.length > 0) {
                success(result[0]);
            } else {
                success(null);
            }
        }, failure);

    }
};

var assetCategoryService = {
    getCategoryURL: function (asset) {
        var categoryArray = [];
        var metaTag = asset.metaTag1;
        if (metaTag != null && metaTag.length > 0) {
            metaTag = metaTag.replace(/#/g, '');
        }
        var category = null;
        if (metaTag != null) {
            var catAndTag1 = metaTag.split("~");
            category = catAndTag1[0];
        }
        categoryArray.push(category);

        var params = {
            correlationId: resource.correlationId,
            companyCode: eLearningAPP.currentUser.companyCode,
            userCode: eLearningAPP.currentUser.userCode,
            appPlatForm: resource.ssoDetail.appPlatForm,
            appSuiteId: resource.ssoDetail.appSuiteId,
            appId: resource.ssoDetail.appId,
            categoryIds: categoryArray
        };
        var result = assetCategoryRemoteDAO.getCategoryURL(params);
        if (result != null) {
            return result.Thumbnail_URL;
        } else {
            return null;
        }
    }
};

var assetCategoryRemoteDAO = {
    metadata: {
        "service": "ELInfrastructureService",
    },

    getCategoryURL: function (params) {
        var result = CoreSOAP.invoke(this, "GetCategoryThumbnail", params);
        if (result != null && result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }
};
var myWindow;
function fnPreviewAsset(daCode) {
    var left = Number((screen.width / 2) - (1000 / 2));
    var top = Number((screen.height / 2) - (800 / 2));
    var windowFeatures = 'channelmode=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,width=1000,height=600,top=' + top + 'left=' + left;

    var startTime = new Date();
    $.modal({ ajax: '../AssetUpload/DigitalAssetPreview/' + daCode + '', title: 'Asset View', overlayClose: false });
    $("#modal_close").click(function () { fnGetPlayTimeAndUpdate(daCode, startTime); });

    return;
    // myWindow = window.open('../AssetUpload/DigitalAssetPreview/' + daCode +
	// '', 'Popup', windowFeatures);
    // myWindow.onbeforeunload = function () {
    // // Do something
    // fnGetPlayTimeAndUpdate(daCode,startTime);
    // };
}

function fnGetPlayTimeAndUpdate(daCode, startTime, asset) {
    // alert(JSON.stringify(asset));
	//coreView.showLoading("Closing Player");
    var date1 = new Date(startTime); // 9:00 AM
    var date2 = new Date(); // 5:00 PM
    if (date2 < date1) {
        date2.setDate(date2.getDate() + 1);
    }
    var diff = date2 - date1; // playtime in millisecond.
    
    if(asset !=null && (asset.downloaded == 'Y' || asset.downloaded == 'N')){
        asset.downloaded = 0;
    }
    coreView.getGeoPosition(function (position) {
        if(asset == null){
        asset ={};
        }
        // insert billing
        var analytics = null;
        var user = eLearningAPP.currentUser;
        analytics = {
            companyCode: user.companyCode,
            daCode: daCode,
            userCode: user.userCode,
            userName: user.userName,
            userRegionCode: user.regionCode,
            userRegionName: user.regionName,
            divisionCode: user.divisionCode,
            divisionName: user.divisionName,
            dateTime: new Date(),
            playTime:diff,
            offlineClick: (asset.offlinePlay!=null?asset.offlinePlay:0),
            downloaded: (asset.downloaded!=null?asset.downloaded:0),
            onlinePlay: (asset.onlinePlay!=null?asset.onlinePlay:1),
            latitude: position.latitude,
            longitude: position.longitude
        };
        
        InsertELDetailsWeb.InsertBilling(analytics, function(e) {
        	coreView.hideLoading();
        });
    });
}

function isMobileTab() {

}

var InsertELDetailsWeb = {
    InsertBilling: function (params, oncomplete) {
        var daBillingRecords = [];
        var correlationId = synchronizeRemoteDAO.getCorrelationId(params.companyCode, params.userCode);
        var daBillingDetail ={
            companyCode: params.companyCode,
            companyId: window.localStorage.getItem("companyId"),
            correlationId: correlationId,
            daCode: params.daCode,
            userCode: params.userCode,
            userName: params.userName,
            regionCode: params.userRegionCode,
            regionName: params.userRegionName,
            divisionCode: params.divisionCode,
            divisionName: params.divisionName,
            dateTime: params.dateTime,
            offlineClick: params.offlineClick,
            onlinePlay:params.onlinePlay ,
            downloaded: params.downloaded,
            longitude:params.longitude,
            latitude:params.latitude,
            playTime: params.playTime
            
        };
        
        var columns = [
                       {name: "companyCode", columnName: "Company_Code"},
                       {name: "daCode", columnName: "DA_ID"},
                       {name: "userCode", columnName: "User_Code"},
                       {name: "userName", columnName: "User_Name"},
                       {name: "regionCode", columnName: "Region_Code"},
                       {name: "regionName", columnName: "Region_Name"},
                       {name: "divisionCode", columnName: "Division_Code"},
                       {name: "divisionName", columnName: "Division_Name"},
                       {name: "dateTime", columnName: "DateTime", isDate:true},
                       {name: "offlineClick", columnName: "Offline_Click"},
                       {name: "downloaded", columnName: "Downloaded"},
                       {name: "onlinePlay", columnName: "Online_Play"},
                       {name: "longitude", columnName: "Longitude"},
                       {name: "latitude", columnName: "Latitude"},
                       {name: "playTime", columnName: "Play_Time"},
                       {name:"companyId", columnName:"Company_Id"}
                       ];
        
        var elItemizedBillingDetails = eLearningAPP.formatDataForSync(daBillingDetail, columns);
        var daBillingRecord = {
            correlationId: correlationId,
            companyCode: params.companyCode,
            userCode: params.userCode,
            divisionCode : params.divisionCode,
            divisionName : params.divisionName,
            elItemizedBillingDetails: elItemizedBillingDetails
        };
        // daBillingRecords.push(daBillingRecord);
        // alert(JSON.stringify(daBillingRecords));
        /*
		 * digitalAssetBillingRemoteDAO.syncPut(this, daBillingRecords,
		 * function(data) { //alert(data); }, function(e){ });
		 */
         digitalAssetBillingRemoteDAO.insertBilling(this, daBillingRecord, oncomplete, oncomplete);
        
        /*
		 * var data = { CompanyCode: params.companyCode, CorrelationId: "1",
		 * AppPlatform: "web", AppSuiteId: "1", AppId: "2", DACode:
		 * params.daCode,
		 * 
		 * UserCode: params.userCode, UserName: params.userName, RegionCode:
		 * params.userRegionCode, RegionName: params.userRegionName,
		 * DivisionCode: params.divisionCode, DivisionName: params.divisionName,
		 * 
		 * BillingDate: params.dateTime.toString(), OfflineClick: 0, OnlinePlay:
		 * 1, Download: 0, PlayTime: params.playTime };
		 * 
		 * var context = ['AssetUpload', 'InsertELItemizedBilling']; var result =
		 * ""; CoreREST.get(this, context, data, function (data) { result =
		 * data; console.log(result); }, function (data) { }); return result;
		 */
    },

    InsertTagAnalytics: function (params) {
        var daTagAnalyicRecords = new Array();
        var correlationId = synchronizeRemoteDAO.getCorrelationId(params.companyCode, params.userCode);
        var daTagId = UUIDUtil.getUID();
        var tagAnalytic = {
            daTagAnalyticId: daTagId,
            companyCode: params.companyCode,
            companyId: window.localStorage.getItem("companyId"),
            daCode: params.daCode,
            userCode: params.userCode,
            userName: params.userName,
            regionCode: params.userRegionCode,
            regionName: params.userRegionName,
            dateTime: params.dateTime,
            like: params.like,
            dislike: params.dislike,
            rating: params.rating,
            tagDescription: params.tagDescription
        };
        var columns = [
                       {name: "companyCode", columnName: "Company_Code"},
                       {name: "daCode", columnName: "DA_ID"},
                       {name: "userCode", columnName:"User_Code"},
                       {name: "userName", columnName:"User_Name"},
                       {name: "regionCode", columnName: "Region_Code"},
                       {name: "regionName", columnName: "Region_Name"},
                       {name: "dateTime", columnName:"DateTime", isDate:true},
                       {name: "like", columnName:"Like"},
                       {name: "dislike", columnName:"Disike"},
                       {name: "rating", columnName:"rating"},
                       {name: "tagDescription", columnName:"Tag_Description"},
                       {name:"companyId", columnName:"Company_Id"}
                       ];
        var tagDetails = eLearningAPP.formatDataForSync(tagAnalytic, columns);
        var daTagAnalyicRecord = {
            daTagAnalyticId: daTagId,
            correlationId: correlationId,
            companyCode: params.companyCode,
            userCode: params.userCode,
            tagDetails: tagDetails
        };
        // alert(JSON.stringify(daTagAnalyicRecord));
        daTagAnalyicRecords.push(daTagAnalyicRecord);
        // alert(JSON.stringify(daTagAnalyicRecords));
        
        daTagAnalyticRemoteDAO.syncPut(this, daTagAnalyicRecords, function(data) {
                // alert(data);
        }, function(e){
        });
        /*
		 * var data = { CompanyCode: params.companyCode, CorrelationId: "1",
		 * AppPlatform: "web", AppSuiteId: "1", AppId: "2", DACode:
		 * params.daCode,
		 * 
		 * UserCode: params.userCode, UserName: params.userName, RegionCode:
		 * params.userRegionCode, RegionName: params.userRegionName,
		 * 
		 * AnalyticsDate: params.dateTime.toString(), Like: params.like,
		 * Dislike: params.dislike, Rating: params.rating, TagDescription:
		 * params.tagDescription }; var context = ['AssetUpload',
		 * 'InsertELTagAnalytics']; var result = ""; CoreREST.get(this, context,
		 * data, function (data) { alert(JSON.stringify(data)); result = data;
		 * console.log(result); }, function (data) {
		 * //alert(JSON.stringify(data)); }); return result;
		 */
    }
}

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function hideMenu() {
    $('#menu-panel').animate({
        left: '-330px'
    }, 200, function () {
        $('#menu-panel').removeClass('show');
        // $('.shadeBg').remove();
        // $('body').removeClass('page-player');
    });
    $('.right-sec').animate({ 'left': '0px' }, 200, function () {
        $('.wrapper').css({ 'height': 'auto', 'overflow': '', 'position': '' });
    });
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function getRespectiveThumbnail(asset) {
    var i = asset.offLineURL.lastIndexOf(".");
    var ext = asset.offLineURL.substring(i + 1);
    var extIcon = '';

    if (ext == 'jpg' || ext == 'png' || ext == 'jpeg' || ext == 'gif' || ext == 'bmp')
        extIcon = 'image.png';
    else if (ext == 'pdf')
        extIcon = 'pdf.png';
    else if (ext == 'docx' || ext == 'doc')
        extIcon = 'docx.png';
    else if (ext == 'ppt' || ext == 'pptx')
        extIcon = 'pptx.png';
    else if (ext == 'xls' || ext == 'xlsx')
        extIcon = 'xlsx.png';
    else if (ext == 'zip')
        extIcon = 'html5.png';
    else
        extIcon = 'video.png';

    return extIcon;
}
/* for asset share popup */

eLearningAPP.showLoader = function () {
    if(eLearningAPP.bulkTask == null)
        eLearningAPP.bulkTask = new BulkTask({});
    eLearningAPP.bulkTask.showLoading();
};

eLearningAPP.hideLoader = function () {
    if (eLearningAPP.bulkTask != null)
        eLearningAPP.bulkTask.hideLoading();
};

eLearningAPP.showSharePopup = function (data, assetId) {
    var opts = new Array();
    if (data != null && data.length > 0) {
        for (var i = 0; i <= data.length - 1; i++) {
            var obj = {};
            //obj.text = data[i].Customer_Email;
            obj.text = data[i].emailId;
            opts.push(obj);
        }
    }
    eLearningAPP.showLoader();
    Services.getTemplateList(function (templates) {
    	var tmpl = new Array();
        if (templates != null && templates.length > 0) {
            for (var i = 0; i <= templates.length - 1; i++) {
                var t = templates[i];
                var tmp = {};
                tmp.type = 'thumbwithpreview';
                tmp.displayName = t.Template_Name;
                tmp.id = 'form-template-' + t.Template_Id;
                tmp.src = t.Thumbnail_Url;
                tmp.html = t.HTML_Code;
                tmp.data = {
                    templateid: t.Template_Id,
                    name: t.Template_Name
                };
                tmp.isDefault = t.Is_default;
                if (tmp.isDefault == 1) {
                	eLearningAPP.setTemplate(tmp);
                }
                tmpl.push(tmp);
            }
        }
        eLearningAPP.bindSharePopup(data, tmpl, opts, assetId);
    }, function (e) {
        alert("Error getting details");
    });
};

eLearningAPP.bindSharePopup = function (data, templates, opts, assetId) {
    eLearningAPP.hideLoader();
    var fieldContent = '';
    fieldContent += '<div class="form-block">';
    fieldContent += '<div class="form-label">Share this asset</div>';
    fieldContent += '<div class="input-group">';
    fieldContent += '<input class="inline-input" placeholder="Enter your customer email ID" maxlength="100" type="text" name="email" id="form-email" value=""/>';
    fieldContent += '<button class="inline-button" id="form-share">Share</button>';
    fieldContent += '</div>';
    fieldContent += '<div class="form-block block-check"><label class="input-check"><input type="checkbox" id="form-autosave" name="autosave"><label for="form-autosave">Automatically save this customer </label></label></div>';
    fieldContent += '</div>';
    
    var sharePop = new SharePop({
        assetId: assetId,
        title: "Share",
        popId: "shareWrapper",
        pages: [{
            title: "Share to your customers",
            tabs: [{
                tabName: "Add and Share",
                formData: [
                    { type: 'html', content: fieldContent },
                    { type: 'thumbwithbtn', displayName: eLearningAPP.templateName, id: 'form-template', src: eLearningAPP.thumbnailSrc, html: eLearningAPP.thumbnailHtml, btnText: 'Change Template', value: eLearningAPP.templateId }
                ],

                showPage: false,
                onTabSelect: function (sp) {
                    if (sp.currentEmail) $(sp.$wBody.find("#form-email")).val(sp.currentEmail);
                    $("#form-share").unbind().bind("click", function (e) {
                        eLearningAPP.submitShareForm(sp);
                    });
                    var $anchorBtn = sp.$wBody.find("#form-template .form-field-btn #changeTemplate a");
                    $($anchorBtn).unbind().bind("click", function (e) {
                        eLearningAPP.goToPage(sp, 2);
                        return false;
                    });

                    var $previewBtn = sp.$wBody.find("#form-template .form-field-btn #showPreview a");
                    $($previewBtn).unbind().bind("click", function (e) {
                        eLearningAPP.previewTemplateId = eLearningAPP.templateId;
                        eLearningAPP.goToPage(sp, 3);
                        return false;
                    });
                    console.log(sp.$wBody.html());
//                    var $templateArea = $(sp.$wBody.find(".html-form-content > .col-xs-12, .html-form-content > .col-xs-8"));
//                    var $parent = $($templateArea.parent());
//                    var rectConf = $templateArea.get(0).getBoundingClientRect();
//                    $parent.height(rectConf.height);

                    if (eLearningAPP.formBlockUpdated) {
                        eLearningAPP.formBlockUpdated = false;
                        $(sp.$wBody.find("#form-template")).addClass("form-block-updated");
                    }
                }
            }, {
                   
                tabName: "Pick my customers",
                showPage: false,
                listData: opts,
                onTabSelect: function (sp) {
                    $(".share-tab-body ul li span.fa.fa-share").unbind().bind("click", function (e) {
                        var email = $(this).parent().find("span").get(0).innerHTML;
                        //eLearningAPP.submitShared(sp.options.assetId, email, sp);
                        sp.currentEmail = email;
                        var $tabs = $(sp.$wBody.find(".share-tab span"));
                        $($tabs.get(0)).trigger("click");
                    });
                }
            }],
                
            beforeLoad: false,
            afterLoad: function (sp) {
                if (sp.currentEmail) $("#form-email").val(sp.currentEmail);
                $(".wrapper").hide();
                if (data != null && data.length > 0) {
                    $(".share-tab").show();
                } else {
                    $(".share-tab").hide();
                }
                $("#form-share").unbind().bind("click", function (e) {
                    eLearningAPP.submitShareForm(sp);
                });
                $("#form-email").keyup(function (e) {
                    sp.currentEmail = $(this).val();
                });
            }
        }, {

            title: "Customer Details",
            tabs: [{
                tabName: "Add and Share",
                formData: [
                    { type: 'label', text: '' },
                    { type: 'text', displayName: 'First Name', placeholder: "Enter first name here", name: 'firstname', id: 'form-firstname', value: "", max: 100 },
                    { type: 'text', displayName: 'Last Name', placeholder: "Enter last name here", name: 'lastname', id: 'form-lastname', value: "", max: 100 },
                    { type: 'text', displayName: 'Email ID', placeholder: "Enter email here", name: 'email', id: 'form-email', value: "", max: 100 },
                    { type: 'select', displayName: 'Category', name: 'category', id: 'form-category', options: new Array() },
                    { type: 'select', displayName: 'Speciality', name: 'speciality', id: 'form-speciality', options: new Array(), hidden: true},
                    { type: 'text', displayName: 'Location', placeholder: "Location", name: 'location', id: 'form-location', value: "", max: 100 },
                    { type: 'text', displayName: 'Phone', placeholder: "Enter phone number here", name: 'phone', id: 'form-phonenumber', value: "", max: 15 },
                    { type: 'text', displayName: eLearningAPP.templateName, id: 'form-template',src: eLearningAPP.thumbnailSrc, html: eLearningAPP.thumbnailHtml, btnText: 'Change Template', value: eLearningAPP.templateId ,hidden: true },
                    { type: 'check', displayName: '', name: 'autosave', id: 'form-autosave', checked: false, text: 'Automatically save this customer ', hidden: true },
                    { type: 'button', displayName: '', name: 'share', id: 'form-share', text: 'Submit and Share' }
                ],
                showPage: false
            }],

            beforeLoad: false,
            afterLoad: function (sp) {
                SharePop.showLoader();
				Services.getCustDomain(function(data){
					if(data >= 1){
						$('#form-speciality').parents().eq(1).hide();
					} else {
						$('#form-speciality').show();
					}
				}, function(){
					console.log("error");
				});
                Services.getCustomerSpecialityByCompany(function (data) {
                    SharePop.hideLoader();
                    var selSpl = $("#form-speciality");
                    if (data != null && data.length > 0) {
                        selSpl.empty();
                        for (var i = 0; i <= data.length - 1; i++) {
                            selSpl.append("<option value=\"" + data[i].Preference_Value_Id + "\">" + data[i].Preference_Value + "</option>");
                        }
                    }
                }, function () { SharePop.hideLoader(); });
                Services.getCustomerEntity(function (data) {
                    SharePop.hideLoader();
                    var selSpl = $("#form-category");
                    if (data != null && data.length > 0) {
                        selSpl.empty();
                        for (var i = 0; i <= data.length - 1; i++) {
                            selSpl.append("<option value=\"" + data[i].Entity_Value_Id + "\">" + data[i].Entity_Value_Name + "</option>");
                        }
                    }
                }, function () { SharePop.hideLoader(); });
                
                if (sp.currentEmail) $("#form-email").val(sp.currentEmail);
                $("#form-email").attr("disabled", "disabled");
                $(".wrapper").hide();
                $(".share-tab").hide();
                $("#form-share").unbind().bind("click", function (e) {
                    eLearningAPP.submitCustomerShareForm(sp);
                });

                var $anchorBtn = sp.$wBody.find("#form-template .form-field-btn .share-pop-btn a");
                $($anchorBtn).unbind().bind("click", function (e) {
                    eLearningAPP.goToPage(sp, 2);
                    return false;
                });
//                var $templateArea = $(sp.$wBody.find(".html-form-content > .col-xs-12, .html-form-content > .col-xs-8"));
//                var $parent = $($templateArea.parent());
//                var rectConf = $templateArea.get(0).getBoundingClientRect();
//                $parent.height(rectConf.height);
            }
        }, {
            title: "Pick Template",
            tabs: [{

                tabName: "Choose Template",
                formData: templates,
                showPage: false
            }],
                
            beforeLoad: false,
            afterLoad: function (sp) {
                $(".wrapper").hide();
                $(".share-tab").hide();
                var $previewBtn = sp.$wBody.find(".share-btn-preview");
                $($previewBtn).unbind().bind("click", function (e) {
                    var $elem = $(this);
                    var $parent = $($elem.parents(".form-block"));
                    var id = $parent.data("templateid");
                    eLearningAPP.previewTemplateId = id;
                    sp.nextPage();
                    return false;
                });

                var $chooseBtn = sp.$wBody.find(".share-btn-choose");
                $($chooseBtn).unbind().bind("click", function (e) {
                    var $elem = $(this);
                    var $parent = $($elem.parents(".form-block"));
                    var id = $parent.data("templateid");
                    for (var i = 0; i <= templates.length - 1; i++) {
                        if (templates[i].data.templateid == id) {
                        	eLearningAPP.setTemplate(templates[i], sp);
                            break;
                        }
                    }

                    eLearningAPP.formBlockUpdated = true;
                    sp.$backBtn.trigger("click");
                    return false;

                });
//                var $templateArea = $(sp.$wBody.find(".html-form-content > .col-xs-12, .html-form-content > .col-xs-8"));
//                $templateArea.each(function (index, el) {
//
//                    var $parent = $($templateArea.parent());
//                    var rectConf = el.getBoundingClientRect();
//                    $parent.height(rectConf.height);
//                });
            }
        }, {

            title: "Preview",
            tabs: [{
                tabName: "Preview Template",
                formData: [
                    { type: 'button', displayName: '', name: 'share', id: 'form-choose', text: 'Choose' },
                    { type: 'bitpreviewtemplate', displayName: 'Preview', id: 'form-template-preview', html: '', value: 0 }
                ],
                showPage: false
            }],

            beforeLoad: false,
            afterLoad: function (sp) {
                $(".wrapper").hide();
                $(".share-tab").hide();
                var $formTmplPrev = $(sp.$wBody.find("#form-template-preview"));
                var template = null;
                for (var i = 0; i <= templates.length - 1; i++) {
                    if (templates[i].data.templateid == eLearningAPP.previewTemplateId) {
                        $formTmplPrev.html('<div class="form-blocker" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;"></div><div class="html-form-content noscale">' + templates[i].html + '</div>');
                        template = templates[i];
                        break;
                    }
                }
                var $chooseBtn = sp.$wBody.find("#form-choose");
                $($chooseBtn).unbind().bind("click", function (e) {
                    eLearningAPP.setTemplate(template, sp);
                    eLearningAPP.formBlockUpdated = true;
                    if (sp.pageHistory[sp.pageHistory.length - 2] != 0) {
                        sp.$backBtn.trigger("click");
                        sp.$backBtn.trigger("click");
                    } else {
                        sp.$backBtn.trigger("click");
                    }
                    return false;
                });
                //$($formTmplPrev.find("img")).css("transform", "scale(0.3)");
            }
        }],
                                
        onClose: function () {
            $(".wrapper").show();
        }
    });
};

eLearningAPP.goToPage = function (sp, index) {
    sp.bindPage(index);
};

eLearningAPP.setTemplate = function (template, sp) {
	eLearningAPP.templateId = template.data.templateid;
    eLearningAPP.thumbnailSrc = template.src;
    eLearningAPP.thumbnailHtml = template.html;
    eLearningAPP.templateName = template.displayName;
    
    if (sp != null) {
        sp.pages[0].tabs[0].formData[1].displayName = eLearningAPP.templateName;
        sp.pages[0].tabs[0].formData[1].src = eLearningAPP.thumbnailSrc;
        sp.pages[0].tabs[0].formData[1].html = eLearningAPP.thumbnailHtml;
        sp.pages[0].tabs[0].formData[1].value = eLearningAPP.templateId;
        /*sp.pages[1].tabs[0].formData[6].displayName = eLearningAPP.templateName;
        sp.pages[1].tabs[0].formData[6].html = eLearningAPP.thumbnailHtml;
        sp.pages[1].tabs[0].formData[6].value = eLearningAPP.templateId;*/
    }
};
eLearningAPP.submitShared = function (assetId, email, sp) {
    var postData = {};
    postData.Customer_Email = email;
    postData.Asset_Id = assetId;
    postData.User_Id = Services.defaults.userId;
    postData.Template_Id = eLearningAPP.templateId;
    SharePop.showLoader();
    Services.insertCustomerAssetSharing(true, postData, function (data) {
        SharePop.hideLoader();
        if (data != null && data > 0) {
            sp.alert("An e-mail with a link to view this asset will be sent soon to this " + email, function () {
                sp.close();
            });
        } else {
            sp.alert("Error sharing asset, please try again.");
        }
    }, function (e) {
        SharePop.hideLoader();
        sp.alert("Error sharing asset, please try again.");
    });
};
eLearningAPP.submitShareForm = function (sp) {
    // validation
    var email = $("#form-email").val();
    if (email == null || email.trim() == '') {
        sp.alert("Email id is required.");
        return;
    }
    if (email != null && email.trim().length > 0) {
        if (!eLearningAPP.validateEmail(email)) {
            sp.alert("Email is invalid.");
            return;
        }
    }
    var isAutosave = $("#form-autosave:checked").length>0?true:false;
    var postData = {};
    postData.Customer_Email = email;
    postData.Asset_Id = sp.options.assetId;
    postData.User_Id = Services.defaults.userId;
    postData.Template_Id = eLearningAPP.templateId;
    SharePop.showLoader();
    Services.insertCustomerAssetSharing(isAutosave, postData, function (data) {
        SharePop.hideLoader();
        if (data != null && data == 0) {
            sp.nextPage();
        } else if (data != null && data > 0) {
        	customertableLocalDAO.getByEmailData(postData.Customer_Email, function (userinfo) {
                if(userinfo == null) {
                    Services.insertCustomerMaster(postData, function (data) {
                    if(data != null) {
                        var userRecord = {};
                        var name = "Doctor";
                        userRecord.firstName = name;
                        userRecord.lastName = postData.Customer_LName;
                        userRecord.emailId = postData.Customer_Email;
                        userRecord.phone = postData.Customer_Phone;
                        userRecord.categoryId = postData.Entity_Value_Id;
                        //userRecord.categoryName = category1;
                        userRecord.specialityId = postData.Customer_Preference1;
                        //userRecord.specialityName = speciality1;
                        userRecord.userId = postData.User_Id;
                        userRecord.customerId = data;
                    }
                    customertableLocalDAO.insert(userRecord, function(){
                        sp.alert("An e-mail with a link to view this asset will be sent soon to this " + email, function () {
                            sp.close();
                        });
                    }, function(){
                        sp.alert("An e-mail with a link to view this asset will be sent soon to this " + email, function () {
                            sp.close();
                        });
                    	});
                	});
            	} else {
					sp.alert("An e-mail with a link to view this asset will be sent soon to this " + email, function () {
						sp.close();
					});
            	}
        	});
        } else {
            sp.alert("Error sharing asset, please try again.");
        }
    }, function (e) {
        SharePop.hideLoader();
        sp.alert("Error sharing asset, please try again.");
    });
};
eLearningAPP.submitCustomerShareForm = function (sp) {
    // validation
    var firstname = $("#form-firstname").val();
    if (firstname == null || firstname.trim() == '') {
        sp.alert("First name is required.");
        return;
    }
    if (firstname != null && firstname.trim().length > 0) {
        if (!eLearningAPP.validateName(firstname)) {
            sp.alert("First name is invalid.");
            return;
        }
    }
    var lastname = $("#form-lastname").val();
    if (lastname != null && lastname.trim().length > 0) {
        if (!eLearningAPP.validateName(lastname)) {
            sp.alert("Last name is invalid.");
            return;
        }
    }
    var email = $("#form-email").val();
    if (email == null || email.trim() == '') {
        sp.alert("Email id is invalid.");
        return;
    }
    if (email != null && email.trim().length > 0) {
        if (!eLearningAPP.validateEmail(email)) {
            sp.alert("Email is invalid.");
            return;
        }
    }
    
    var category = $("#form-category").val();
    if (category == null || category.trim() == '') {
        sp.alert("Category is required.");
        return;
    }
    var category1 = "";
    Services.getCustomerEntity(function(customerEntity){
        for(var i=0; i<customerEntity.length;i++){
            if(category == customerEntity[i].Entity_Value_Id){
                category1 = customerEntity[i].Entity_Value_Name;
            }
        }
    });
    
    var speciality = $("#form-speciality").val();
    var speciality1 = "";
    Services.getCustomerSpecialityByCompany(function (specialities) {
        for(var i=0; i<specialities.length;i++){
            if(speciality == specialities[i].Preference_Value_Id) {
                speciality1 = specialities[i].Preference_Value;
            }
        }
    });
    
    var location = $("#form-location").val();
    
    var phone = $("#form-phonenumber").val();
    if (phone != null && phone.trim().length > 0) {
        if (!eLearningAPP.validatePhone(phone)) {
            sp.alert("Phone number is invalid.");
            return;
        }
    }
    var isAutosave = $("#form-autosave:checked").length > 0 ? true : false;
    var postData = {};
    postData.Asset_Id = sp.options.assetId;
    postData.Customer_FName = firstname;
    postData.Customer_LName = lastname;
    postData.Customer_Email = email;
    postData.Customer_Phone = phone;
    postData.Entity_Value_Id = category;
    postData.Customer_Preference1 = speciality;
    postData.Customer_Location = location;
    postData.User_Id = Services.defaults.userId;
    postData.Template_Id = eLearningAPP.templateId;
    SharePop.showLoader();
    Services.insertCustomerAssetSharing(isAutosave, postData, function (data) {
        SharePop.hideLoader();
        if (data != null && data > 0) {
        	customertableLocalDAO.getByEmailData(postData.Customer_Email, function (userinfo) {
                if(userinfo == null) {
                    Services.insertCustomerMaster(postData, function (data) {
                    if(data != null){
                        var userRecord = {};
                        userRecord.firstName = postData.Customer_FName;
                        userRecord.lastName = postData.Customer_LName;
                        userRecord.emailId = postData.Customer_Email;
                        userRecord.phone = postData.Customer_Phone;
                        userRecord.categoryId = postData.Entity_Value_Id;
                        userRecord.categoryName = category1;
                        userRecord.specialityId = postData.Customer_Preference1;
                        userRecord.specialityName = speciality1;
                        userRecord.location = location;
                        userRecord.userId = postData.User_Id;
                        userRecord.customerId = data;
                    }
                        customertableLocalDAO.insert(userRecord, function(){
                            sp.alert("An e-mail with a link to view this asset will be sent soon to this " + email, function () {
                                sp.close();
                            });
                        }, function(){
                            sp.alert("An e-mail with a link to view this asset will be sent soon to this " + email, function () {
                                sp.close();
                            });
                        });
                    });
                }
            });
        } else {
            sp.alert("Error sharing asset, please try again.");
        }
    }, function (e) {
        SharePop.hideLoader();
        sp.alert("Error sharing asset, please try again.");
    });
};
eLearningAPP.validateEmail = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};
eLearningAPP.validatePhone = function (phone) {
    var re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return re.test(phone);
};
eLearningAPP.validateName = function (name) {
    var re = /^[a-zA-Z .]+$/;
    return re.test(name);
};
/* for asset share popup */