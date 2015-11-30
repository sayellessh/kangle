var assetDetail = {
    isUnAssign: true,
    assetId: 0,
    selectedFile: null,
    init: function (userId, assetId, isUnassign) {
        
        assetDetail.isUnAssign = (isUnassign == 'Y' ? true : false);
        assetDetail.assetId = assetId;
        assetDetail.userId = userId;
        assetDetail.getAssetDetails();
        assetDetail.setHeader();
    },
    setHeader: function() {
        /** Page Header **/
        var hdrOptions = [
            { className: 'fa-home' },
            { className: 'fa-bell' },
            { className: 'fa-pencil' }
        ];

        var hdrEl = new header();
        hdrEl.hdrElActions = function (index) {
        	if (index == 0) {
                window.location.href = '../homePage.html';
            } else if (index == 1) {
                window.location.href = '../notificationhub/Notificationhub.html';
            } else if (index == 2) {
            	assetDetail.chooseThumbnailAndUpload();
            }
        	return false;
        };
        hdrEl.onBackClick = function () {
            if (assetDetail.isUnAssign)
                window.location.href = 'UnAssignedAssets.Mobile.html';
            else
                window.location.href = 'AssignedAssets.Mobile.html';
        };
        //hdrEl.createHeaderWithUpload(hdrOptions, 'Asset Details');
        hdrEl.createHeaderWithIcons(hdrOptions, 'Asset Details');
        $('.wrapper header').replaceWith(hdrEl.el);
    },
    getAssetDetails: function () {
        if (assetDetail.isUnAssign) {
            Services.showLoader();
            Services.getUnAssignedAssetByStagingId(assetDetail.userId, assetDetail.assetId, function (data) {
                Services.hideLoader();
                assetDetail.bindAssetDetails(data);
            }, function () {
                Services.hideLoader();
            });
        } else {
            Services.showLoader();
            Services.getAssignedAssetById(assetDetail.userId, assetDetail.assetId, function (data) {
                Services.hideLoader();
                assetDetail.bindAssignedAssetDetails(data);
            }, function () {
                Services.hideLoader();
            });
        }
    },
    bindAssetDetails: function (data) {
        $('#asset-url').attr('src', data[0].DA_Thumbnail_URL);
        $('.asset-size').text(data[0].File_Size_In_MB + ' MB');
        $('.asset-upload-name').text(data[0].Uploaded_By_Name);
        $('.asset-upload-date').text(data[0].Uploaded_DateTime);
        $('.detail-name h3').text(data[0].DA_Name);
        $('.detail-name p').text(data[0].DA_Category_Name);
        $('.detail-desc p').text(data[0].DA_Description);
        $('body').css('background', 'rgb(247, 247, 247)');

        var fileType = this.getDocumentType(data[0].DA_Name);
        $('.detail-type img').attr('src', 'images/newdoctype/' + fileType + '.png');
        if (data[0].Tags !== undefined && data[0].Tags !== '') {
            var tags = data[0].Tags.split(',');
            $('.asset-tags').empty();
            for (var i = 0; i < tags.length; i++) {
                $('.asset-tags').append('<li><span class="fa fa-tag"></span> ' + tags[0] + '</li>');
            }
        }
    },
    bindAssignedAssetDetails: function (data) {
        $('#asset-url').attr('src', data[0].DA_Thumbnail_URL);
        $('.asset-size').text(data[0].DA_Size_In_MB + ' MB');
        $('.asset-upload-name').text(data[0].Uploaded_By_Name);
        $('.asset-upload-date').text(data[0].Uploaded_Date);
        $('.detail-name h3').text(data[0].DA_Name);
        $('.detail-name p').text(data[0].DA_Category_Name);
        $('.detail-desc p').text(data[0].DA_Description);
        $('.detail-left').css('padding-top', '7px');
        $('.detail-right').html('<p>' + data[0].Star_Count + ' <span class="fa fa-star"></span></p><p>' +
            data[0].Views_Count + ' <span class="fa fa-eye"></span></p><p>' + data[0].Likes_Count +
            ' <span class="fa fa-heart"></span></p>');

        if (data[0].Is_Downloadable == 'Y') 
            $('.detail-size').append('<span class="fa fa-download"></span>');
        else
            $('.detail-size').append('<span class="fa fa-globe"></span>');

        if (data[0].Is_Customer_Sharable == 'Y')
            $('.detail-size').append('<span class="fa fa-share-alt"></span>');

        var fileType = this.getDocumentType(data[0].DA_Name);
        $('.detail-type img').attr('src', 'images/newdoctype/' + fileType + '.png');
        if (data[0].Tag_Name !== undefined && data[0].Tag_Name !== '') {
            var tags = data[0].Tag_Name.split(',');
            $('.asset-tags').empty();
            for (var i = 0; i < tags.length; i++) {
                $('.asset-tags').append('<li><span class="fa fa-tag"></span> ' + tags[0] + '</li>');
            }
        }

        if (assetDetail.isUnAssign == false) {
            $('.show-assign').show();
            var userMapped = data[0].Users_Mapped;
            if (userMapped !== null && userMapped.length > 0) {
                $('.user-search').show();
                var uniqueids = {};
                for (var i = 0; i < userMapped.length; i++) {
                	if(uniqueids[userMapped[i].User_Id] == null) {
	                    var html = '';
	                    html += '<li data-title="' + userMapped[i].Employee_Name + '" class="'  + (i%2 == 0 ? 'row-alt' : '') + '">';
	                    html += '<div class="list-items-inner">';
	                    html += '<span class="list-prof"><img src="https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/4/005/0a2/2da/211e0da.jpg" alt="" /></span>';
	                    html += '<span class="list-user">';
	                    html += '<span class="list-user-name">' + userMapped[i].Employee_Name + '</span> ';
	                    html += '<span class="list-user-loc">Chennai</span>';
	                    html += '</span>';
	                    html += '</div>';
	                    html += '</li>';
	                    $('.user-list .list-items').append(html);
	                    uniqueids[userMapped[i].User_Id] = userMapped[i];
                	} 
                }

                $('.user-search span').unbind('click').bind('click', function () {
                    var val = $('.user-search input').val().toLowerCase();
                    if (val == '') {
                        $('.user-list .list-items li').show();
                    } else {
                        $('.user-list .list-items li').each(function (i, el) {
                            var $el = $(el);
                            if ($el.data('title').toLowerCase().indexOf(val) > -1) {
                                $el.show();
                            } else {
                                $el.hide();
                            }
                        });
                    }
                });
            }
        }
    },
    getDocumentType: function(fileName) {
        if (fileName == null || fileName === undefined || fileName == '')
            return 'INVALID';
        var parts = fileName.split('.'), ext = parts[parts.length - 1];
        if (ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'bmp') {
            return 'image';
        } else if (ext == 'mp4' || ext == 'MOV' || ext == 'mov') {
            return 'video';
        } else if (ext == 'wmv' || ext == 'mp3' || ext == 'm4a' || ext == 'wma' || ext == 'flac' || ext == 'alac') {
            return 'audio';
        } else {
            return ext;
        }
        return 'INVALID';
    },
    chooseThumbnailAndUpload: function() {
    	var fileBrowseOptions = {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.PICTURE
        };
    	navigator.camera.getPicture(function(imageURI) {
            assetDetail.startUpload(imageURI);
        }, function(message) {
            alert('Unable to get picture.');
        }, fileBrowseOptions);
    },
    startUpload: function(imageURI) {
    	var options = new FileUploadOptions();
        options.fileKey="filename";
        options.fileName= new Date().getTime() + '.png';
        options.mimeType="image/jpeg";
        var ft = new FileTransfer();
        var context = [];
        if(assetDetail.isUnAssign) {
        	context = [Services.context.upload, 'ChangeUnassignedAssetThumbnail', Services.defaults.subdomainName, Services.defaults.companyId,
        	           assetDetail.userId, assetDetail.assetId];
        } else {
        	context = [Services.context.upload, 'UpdateAssetThumbnailOfAssignedAsset', Services.defaults.subdomainName, Services.defaults.companyId,
                           assetDetail.assetId, assetDetail.userId];	
        }
        var url = CoreREST._addContext(CoreREST._defaultServer, context);
        $(".wrapper header li .fa-pencil").hide();
        Services.showLoader();
        ft.upload(imageURI, url, function(response) {
        	if(response != null && response.response) {
        		try {
        			var data = JSON.parse(response.response);
        			if(data != null && data.Transaction_Status) {
                        alert(data.Message_To_Display);
                        window.location.reload();
                    } else {
                    	alert("Unable to upload thumbnail, please try again.");
                    }
        		} catch(e) {
        			alert("Unable to upload thumbnail, please try again.");
        		}
        	} else {
        		alert("Unable to upload thumbnail, please try again.");
        	}
        	Services.hideLoader();
        	$(".wrapper header li .fa-pencil").show();
        }, function(e) {
        	Services.hideLoader();
        	$(".wrapper header li .fa-pencil").show();
        	alert("Unable to upload thumbnail, please try again.");
        }, options);
    }
};