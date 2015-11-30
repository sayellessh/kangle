/**
 * PENDING ITEMS 1. Integrate praffulla code - UpSync DAO (SyncGet, SyncPut,
 * Clean)
 */

var eLearningAPP = {};

function Downloader() {
};
Downloader.prototype.downloadFile = function(downloadURL, directoryName,
		fileName, params, progressCallBack) {
	if (params == null) {
		params = {};
	}
	params.dirName = directoryName;
	params.fileName = fileName;
	var win = function(progressStatus) {
		var perc = progressStatus.progress;
		progressStatus.status = 1;
		progressStatus.dirName = directoryName;
		progressStatus.fileName = fileName;
		progressStatus.progress = perc;
		progressCallBack(progressStatus);
		/*
		 * if (progressCallBack != null) { progressCallBack(progressStatus); }
		 */
	};

	var fail = function(progressFailed) {
		if (progressCallBack != null) {
			progressFailed.status = -1;
			progressFailed.progress = 0;
			progressCallBack(progressFailed);
		}
	};

	// alert(cordova.file.externalRootDirectory);
	/*
	 * var fileTransfer = new FileTransfer(); var uri = encodeURI(downloadURL);
	 * //alert(FileTransfer); //alert(cordova.file.externalRootDirectory);
	 * fileTransfer.download(uri, cordova.file.externalRootDirectory +
	 * directoryName + '/' + fileName, win, fail, false, params);
	 * fileTransfer.onprogress = function (progressStatus) { if
	 * (progressCallBack != null) { //alert(progressStatus.lengthComputable); if
	 * (progressStatus.lengthComputable) { var perc =
	 * Math.floor(progressStatus.loaded / progressStatus.total * 100);
	 * progressStatus.status = 1; progressStatus.dirName = directoryName;
	 * progressStatus.fileName = fileName; progressStatus.progress = perc;
	 * progressCallBack(progressStatus); } } }
	 */

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
	//cordova.exec(win, fail, "Downloader", "downloadFile",
	//		[ downloadURL, params ]);
};

function Downloader() {
};
Downloader.prototype.deleteFile = function(url, win, fail) {
	cordova.exec(win, fail, "Downloader", "delete", [ url ]);
};

eLearningAPP.docOpenDeatils = {
	docOpen : false,
	openTime : 0,
	daBillingId : null
};

eLearningAPP.initApp = function() {
	document.addEventListener("resume", eLearningAPP.backFromDocOpen, false);
	document.addEventListener("backbutton", function() {
	}, false);
	// document.addEventListener("pause", function(){navigator.app.exitApp();},
	// false);
	coreView.initializeGeoPosition();
	eLearningAPP.init();
};

/**
 * This function should be invoked with to Play or Open the asset
 * 
 * e.g.: eLearningAPP.playOrOpen(asset, function(progress){ // will give
 * progress in percentage console.log("Download progress is " + progress + "%");
 * });
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
eLearningAPP.playOrOpen = function(asset, downloadProgress) {
	digitalAssetLocalDAO.get(asset.daCode, function(returnedAsset) {
		if (returnedAsset != null && returnedAsset.downloaded == "Y") {
			asset.downloaded = "Y";
			asset.downloadedFileName = returnedAsset.downloadedFileName;
			asset.downloadedThumbnail = returnedAsset.downloadedThumbnail;
			assetService.saveAssetDetailsAndAnalyticsHistory(asset,
					asset.analyticsHistory, function(data) {
						eLearningAPP._playOrOpenAsset(asset, downloadProgress);
					}, function(data) {
					});
		} else {
			assetService.saveAssetDetailsAndAnalyticsHistory(asset,
					asset.analyticsHistory, function(data) {
						eLearningAPP._playOrOpenAsset(asset, downloadProgress);
					}, function(data) {
					});
		}
	}, function(data) {
	});

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
eLearningAPP.download = function(asset, downloadProgress) {
	if (eLearningAPP.isDownloading == true) {
		return;
	}
	eLearningAPP.isDownloading = true;

	digitalAssetLocalDAO
			.get(
					asset.daCode,
					function(returnedAsset) {
						var existingAsset = (returnedAsset != null);
						if (existingAsset == true) {
							if (returnedAsset.downloaded == 'Y') {
								fileUtil
										.checkIfFileExists(
												returnedAsset.downloadedFileName,
												function(fileEntry) {
													asset.downloaded = returnedAsset.downloaded;
													asset.downloadedFileName = returnedAsset.downloadedFileName;
													asset.downloadedThumbnail = returnedAsset.downloadedThumbnail;
													alert(resource.alreadyDownloaded);
													eLearningAPP.isDownloading = false;
												},
												function(msg) {
													AssetDownloader
															.downloadFile(
																	asset,
																	downloadProgress,
																	function(
																			data) {
																		var tag1 = asset.metaTag1;
																		var tag2 = asset.metaTag2;

																		metaTagService
																				.saveMetaTag(
																						tag1,
																						tag2,
																						function(
																								data) {
																						},
																						function(
																								data) {
																						});
																		coreView
																				.getGeoPosition(function(
																						position) {
																					assetService
																							.populateAssetBilling(
																									eLearningAPP.currentUser,
																									position,
																									asset,
																									function(
																											daBillingId) {
																										var assetBilling = {};
																										assetBilling.daBillingId = daBillingId;
																										assetBilling.downloaded = 1;
																										assetBilling.onlinePlay = 0;
																										assetBilling.offlinePlay = 0;
																										digitalAssetBillingLocalDAO
																												.update(
																														assetBilling,
																														function(
																																data) {
																														},
																														function(
																																data) {
																														});
																										eLearningAPP.isDownloading = false;
																									},
																									function(
																											data) {
																										eLearningAPP.isDownloading = false;
																									});
																				});
																	},
																	function(
																			data) {
																		eLearningAPP.isDownloading = false;
																	});
												});
							} else {
								AssetDownloader
										.downloadFile(
												asset,
												downloadProgress,
												function(data) {
													var tag1 = asset.metaTag1;
													var tag2 = asset.metaTag2;

													metaTagService.saveMetaTag(
															tag1, tag2,
															function(data) {
															}, function(data) {
															});
													coreView
															.getGeoPosition(function(
																	position) {
																assetService
																		.populateAssetBilling(
																				eLearningAPP.currentUser,
																				position,
																				asset,
																				function(
																						daBillingId) {
																					var assetBilling = {};
																					assetBilling.daBillingId = daBillingId;
																					assetBilling.downloaded = 1;
																					assetBilling.onlinePlay = 0;
																					assetBilling.offlinePlay = 0;
																					digitalAssetBillingLocalDAO
																							.update(
																									assetBilling,
																									function(
																											data) {
																									},
																									function(
																											data) {
																									});
																					eLearningAPP.isDownloading = false;
																				},
																				function(
																						data) {
																					eLearningAPP.isDownloading = false;
																				});
															});
												},
												function(data) {
													eLearningAPP.isDownloading = false;
												});
							}
						} else {
							assetService
									.saveAssetDetailsAndAnalyticsHistory(
											asset,
											asset.analyticsHistory,
											function(data) {
												AssetDownloader
														.downloadFile(
																asset,
																downloadProgress,
																function(data) {
																	var tag1 = asset.metaTag1;
																	var tag2 = asset.metaTag2;

																	metaTagService
																			.saveMetaTag(
																					tag1,
																					tag2,
																					function(
																							data) {
																					},
																					function(
																							data) {
																					});
																	coreView
																			.getGeoPosition(function(
																					position) {
																				assetService
																						.populateAssetBilling(
																								eLearningAPP.currentUser,
																								position,
																								asset,
																								function(
																										daBillingId) {
																									var assetBilling = {};
																									assetBilling.daBillingId = daBillingId;
																									assetBilling.downloaded = 1;
																									assetBilling.onlinePlay = 0;
																									assetBilling.offlinePlay = 0;
																									digitalAssetBillingLocalDAO
																											.update(
																													assetBilling,
																													function(
																															data) {
																													},
																													function(
																															data) {
																													});
																									eLearningAPP.isDownloading = false;
																								},
																								function(
																										data) {
																									eLearningAPP.isDownloading = false;
																								});
																			});
																},
																function(data) {
																	eLearningAPP.isDownloading = false;
																});
											},
											function(data) {
												eLearningAPP.isDownloading = false;
											});
						}
					}, function(data) {
						eLearningAPP.isDownloading = false;
					});
};

eLearningAPP.docOpenDeatils = {};

eLearningAPP._playOrOpenAsset = function(asset, downloadProgress) {
	var documentType = asset.documentType;
	// alert(documentType);
	coreView.getAssetURL(asset, function(assetURL) {
		if (documentType == 'VIDEO') {
			asset.offLineURL = assetURL;
			var ply = new Player({
				asset : asset,
				startTime : new Date()
			});
			ply.show();
		} else {
			if (asset.downloaded == 'Y') {
				fileUtil.checkIfFileExists(asset.downloadedFileName, function(
						fileEntry) {
					var d = new Date();
					eLearningAPP.docOpenDeatils.openTime = d.getTime();
					eLearningAPP.docOpenDeatils.docOpen = true;
					asset.offLineURL = assetURL;
					// alert(asset.offLineURL);
					var ply = new Player({
						asset : asset,
						startTime : new Date()
					});
					ply.show();
				}, function(msg) {
					AssetDownloader.downloadFile(asset, downloadProgress,
							function(returnedAsset) {
								// alert(JSON.stringify(returnedAsset));
								var tag1 = asset.metaTag1;
								var tag2 = asset.metaTag2;
								metaTagService.saveMetaTag(tag1, tag2,
										function(data) {
										}, function(data) {
										});
								var d = new Date();
								eLearningAPP.docOpenDeatils.openTime = d
										.getTime();
								eLearningAPP.docOpenDeatils.docOpen = true;
								var downloadedAssetURL = coreView
										.getAssetURL(returnedAsset);
								var ply = new Player({
									asset : returnedAsset,
									startTime : new Date()
								});
								ply.show();
							}, function(data) {
							});
				});
			} else {
				AssetDownloader.downloadFile(asset, downloadProgress, function(
						returnedAsset) {
					var tag1 = asset.metaTag1;
					var tag2 = asset.metaTag2;
					metaTagService.saveMetaTag(tag1, tag2, function(data) {
					}, function(data) {
					});
					var d = new Date();
					eLearningAPP.docOpenDeatils.openTime = d.getTime();
					eLearningAPP.docOpenDeatils.docOpen = true;
					// var downloadedAssetURL =
					coreView.getAssetURL(returnedAsset, function(
							downloadedAssetURL) {
						var ply = new Player({
							asset : returnedAsset,
							startTime : new Date()
						});
						ply.show();
					});
				}, function(data) {
				});
			}
		}

	});

	// Populate Billing Section
	/*
	 * coreView.getGeoPosition(function (position) {
	 * assetService.populateAssetBilling(eLearningAPP.currentUser, position,
	 * asset, function (daBillingId) {
	 *  }, function (data) { }); });
	 */
};

eLearningAPP.backFromDocOpen = function() {
	if (eLearningAPP.docOpenDeatils.docOpen == true
			&& eLearningAPP.docOpenDeatils.openTime > 0) {
		var d = new Date();
		eLearningAPP.docOpenDeatils.docOpen = false;
		var assetBilling = {};
		assetBilling.daBillingId = eLearningAPP.docOpenDeatils.daBillingId;
		assetBilling.playTime = (d.getTime() - eLearningAPP.docOpenDeatils.openTime);
		assetService.updateAssetBilling(assetBilling, function(data) {
		}, function(data) {
		});
		eLearningAPP.docOpenDeatils.openTime = 0;
	}
};

eLearningAPP.getHieght = function() {
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

eLearningAPP.showProgress = function(progressDetails, success) {
	// var height = window.innerHeight;
	// height = height - 25;
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

	if (isNaN(progress)) {
		eLearningAPP.progressBar.addClass("progessError");
		setTimeout(
				function() {
					if (progress != 'NON-DOWNLOAD-ERROR') {
						if (typeof progressDetails == 'object') {
							if (progressDetails.error == true) {
								alert(progressDetails.message);
							} else {
								alert("Errror downloading asset, please check the internet availablity and try again.");
							}
						} else {
							alert("Errror downloading asset, please check the internet availablity and try again.");
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
		if (typeof success == 'function')
			success();
		setTimeout(function() {
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

eLearningAPP.showToast = function(message) {
	var toast = $(".toast");
	if (toast.length == 0) {
		toast = $("<div style='z-index: 9999' class='toast'><div class='close'>X</div><div class='title'>Info</div><div class='message'></div></div>");
		$("body").append(toast);
		toast.click(function() {
			toast.hide();
		});
		$('body').click(function() {
			toast.hide();
		});

		$('document').click(function() {
			toast.hide();
		});

		$('.header').click(function() {
			toast.hide();
		});
		$('.showBrowseTag').click(function() {
			toast.hide();
		});
		$('.sideMenu').click(function() {
			toast.hide();
		});
		$('.breadcrumb').click(function() {
			toast.hide();
		});
		$('.content').click(function() {
			toast.hide();
		});
		$('.assetList').click(function() {
			toast.hide();
		});

		$('.assetDetail').click(function() {
			toast.hide();
		});
	}
	toast.find(".message").html(message);
	//toast.screenCenter();
	toast.css("top", ($(window).height() - toast.height() - 50) + "px");
	toast.show();
};

eLearningAPP.hideToast = function() {
	var toast = $(".toast");
	if (toast.length > 0) {
		toast.hide();
	}

};

function Menu(settings) {
	this.settings = $.extend({}, settings);
	this.container = this.settings.container;
	this.menuItems = this.settings.menuItems;
	this.menuBar = $("<div class='menubar' />");
	this.container.append(this.menuBar);
	this.onSelection = this.settings.onSelection;
};

Menu.prototype.show = function() {
	var that = this;
	this.menuBar.empty();
	$.each(this.menuItems, function(index, menuItem) {

		var menu = $("<div class='menu' />");
		that.menuBar.append(menu);
		if (menuItem.defaultSelected == true) {
			menu.addClass("active");
		}

		menu.html(menuItem.name);
		menu.click(function(e) {
			var currentMenu = menuItem;
			that.menuBar.find(".active").removeClass("active");
			menu.addClass("active");
			$.each(that.menuItems, function(i, item) {
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

	$("body").append(menuPopup);
	menuPopup.hide();
	menuButton.click(function() {
		if (menuPopup.is(':visible') == true) {
			menuPopup.hide();
		} else {
			menuPopup.css("left", $(window).width() - menuPopup.width());
			menuPopup.show();
		}
	});
};

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
	this.sideMenu = $('<div class="sideMenu"></div>');
	this.categories.append(this.sideMenu);
	this.tags.append(this.sideMenu);
	var that = this;
	this.sideMenu.click(function(e) {
		if (!that.sideMenu.hasClass("closed")) {
			//that.browseTag.css('display', 'none');
			that.sideMenu.addClass("closed");
			$(".content").css('left', "30px");
			$(".assetDetail").css('left', "30px");
			$(".breadcrumb").css('left', "30px");

		} else {
			//that.browseTag.css('display', 'block');
			$(".content").css('left',
					(that.tagListContainer.width() + 30) + "px");
			$(".assetDetail").css('left',
					(that.tagListContainer.width() + 30) + "px");
			$(".breadcrumb").css('left',
					(that.tagListContainer.width() + 30) + "px");
			that.sideMenu.removeClass("closed");
		}
	});
	if ($(window).width() < 720) {
		this.isPhone = true;
	}
	this.browseTag = $('<div class="browseTag" ></div>');
	this.categories.append(this.browseTag);

	if (this.isPhone == true) {
		this.sideMenu.addClass("closed");
	}

	this.tagListContainer = $("<ul class='tagList' />");
	this.browseTag.append(this.tagListContainer);
	this.onSelection = this.settings.onSelection;
	this.onTagSelection = this.settings.onTagSelection;
	this.selectedTag = null;
	this.breadcrumbContainer = this.settings.breadcrumbContainer;
}

TagList.prototype.breadcrumb = function(metaTag, subTag) {
	this.breadcrumbContainer.empty();

	if (metaTag != null) {

		if (typeof metaTag == 'string') {

			this.breadcrumbContainer.append('<li>' + metaTag + '</li>');
			if (metaTag != 'All Assets') {

				var anchorClose = $('<li style="width: 30px !important;"><a class="fa fa-close"></a></li>');

				anchorClose.bind('click', function(e) {

					$('.search_sec input').val('');

					eLearningAPP.refresh();

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

				this.breadcrumbContainer.append('<li>&gt;</li><li>'
						+ subTag.subTag + '</li>');

			}

		}

	}

};

TagList.prototype.show = function() {
	var that = this;
	this.tagListContainer.empty();

	if (this.metaTags == null || this.metaTags.length == 0) {
		this.tagListContainer.append("No assets found");
		this.tagListContainer.addClass("noassets");
	}
	/*
	 * $('.product_search').change(function() { var searchInput = $(this).val();
	 * if(searchInput != null){ //select * from table_name where asset_name LIKE
	 * %input% digitalAssetLocalDAO.getLike(searchInput, function(assets){
	 * eLearningAPP.showAssets(null, assets, null, null); }); } });
	 */

	this.taggedAssets = sortByKey(this.taggedAssets, 'subTag');
	$.each(this.taggedAssets, function(index, taggedAsset) {
		var li = $("<li></li>");
		that.tags.append(li);
		var tagName = (taggedAsset.subTag).replace(' ', '').toLowerCase();
		li.append('<a href="#" id="' + tagName + '">' + taggedAsset.subTag
				+ '</a> <span class="count">' + taggedAsset.tagCount
				+ '</span>');
		li.bind('click', function(e) {
			if (typeof that.onSelection == 'function') {
				$('.menu#tag li').removeClass('active');
				li.addClass('active');
				that.breadcrumb("Filtered by <span>" + '"' + taggedAsset.subTag
						+ '"' + "</span>");
				that.onTagSelection(taggedAsset.subTag);
				hideMenu();
				$('.asset-detail').hide();
				if ($(window).width() < 768) {
					$("#menu-panel").addClass("menu-collapse");
				}
			}
		});
	});

	// category alphabetical order list
	this.metaTags = sortByKey(this.metaTags, 'metaTag');

	$
			.each(
					this.metaTags,
					function(index, metaTag) {
						var li = $("<li />");
						that.tagListContainer.append(li);
						var tagDisplayName = metaTag.metaTag;
						if (metaTag.metaTag.split("~").length > 1) {
							tagDisplayName = metaTag.metaTag.split("~")[1];
						}
						var categoryIconUrl = metaTag.iconURL;
						var categoryIcon = "";
						if (categoryIconUrl != null
								&& categoryIconUrl != "undefined") {
							categoryIcon = "<img src ='"
									+ categoryIconUrl
									+ "' style = 'height : 42px;margin-left : 5px;' classs='categoryImg'>";
						}
						li
								.append('<a href="#">'
										+ tagDisplayName
										+ '</a> <span class="count">'
										+ metaTag.tagCount
										+ '</span><span class="subTagButton arrow-down"></span>');

						var subTagButton = $(".subTagButton", li);
						li.append(subTagButton);
						if (typeof that.settings.getSubTags == 'function') {
							subTagButton
									.click(function(e) {
										if (li.hasClass('selected')) {
											li.removeClass('selected');
											$('.child', li).hide();
											return false;
										}

										that.categories.find('.selected')
												.removeClass('selected');

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

										that.settings
												.getSubTags(
														metaTag,
														function(sTags) {

															if (sTags != null
																	&& sTags.length > 0) {

																// category
																// alphabetical
																// order list
																sTags = sortByKey(
																		sTags,
																		'subTag');

																$
																		.each(
																				sTags,
																				function(
																						jndex,
																						sTag) {

																					var subTagLi = $("<li />");

																					subTag
																							.append(subTagLi);
																					if (sTag.tagCount == null
																							|| sTag.tagCount == undefined) {

																						sTag.tagCount = 0;

																					}

																					subTagLi
																							.append('<a href="#">'
																									+ sTag.subTag
																									+ '</a> <span class="count">'
																									+ sTag.tagCount
																									+ '</span>');

																					subTagLi
																							.click(function(
																									e) {
																								e
																										.stopPropagation();
																								that.categories
																										.find(
																												'.active')
																										.removeClass(
																												'active');
																								// $(".child
																								// li").removeClass("active");
																								subTagLi
																										.addClass("active");
																								// check
																								// iphone
																								// code
																								if (that.isPhone == true) {
																									//that.browseTag
																									//		.css(
																									//				'display',
																									//				'none');
																									that.sideMenu
																											.addClass("closed");
																									$(
																											".content")
																											.css(
																													'left',
																													"30px");
																									$(
																											".assetDetail")
																											.css(
																													'left',
																													"30px");
																									$(
																											".breadcrumb")
																											.css(
																													'left',
																													"30px");
																								}

																								if (typeof that.onSelection == 'function') {
																									$(
																											window)
																											.scrollTop(
																													0);
																									that
																											.breadcrumb(
																													metaTag,
																													sTag);
																									that
																											.onSelection(
																													metaTag,
																													sTag);
																									hideMenu();
																									$(
																											'.asset-detail')
																											.hide();
																									if ($(
																											window)
																											.width() < 768) {
																										$(
																												"#menu-panel")
																												.addClass(
																														"menu-collapse")
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

						li.click(function(e) {

							that.categories.find('.active').removeClass(
									'active');

							$('.child').hide();

							li.addClass('active');

							that.categories.find('.selected').removeClass(
									'selected');

							that.selectedTag = metaTag;

							if (that.isPhone == true) {

								//that.browseTag.css('display', 'none');

								that.sideMenu.addClass("closed");

								$(".asset-result").css('left', "30px");

								$(".assetDetail").css('left', "30px");

								// fix breadcrumb

								$(".breadcrumb").css('left', "30px");

							}

							if (typeof that.onSelection == 'function') {
								// alert(JSON.stringify(metaTag));
								that.breadcrumb("Filtered by <span>" + '"'
										+ metaTag.metaTag + '"' + "</span>");
								that.onSelection(metaTag);
								hideMenu();
								$('.asset-detail').hide();
								if ($(window).width() < 768) {
									$("#menu-panel").addClass("menu-collapse")
								}
							}

						});
					});
};

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
	this.assets = this.settings.assets;
	this.assestContainer = this.settings.assestContainer;
	this.onSelection = this.settings.onSelection;
	this.onDelete = this.settings.onDelete;
	this.container.find('#category').show();
	this.onCompleteRender = this.settings.onCompleteRender;
}

AssetList.prototype.show = function() {
	// alert("shiw");
	var that = this;
	this.container.empty();

	this.assestContainer.empty();

	var selectedTag = $('#category li.active');
	if (selectedTag.length > 0) {

	}

	if (this.assets == null || this.assets.length == 0) {
		if (this.settings.isOnline == false && this.isFilter == false) {
			this.container
					.append("<p class='noassetfound'>You have not downloaded any assets to display. Please go online, download assets and visit this again</p>");
			// this.container.addClass("noassetfound");
			$('.asset-menu').hide();

		} 
		if(this.isFilter == true) {
            this.container.append('<span class="no-asset" style="padding: 10px; font-size: 16px; line-height: 20px; ">No assets found.</span>');
            this.assestContainer.append('<span class="no-asset" style="padding: 10px; font-size: 16px; line-height: 20px; ">No assets found.</span>');
            this.container.addClass("noassetfound");
            this.assestContainer.addClass("noassetfound");
		}
		return;
	} else {
		this.container.removeClass("noassetfound");
        this.assestContainer.removeClass("noassetfound");
	}
	that.createAssetView(this.assets);
	// } else {

	that.createListView(this.assets);
	// }

	// });

};

AssetList.prototype.createListView = function(assets) {
	// alert("listView->"+assets.length);

	var that = this;

	var url = '';
	$.each(assets,function(index, asset) {
		coreView.getThumbnailURL(asset,function(thumnailURL) {
			//alert(JSON.stringify(asset));
			var assetDiv = $("<li class='asset'></li>");
			assetDiv.append('<img src="'+ thumnailURL + '" />');
			var ratingDiv = '<div class="rating_div">';
            ratingDiv += '<div class="rating fa fa-star">' + asset.analyticsHistory.starValue  + '</div><div class="like fa fa-heart">' + asset.analyticsHistory.totalLikesCount +
                '</div><div class="views fa fa-eye">' + asset.analyticsHistory.totalViewsCount + '</div>';
            ratingDiv += '</div>';
			var thumbImg = '';
			thumbImg = getRespectiveThumbnail(asset);
			thumbImg = '<img src= "online/newdoctype/'+ thumbImg + '" alt=""/>';
			assetDiv.append('<div class="asset-name"><div class="asset-thumb">'+ thumbImg + '</div><div class="asset-descr"><p>'
					+ asset.name + 
			'</p><p class="asset-type"><span style="float: left;width: 16px;height: 16px;"><img class="_hdd-o" src="online/images/Memory_Card.png" style="width:100%; height:100%;"/></span>&nbsp;' 
					+ asset.fileSize + ' MB</p>' + ratingDiv + '</div></div>');
			assetDiv.append('<span class="shade-bg"></span><div class="overlay"><ul>'
					+ '<li class="play"><a href="#" title="Play" data-code="'+ asset.daCode
					+ '">1</a></li>'
					+ ('<li class="down delete"><a href="#" title="Delete" data-code="'
							+ asset.daCode + '">2</a></li>')
							+ '<li class="view"><a href="#" title="View" data-code="'
							+ asset.daCode
							+ '">3</a></li></ul></div>');
			
			that.container.append(assetDiv);
			$('.down', assetDiv).data('asset',asset);
			$('.down', assetDiv).click(function(e) {
			// alert('click');
					var data = $(this).data('asset');
					if (typeof that.onDelete == 'function') {
					
						that.onDelete(data);
						
					}
				return false;
				// that.settings.(asset);
			});

			$('.play', assetDiv).unbind('click').bind('click',function() {
				eLearningAPP.playOrOpen(asset,function(progress) {
					eLearningAPP.showProgress(progress.progress);
				});
			});
			
			$('.view', assetDiv).click(function() {
				if (typeof that.onSelection == 'function') {
					that.onSelection(asset);
				}
				return false;
			});

			if (index == (assets.length - 1)) {
				that.onCompleteRender();
				$(" li.asset").unbind('click').bind('click',function(e) {
					e.preventDefault();
					if ($(this).hasClass('visited')) {
						$(this).removeClass('visited');
					} else {
						$(" li.asset").removeClass('visited');
						$(this).addClass('visited');
					}
				});
				$(window).resize(function() {
					that.onCompleteRender();
				});
				}
			});
	});
};

AssetList.prototype.createAssetView = function(assets) {
	// alert("assetView->"+assets.length);
	var that = this;
	var url = '';
	that.assestContainer.empty();
	/*
	 * function centerView() { //alert('inside center'); var listEl =
	 * $('li.asset', that.assestContainer), cListEl = listEl.length, totEl = 0,
	 * listElWid = listEl.outerWidth(); var pLeft =
	 * parseInt(that.assestContainer.css('padding-left').replace('px', '')),
	 * pRight = parseInt(that.assestContainer.css('padding-right').replace('px',
	 * '')); var pWid = $('.right-sec').width() - (pLeft+pRight); var mLeft =
	 * parseInt(listEl.css('margin-left').replace('px', '')), mRight =
	 * parseInt(listEl.css('margin-right').replace('px', '')); listElWid =
	 * listElWid + mLeft + mRight; var totFit = parseInt(pWid / listElWid, 10);
	 * totEl = (cListEl < totFit ? cListEl : totFit); that.assestContainer.css({
	 * 'width': (totEl * listElWid) + 'px', 'margin-left': 'auto',
	 * 'margin-right': 'auto' }); }
	 */
	// alert('before start');
	$.each(assets,function(index, asset) {
		coreView.getThumbnailURL(asset,function(thumnailURL) {
			// alert(thumnailURL);
			var assetDiv = $("<li class='asset'></li>");
			var assetImg = $('<div class="assetimg_div"><img class="thumb_img" src="'
					+ thumnailURL + '"></div>');
			assetDiv.append(assetImg);
			var extIcon = '';
			extIcon = getRespectiveThumbnail(asset);
			console.log(JSON.stringify(asset));
				/*
				 * var i =
				 * asset.offLineURL.lastIndexOf(".");
				 * var ext =
				 * asset.offLineURL.substring(i +
				 * 1); var extIcon = '';
				 * 
				 * if (ext == 'jpg' || ext == 'png' ||
				 * ext == 'jpeg' || ext == 'gif')
				 * extIcon =
				 * '../images/doctype/image.png';
				 * else if (ext == 'pdf') extIcon =
				 * '../images/doctype/pdf.png'; else
				 * if (ext == 'docx' || ext ==
				 * 'doc') extIcon =
				 * '../images/doctype/word.png';
				 * else if(ext == 'ppt' || ext ==
				 * 'pptx') extIcon =
				 * '../images/doctype/PPT.png'; else
				 * if(ext == 'xls' || ext == 'xlsx')
				 * extIcon =
				 * '../images/doctype/excel.png';
				 * else if (ext == 'zip') extIcon =
				 * '../images/doctype/zip.png'; else
				 * extIcon =
				 * '../images/doctype/playNew.png';
				 */
					var btmDiv = $('<div class="bottom_div"></div>');
						btmDiv.append('<div class="doc_type"><img class="player_thumb" src="online/newdoctype/'
							+ extIcon
							+ '"></div>');
					var assetDesc = $('<div class="asset_name"></div>');
						assetDesc.append('<div class="asset_div"><p class="name">'+ asset.name
							+ '</p><p class="status"><span style="float: right;width: 16px;height: 16px;"><img class="_hdd-o" src="online/images/Memory_Card.png" style="width:100%; height:100%;"/></span>&nbsp;' 
							+ asset.fileSize + ' MB</p></div>');
//					var ratingDiv = '<div class="rating_div"><ul class="rating">';
//						for (var i = 0; i < 5; i++) {
//							var className = '';
//							if ((asset.analyticsHistory.starValue - 1) > -1)
//								 className = 'full-img';
//							
//							ratingDiv += '<li><a href="#" class="'+ className+ '" title="'+ i
//									+ '"></a></li>';
//							}
//											// asset.analyticsHistory.starValue
//							ratingDiv += '</ul>';
//							ratingDiv += '<div class="like">'
//								+ asset.analyticsHistory.totalLikesCount
//								+ '</div><div class="views">'
//								+ asset.analyticsHistory.totalViewsCount
//								+ '</div>';
//							ratingDiv += '</div>';
//							assetDesc.append(ratingDiv);// rating
						/*new rating changes*/
		                var ratingDiv = '<div class="rating_div">';
		                    ratingDiv += '<div class="like">' + asset.analyticsHistory.totalLikesCount + '</div><div class="views">' +
		                    asset.analyticsHistory.totalViewsCount + '</div><div class="rating_new" >' + asset.analyticsHistory.starValue + '</div>';
		                    ratingDiv += '</div>';
		                    /*ratingDiv += '<div class="like">' + asset.analyticsHistory.totalLikesCount + '</div><div class="views">' +
		                        asset.analyticsHistory.totalViewsCount + '</div>';
		                    ratingDiv += '</div>';*/
		                    assetDesc.append(ratingDiv);//rating
		                    /*new rating changes*/
							assetDesc.append('<div class="button-div"><input id="view-asset" type="button" value="View"/>'
							+ ('<input id="down-asset" type="button" value="Delete"/></div>'));
								btmDiv.append(assetDesc);
							assetDiv.append(btmDiv);
								// alert(btmDiv);
								that.assestContainer.append(assetDiv);
						$('.assetimg_div', assetDiv).unbind('click').bind('click',function(evt) {
								evt.preventDefault();
							$('.right-sec').attr('style','');
							if (typeof that.onSelection == 'function') {
								that.onSelection(asset);
							}
							return false;
						});
						$('.bottom_div', assetDiv).unbind('click').bind('click',function(evt) {
							evt.preventDefault();
							$('.right-sec').attr('style','');
							if (typeof that.onSelection == 'function') {
								that.onSelection(asset);
							}
							return false;
						});

						$('#view-asset', assetDiv).click(function(evt) {
							evt.preventDefault();
							eLearningAPP.playOrOpen(asset,function(progress) {
								eLearningAPP.showProgress(progress.progress);
							});
							return false;
						});

						$('#down-asset', assetDiv).click(function(evt) {
							evt.preventDefault();
								if (typeof that.onDelete == 'function') {
									that.onDelete(asset);
								}
								return false;
						});

						if (index == (assets.length - 1)) {
							$(window).resize(function() {
							/* centerView(); */
							});
						}
					}, function(e) {
					});
		});
};

function AssetDetail(settings) {
	this.settings = $.extend({}, settings);
	this.container = this.settings.container;
	this.asset = this.settings.asset;
	this.onSelection = this.settings.onSelection;
	this.onRatingSelected = this.settings.onRated;
	this.onAssetLiked = this.settings.onAssetLike;
	this.onAssetUnliked = this.settings.onAssetUnliked;
	this.isPhone = false;
	if ($(window).width() < 720) {
		this.isPhone = true;
	}
}
AssetDetail.prototype.intiRating = function(id, rating, isBig) {
	var that = this;
	ratings(id, 5, rating, true, isBig).bind('ratingchanged',
			function(event, data) {
				// $(".star").hide();
				$(".ratingText").html("Thank you for Rating");

				if (typeof that.onRatingSelected == 'function') {
					that.onRatingSelected(that.asset, data.rating);
				}
			});
};
AssetDetail.prototype.setRating = function(id, rating, isBig) {
	ratings(id, 5, rating, false, isBig);
};

// detail page show
AssetDetail.prototype.show = function() {

	this.container.empty();
	var that = this;
	var asset = this.asset;
	$(".bottom-sec").css('display','none');
	// var thumnailURL =
	coreView
			.getThumbnailURL(
					asset,
					function(thumnailURL) {

						var tagDisplayName = asset.metaTag1.replace(/#/g, '');
						if (tagDisplayName.split("~").length > 1) {

							tagDisplayName = tagDisplayName.split("~")[1];

						}

						// var subTag = new Array();
						// subTag.push(asset.metaTag2);
						var subTag = new Array();
						var mtAry = asset.metaTag2.toString().split(',')
						if (mtAry != null && mtAry.length > 0) {
							for (var i = 0; i <= mtAry.length - 1; i++) {
								subTag.push(mtAry[i]);
							}
						}

						/*if (asset.analyticsHistory.starValue > 5) {

							asset.analyticsHistory.starValue = 5;

						}*/

						var html = '<a class="back-detail">Back</a><div class="asset-desc"><div style="height: 2px; width: 100%; clear: both;"></div>'
								+ '<div class="desc-image"><div class="desc-left"><div class="desc-img-rgt"><div class="desc-img">'
								+ '<span class="asset-shade"> <img src="'
								+ thumnailURL
								+ '" alt="'
								+ asset.name
								+ '"/>'
								+ '<span class="shade-bg"></span>'+
								'<div class="actions" >'+
			                    '<ul id="line">'+
			                    '<li> <a id="asset-view" class="asset-view-btn" href="#" title="view"></a></li>'+
			                    '<li style="display:none;"> <a id="asset-download" href="#" title="Download" style="display:none;"></a></li>'+
			                    /*'<li> <a href="#" style="width:50px; height:32px; display:none; padding:5px; background: url(online/imgs/download.png) 13px 0 no-repeat;"></a></li>'+*/
			                    '</ul>'+
			                    '</div>'+
			                    '</span></div>'+
			                    '</div></div>'+
								//+ '<div class="asset-action"><a id="asset-view" href="#" title="view">View</a>'
								//+ '</div>'
								//+ '</div>
			                    '<div class="tab_offline">'+
								'<ul class="tag_ul" >'+
								'<li id="Details_offline" class="active_div">Details</li>'+
								'<li id="Discuss_offline">Discuss</li>'+
								'<li id="Related_offline" style="display:none;">Related</li>'+
								'</ul></div>'+
								
								'<div class="desc-right" style="display:block;"><div class="desc-cont"><div class="desc-cont-tlft">'
								+ '<h2>'
								+ asset.name
								+ '</h2><div><span>Category :</span><span>'
								+ tagDisplayName
								+ '</span>'
								+ '</div></div><div class="desc-cont-trig"><ul><li class="asset-rat">'
								+ asset.analyticsHistory.starValue
								+ '</li>'
								+ '<li class="asset-like">'
								+ asset.analyticsHistory.totalLikesCount
								+ '</li><li class="asset-cmt">'
								+ '</li></ul></div>';
						if (subTag.length > 0) {
							html += '<div class="desc-cont-tags"><ul>';
							for (var i = 0; i < subTag.length; i++) {

								html += '<li><a href="#" title="' + subTag[i]
										+ '">' + subTag[i] + '</a></li>';
							}
							html += '</ul></div>';
						}

						html += '</div></div><div style="clear: both;"></div></div>';
						console.log(that.container);

						html += '<div class="asset-action clearfix">';
						var assetLikeDiv = '<div class="action-left" style="display:block;"><ul class="asset-like">';
						assetLikeDiv += '<li id="asset-like"><a href="#" title="Like"></a></li>'
								+ '<li id="asset-unlike"><a href="#" title="Unlike"></a></li></ul>'
								+ '<div class="likeOrDislikeText" style="display: none"></div>';

						var rateDiv = '<p>Rate this</p><div class="asset-rate"></div></div>';
						html += assetLikeDiv + rateDiv;

						/** comments * */
						var commentDiv = '<div class="action-right">';
						commentDiv += '<h3>Comments</h3><div class="asset-comments">';
						commentDiv += '<div class="comment-box"><span>'
								+ '<img src="../images/imgs/profile_icon.png" alt=""/></span><form action="#" method="post">'
								+ '<textarea name="comment" class="tag-comment" placeholder="Share your comments"></textarea>'
								+ '<input type="button" class="form-submit" value="save" /></form></div>'
								+ '</div><div class="comment-success" style="display:none;"></div></div></div>';

						/*
						 * var commentDiv = '<div class="comment_div">';
						 * commentDiv += '<div class="col-lg-12
						 * cls-sub-header1" id="dv_comments_header">Comments</div>';
						 * commentDiv += '<div class="col-lg-12"
						 * id="dvDiscuss">'; commentDiv += '<div
						 * class="publishContainer">'; //commentDiv += '<div
						 * class="comment">Comments</div>'; commentDiv += '<textarea
						 * class="msgTextArea" id="txtMessage" maxlength="100"
						 * onkeypress="assetPlay.onPostEntry()"
						 * onkeydown="assetPlay.onPostEntry()"
						 * onkeyup="assetPlay.onPostEntry()" data-bind="value:
						 * newMessage, jqAutoresize: {}" style="height: 3em;"
						 * placeholder="What\'s on your mind?"></textarea><p>(<span
						 * id="spnCntRemaining">100</span> characters
						 * remaining)</p>'; commentDiv += '<input
						 * type="button" data-url="/Wall/SavePost" value="Post"
						 * id="btnShare" data-bind="click: addPost">';
						 * commentDiv += ' </div>'; commentDiv += '<ul id="msgHolder" data-bind="foreach: posts">';
						 * commentDiv += ' <li class="postHolder">'; commentDiv += '<img
						 * class="img_post_header" data-bind="attr: { src:
						 * PostedByAvatar }"><p><a data-bind=" text:
						 * PostedByName"></a>: <span data-bind=" html:
						 * Message"></span></p>'; commentDiv += ' <div
						 * class="postFooter">'; commentDiv += ' <span
						 * class="timeago" data-bind="text: PostedDate"></span>&nbsp;<a
						 * class="linkComment" href="#" data-bind=" click:
						 * toggleComment">Comment</a>'; commentDiv += ' <div
						 * class="commentSection">'; commentDiv += '
						 * <ul data-bind="foreach: PostComments">'; commentDiv += '
						 * <li class="commentHolder">'; commentDiv += ' <img
						 * class="img_post_header" data-bind="attr: { src:
						 * CommentedByAvatar }"><p><a data-bind=" text:
						 * CommentedByName"></a>: <span data-bind=" html:
						 * Message"></span></p>'; commentDiv += ' <div
						 * class="commentFooter"><span class="timeago"
						 * data-bind="text: CommentedDate"></span>&nbsp;</div>';
						 * commentDiv += ' </li>'; commentDiv += '</ul>';
						 * commentDiv += ' <div style="display: block"
						 * class="publishComment">'; commentDiv += '<textarea
						 * maxlength="100" class="commentTextArea"
						 * data-bind="value: newCommentMessage, jqAutoresize:
						 * {}" placeholder="write a comment..."
						 * onkeypress="assetPlay.onCommentEntry(this)"
						 * onkeydown="assetPlay.onCommentEntry(this)"
						 * onkeyup="assetPlay.onCommentEntry(this)"></textarea>';
						 * commentDiv += ' <input type="button" value="Post"
						 * class="btnComment" data-bind="click: addComment" />';
						 * commentDiv += '</div>'; commentDiv += '</div>';
						 * commentDiv += '</div>'; commentDiv += '</li>';
						 * commentDiv += '</ul>'; commentDiv += '</div>';
						 * commentDiv += '</div>';
						 */

						html += commentDiv + '</div>';
						that.container.html(html);
						$(".comment-box span img").attr("src",
								eLearningAPP.currentUser.userImg).css("height",
								"65px");

						that.intiRating($('.asset-rate'), 0, true);

						/** view and download * */
						$('#asset-view').click(function(e) {
							eLearningAPP.playOrOpen(asset, function(progress) {
								eLearningAPP.showProgress(progress.progress);
							});
						});
						
						/** Tab section clicks **/
				        $('.tab_offline ul li').bind('click',function(){
				        	$( ".tab_offline ul li" ).removeClass("active_div");
							$(this).addClass("active_div");
							if(this.id == "Details_offline") {
								$('.desc-right, .action-left').css('display','block');
								$('.action-right').css('display','none');
							} else if(this.id == "Discuss_offline") {
								$('.desc-right, .action-left').css('display','none');
								$('.action-right').css('display','block');
							} /*else if(this.id == "Related") {
								$('.desc-right, .action-left, .comment_div').css('display','none');
								$('.categ-sec').css('display','block');*/
				        });
				        /** Tab section clicks **/

						/** Asset like or dislike * */
						var onAssetLikeCallback = that.onAssetLiked;
						var onAssetUnlikeCallback = that.onAssetUnliked;
						$('#asset-unlike a').click(function(e) {
							$(".likeOrDislikeText").show().html("Thank you for Like/Dislike");
									$(".asset-like").addClass('hidden');
									onAssetUnlikeCallback(asset);
									return false;
								});

						$('#asset-like a').click(function(e) {
							$(".likeOrDislikeText").show().html("Thank you for Like/Dislike");
									$(".asset-like").addClass('hidden');
									onAssetLikeCallback(asset);
									return false;
						});
						
						/*new back button*/
				        //$('.bread-crum').append('<li style="width:50px;"><span class="back-detail">Back</span></li>');
				        $('.back-detail').unbind('click').bind('click', function () {
				            $('.asset-detail').hide(); $(this).remove();
				            var viewState = $('.asset-menu li a:visible');
				            $('.asset-holder').show();
				            $('.bottom-sec').css('display','block');
				            $('body').addClass('bg-wood');
				        });
				        /*$('.back-detail').unbind('click').bind('click', function () {
				            window.location.reload();
				        });*/
				        /*new back button end*/
						
				        $('.desc-cont-tags ul li a').bind('click',function() {
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

							saveTagText.click(function(e) {
										e.stopPropagation();
										var comments = tagTextArea.val();
										if (comments != null&& comments.trim() != "") {
											// that.showMessage(comments);
											$('.comment-success').show().html('Thanks for sharing your comments');
											tagTextArea.val('').empty();
											tagTextArea.attr('placeholder','Share your comments');
											that.settings.onSaveComments(asset,comments);
										} else {
											alert("Please enter your comments and try saving again");
										}
									});
						}
						that.container.show();
					});

};

AssetDetail.prototype.showMessage = function(comment) {

	var cHtml = '<li class="comment-item"><div class="comment-desc"><h4>'
			+ userNameWeb_g +

			'</h4><h5>' + new Date() + '</h5><p>' + comment + '</p></div></li>';

	$('.comments ul').append(cHtml);
}

// UI Components ends
var resource = {
	assetDownloadFolder : "Kangle/assets",
	assetCategoryFolder : "Kangle/categoryIcons",
	alreadyDownloaded : "Asset already downloaded.",
	courseFolder : "Kangle/test",
	logoFolder : "Kangle/companyLogo",
	//nomediaFolder : "Kangle/nomedia",
	logoFileName : "companyLogo.jpg",
	defaultLogoPath : "../images/EL/logo.png",
	assetBaseFolder : "Kangle",
	tagSeparator : "#",
	correlationId : 1,
	networkMessage : {
		video : "Video cannot be played as the internet connection is not available",
		document : "Document cannot be opened as the internet connection is not available",
		noNetwork : "Your device is not connected to the internet. Please connect to the internet and retry the operation"
	},
	login : {
		failed : 'Login failed, please try again!',
		failedNetwork: 'Unable to connect to internet, please check your network connectivity or some security app is blocking from network connectivity.'
	},

	ssoDetail : {
		reasonId : 2,
		appSuiteId : 1,
		appId : 3,
		appPlatForm : "ANDROID"
	},
	download : {
		tempFolder : "eLearning/temp",
		categoryImageFormat : "jpg",
		logoFormat : "jpg"
	},
	// onlineURL
	onlineURL : "http://" + DOMAIN + "/",
	
	userValidationMessage : "You are not an authorised user.",
	timeoutErrorMessage : "Error connecting to the server, please try again",
	application : {
		version : "2",
		release : "9",
		upToDate : "You have the latest version of APP",
		upgradingMessage : "Please wait, upgrading application...",
		upgradeAlertMessage : 'A newer version of APP is available. Please click on "Upgrade APP" to get the latest version',
		upgradeOption : "Upgrade APP"
	},
	confirmationBox : {
		title : "Confirm",
		yes : "yes",
		no : "no",
		deleteAssetMessage : "Are you sure you want to delete this Asset ?",
		message : "Resetting Kangle would result in loss of data and you will no longer be able to access the digital documents. Are you sure you want to continue?",
		/*
		 * message : "This action will erase all the digital assets that you
		 * have downloaded and stored in your memory card. If you need the
		 * digital assets you should download them again. Do you want to
		 * continue?", //As per CR Jul 10.
		 */
		messageUpSynchOnline : "You have clicked on Reset. This action will clear all your personal data from Kangle and reset the login. If you intended to log off, you do not have to do anything, please minimize the application. Are you sure you want to reset the device?",
		messageUpSynchOffline : "You have some important data not uploaded to central data center and your  not in online also.So you are not able to upload those data. Please connect to the internet and upload the data before Format Device"
	}

};

// Elearning specific serviices and DAOs

var assetService = {
	insertAssetBilling : function(context, assetBilling, success, failure) {
		assetBilling.daBillingId = UUIDUtil.getUID();
		var daBillingId = assetBilling.daBillingId;
		digitalAssetBillingLocalDAO.insert(assetBilling,
				function(assetBilling) {
					success(daBillingId);
				}, failure);
	},

	updateAssetBilling : function(assetBilling, success, failure) {
		digitalAssetBillingLocalDAO.update(assetBilling, success, failure);
	},

	saveAssetDetailsAndAnalyticsHistory : function(assetDetails,
			daAnalyticsHistory, success, failure) {
		assetService.saveAssetDetails(assetDetails, function(data) {
			assetService.saveOrUpdateAnalyticalHistory(daAnalyticsHistory,
					success, failure);
		}, function(data) {
		});
	},

	saveAssetDetails : function(assetDetails, success, failure) {
		// alert(JSON.stringify(assetDetails));
		digitalAssetLocalDAO.get(assetDetails.daCode, function(returnedAsset) {
			// alert(JSON.stringify(returnedAsset));
			if (returnedAsset != null) {
				digitalAssetLocalDAO.update(assetDetails, success, failure);
			} else {
				digitalAssetLocalDAO.insert(assetDetails, success, failure);
			}
		}, function(data) {
		});
	},

	saveOrUpdateAnalyticalHistory : function(daAnalyticsHistory, success,
			failure) {
		daAnalyticHistoryLocalDAO.getByAsset(daAnalyticsHistory.daCode,
				function(analyticsHistory) {
					if (analyticsHistory != null) {
						daAnalyticHistoryLocalDAO.update(null,
								daAnalyticsHistory, success, failure);
					} else {
						daAnalyticHistoryLocalDAO.insert(daAnalyticsHistory,
								success, failure);
					}

				}, function(data) {
				});
	},

	populateAssetBilling : function(user, position, asset, success, failure) {
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
				companyCode : user.companyCode,
				daCode : asset.daCode,
				userCode : user.userCode,
				userName : user.userName,
				regionCode : user.regionCode,
				regionName : user.regionName,
				divisionCode : user.divisionCode,
				divisionName : user.divisionName,
				dateTime : new Date(),
				offlineClick : offline,
				downloaded : 0,
				onlinePlay : online,
				latitude : position.latitude,
				longitude : position.longitude
			};
			this.insertAssetBilling(this, assetBilling, function(daBillingId) {
				success(daBillingId);
			}, function(data) {
			});

		} else {
			success({});
		}
	},

	persistAnalytics : function(analytics, success, failure) {
		if (analytics instanceof Array != true) {
			analytics.daTagAnalyticId = UUIDUtil.getUID();
		}
		if (eLearningAPP.currentUser != null) {
			if (analytics instanceof Array) {
				$.each(analytics, function(i, analytic) {
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
		daTagAnalyticLocalDAO.insert(analytics, function(data) {
			success(analytics.daTagAnalyticId);
		}, function() {
		});
	},
	insertReadAnalytics: function(daCode, success, failure) {
		DigitalAssetAnalytics.get(daCode, function(data){
    		if(data == null || data.length == 0) {
    			var userInfo = JSON.parse(window.localStorage.getItem("user"));
    			var daHistory = {
					daCode: daCode,
					companyId: userInfo.companyId,
					userId: userInfo.userId,
					regionCode: userInfo.regionCode,
					isRead: true
    			};
    			DigitalAssetAnalytics.insert(daHistory, function(){
    				if(success) success();
    			}, function(){
    				if(success) success();
    			});
    		} else {
    			if(success) success();
    		}
    	}, function(){
    		if(success) success();
    	});
	}
};
// SynchronizeLocalDAO starts here

var assetMetaTagLocalDao = {

	metadata : {
		"tableName" : "tbl_DIGASSETS_METADATA",
		"columns" : [ {
			name : "category",
			columnName : "category"
		}, {
			name : "metaTag",
			columnName : "meta_tag",
			pk : true
		}, {
			name : "subTag",
			columnName : "sub_tag",
			pk : true
		}, {
			name : "tagCount",
			columnName : "Tag_Count"
		}, ]
	},
	insert : function(metaTag, success, failure) {
		coreDAO.insert(this, metaTag, success, failure);
	},

	update : function(metaTag, success, failure) {
		coreDAO.update(this, metaTag, success, failure);
	},

	get : function(metaTag, subTag, success, failure) {
		var criteria = {};
		criteria.metaTag = metaTag;
		criteria.subTag = subTag;
		var result = null;
		coreDAO.getEquals(this, criteria, function(data) {
			if (data.length > 0) {
				result = data[0];
				console.log('result in metaTag' + JSON.stringify(result));
			} else {
				result = null;
			}
			success(result);
		}, failure);
	},

	getAll : function(success, failure) {
		var result = null;
		coreDAO.getEquals(this, null, function(data) {
			if (data.length > 0) {
				result = data;
			} else {
				result = null;
			}
			success(result);
		}, failure);
	},
	remove : function(metaTag, subTag, success, failure) {
		var criteria = {};
		criteria.metaTag = metaTag;
		criteria.subTag = subTag;
		coreDAO.remove(this, criteria, success, failure);
	},
	getMetaTags : function(success, failure) {
		var query = 'Select category, Meta_Tag, SUM(Tag_Count) as Tag_Count from tbl_DIGASSETS_METADATA Group By category, Meta_Tag';
		coreDAO.executeCustomQuery(this, query, null, success, failure);
	},
	getTaggedAssets : function(success, failure) {
		var query = 'Select category, Meta_Tag, Sub_Tag, sum(Tag_Count) as Tag_Count from tbl_DIGASSETS_METADATA Group By Sub_Tag';
		coreDAO.executeCustomQuery(this, query, null, success, failure);
	},
	getAssetsByTag : function(tagName, success, failure) {
		var criteria = {};
		criteria.subTag = tagName;
		var result = null;
		coreDAO.getEquals(this, criteria, function(data) {
			if (data.length > 0) {
				result = data[0];
				console.log('result in metaTag' + JSON.stringify(result));
			} else {
				result = null;
			}
			success(result);
		}, failure);
	},
	getSubTags : function(metaTag, success, failure) {
		var query = "Select Sub_Tag, Tag_Count from tbl_DIGASSETS_METADATA Where Meta_Tag = '"
				+ metaTag + "' Group By Sub_Tag";
		coreDAO.executeCustomQuery(this, query, null, success, failure);
	},

	clean : function(context, data, success, failure) {
		assetMetaTagLocalDao.remove(null, null, success, failure);
	}

};
var metaTagService = {
	saveMetaTag : function(metaTag, subTag, success, failure) {
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

		this
				.saveOrUpdateTagDetails(category, metaTag, subTag, success,
						failure);
	},

	saveOrUpdateTagDetails : function(category, metaTag, subTag, success,
			failure, index) {
		if (index == null) {
			index = 0;
		}
		if (index < metaTag.length) {
			var singleMetaTag = metaTag[index];
			assetMetaTagLocalDao
					.get(
							singleMetaTag,
							subTag,
							function(returnTag) {
								if (returnTag != null) {
									returnTag.tagCount = parseInt(returnTag.tagCount) + 1;
									assetMetaTagLocalDao
											.update(
													returnTag,
													function(data) {
														index++;
														metaTagService
																.saveOrUpdateTagDetails(
																		category,
																		metaTag,
																		subTag,
																		success,
																		failure,
																		index);
													}, failure);

								} else {
									returnTag = {};
									returnTag.category = category;
									returnTag.metaTag = singleMetaTag;
									returnTag.subTag = subTag;
									returnTag.tagCount = 1;
									assetMetaTagLocalDao
											.insert(
													returnTag,
													function(data) {
														index++;
														metaTagService
																.saveOrUpdateTagDetails(
																		category,
																		metaTag,
																		subTag,
																		success,
																		failure,
																		index);
													}, failure);

								}
							}, failure);
		} else {
			success();
		}
	},

	removeOrUpdateMetaTag : function(metaTag, subTag, success, failure) {
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
		this.updateOrRemoveTagDetails(category, metaTag, subTag, success,
				failure);
	},

	updateOrRemoveTagDetails : function(category, metaTag, subTag, success,
			failure, index) {
		if (index == null) {
			index = 0;
		}
		if (index < metaTag.length) {
			var singleMetaTag = metaTag[index];
			assetMetaTagLocalDao
					.get(
							singleMetaTag,
							subTag,
							function(returnTag) {
								if (returnTag != null && returnTag.tagCount > 1) {
									returnTag.tagCount = parseInt(returnTag.tagCount) - 1;
									assetMetaTagLocalDao
											.update(
													returnTag,
													function(data) {
														index++;
														metaTagService
																.updateOrRemoveTagDetails(
																		category,
																		metaTag,
																		subTag,
																		success,
																		failure,
																		index);
													}, failure);

								} else {
									assetMetaTagLocalDao
											.remove(
													singleMetaTag,
													subTag,
													function(returnTag) {
														index++;
														metaTagService
																.updateOrRemoveTagDetails(
																		category,
																		metaTag,
																		subTag,
																		success,
																		failure,
																		index);
													}, failure);

								}
							}, failure);
		} else {
			success();
		}
	}

};

// UserLocalDAO starts here

var userLocalDAO = {

	metadata : {
		"tableName" : "tbl_User_Info",
		"columns" : [ {
			name : "companyCode",
			columnName : "Company_Code"
		}, {
			name : "userId",
			columnName : "User_Id"
		}, {
			name : "userName",
			columnName : "User_Name"
		}, {
			name : "password",
			columnName : "Password"
		}, {
			name : "blobUrl",
			columnName : "Blob_URL"
		}, {
			name : "url",
			columnName : "URL"
		}, {
			name : "userCode",
			columnName : "User_Code",
			pk : true
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
			name : "userTypeCode",
			columnName : "User_Type_Code"
		}, {
			name : "userTypeName",
			columnName : "User_Type_Name"
		}, {
			name : "regionHierarchy",
			columnName : "Region_Hierarchy"
		}, {
			name : "lastSyncDate",
			columnName : "Last_Sync_Date"
		}, {
			name : "ssoId",
			columnName : "SSO_Id"
		}, {
			name : "pushRegId",
			columnName : "PUSH_REG_ID"
		}, {
			name : "supportEmail",
			columnName : "Support_Email"
		}, {
			name : "supportPhone",
			columnName : "Support_Phone_Number"
		}, {
			name : "companyId",
			columnName : "Company_Id"
		} ]
	},

	insert : function(user, success, failure) {
		// alert('insert');
		userLocalDAO.remove(null);
		coreDAO.insert(this, user, success, failure);
	},

	update : function(user, success, failure) {
		coreDAO.update(this, user, success, failure);
	},

	remove : function(userCode, success, failure) {
		var criteria = {};
		criteria.userCode = userCode;
		return coreDAO.remove(this, criteria, success, failure);
	},

	get : function(success, failure) {
		coreDAO.getEquals(this, null, function(users) {
			var result = null;
			if (users.length > 0) {
				result = users[0];
			}
			success(result);
		}, failure);

	},

	clean : function(context, data, success, failure) {
		userLocalDAO.remove(null, success, failure);
	}
};
// UserLocalDAO ends here

// DigitalAssetLocalDAO starts here
var digitalAssetLocalDAO = {
	metadata : {
		"tableName" : "tbl_DIGASSETS_MASTER",
		"columns" : [ {
			name : "productCode",
			columnName : "Product_Code"
		}, {
			name : "daCode",
			columnName : "DA_Code",
			pk : true
		}, {
			name : "fileUploadDateTime",
			columnName : "DA_FileUploadDateTime"
		}, {
			name : "downloadDateTime",
			columnName : "DA_DownloadDateTime"
		}, {
			name : "mode",
			columnName : "Mode"
		}, {
			name : "name",
			columnName : "DAName"
		}, {
			name : "offLineOutPutId",
			columnName : "OfflineOutPutId"
		}, {
			name : "onLineOutPutId",
			columnName : "OnlineOutPutId"
		}, {
			name : "onlineURL",
			columnName : "OnlineURL"
		}, {
			name : "offLineURL",
			columnName : "OffLineURL"
		}, {
			name : "lastFileUpdatedTimeStamp",
			columnName : "LastFileUpdatedTimeStamp",
			isDate : true
		}, {
			name : "lastTagUpdatedTimeStamp",
			columnName : "LastTagUpdatedTimeStamp",
			isDate : true
		}, {
			name : "downloaded",
			columnName : "Downloaded"
		}, {
			name : "downloadedFileName",
			columnName : "DownloadedFileName"
		}, {
			name : "downloadedThumbnail",
			columnName : "DownloadedThumbnail"
		}, {
			name : "documentType",
			columnName : "DocumentType"
		}, {
			name : "downloadable",
			columnName : "IsDownloadable"
		}, {
			name : "thumbnailURL",
			columnName : "ThumnailURL"
		}, {
			name : "description",
			columnName : "DA_Description"
		}, {
			name : "metaTag1",
			columnName : "MetaTag_One"
		}, {
			name : "fileSize",
			columnName : "DB_Size_In_MB"
		}, {
			name : "metaTag2",
			columnName : "MetaTag_Two"
		} ]
	},

	insert : function(asset, success, failure) {
		JSON.stringify("asset inserted : " + JSON.stringify(asset));
		coreDAO.insert(this, asset, success, failure);
	},

	update : function(asset, success, failure) {
		JSON.stringify("asset updated : " + JSON.stringify(asset));
		// alert(JSON.stringify(asset));
		coreDAO.update(this, asset, success, failure);
	},

	remove : function(daCode, success, failure) {
		var criteria = {};
		criteria.daCode = daCode;
		coreDAO.remove(this, criteria, success, failure);
	},

	clean : function(context, data, success, failure) {
		digitalAssetLocalDAO.remove(null, success, failure);
	},

	get : function(daCode, success, failure) {
		var criteria = {};

		criteria.daCode = daCode;
		var result = null;
		coreDAO.getEquals(this, criteria, function(data) {
			if (data.length > 0) {
				result = data[0];
			} else {
				result = null;
			}
			success(result);
		}, failure);
	},
	getByTag : function(metaTag1, metaTag2, success, failure) {

		var criteria = {};
		if (metaTag1 != null)
			criteria.metaTag1 = metaTag1;
		criteria.metaTag2 = metaTag2;
		var result = null;
		coreDAO.getLike(this, criteria, function(data) {
			if (data.length > 0) {
				result = data;
			} else {
				result = null;
			}
			success(result);
		}, failure);
	},

	getByCode : function(daCode, success, failure) {
		var criteria = {};
		criteria.daCode = daCode;
		coreDAO.getEquals(this, criteria, function(data) {
			if (data.length > 0) {
				result = data[0];
			} else {
				result = null;
			}
			success(result);
		}, failure);
	},

	getAll : function(success, failure) {
		coreDAO.getEquals(this, {}, success, failure);
	},

	getAssetURL : function(correlationId, companyCode, userCode, onlineURL,
			networkType) {
		// alert("getAsset url");
		var data = {
			userCode : userCode,
			url : onlineURL,
			networkType : networkType
		};

		var context = [ correlationId, companyCode, 'WebAPI', 'getSecreatAuth' ];
		var result = "";
		CoreREST.post(this, context, data, function(data) {
			result = data;
			console.log(result);
		}, function(data) {
		});
		return result;
	},

	getByOutputId : function(onLineOutPutId, success, failure) {
		alert('get by getByOutputId  - ' + onLineOutPutId + ' type '
				+ typeof onLineOutPutId);
		var criteria = {};
		criteria.onLineOutPutId = onLineOutPutId.toString();
		coreDAO.getEquals(this, criteria, function(result) {
			if (result != null && result.length > 0) {
				success(result[0]);
			} else {
				success(null);
			}
		}, failure);

	},
	getLike : function(searchString, success, failure) {
		var criteria = {};
		criteria.DAName = searchString;
		var query = "SELECT * FROM " + this.metadata.tableName
				+ " WHERE DAName LIKE \"%" + searchString + "%\"";
		coreDAO.executeCustomQuery(this, query, null, function(result) {
			if (result != null && result.length > 0) {
				success(result);
			} else {
				success(null);
			}
		}, function(e) {
		});

	}
};

var daTagAnalyticLocalDAO = {

	metadata : {
		"tableName" : "tbl_DA_Tag_Analytics",
		"columns" : [ {
			name : "daTagAnalyticId",
			columnName : "DA_Tag_Analysic_Id",
			pk : true
		}, {
			name : "companyCode",
			columnName : "Company_Code"
		}, {
			name : "companyId",
			columnName : "Company_Id"
		}, {
			name : "daCode",
			columnName : "DA_ID"
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
			name : "dateTime",
			columnName : "DateTime",
			isDate : true
		}, {
			name : "like",
			columnName : "Like"
		}, {
			name : "dislike",
			columnName : "Disike"
		}, {
			name : "rating",
			columnName : "rating"
		}, {
			name : "tagDescription",
			columnName : "Tag_Description"
		} ]
	},

	insert : function(daAnalytics, success, failure) {
		daAnalytics.companyId = window.localStorage.getItem("companyId");
		coreDAO.insert(this, daAnalytics, success, failure);
	},
	getCount : function(success, failure) {
		coreDAO.getEquals(this, {}, function(daTagAnalytics) {
			console.log('inside get analytics : '
					+ JSON.stringify(daTagAnalytics));
			if (daTagAnalytics != null && daTagAnalytics.length > 0) {
				success(daTagAnalytics.length);
			} else {
				success(0);
			}
		}, failure);
	},

	remove : function(daTagAnalyticId, success, failure) {
		var criteria = {};
		criteria.daTagAnalyticId = daTagAnalyticId;
		coreDAO.remove(this, criteria, success, failure);
	},

	clean : function(success, failure) {
		daTagAnalyticLocalDAO.remove(null, success, failure);
	},

	syncGet : function(params, success, failure) {
		// alert(JSON.stringify(params));
		var daTagAnalyicRecords = [];
		var columns = [ {
			name : "companyCode",
			columnName : "Company_Code"
		}, {
			name : "daCode",
			columnName : "DA_ID"
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
			name : "dateTime",
			columnName : "DateTime",
			isDate : true
		}, {
			name : "like",
			columnName : "Like"
		}, {
			name : "dislike",
			columnName : "Disike"
		}, {
			name : "rating",
			columnName : "rating"
		}, {
			name : "tagDescription",
			columnName : "Tag_Description"
		}, {
			name : "companyId",
			columnName : "Company_Id"
		} ];

		coreDAO.getEquals(this, {}, function(daTagAnalytics) {
			$.each(daTagAnalytics, function(index, daTagAnalyic) {
				daTagAnalyic.companyId = window.localStorage.getItem("companyId");
				var tagDetails = eLearningAPP.formatDataForSync(daTagAnalyic,
						columns);
				var daTagAnalyicRecord = {
					daTagAnalyticId : daTagAnalyic.daTagAnalyticId,
					correlationId : params.correlationId,
					companyCode : params.companyCode,
					compnayId : window.localStorage.getItem("companyId"),
					userCode : params.userCode,
					tagDetails : tagDetails
				};
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
		}, {
			name : "companyId",
			columnName : "Company_Id"
		} ];

		coreDAO.getEquals(this, {}, function(daBillingDetails) {

			$.each(daBillingDetails, function(index, daBillingDetail) {
				daBillingDetail.companyId = window.localStorage.getItem("companyId");
				var elItemizedBillingDetails = eLearningAPP.formatDataForSync(
						daBillingDetail, columns);
				var daBillingRecord = {
					correlationId : params.correlationId,
					companyCode : params.companyCode,
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

var AssetDownloader = {
	downloadFile : function(asset, downloadProgress, success, failure) {
		AssetDownloader.progressCallbackMethod = downloadProgress;
		if (AssetDownloader.progressCallbackMethod == null
				|| typeof AssetDownloader.progressCallbackMethod != 'function') {
			AssetDownloader.progressCallbackMethod = function(progress) {
			};
		}
		var ext = "mp4";
		var assetURLSplit = asset.offLineURL.split(".");
		if (assetURLSplit != null && assetURLSplit.length > 0) {
			ext = assetURLSplit.pop();
		}
		var fileName = "DA_" + asset.daCode + "." + ext;
		var assetFolder = resource.assetDownloadFolder;
		var downloadedFileName = assetFolder + "/" + fileName;
		if (asset.downloaded == 'Y'
				&& downloadedFileName == asset.downloadedFileName
				&& fileUtil.checkIfFileExists(asset.downloadedFileName)) {
			alert(resource.alreadyDownloaded + fileName);
			return;
		} else {
			var downloaderUtil = new Downloader();
			AssetDownloader.progressCallbackMethod({
				progress : 0
			});
			downloaderUtil
					.downloadFile(
							asset.offLineURL,
							assetFolder,
							fileName,
							{},
							function(progressStatus) {
								if (isNaN(progressStatus.progress)) {
									AssetDownloader
											.progressCallbackMethod(progressStatus);
								} else {
									if (progressStatus.progress == 100) {
										progressStatus.progress = 50;
										AssetDownloader
												.progressCallbackMethod(progressStatus);
										asset.downloadedFileName = downloadedFileName;
										asset.downloaded == 'Y';
										AssetDownloader.downloadThumbnail(
												asset, downloadProgress,
												success, failure);
									} else {
										progressStatus.status = "ASSET_DOWNLOADING";
										if (progressStatus.progress % 2 == 0) {
											var progress = progressStatus.progress / 2;
											progressStatus.progress = progress;
											AssetDownloader
													.progressCallbackMethod(progressStatus);
										}
									}
								}
							});
		}
	},

	downloadThumbnail : function(asset, downloadProgress, success, failure) {
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
		if (downloadedThumbnail == asset.downloadedThumbnail
				&& fileUtil.checkIfFileExists(downloadedThumbnail)) {
			asset.downloaded = "Y";
			AssetDownloader.makeAssetAsOffline(asset, function(data) {
				success(asset);
			}, failure);
		} else {
			asset.downloadedThumbnail = downloadedThumbnail;
			var downloaderUtil = new Downloader();
			downloaderUtil
					.downloadFile(
							asset.thumbnailURL,
							assetFolder,
							fileName,
							{},
							function(progressStatus) {
								if (isNaN(progressStatus.progress)) {
									AssetDownloader
											.progressCallbackMethod(progressStatus);
								} else {
									if (progressStatus.progress == 100) {
										progressStatus.status = "THUMBNAIL_DOWNLOADED";
										asset.downloaded = "Y";
										AssetDownloader
												.makeAssetAsOffline(
														asset,
														function(returnedAsset) {
															AssetDownloader
																	.progressCallbackMethod({
																		progress : 100
																	});
															success(returnedAsset);
														}, failure);
										// AssetDownloader.downloadAssetCategoryIcon(asset,
										// success, failure);
									} else {
										if (progressStatus.progress % 2 == 0) {
											var progress = (50) + (progressStatus.progress / 2);
											progressStatus.progress = progress;
											AssetDownloader
													.progressCallbackMethod(progressStatus);
										}
									}
								}
							});
		}
	},

	downloadAssetCategoryIcon : function(asset, success, failure) {
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
		if (fileUtil.checkIfFileExists(downloadedThumbnail) == false) {
			var downloaderUtil = new Downloader();
			var ext = resource.download.categoryImageFormat;
			var categoryUrl = assetCategoryService.getCategoryURL(asset);
			var categoryURLSplit = categoryUrl.split(".");
			if (categoryURLSplit != null) {
				ext = categoryURLSplit.pop();
			}
			var fileName = category + "." + ext;
			downloaderUtil.downloadFile(categoryUrl, assetFolder, fileName, {},
					function(progressStatus) {
						if (progressStatus.progress == 100) {
							AssetDownloader.progressCallbackMethod({
								progress : 90
							});
							AssetDownloader.makeAssetAsOffline(asset, success,
									failure);
						}
					});
		} else {
			AssetDownloader.makeAssetAsOffline(asset, function(data) {
				AssetDownloader.progressCallbackMethod({
					progress : 100
				});
				success(asset);
			}, failure);
		}
	},

	makeAssetAsOffline : function(asset, success, failure) {
		digitalAssetLocalDAO.update(asset, function(data) {
			AssetDownloader.progressCallbackMethod({
				progress : 100
			});
			success(asset);
		}, failure);
	}
};

function hideMenu() {
	$('#menu-panel').animate({
		left : '-330px'
	}, 200, function() {
		$('#menu-panel').removeClass('show');
	});
	$('.right-sec').animate({
		'left' : '0px'
	}, 200, function() {
		$('.wrapper').css({
			'height' : 'auto',
			'overflow' : '',
			'position' : ''
		});
	});
}

// common function for alphabetical order sorting
function sortByKey(array, key) {
	var uniqueTags = {};
	var totalArray = new Array();
	if (key == 'subTag') {
		for (var i = 0; i <= array.length - 1; i++) {
			var tmpArray = new Array();
			var tAry = $.extend(true, {}, array[i]);
			var subTagSplit = tAry.subTag.split(',');
			for (var j = 0; j <= subTagSplit.length - 1; j++) {
				// alert(subTagSplit[j]);
				tAry['subTag'] = subTagSplit[j];
				var nAry = $.extend(true, {}, tAry);
				if (uniqueTags[subTagSplit[j]] == null) {
					// tmpArray.push(nAry);
					uniqueTags[subTagSplit[j]] = nAry;
				} else {
					uniqueTags[subTagSplit[j]]["tagCount"] = (uniqueTags[subTagSplit[j]]["tagCount"])
							+ nAry['tagCount'];

				}
			}
			// totalArray = totalArray.concat(tmpArray);
		}
		totalArray = new Array();
		for ( var uniqueTag in uniqueTags) {
			totalArray.push(uniqueTags[uniqueTag]);
		}
	} else {
		totalArray = array;
	}
	return totalArray.sort(function(a, b) {
		var x = a[key].toLowerCase();
		var y = b[key].toLowerCase();
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}
/*
 * function sortByKey(array, key) { return array.sort(function (a, b) { var x =
 * a[key].toLowerCase(); var y = b[key].toLowerCase(); return ((x < y) ? -1 :
 * ((x > y) ? 1 : 0)); }); }
 */

// Device utilities
var coreView = {
	geoPosition : {
		latitude : 0,
		longitude : 0
	},
	context : {},

	getAssetURL : function(asset, success) {
		var assetURL = null;
		var user = eLearningAPP.currentUser;
		digitalAssetLocalDAO.get(asset.daCode, function(returnAsset) {
			if (returnAsset != null) {
				fileUtil.getFileEntry(returnAsset.downloadedFileName, function(
						fileEntry) {
					if (fileEntry != null) {
						assetURL = fileEntry.nativeURL;
						success(assetURL);
					} else {
						assetURL = asset.onlineURL;
						success(assetURL);
					}
				});

			} else {
				assetURL = asset.onlineURL;
				success(assetURL);
			}
		});
	},

	getCategoryIconURL : function(category) {
		var iconUrl = null;
		if (category != null) {
			var categoryIconUrl = resource.assetCategoryFolder + '/' + category
					+ '.' + resource.download.categoryImageFormat;
			var fileEntry = fileUtil.getFileEntry(categoryIconUrl);
			if (fileEntry != null) {
				iconUrl = fileEntry.fullPath;
			}
			return iconUrl;
		} else {
			return iconUrl;
		}
	},

	getThumbnailURL : function(asset, onSuccess) {

		var thumbnailURL = null;
		try {
			if (coreNET.isConnected()) {
				thumbnailURL = asset.thumbnailURL;
				if (onSuccess)
					onSuccess(thumbnailURL);
			} else {
				digitalAssetLocalDAO
						.get(
								asset.daCode,
								function(returnAsset) {
									if (returnAsset != null) {
										fileUtil
												.getFileEntry(
														returnAsset.downloadedThumbnail,
														function(fileEntry) {

															if (fileEntry != null) {
																thumbnailURL = fileEntry.nativeURL;
																if (onSuccess)
																	onSuccess(thumbnailURL);
															} else {
																if (asset.documentType == 'VIDEO') {
																	thumbnailURL = "../images/EL/offlineThumnailVideo.png";
																} else {
																	thumbnailURL = "../images/EL/offlineThumnail.png";
																}
																if (onSuccess)
																	onSuccess(thumbnailURL);
															}
														});
									} else {
										if (asset.documentType == 'VIDEO') {
											thumbnailURL = "../images/EL/offlineThumnailVideo.png";
										} else {
											thumbnailURL = "../images/EL/offlineThumnail.png";
										}
										if (onSuccess)
											onSuccess(thumbnailURL);
									}
								},
								function(e) {
									if (asset.documentType == 'VIDEO') {
										thumbnailURL = "../images/EL/offlineThumnailVideo.png";
									} else {
										thumbnailURL = "../images/EL/offlineThumnail.png";
									}
									if (onSuccess)
										onSuccess(thumbnailURL);
								});

			}
		} catch (exception) {
			thumbnailURL = asset.thumbnailURL;
			if (onSuccess)
				onSuccess(thumbnailURL);

		}
	},

	initializeGeoPosition : function() {
		navigator.geolocation.getCurrentPosition(successFunction,
				errorFunction, {
					enableHighAccuracy : true,
					maximumAge : 30000,
					timeout : 5000
				});
		function successFunction(position) {

			coreView.geoPosition = {
				latitude : position.coords.latitude,
				longitude : position.coords.longitude
			};
		}
		function errorFunction(position) {
			coreView.geoPosition = {
				latitude : 0,
				longitude : 0
			};
		}
	},

	getGeoPosition : function(afterGeoGot) {
		afterGeoGot(coreView.geoPosition);
	},

	showLoading : function(message) {
		if (message == null && message == "undefined") {
			message = "Loading...";
		}
		var div = $("#loading");
		if (div.length == 0) {
			div = $("<div id='loading' style='background-color:white;color:black;width:100px;text-align:center;z-index:9990;display:none'>"
					+ message + "</div>");
			$(document.body).append(div);
		}
		div.screenCenter();
		div.show();
	},

	hideLoading : function() {
		$("#loading").hide();
	}
};

jQuery.fn.screenCenter = function() {

	this.css("position", "absolute");
	this.css("top", Math.max(0,
			(($(window).height() - $(this).outerHeight()) / 2)
					+ $(window).scrollTop())
			+ "px");
	this.css("left", Math.max(0,
			(($(window).width() - $(this).outerWidth()) / 2)
					+ $(window).scrollLeft())
			+ "px");
	return this;
};

jQuery.fn.screenVirticalCenter = function() {
	this.css("position", "absolute");
	this.css("left", Math.max(0,
			(($(window).height() - $(this).outerHeight()) / 2)
					+ $(window).scrollTop())
			+ "px");
	this.css("top", Math.max(0,
			(($(window).height() - $(this).outerWidth()) / 2)
					+ $(window).scrollLeft())
			+ "px");
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
	isConnected : function() {
		try {
			var connectionType = navigator.network.connection.type;
			if (connectionType == Connection.NONE
					|| connectionType == Connection.UNKNOWN) {
				return false;
			} else {
				return true;
			}
		} catch (ex) {
			return true;
		}

	},

	getNetworkType : function() {
		return navigator.network.connection.type.toUpperCase();
	}
};

// coreNet ends and utils starts here

var fileUtil = {
	fileObject : null,

	deleteDirectory : function(directoryName, success, failure) {
		fileUtil.getDirectoryEntry(directoryName, function(directoryEntry) {
			if (directoryEntry != null) {
				directoryEntry
						.removeRecursively(successCallback, errorCallback);
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
		}, function(e) {
			failure(true);
		});
	},

	getDirectoryEntry : function(directoryName, success, failure) {
		var dirEntry = null;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
		function gotFS(fileSystem) {
			fileSystem.root.getDirectory(directoryName, {
				create : false,
				exclusive : false
			}, onGetDirectorySuccess, function(e) {
				failure(e);
			});
		}
		function onGetDirectorySuccess(dir) {
			if (dir.isDirectory) {
				dirEntry = dir;
			}
			success(dirEntry);
		}
		function fail(e) {
			failure(e);
		}
	},
	getFileSize : function(fileName) {
		var fileEntry = this.getFileEntry(fileName);
		var file = this.getFileFromFileEntry(fileEntry);
		if (file != null) {
			var size = 0;
			size = (file.size / 1024);
			size = size / 1024;
			return size.toFixed(2);
		} else {
			return 0;
		}

	},

	deleteFile : function(fileName, success, failure) {
		console.log('file name to be deleted ' + fileName);
		// var fileEntry=
		// alert('del util');
		fileUtil.getFileEntry(fileName, function(fileEntry) {
			// alert('file ent');
			if (fileEntry != null) {
				console.log('got file entry->' + fileEntry.fullPath);
				// alert('bf rem');
				fileEntry.remove(function() {
					// alert('af rem');
					success(true);
				}, function(e) {
					failure();
				});
			} else {
				console.log('no file entry found');
				success(false);
			}
		}, failure);
		// return true;
	},
	checkIfFileExists : function(path, success, fail) {
		if ((typeof path == 'undefined')) {
			path = '';
		}
		var fileExists = false;
		/*
		 * try { window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		 * function(fileSystem){ fileSystem.root.getFile(path, { create: false },
		 * function(fileEntry){ if(fileEntry != null){ fileExists = true;
		 * success(fileEntry); } }, function (fileEntry){ fileExists = false;
		 * fail(); }); }, function (fileEntry){ fileExists = false; fail(); }); }
		 * catch (e) { // TODO: handle exception }
		 */

		try { 
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) { 
				fileSystem.root.getFile(path, { create: false }, function(fileEntry){ 
					if(fileEntry != null){ 
						fileExists = true;
						success(fileEntry); 
					} 
				}, function (fileEntry){ 
					fileExists = false;
					fail(); 
				}); 
			}, function (fileEntry){
				fileExists = false; 
				fail(); 
			});
		} catch (e) { 
			// TODO: handle exception 
			fail(); 
		}
		/*
		 * var downloader = new Downloader(); downloader.checkFileExists(path,
		 * function(entry) { if(fileEntry != null){ fileExists = true;
		 * success(fileEntry); } }, function(e) { fileExists = false; fail();
		 * });
		 */
//		function win(result) {
//			if (result != null) {
//				fileExists = true;
//				success(result);
//			}
//		}
//		function failure(result) {
//			fileExists = false;
//			fail();
//		}
		//cordova.exec(win, failure, "Downloader", "checkFileExists", [ path ]);
		// return fileExists;
	},

	getFileEntry : function(filePath, success, fail) {
		var fileEntryForUse = null;
		function getFilePath() {
			return filePath;
		}

		function gotFileEntry(fileEntry) {
			fileEntryForUse = fileEntry;
			/*
			 * if(device.platform=="iOS"){ fileEntryForUse.fullPath =
			 * 'cdvfile://localhost/persistent' + fileEntryForUse.fullPath;
			 * }else{ fileEntryForUse.fullPath = 'file:///sdcard' +
			 * fileEntryForUse.fullPath;
			 *  }
			 */
			// alert('after got');
			if (success)
				success(fileEntryForUse);
		}

		function gotFS(fileSystem) {
			// alert('gotfs');
			var filePath = getFilePath();
			fileSystem.root.getFile(filePath, {
				create : false
			}, gotFileEntry, fail);
		}
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
		// return fileEntryForUse;
	},

	getFileFromFileEntry : function(fileEntry) {
		var fileTobeReturn = null;
		if (fileEntry != null) {
			fileEntry.file(gotFile, fail);
		}

		function gotFile(file) {
			fileTobeReturn = file;

		}
		function fail() {
		}

		return fileTobeReturn;
	}

};

var UUIDUtil = {
	s4 : function() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16)
				.substring(1);
	},

	getUID : function() {
		var _i = UUIDUtil;
		return _i.s4() + _i.s4() + '-' + _i.s4() + '-' + _i.s4() + '-'
				+ _i.s4() + '-' + _i.s4() + _i.s4() + _i.s4();
	}
};

eLearningAPP.formatDataForSync = function(data, columns) {
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
	if (configSettings != null && configSettings.Action == "DATE_SETTINGS"
			&& configSettings.Intent != null) {
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

/*
 * function Downloader() {};
 * 
 * Downloader.prototype.downloadFile = function(downloadURL, directoryName,
 * fileName, params, progressCallBack) { if (params == null){ params = {}; }
 * params.dirName = directoryName; params.fileName = fileName;
 * 
 * var win = function(progressStatus){ if (progressCallBack != null){
 * progressCallBack(progressStatus); } };
 * 
 * var fail = function(progressFailed){ if (progressCallBack != null){
 * progressFailed.status = -1; progressFailed.progress = 0;
 * progressCallBack(progressFailed); } };
 * 
 * var fileTransfer = new FileTransfer(); var uri = encodeURI(downloadURL);
 * //fileTransfer.download(uri, 'cdvfile://localhost/persistent/' +
 * directoryName + '/' + fileName, win, fail, false, params);
 * fileTransfer.download(uri, cordova.file.externalRootDirectory + directoryName +
 * '/' + fileName, win, fail, false, params);
 * 
 * //PhoneGap.exec(win, fail, "Downloader", "downloadFile", [downloadURL,
 * params]); };
 */

function FileOpener() {
};

FileOpener.prototype.open = function(url) {
	//cordova.exec(null, null, "FileOpener", "openFile", [ url ]);
	alert(url);
	cordova.plugins.fileOpener2.open(
	    url, "application/*"
	);
};
var deviceInfo = {

	getDeviceId : function() {
		return device.uuid;
	}
};

if (!window.plugins) {
	window.plugins = {};
}
if (!window.plugins.fileOpener) {
	window.plugins.fileOpener = new FileOpener();
}

/*if (window['cordova'] != 'undefined' && window['cordova'] != null) {
	// Native Player
	cordova.define("cordova/plugin/videoplayer", function(require, exports,
			module) {
		var exec = require("cordova/exec");
		var VideoPlayer = function() {
		};

		VideoPlayer.prototype.play = function(url) {
			exec(null, null, "VideoPlayer", "playVideo", url);
		};

		var videoPlayer = new VideoPlayer();
		module.exports = videoPlayer;
	});

	if (!window.plugins) {
		window.plugins = {};
	}
	if (!window.plugins.videoPlayer) {
		window.plugins.videoPlayer = cordova
				.require("cordova/plugin/videoplayer");
	}
}*/

/**
 * Task framework
 */
function CoreTask(options) {
	this.settings = $.extend({
		task : function(context, data, success, failure) {
			success();
		},
		context : {},
		data : {},
		success : function() {
		},
		failure : function() {
		},
		title : options != null && options.task != null ? options.task.name
				: "Untitled",
		waitPeriod : 100
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

CoreTask.prototype.execute = function(_this) {
	if (_this == null) {
		_this = this;
	}
	setTimeout(function() {
		_this.executeTask(_this);
	}, _this.waitPeriod);
};

CoreTask.prototype.executeTask = function(_this) {
	this.task(_this.context, _this.data, _this.success, _this.failure);
};

function BulkTask(options) {
	CoreTask.call(this, options);
	this.tasks = [];
	this.spinner = options.spinner;
};

BulkTask.prototype = new CoreTask();

BulkTask.prototype.constructor = CoreTask;

BulkTask.prototype.addTask = function(task) {
	this.tasks.push(task);
};

BulkTask.prototype.executeTask = function(_this) {
	if (_this == null) {
		_this = this;
	}
	if (_this.tasks.length > 0) {
		var lastIndex = this.tasks.length - 1;
		$.each(_this.tasks, function(index, task) {
			task.context = _this.context;
			if (index == lastIndex) {
				task.success = function(data) {
					_this.hideLoading();
					_this.success(data);
				};
				task.failure = task.failure = function(data) {
					_this.hideLoading();
					_this.failure(data);
				};
			} else {
				task.success = function(data) {
					_this.tasks[index + 1].data = data;
					_this.tasks[index + 1].execute(_this.tasks[index + 1]);
				};
				task.failure = function(data) {
					_this.hideLoading();
					_this.failure(data);
				};
			}
		});
		_this.tasks[0].data = _this.data;
		if (_this.spinner != false) {
			// _this.showLoading();
		}
		_this.tasks[0].execute(_this.tasks[0]);
	}
};

BulkTask.prototype.showLoading = function() {

	var loader = $('#BulkTaskLoader');
	if (loader.length == 0) {
		loader = $('<div id="BulkTaskLoader" class="loader" ><img src="../images/EL/loader.gif" /></div>');
		$('body').append(loader);
	}
	loader.screenCenter();
	loader.show();

};

BulkTask.prototype.hideLoading = function() {
	var loader = $('#BulkTaskLoader');
	loader.hide();
};

function PairTask(options) {
	CoreTask.call(this, options);
	this.settings = $.extend({
		firstTask : new CoreTask({}, {}, function() {
		}, function() {
		}),
		secondTask : new CoreTask({}, {}, function() {
		}, function() {
		}),
		waitPeriod : 100
	}, options);

	this.firstTask = this.settings.firstTask;
	this.secondTask = this.settings.secondTask;

};

PairTask.prototype = new CoreTask();

PairTask.prototype.constructor = CoreTask;

PairTask.prototype.executeTask = function(_this) {
	if (_this == null) {
		_this = this;
	}
	_this.firstTask.context = _this.context;
	_this.firstTask.data = _this.data;
	_this.firstTask.success = function(data) {
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

TaskUtil.prototype.execute = function(context, data, success, failure) {
	if (success == null) {
		success = function(data) {
		};
	}

	if (failure == null) {
		failure = function(data) {
		};
	}
	if (this.taskSpecifications != null) {
		var bulkTask = this._buildTasks(this.taskSpecifications, context, data,
				success, failure);
		bulkTask.execute();
		// success(data);
	}
};

TaskUtil.prototype._buildTasks = function(taskSpecifications, context, data,
		success, failure) {
	var bulkTask = new BulkTask({
		data : data,
		context : context,
		success : success,
		failure : failure,
		spinner : data.spinner
	});
	var _this = this;
	$.each(taskSpecifications, function(index, taskSpecification) {
		var task = null;
		if (taskSpecification instanceof Array) {
			task = _this._buildTasks(taskSpecification, context, data, success,
					failure);
		} else if (taskSpecification.firstTask != null) {
			task = new PairTask({
				firstTask : new CoreTask({
					task : taskSpecification.firstTask,
					title : taskSpecification.title
				}),
				secondTask : new CoreTask({
					task : taskSpecification.secondTask,
					title : taskSpecification.title
				}),
				title : taskSpecification.title
			});

		} else {
			task = new CoreTask({
				task : taskSpecification.task,
				title : taskSpecification.title
			});
		}
		bulkTask.addTask(task);
	});
	return bulkTask;
};

var CoreSOAP = {
	 server:"http://"+SERVERNAME+"/",
	
	errorHandler : null,
	invoke : function(daoClass, operation, params, returnType) {
		var _this = CoreSOAP;
		if (returnType == null || returnType == 'undefined') {
			returnType = 'json';
		}
		var bhRequest = "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ns1=\"http://tempuri.org/\" xmlns:ns2=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\"> "
				+ "<s:Body>" + "<ns1:" + operation + ">";
		var paramString = "";
		params.appId = 3;
		params.appSuiteId = 1;
		params.appPlatForm = device.platform;
		for ( var key in params) {
			if (params.hasOwnProperty(key)) {
				if (params[key] instanceof Array) {
					paramString += ("<ns1:" + key + ">");
					var arrayValues = params[key];
					for (var index = 0; index < arrayValues.length; index++) {
						paramString += ("<ns2:string>"
								+ $('<div/>').text(arrayValues[index]).html() + "</ns2:string>");
					}
					paramString += ("</ns1:" + key + ">");
				} else {
					paramString += ("<ns1:" + key + ">"
							+ $('<div/>').text(params[key]).html() + "</ns1:"
							+ key + ">");
				}
			}
		}

		bhRequest += paramString;
		bhRequest += "</ns1:" + operation + ">" + "</s:Body>" + "</s:Envelope>";

		var result = null;
		var server = CoreSOAP.server;
		if (daoClass.metadata.server != null) {
			server = daoClass.metadata.server;
		}
		var url = server + daoClass.metadata.service + ".svc";
		var soapAction = "http://tempuri.org/I" + daoClass.metadata.service
				+ "/" + operation;
		var responseTag = operation + "Response";
		var resultTag = operation + "Result";
		console.log("Sarva: " + JSON.stringify(bhRequest));
		console.log(url);
		CoreSOAP.isError = false;
		var done = false;

		setTimeout(function() {
			if (!done)
				alert('Longer');
		}, 3000);
		setTimeout(function() {
			if (!done)
				window.location.href = 'error.html';
		}, 3000);
		$.ajax({
			type : "POST",
			url : url,
			data : bhRequest,
			timeout : 6000,
			contentType : "text/xml",
			async : false,
			cache : false,
			dataType : "xml",
			beforeSend : function(xhr) {
				xhr.setRequestHeader("SOAPAction", soapAction);
			},
			success : function(data) {
				done = true;
				$(data).find(responseTag).each(function() {
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
				$(data).find("outputMsg").each(function() {
					CoreSOAP.outputMsg = $(this).text();
				});
				console.log('result : ' + JSON.stringify(result));
			},
			error : function(xhr, status, error) {
				done = true;
				var arguments = {
					url : url,
					data : bhRequest,
					status : status,
					xhr : xhr,
					error : error
				};
				CoreSOAP.isError = true;

				eLearningAPP.logError(CoreSOAP, error, arguments, "invoke");
				if (_this.errorHandler != null) {
					_this.errorHandler(arguments);
				}
			}
		});
		return result;
	},

	invokeGet : function(daoClass, operation, params, returnType, rootElement) {
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

	_getFirstElement : function(array) {
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

	unmarshallXML : function(daoClass, result, rootElement) {
		var marshlledRecords = [];
		if (rootElement != null && result != null && result != "") {
			result
					.find(rootElement)
					.each(
							function() {
								var unmashalledRecord = $(this);
								var marshallRecord = {};
								var noOfColumns = daoClass.metadata.properties.length;
								var value = null;
								for (var i = 0; i < noOfColumns; i++) {
									var paramName = daoClass.metadata.properties[i].outProperty;
									if (paramName != null) {
										value = unmashalledRecord.find(
												paramName).text();
										if (value != null) {
											if (daoClass.metadata.properties[i].isDate != null
													&& daoClass.metadata.properties[i].isDate == true) {
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

	unmarshallJSON : function(daoClass, result) {
		if (typeof result == 'object') {

			var records = [];
			if (result instanceof Array) {
				records = result;
			} else {
				records.push(result);
			}

			var marshlledRecords = [];
			$
					.each(
							records,
							function(index, record) {
								var marshallRecord = {};
								var noOfColumns = daoClass.metadata.properties.length;
								var value = null;
								for (var i = 0; i < noOfColumns; i++) {
									var paramName = daoClass.metadata.properties[i].outProperty;
									if (paramName != null
											&& record[paramName] != null) {
										value = record[paramName];
										if (daoClass.metadata.properties[i].isDate != null
												&& daoClass.metadata.properties[i].isDate == true) {
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

	invokeGetSingle : function(daoClass, operation, params) {
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

/*
 * var CoreREST = {
 * 
 * _defaultServer: "../", accessKey: "dummy",
 * 
 * _addContext: function(url, context){ if (context != null && context.length >
 * 0){ for (var key in context) { url += context[key] + '/'; } } return url; },
 * 
 * _raw: function(url, requestType, context, data, success, failure){ //TODO
 * $.mobile.allowCrossDomainPages = true; un - comment code //$.support.cors =
 * true; url = this._addContext(url, context); if (data == null){ data = {}; }
 * console.log(url); data.accessKey = this.accessKey; $.ajax({ url: url, type:
 * requestType, data: data, dataType: "json", async: false, crossDomain : true,
 * success: function(response){ console.log("Success:" +
 * JSON.stringify(response)); success(response); }, error: function(xhr, status,
 * error){ console.log(JSON.stringify(xhr) + " - " + JSON.stringify(status) + " - " +
 * JSON.stringify(error)); var arguments = { url: url, data: data, status:
 * status, xhr: xhr }; eLearningAPP.logError(CoreREST, error, arguments,
 * "invoke"); failure(error); } }); },
 * 
 * post : function(restClass, context, data, success, failure){
 * this._raw(this._defaultServer, 'POST', context, data, success, failure); },
 * 
 * put : function(restClass, context, data, success, failure){
 * this._raw(this._defaultServer, 'POST', context, data, success, failure); },
 * 
 * remove : function(restClass, context, data, success, failure){
 * this._raw(this._defaultServer, 'DELETE', context, data, success, failure); },
 * 
 * get: function(restClass, context, data, success, failure){
 * this._raw(this._defaultServer, 'GET', context, data, success, failure); },
 * 
 *  };
 */
var userRemoteDAO = {
	metadata : {
		"service" : "WLUserService",
		"properties" : [ {
			name : "companyCode",
			inProperty : "companyCode",
			outProperty : "Company_Code"
		}, {
			name : "userId",
			inProperty : "userId",
			outProperty : "User_Id"
		}, {
			name : "userName",
			inProperty : "userName",
			outProperty : null
		}, {
			name : "password",
			inProperty : "password",
			outProperty : null
		}, {
			name : "blobUrl",
			inProperty : "blobUrl",
			outProperty : "Profile_Photo_BLOB_URL"
		}, {
			name : "url",
			inProperty : "url",
			outProperty : null
		}, {
			name : "userCode",
			inProperty : "userCode",
			outProperty : "User_Code"
		}, {
			name : "regionCode",
			inProperty : "regionCode",
			outProperty : "Region_Code"
		}, {
			name : "regionName",
			inProperty : "regionName",
			outProperty : "Region_Name"
		}, {
			name : "userTypeCode",
			inProperty : "userTypeCode",
			outProperty : "User_Type_Code"
		}, {
			name : "regionHierarchy",
			inProperty : "regionHierarchy",
			outProperty : "User_Hierarchy"
		}, {
			name : "userTypeName",
			inProperty : "userTypeName",
			outProperty : "User_Type_Name"
		}, {
			name : "lastSyncDate",
			inProperty : "lastSyncDate",
			outProperty : null
		}, {
			name : "supportEmail",
			inProperty : "supportEmail",
			outProperty : "Support_Email"
		}, {
			name : "supportPhone",
			inProperty : "supportPhone",
			outProperty : "Support_Phone_Number"
		}, {
			name : "isHidoctorCustomer",
			inProperty : "isHidoctorCustomer",
			outProperty : "Is_HiDoctor_Customer"
		}, {
			name : "companyId",
			inProperty : "companyId",
			outProperty : "Company_Id"
		} ]
	},

	login : function(userName, password, url) {
		// TODO make the rest call
		var data = {
			correlationId : 1,
			userName : userName,
			password : password,
			subDomainName : url
		};
		// var result = CoreSOAP.invoke(this, "CheckUserAuthentication", data);
		var result = CoreSOAP.invoke(this, "CheckUserAuthenticationByEmail",
				data);
		return (result);
	},

	get : function(userName, url) {
		var data = {
			correlationId : 1,
			userName : userName,
			subDomainName : url
		};
		// var result = CoreSOAP.invokeGetSingle(this, "GetUserInfo", data);
		var result = CoreSOAP.invokeGetSingle(this, "GetUserInfoByEmail", data);
		console.log('user RemoteDAO : ' + JSON.stringify(result));
		
		var HDresultvalue = result.isHidoctorCustomer;
        console.log('resultvalue' + HDresultvalue);
        window.localStorage.setItem('hidoctorcustomer',HDresultvalue);
        
		// alert('user RemoteDAO : '+JSON.stringify(result));
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

var dateFormat = function() {
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function(
			val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len)
			val = "0" + val;
		return val;
	};

	// Regexes and supporting functions are cached through closure
	return function(date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask
		// prefix)
		if (arguments.length == 1
				&& Object.prototype.toString.call(date) == "[object String]"
				&& !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date))
			throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_
				+ "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_
				+ "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"]
				(), L = date[_ + "Milliseconds"](), o = utc ? 0 : date
				.getTimezoneOffset(), flags = {
			d : d,
			dd : pad(d),
			ddd : dF.i18n.dayNames[D],
			dddd : dF.i18n.dayNames[D + 7],
			m : m + 1,
			mm : pad(m + 1),
			mmm : dF.i18n.monthNames[m],
			mmmm : dF.i18n.monthNames[m + 12],
			yy : String(y).slice(2),
			yyyy : y,
			h : H % 12 || 12,
			hh : pad(H % 12 || 12),
			H : H,
			HH : pad(H),
			M : M,
			MM : pad(M),
			s : s,
			ss : pad(s),
			l : pad(L, 3),
			L : pad(L > 99 ? Math.round(L / 10) : L),
			t : H < 12 ? "a" : "p",
			tt : H < 12 ? "am" : "pm",
			T : H < 12 ? "A" : "P",
			TT : H < 12 ? "AM" : "PM",
			Z : utc ? "UTC" : (String(date).match(timezone) || [ "" ]).pop()
					.replace(timezoneClip, ""),
			o : (o > 0 ? "-" : "+")
					+ pad(
							Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o)
									% 60, 4),
			S : [ "th", "st", "nd", "rd" ][d % 10 > 3 ? 0
					: (d % 100 - d % 10 != 10) * d % 10]
		};

		return mask.replace(token, function($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default" : "ddd mmm dd yyyy HH:MM:ss",
	shortDate : "m/d/yy",
	mediumDate : "mmm d, yyyy",
	longDate : "mmmm d, yyyy",
	fullDate : "dddd, mmmm d, yyyy",
	shortTime : "h:MM TT",
	mediumTime : "h:MM:ss TT",
	longTime : "h:MM:ss TT Z",
	isoDate : "yyyy-mm-dd",
	isoTime : "HH:MM:ss",
	isoDateTime : "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime : "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday",
			"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
	monthNames : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
			"Sep", "Oct", "Nov", "Dec", "January", "February", "March",
			"April", "May", "June", "July", "August", "September", "October",
			"November", "December" ]
};

// For convenience...
Date.prototype.format = function(mask, utc) {
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
	metadata : {
		"service" : "ELBillingService"
	},

	syncPut : function(context, params, success, failure) {

		var result = null;
		if (params instanceof Array) {
			for (var index = 0; index < params.length; index++) {
				var param = params[index];
				var daBillingRecord = {
					correlationId : param.correlationId,
					companyCode : param.companyCode,
					userCode : param.userCode,
					elItemizedBillingDetails : param.elItemizedBillingDetails
				};
				result = CoreSOAP.invoke(digitalAssetBillingRemoteDAO,
						"InsertELItemizedBilling", daBillingRecord);
				if (CoreSOAP.isError == true) {
					failure();
					return;
				} else if (result == false) {
					success(false);
					return;
				}
			}
			;
			success(result);
		} else {
			var daBillingRecord = {
				correlationId : params.correlationId,
				companyCode : params.companyCode,
				companyId : window.localStorage.getItem("companyId"),
				userCode : params.userCode,
				elItemizedBillingDetails : params.elItemizedBillingDetails
			};
			result = CoreSOAP.invoke(digitalAssetBillingRemoteDAO,
					"InsertELItemizedBilling", daBillingRecord);
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
	params : null,
	startUpsync : function(success, failure, overallPercentage) {
		eLearningUpsyncService.overallPercentage = 100;
		if (overallPercentage != null) {
			eLearningUpsyncService.overallPercentage = overallPercentage;
		}

		if (coreNET.isConnected() == true) {
			var percentageProgress = (eLearningUpsyncService.overallPercentage * 2) / 100;
			eLearningAPP.showProgress(percentageProgress);
			setTimeout(
					function() {
						eLearningUpsyncService
								.checkUserLoginAndCorrelationId(
										function(isLoggedinAndHasCorelationalId) {
											if (isLoggedinAndHasCorelationalId == true) {
												var taskSpecifications = [
														{
															firstTask : eLearningUpsyncService.getDATagAnalytics,
															secondTask : eLearningUpsyncService.upSyncDATagAnalytics
														},
														{
															firstTask : eLearningUpsyncService.getDABillingData,
															secondTask : eLearningUpsyncService.upSyncDABillingData
														} ];

												var taskUtil = new TaskUtil(
														taskSpecifications);
												taskUtil
														.execute(
																eLearningUpsyncService,
																{
																	spinner : false
																},
																function(data) {
																	synchronizeRemoteDAO
																			.endSync(eLearningUpsyncService.params);
																	var percentageProgress = (eLearningUpsyncService.overallPercentage * 100) / 100;
																	eLearningAPP
																			.showProgress(percentageProgress);
																	if (eLearningUpsyncService.overallPercentage == 100) {
																		eLearningAPP
																				.showToast("Data has been sucessfully uploaded");
																	}
																	success(true);
																},
																function(data) {
																	eLearningAPP
																			.showProgress("NON-DOWNLOAD-ERROR");
																	failure();
																});
											} else {
												eLearningAPP
														.showProgress("NON-DOWNLOAD-ERROR");
												alert(resource.userValidationMessage);
											}
										},
										function(data) {
											eLearningAPP
													.showProgress("NON-DOWNLOAD-ERROR");
											alert(resource.networkMessage.noNetwork);
										});
					}, 100);

		} else {
			eLearningAPP.showProgress("NON-DOWNLOAD-ERROR");
			alert(resource.networkMessage.noNetwork);
			return;
		}
	},

	getDATagAnalytics : function(context, data, success, failure) {
		// alert("getDATagAnalytics");
		daTagAnalyticLocalDAO.syncGet(eLearningUpsyncService.params, success,
				failure);
	},

	upSyncDATagAnalytics : function(context, data, success, failure) {
		var percentageProgress = (eLearningUpsyncService.overallPercentage * 10) / 100;
		// percentageProgress = parseInt(percentageProgress);
		eLearningAPP.showProgress(percentageProgress);
		if (data != null && data.length > 0) {
			var taskSpecifications = [ {
				task : daTagAnalyticRemoteDAO.syncPut
			} ];
			var taskUtil = new TaskUtil(taskSpecifications);
			data.spinner = false;
			taskUtil
					.execute(
							eLearningUpsyncService,
							data,
							function(isSyncPutSuccessful) {
								var percentageProgress = (eLearningUpsyncService.overallPercentage * 35) / 100;
								eLearningAPP.showProgress(percentageProgress);
								if (isSyncPutSuccessful == true) {
									daTagAnalyticLocalDAO
											.clean(
													function(data) {
														var percentageProgress = (eLearningUpsyncService.overallPercentage * 50) / 100;
														eLearningAPP
																.showProgress(percentageProgress);
														success();
													}, failure);
								} else {
									eLearningAPP
											.showToast("Error uploading data, please try later");
									failure();
								}
							}, function(data) {
								alert(resource.networkMessage.noNetwork);
								failure(data);
							});
		} else {
			var percentageProgress = (eLearningUpsyncService.overallPercentage * 50) / 100;
			eLearningAPP.showProgress(percentageProgress);
			success();
		}
	},

	getDABillingData : function(context, data, success, failure) {
		// alert("s");
		digitalAssetBillingLocalDAO.syncGet(eLearningUpsyncService.params,
				success, failure);
	},

	upSyncDABillingData : function(context, data, success, failure) {
		var percentageProgress = (eLearningUpsyncService.overallPercentage * 60) / 100;
		eLearningAPP.showProgress(percentageProgress);
		if (data != null && data.length > 0) {
			var taskSpecifications = [ {
				task : digitalAssetBillingRemoteDAO.syncPut
			} ];
			var taskUtil = new TaskUtil(taskSpecifications);
			data.spinner = false;
			taskUtil
					.execute(
							eLearningUpsyncService,
							data,
							function(isSyncPutSuccessful) {
								eLearningAPP.showProgress(85);
								if (isSyncPutSuccessful == true) {
									digitalAssetBillingLocalDAO
											.clean(
													function(data) {
														var percentageProgress = (eLearningUpsyncService.overallPercentage * 95) / 100;
														eLearningAPP
																.showProgress(percentageProgress);
														success();
													}, failure);
								} else {
									alert("Error uploading data, please try later");
									failure();
								}
							}, function(data) {
								alert(resource.networkMessage.noNetwork);
								failure(data);
							});
		} else {
			var percentageProgress = (eLearningUpsyncService.overallPercentage * 95) / 100;
			eLearningAPP.showProgress(percentageProgress);
			success();
		}
	},

	showUploadProgress : function() {
		success();
	},

	checkUserLoginAndCorrelationId : function(success, failure) {
		userLocalDAO
				.get(
						function(user) {
							console.log('user : ' + JSON.stringify(user));

							if (user != null && user.ssoId != null) {
								var correlationId = synchronizeRemoteDAO
										.getCorrelationId(user.companyCode,
												user.userCode);
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

	isUpsyncDataAvailable : function(success, failure) {
		daTagAnalyticLocalDAO.getCount(function(count) {
			if (count != 0) {
				success(true);
			} else {
				digitalAssetBillingLocalDAO.getCount(function(count) {
					if (count != 0) {
						success(true);
					} else {
						trainingRequestLocalDAO.getCount(function(count) {
							if (count != 0) {
								success(true);
							} else {
								var errors = ErrorLogsLocalDAO.getAll();
								if (errors != null && errors.length > 0) {
									success(true);
								} else {
									success(false);
								}
							}
						}, failure);
					}
				}, failure);
			}
		}, failure);
	}

};

var synchronizeRemoteDAO = {
	metadata : {
		"service" : "ELInfrastructureService"
	},

	getCorrelationId : function(companyCode, userCode) {
		var data = {
			companyCode : companyCode,
			userCode : userCode
		};
		var result = CoreSOAP.invoke(this, "StartSync", data, 'text');
		if (CoreSOAP.isError == true) {
			return null;
		} else {
			return result;
		}
	},

	endSync : function(params) {
		var data = {
			correlationId : params.correlationId,
			userCode : params.userCode
		};
		var result = CoreSOAP.invoke(this, "EndSync", data, 'text');
		return eval(result);
	}
};

var userDivisionRemoteDAO = {
	metadata : {
		"service" : "WLUserService",
		"properties" : [ {
			name : "userCode",
			inProperty : "User_Code",
			outProperty : "User_Code"
		}, {
			name : "divisionCode",
			inProperty : "Division_Code",
			outProperty : "Division_Code"
		}, {
			name : "divisionName",
			inProperty : "Division_Name",
			outProperty : "Division_Name"
		} ]
	},

	get : function(correlationId, companyId, companyCode, userCode) {
		var data = {
			correlationId : correlationId,
			companyCode : companyCode,
			userCode : userCode,
			companyId : companyId
		};
		var result = CoreSOAP.invokeGet(this, "GetUserDivision", data);
		return result;
	}

};
var configurationRemoteDAO = {
	metadata : {
		"service" : "ELInfrastructureService",
		"properties" : [ {
			name : "companyCode",
			inProperty : "Company_Code",
			outProperty : "Company_Code"
		}, {
			name : "dateSettings",
			inProperty : "DATE_SETTINGS",
			outProperty : "DATE_SETTINGS"
		}, {
			name : "Action"
		}, {
			name : "Intent"
		}, {
			name : "Intent_Type"
		}, {
			name : "Is_Active"
		} ]
	},

	get : function(params) {
		var result = CoreSOAP.invoke(this, "GetELConfiguration", params);
		var configuration = {};
		if (result != null && result.length > 0) {
			configuration = result[0];
		}
		return configuration;
	},

	syncGet : function(params) {
		// alert(JSON.stringify(params));
		return this.get(params);
	}
};

var eLearningUpgradeService = {
	startUpgrade : function() {
		if (coreNET.isConnected() == false) {
			alert(resource.networkMessage.noNetwork);
			return;
		}
		var availabeDetail = eLearningUpgradeService.isNewVersionAvailable();
		if (availabeDetail.isNewAvailabe == true) {
			var fileName = UUIDUtil.getUID() + ".apk";
			var tempFolder = resource.download.tempFolder;
			var downloadedFileName = "file:///sdcard/" + tempFolder + "/"
					+ fileName;
			var downloaderUtil = new Downloader();
			var apkURL = availabeDetail.apkURL;
			downloaderUtil.downloadFile(apkURL, tempFolder, fileName, {},
					function(progressStatus) {
						eLearningAPP.showProgress(progressStatus.progress);
						if (progressStatus.progress >= 100) {
							window.plugins.fileOpener.open(downloadedFileName);
						}
					});
		} else {
			alert(resource.application.upToDate);
		}
	},

	isNewVersionAvailable : function() {
		var version = resource.application.version + '.'
				+ resource.application.release;
		var platform = resource.application.platform;
		var apkURL = null;
		if (eLearningAPP.currentUser != null) {
			apkURL = upgradeRemoteDAO.get('1', eLearningAPP.currentUser.url,
					eLearningAPP.currentUser.companyCode, version, platform);
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

	isUpgradeRequired : function(success, failure) {
		var differentVersion = false;
		upgradeLocalDAO.get(function(currentVersion) {
			var newVersion = {
				version : resource.application.version,
				release : resource.application.release
			};
			if (currentVersion == null) {
				differentVersion = true;
			} else {
				if (newVersion.version != currentVersion.version
						|| newVersion.release != currentVersion.release) {
					differentVersion = true;
				}
			}
			success(differentVersion);
		}, failure);
	},

	updateTables : function(success, failure) {
		coreView.showLoading(resource.application.upgradingMessage);
		var entities = eLearningUpgradeService._getAllEntities();
		eLearningUpgradeService._updateTables(entities, success, failure);
	},

	_updateTables : function(entities, success, failure, index) {

		if (index == null) {
			index = 0;
		}
		if (index < entities.length) {
			var entity = entities[index];
			var localDAO = eval(entity);
			console.log(localDAO);
			coreDAO.updateTable(localDAO, function(data) {
				index++;
				eLearningUpgradeService._updateTables(entities, success,
						failure, index);
			}, function(data) {
			});
		} else {
			eLearningUpgradeService.completeUpgrade(success, failure);
		}
	},

	completeUpgrade : function(success, failure) {
		var newVersion = {
			version : resource.application.version,
			release : resource.application.release
		};
		upgradeLocalDAO.remove(function(data) {
			upgradeLocalDAO.insert(newVersion, function(data) {
				userLocalDAO.get(function(user) {
					if (user != null && user.ssoId != null) {
						var sendVersion = newVersion.version + '.'
								+ newVersion.release;
						upgradeRemoteDAO.sendVersion('1', user.url,
								user.companyCode, user.userCode, user.userName,
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

	_getAllEntities : function(onSyncBatchComplete) {
		var entities = [ "userLocalDAO", "assetMetaTagLocalDao",
				"digitalAssetLocalDAO", "daTagAnalyticLocalDAO",
				"digitalAssetBillingLocalDAO", "daAnalyticHistoryLocalDAO",
				"upgradeLocalDAO" ];
		return entities;
	},

	alertAndHighLightUpgradeOption : function() {
		if (coreNET.isConnected()) {
			var availabeDetail = eLearningUpgradeService
					.isNewVersionAvailable();
			if (availabeDetail.isNewAvailabe == true) {
				alert(resource.application.upgradeAlertMessage);
				var option = $(".upgradeOption");
				option.empty();
				option.append("<div class='hightedUpgradeOption'>"
						+ resource.application.upgradeOption + "</div>");
			}
		}
	}
};

var upgradeRemoteDAO = {
	metadata : {
		"service" : "ELInfrastructureService"
	},

	get : function(correlationId, subDomain, companyCode, waVersion, platform) {
		var data = {
			correlationId : correlationId,
			subdomainName : subDomain,
			companyCode : companyCode,
			waVersion : waVersion,
			platform : platform
		};
		var result = CoreSOAP.invokeGet(this, "CheckNewVersion", data, 'text');
		return result;
	},

	sendVersion : function(correlationId, subDomain, companyCode, userCode,
			userName, waVersion) {
		var data = {
			correlationId : correlationId,
			subdomainName : subDomain,
			companyCode : companyCode,
			userCode : userCode,
			userName : userName,
			waVersion : waVersion
		};
		var result = CoreSOAP.invokeGet(this, "InstallBack", data, 'text');
	}
};

var upgradeLocalDAO = {

	metadata : {
		"tableName" : "tbl_Upgrade",
		"columns" : [ {
			name : "version",
			columnName : "Version"
		}, {
			name : "release",
			columnName : "Release"
		} ]
	},

	insert : function(version, success, failure) {
		coreDAO.insert(this, version, success, failure);
	},

	update : function(version, success, failure) {
		coreDAO.update(this, version, success, failure);
	},

	remove : function(success, failure) {
		coreDAO.remove(this, null, success, failure);
	},

	get : function(success, failure) {
		var criteria = {};
		coreDAO.getEquals(this, criteria, function(result) {
			if (result.length > 0) {
				success(result[0]);
			} else {
				success(null);
			}
		}, failure);

	}
};

var assetCategoryService = {
	getCategoryURL : function(asset) {
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
			correlationId : resource.correlationId,
			companyCode : eLearningAPP.currentUser.companyCode,
			userCode : eLearningAPP.currentUser.userCode,
			appPlatForm : resource.ssoDetail.appPlatForm,
			appSuiteId : resource.ssoDetail.appSuiteId,
			appId : resource.ssoDetail.appId,
			categoryIds : categoryArray
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
	metadata : {
		"service" : "ELInfrastructureService",
	},

	getCategoryURL : function(params) {
		var result = CoreSOAP.invoke(this, "GetCategoryThumbnail", params);
		if (result != null && result.length > 0) {
			return result[0];
		} else {
			return null;
		}
	}
};

var ErrorLogsLocalDAO = {
	metadata : {
		"tableName" : "tbl_Error_Logs",
		"columns" : [ {
			name : "errorID",
			columnName : "Error_Id",
			pk : true
		}, {
			name : "deviceID",
			columnName : "Device_Id"
		}, {
			name : "userName",
			columnName : "User_Name"
		}, {
			name : "errorTime",
			columnName : "Error_Time",
			isDate : true
		}, {
			name : "error",
			columnName : "Error"
		} ]
	},

	insert : function(error) {
		var res = coreDAO.insert(this, error);
		return res;
	},

	getBy : function(deviceID) {
		var criteria = {};
		criteria.uUid = deviceID;
		var result = coreDAO.getEquals(this, criteria);
		if (result.length > 0) {
			return result;
		}
	},
	getAll : function() {
		var criteria = null;
		var result = coreDAO.getEquals(this, criteria);
		return result;
	},
	remove : function(errorID) {
		var criteria = {};
		criteria.errorID = errorID;
		return coreDAO.remove(this, criteria);
	},

	syncGet : function(params) {
		var errorLogRecords = [];
		var errorLogs = this.getAll();
		$.each(errorLogs, function(index, errorLog) {
			var errorLogRecord = {
				errorID : errorLog.errorID,
				correlationId : 0,
				companyCode : eLearningAPP.currentUser.companyCode,
				userCode : eLearningAPP.currentUser.userCode,
				deviceID : errorLog.deviceID,
				errorTime : errorLog.errorTime,
				error : errorLog.error
			};
			errorLogRecords.push(errorLogRecord);
		});
		return errorLogRecords;
	},

	clean : function(params) {
		if (params == null) {
			params = {};
		}
		ErrorLogsLocalDAO.remove(params.errorID);
	}
};

ErrorLogsRemoteDAO = {

	dateFormat : null,
	metadata : {
		"service" : "ELInfrastructureService"
	},

	syncPut : function(params) {
		var _this = ErrorLogsRemoteDAO;

		_this.dateFormat = "yyyy-mm-dd hh:MM";

		var logDate = params.errorTime.format(_this.dateFormat);

		var log = {
			correlationId : 0,
			companyCode : eLearningAPP.currentUser.companyCode,
			userCode : eLearningAPP.currentUser.userCode,
			deviceId : deviceInfo.getDeviceId(),
			log : "<![CDATA[" + params.error + "]]>",
			logDate : logDate
		};

		console.log(log.log);
		var result = CoreSOAP.invoke(this, "DeviceLog", log);
		return result;
	}
};

eLearningAPP.logError = function(source, err, arguments, methodName) {
	var errorOccuringTime = new Date();
	if(eLearningAPP.currentUser == null)
		eLearningAPP.currentUser = {};
	var errorInfo = {
		"User_Code" : eLearningAPP.currentUser.userCode,
		"Company_Code" : eLearningAPP.currentUser.companyCode,
		"User_Name" : eLearningAPP.currentUser.userName,
		"Page_Name" : eLearningAPP.pageName,
		"Error_At" : (/(\w+)\(/.exec(source.constructor.toString())[1]) + "."
				+ methodName,
		"Arguments" : arguments,
		"Error" : err
	};
	var currentUserName = eLearningAPP.currentUser.userName;
	var errorText = JSON.stringify(errorInfo);
	console.log("debugging..." + errorText);
	var errorLog = {
		errorID : UUIDUtil.getUID(),
		deviceID : deviceInfo.getDeviceId(),
		userName : currentUserName,
		errorTime : errorOccuringTime,
		error : errorText
	};
	ErrorLogsLocalDAO.insert(errorLog);
};

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
};

