var fileTransfer_g = null;
var rxHome = {
    el: $('.posts-view'),
    lastFeedId: 0,
    filesSelected: null,
    bCreate: true,
    imageMaxSize: 10485760,
    //imageMaxSize: 1572864,
    fileUploadType: 'IMAGE',
    bEnter: true,
    init: function () {
        rxHome.getUserFeedsForUser();
        rxHome.insertNewFeed();
        rxHome.showMore();
        rxHome.fileUpload();
        window.setInterval(function () {
            rxHome.getUpdateFeedsForUser();
        }, 300000);
    },
    getUserFeedsForUser: function () {
    	Services.getUserFeeds(Services.defaults.userId, 0, function (data) {
            if (data.length <= 0)
                $('.btn-smore').hide();
            else
                rxHome.bindUserFeed(rxHome.el, data);
            app.hideLoading();
        }, function(){
        	rxHome.bindUserErrorFeed(rxHome.el, networkProblemError);
        	app.hideLoading();
        });
    },
    getUserFeedsAfterId: function () {
        app.showLoading();
    	Services.getUserFeedAfterId(Services.defaults.userId, rxHome.lastFeedId, function (data) {
            if (data.length <= 0)
                $('.btn-smore').hide();
            else
                rxHome.bindUserFeed(rxHome.el, data);
            app.hideLoading();
    	}, function(e){
    		app.hideLoading();
    		app.ajaxFailure(e);
    	});
    },
    getUpdateFeedsForUser: function () {
        var postItem = $('.posts-item').first().data('postItem');
        if(postItem)
            rxHome.lastFeedId = postItem.Id;
        if (postItem != null) rxHome.lastFeedId = postItem.Id;
        else rxHome.lastFeedId = 0;
        Services.getUserFeeds(Services.defaults.userId, rxHome.lastFeedId, function (data) {
            var newDatas = new Array();
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    newDatas.push(data[data.length - (i + 1)]);
                }
            }
            rxHome.bindUserFeed(rxHome.el, newDatas, true);
        }, null);
    },
    getUserFeedsById: function (feedId) {
        Services.getUserFeedsById(feedId, function (data) {
            rxHome.refreshPost(data[0]);
        }, null);
    },
    bindUserErrorFeed: function(el, message) {
    	$('.btn-smore').hide();
    	app.bindUserErrorFeed(el, networkProblemError);
    },
    bindUserFeed: function (el, data, bUpdated) {
        $('.btn-smore').show();
        $.each(data, function (index, value) {
            /*if(index == 0) {
		    	rxHome.lastFeedId = value.Id;
		    }*/
            var postItem = $('<div class="posts-item clearfix"></div>');
            postItem.append('<div class="posts-prof"><img src="' + (value.Profile_Photo_BLOB_URL !=null?value.Profile_Photo_BLOB_URL :Services.defaults.defaultThumbnail) + '" alt="" /></div>');

            var hasLikes = true;
            if (value.lstFeedAnalytics == null || value.lstFeedAnalytics.length <= 0 || !rxHome.isUserLikes(value)) {
                hasLikes = false;
            }
            var desc = '<div class="posts-desc"><div class="posts-title"><a href="UserProfile.Mobile.html?userId=' + (value.User_Id) + '" class="post-by-user">' + value.FirstName + '</a>' +
				'<span>' + (value.Action_Required ? value.Message_Text : '') + '</span></div>';
            var cmnt = '';
            if (value.Action_Required == false) {
            	var messageText = value.Message_Text;
                messageText = messageText.replace(/\n/g, "<br />");
                desc += '<p>' + messageText + '</p>';
                //desc += '<p>' + value.Message_Text + '</p>';
                if (value.Attachment != '') {
                    var type = rxHome.getFileExtension(value.Attachment);
                    if (type == 'IMAGE')
                        desc += '<div class="clear"></div><img src="' + value.Attachment + '" alt=""/>';
                    else if (type == 'VIDEO')
                        desc += '<div class="clear"></div><video id="video" style="max-width: 100%; max-height: 100%;" tabindex="0" controls="">' +
							'<source type="video/mp4" src="' + value.Attachment + '"></source></video>';
                }
                desc += '<div class="posts-actn"><span class="post-created-time">' + value.timestampFormatted + '</span>' +
					'<a href="#" class="like fa fa-thumbs-o-up ' + (hasLikes ? 'disabled' : '') + '"> (' + value.Likes + ')</a><a href="#" class="reply fa fa-mail-reply"></a>' +
					'<a href="#" class="fa fa-comments comments"> (' + (value.lstFeedComments ? value.lstFeedComments.length : 0) + ')</a>' +
					'</div>';
                cmnt += rxHome.addComments(value);
            } else {
                // desc += '<div class="post-request-actions"><a href="#" id="accept-request" class="btn">Accept</a>'+
                // '<a href="#" id="reject-request" class="btn">Reject</a></div>';				
            }

            desc += cmnt + '</div>';
            postItem.append(desc);
            postItem.data('postItem', value);
            if (bUpdated)
                el.prepend(postItem);
            else
                el.append(postItem);
        });
        rxHome.insertComment();
        rxHome.addLike();
        //rxHome.requestActions();        
        $('.posts-item img, .posts-item p, .posts-item video').unbind('click').bind('click', function () {
            var postId = $(this).parents('.posts-item').eq(0);
            postId = postId.data('postItem');
            //window.location.href = '/' + postId;
            window.location.href = 'FeedDetails.Mobile.html?feedId=' + postId.Id;
            return false;
        });
        $('.posts-actn a.comments, .posts-actn a.reply').unbind('click').bind('click', function () {
            var txtrea = $('textarea', $(this).parents('.posts-item').eq(0));
            txtrea.focus();
            return false;
        });
    },
    addComments: function (value) {
        var cmnt = '<div class="posts-comment">';
        if (value.lstFeedComments != null && value.lstFeedComments.length > 0) {
            //cmnt = '<div class="posts-comment">';
            $.each(value.lstFeedComments, function (ind, value1) {
                cmnt += '<div class="comment-item clearfix">';
                cmnt += '<div class="comment-prof"><img src="' + (value1.Profile_Photo_BLOB_URL !=null?value1.Profile_Photo_BLOB_URL :Services.defaults.defaultThumbnail) + '" alt="" /></div>';
                cmnt += '<div class="comment-desc"><a class="com-name" href="UserProfile.Mobile.html?userId=' + (value1.UserId) + '" title="' + value1.Display_Name + '">' + value1.Display_Name +
            	'</a><span>' + value1.Message_Text + '</span><span class="post-date">' + value1.timestampFormatted + '</span></div>';
                cmnt += '</div>';
            });
        }
        cmnt += '<div class="comment-item clearfix"><div class="comment-prof"><img src="' + Services.defaults.myProfileURL + '" alt="" /></div>';
        cmnt += '<div class="comment-desc">' +
        	'<textarea name="comment-text" class="add-comment" cols="30" rows="2" placeholder=""></textarea>' +
        	'</div></div>';
        cmnt += '</div>';
        return cmnt;
    },
    refreshPost: function (data) {
        var el = $('.posts-item');
        $.each(el, function (ind, value) {
            var postItem = null;
            value = el.eq(ind).data('postItem');
            if (data.Id == value.Id) {
                postItem = el.eq(ind);
                postItem.html('<div class="posts-prof"><img src="' + (data.Profile_Photo_BLOB_URL !=null?data.Profile_Photo_BLOB_URL :Services.defaults.defaultThumbnail) + '" alt="" /></div>');

                var hasLikes = true;
                if (data.lstFeedAnalytics == null || data.lstFeedAnalytics.length <= 0 || !rxHome.isUserLikes(data)) {
                    hasLikes = false;
                }
                
                var desc = '<div class="posts-desc"><div class="posts-title"><a href="UserProfile.Mobile.html?userId=' + (data.User_Id) + '" class="post-by-user">' + data.FirstName + '</a>' +
					'<span></span></div>';
                var messageText = value.Message_Text;
                messageText = messageText.replace(/\n/g, "<br />");
                desc += '<p>' + messageText + '</p>';
                //desc += '<p>' + data.Message_Text + '</p>';
                if (value.Attachment != '') {
                    var type = rxHome.getFileExtension(value.Attachment);
                    if (type == 'IMAGE')
                        desc += '<div class="clear"></div><img src="' + value.Attachment + '" alt=""/>';
                    else if (type == 'VIDEO')
                        desc += '<div class="clear"></div><video id="video" style="max-width: 100%; max-height: 100%;" tabindex="0" controls="" preload="none">' +
							'<source type="video/mp4" src="' + value.Attachment + '"></source></video>';
                }
                console.log(value);
                desc += '<div class="posts-actn"><span class="post-created-time">' + data.timestampFormatted + '</span>' +
	        		'<a href="#" class="like fa fa-thumbs-o-up ' + (hasLikes ? 'disabled' : '') + '"> (' + data.Likes + ')</a><a href="#" class="reply fa fa-mail-reply"></a>' +
					'<a href="#" class="fa fa-comments comments"> (' + (data.lstFeedComments ? data.lstFeedComments.length : 0) + ')</a></div>';
                var cmnt = rxHome.addComments(data);
                desc += cmnt + '</div>';
                postItem.append(desc);
                postItem.data('postItem', data);
            }
        });
        $('.posts-actn a.comments, .posts-actn a.reply').unbind('click').bind('click', function () {
            var txtrea = $('textarea', $(this).parents('.posts-item').eq(0));
            txtrea.focus();
            return false;
        });
        rxHome.insertComment();
        rxHome.addLike();
    },
    insertNewFeed: function () {
        //var frm = $('#post-form'), 
        inp = $('#add-post');
        inp.bind('click', function () {
            if (!rxHome.bCreate) { alert('please wait until file uplaoded'); return false; }
            var message = $('#create-post').val(),
    			attachment = rxHome.filesSelected;
            message = message.trim();
            if(message == '' && message.length == 0 && (attachment == null || attachment == '')) {
            	alert('Enter any text');
            	rxHome.bEnter = true;
                return false;
            }
            /*if (message == '' || message.length == 0) {
                alert('Please enter a message');
                return false;
            }*/
            rxHome.insertUserFeed(message, attachment);
            return false;
        });
    },
    insertUserFeed: function (message, attachment) {
        if(!rxHome.bEnter) return false; rxHome.bEnter = false;
    	var feedData = {};
        //alert(Services.defaults.companyId);
        feedData.Company_Id = Services.defaults.companyId;
        feedData.Feed_User_Id = Services.defaults.userId;
        feedData.User_Id = Services.defaults.userId;

        feedData.Timestamp = Date.getDateString();
        feedData.Message_Text = (message && message.length > 0 ? message : '');
        feedData.Message_Text = feedData.Message_Text.autoLink();
        feedData.Action_Required = false;
        feedData.Attachment = attachment;
        //alert(JSON.stringify(feedData));
        Services.insertUserFeed(feedData, function (data) {
            rxHome.filesSelected = null;
            //$('#post-form textarea').val('');
            $('#create-post').val('');
            $("#create-post").css("min-height", "35px");
            $(".form-btn").hide();
            $('.post-uploaded-files').empty();
            rxHome.getUpdateFeedsForUser();
            rxHome.bEnter = true;
        }, function (e) {
        	rxHome.bEnter = true;
        	app.ajaxFailure(e);
        });
    },
    showMore: function () {
        $('.btn-smore').on('click', function () {
            var postItem = $('.posts-item').last().data('postItem');
            if (!postItem) return false;
            rxHome.lastFeedId = postItem.Id; //alert(postItem.Id);
            rxHome.getUserFeedsAfterId();
            return false;
        });
    },
    insertComment: function () {
        $('.add-comment').unbind('keypress').bind('keypress', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                var curPost = $(this).parents('.posts-item').eq(0);
                var feedCommentData = {}
                feedCommentData.UserId = Services.defaults.userId;
                feedCommentData.FeedId = curPost.data('postItem').Id;
                feedCommentData.FeedMasterId = curPost.data('postItem').Feed_Master_Id;
                feedCommentData.MessageText = $(this).val();
                feedCommentData.MessageText = feedCommentData.MessageText.autoLink();
                feedCommentData.Attachment = null;
                Services.insertUserComment(feedCommentData, function (data) {
                    if (data) {
                        rxHome.getUserFeedsById(curPost.data('postItem').Id);
                    }
                }, function () { });
            }
        });
    },
    addLike: function () {
        var el = $('.posts-item');
        $('.posts-actn .like').unbind('click').bind('click', function () {
            if ($(this).hasClass('disabled'))
                return false;

            var el = $(this).parents('.posts-item').eq(0);
            var obj = el.data('postItem');
            Services.updateFeedLikes(obj.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                rxHome.getUserFeedsById(obj.Id);
            }, null);
            return false;
        });
        //var value = el.eq(ind).data('postItem');
    },
    fileUpload: function () {
        var _this = this;
        var triggerEl = $('#add-image,#add-video,#add-camera');
        triggerEl.bind('click', function () {
            var fileBrowseOptions = {};
            if ($(this).attr('id') == 'add-image') {
                rxHome.fileUploadType = 'IMAGE';
                fileBrowseOptions = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: Camera.MediaType.PICTURE
                };
            } else if ($(this).attr('id') == 'add-camera') {
                rxHome.fileUploadType = 'IMAGE';
                fileBrowseOptions = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    correctOrientation: true,
                    mediaType: Camera.MediaType.PICTURE
                };
            } else {
                rxHome.fileUploadType = 'VIDEO';
                fileBrowseOptions = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: Camera.MediaType.VIDEO
                };
            }
            // Retrieve image file location from specified source
            navigator.camera.getPicture(function(imageURI) {
                rxHome.bCreate = false;
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/>' +
                '<img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
                $('.post-thumb-delete').bind('click', function () {
                    rxHome.filesSelected = '';
                    $('.post-thumb').remove();
                    rxHome.bCreate = true;
                    if(fileTransfer_g != null)
                        fileTransfer_g.abort();
                    return false;
                });
                rxHome.filesSelected = '';
                
                if(fileBrowseOptions.mediaType == Camera.MediaType.PICTURE) {
                	var storagePath = cordova.file.externalRootDirectory + "Kangle/files";
                	UploadImageResizer.resizeImage(imageURI, storagePath, function(data, width, height) {
                		var imgPath = storagePath + "/" + data.filename;
                		_this.validateAndUploadImage(imgPath, fileBrowseOptions.mediaType, function(response) {
                    		var jsonObject = JSON.parse(response.response);
                            rxHome.filesSelected = jsonObject.url;
                            if (jsonObject.url != '') {
                            	if (isImage(jsonObject.url))
                                    $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                                if (isVideo(jsonObject.url))
                                    $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                                $('img.loader').hide();
                                $('.post-uploaded-files').show();
                            } else {
                                $('.post-thumb-delete').trigger('click');
                            }
                            rxHome.bCreate = true;
                    	}, function(e) {
                    		$('.post-thumb-delete').trigger('click');
                            rxHome.bCreate = true;
                    	});
                    }, function(e) {
                    	alert('Unable to resize image, please try again.');
                    	$('.post-thumb-delete').trigger('click');
                        rxHome.bCreate = true;
                    });
                } else if(fileBrowseOptions.mediaType == Camera.MediaType.VIDEO) {
                	imageURI = JSON.parse(imageURI);
                	_this.validateAndUploadImageFileName(imageURI.path, fileBrowseOptions.mediaType, imageURI.name, function(data) {
                		var jsonObject = JSON.parse(data.response);
                        rxHome.filesSelected = jsonObject.url;
                        if (jsonObject.url != '') {
                        	if (isImage(jsonObject.url))
                                $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                            if (isVideo(jsonObject.url))
                                $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                            $('img.loader').hide();
                            $('.post-uploaded-files').show();
                        } else {
                            $('.post-thumb-delete').trigger('click');
                        }
                        rxHome.bCreate = true;
                	}, function(e) {
                		$('.post-thumb-delete').trigger('click');
                        rxHome.bCreate = true;
                	});
                } else {
                	_this.validateAndUploadImage(imageURI, fileBrowseOptions.mediaType, function(data) {
                		var jsonObject = JSON.parse(data.response);
                        rxHome.filesSelected = jsonObject.url;
                        if (jsonObject.url != '') {
                        	if (isImage(jsonObject.url))
                                $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                            if (isVideo(jsonObject.url))
                                $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                            $('img.loader').hide();
                            $('.post-uploaded-files').show();
                        } else {
                            $('.post-thumb-delete').trigger('click');
                        }
                        rxHome.bCreate = true;
                	}, function(e) {
                		$('.post-thumb-delete').trigger('click');
                        rxHome.bCreate = true;
                	});
                }
                /*rxHome.passFileSizeValidation(imageURI, function(isPass) {
                    if(isPass) {
                        _this.uploadFileTransfer(imageURI, null, function(response) {
                             if (response.responseCode == 200 && response.type != 'ERROR') {
                                 var jsonObject = JSON.parse(response.response);
                                 rxHome.filesSelected = jsonObject.url;
                                 if (jsonObject.url != '') {
                                     $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                                     $('img.loader').hide();
                                 } else {
                                     $('.post-thumb-delete').trigger('click');
                                 }
                             } else if(response.type == 'ERROR') {
                                 alert('Please upload file size less than ' + (rxHome.imageMaxSize / 1024 / 1024) + ' MB');
                                 $('.post-thumb-delete').trigger('click');
                             } else {
                                 $('.post-thumb-delete').trigger('click');
                             }
                             rxHome.bCreate = true;
                        }, function(e) {
                            $('.post-thumb-delete').trigger('click');
                            rxHome.bCreate = true;
                            if(e.code != 4)
                                alert('Unable to upload picture.');
                        });
                    } else {
                        alert('Please upload file size less than ' + (rxHome.imageMaxSize / 1024 / 1024) + ' MB');
                        $('.post-thumb-delete').trigger('click');
                    }
                }, function(e) {
                    $('.post-thumb-delete').trigger('click');
                    alert('Unable to get picture');
                });*/
            }, function(message) {
                //alert('Unable to get picture.');
                $('.post-thumb-delete').trigger('click');
                rxHome.bCreate = true;
            }, fileBrowseOptions);
            
            return false;
        });
    },
    
    validateAndUploadImage: function(imageURI, mediaType, success, failure) {
    	var _this = this;
    	rxHome.passFileSizeValidation(imageURI, function(isPass) {
            if(isPass) {
                _this.uploadFileTransfer(imageURI, null, mediaType, function(response) {
                     if (response.responseCode == 200 && response.type != 'ERROR') {
                         if(success) success(response);
                     } else if(response.type == 'ERROR') {
                         alert('Please upload file size less than ' + (rxHome.imageMaxSize / 1024 / 1024) + ' MB');
                         if(failure) failure();
                     } else {
                    	 if(failure) failure();
                     }
                }, function(e) {
                    if(e.code != 4)
                        alert('Unable to upload picture.');
                    if(failure) failure(e);
                });
            } else {
                alert('Please upload file size less than ' + (rxHome.imageMaxSize / 1024 / 1024) + ' MB');
                if(failure) failure();
            }
        }, function(e) {
        	alert('Unable to get picture');
            if(failure) failure(e);
        });
    },
    validateAndUploadImageFileName: function(imageURI, mediaType, fileName, success, failure) {
    	var _this = this;
    	rxHome.passFileSizeValidation(imageURI, function(isPass) {
            if(isPass) {
                rxHome.uploadFileTransferFileName(imageURI, null, mediaType, fileName, function(response) {
                     if (response.responseCode == 200 && response.type != 'ERROR') {
                         if(success) success(response);
                     } else if(response.type == 'ERROR') {
                         alert('Please upload file size less than ' + (rxHome.imageMaxSize / 1024 / 1024) + ' MB');
                         if(failure) failure();
                     } else {
                    	 if(failure) failure();
                     }
                }, function(e) {
                    if(e.code != 4)
                        alert('Unable to upload picture.');
                    if(failure) failure(e);
                });
            } else {
                alert('Please upload file size less than ' + (rxHome.imageMaxSize / 1024 / 1024) + ' MB');
                if(failure) failure();
            }
        }, function(e) {
        	alert('Unable to get picture');
            if(failure) failure(e);
        });
    },
    getFileExtension: function (fileName) {
        if (fileName == null || fileName === undefined || fileName == '')
            return 'INVALID';
        var parts = fileName.split('.'), ext = parts[parts.length - 1];
        if (ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'bmp') {
            return 'IMAGE';
        } else if (ext == 'mp4' || ext == 'MOV' || ext == 'mov') {
            return 'VIDEO';
        }
        return 'INVALID';
    },
    loadFeedDetails: function () {
        var content = $("#content .posts-view");
        //var id = window.location.href;
        //id = parseInt(id.substr(id.lastIndexOf('/') + 1, id.length));
       
        Services.getUserFeedsById(feedId, function (data) {
            var value = data[0];
            var postItem = $('<div class="posts-item clearfix"></div>');
            postItem.append('<div class="posts-prof"><img src="' + (value.Profile_Photo_BLOB_URL !=null?value.Profile_Photo_BLOB_URL :Services.defaults.defaultThumbnail) + '" alt="" /></div>');

            var desc = '<div class="posts-desc"><div class="posts-title"><a href="UserProfile.Mobile.html?userId=' + (value.User_Id) + '" class="post-by-user">' + value.FirstName + '</a>' +
				'<span>' + (value.Action_Required ? value.Message_Text : '') + '</span></div>';
            var cmnt = '';
            if (value.Action_Required == false) {
            	var messageText = value.Message_Text;
                messageText = messageText.replace(/\n/g, "<br />");
                desc += '<p>' + messageText + '</p>';
                //desc += '<p>' + value.Message_Text + '</p>';
                if (value.Attachment != '') {
                    var type = rxHome.getFileExtension(value.Attachment);
                    if (type == 'IMAGE')
                        desc += '<img src="' + value.Attachment + '" alt="" id="feedImg"/>';
                    else if (type == 'VIDEO')
                        desc += '<div class="clear"></div><video id="video" style="max-width: 100%; max-height: 100%;" tabindex="0" controls="">' +
							'<source type="video/mp4" src="' + value.Attachment + '"></source></video>';
                }
                desc += '<div class="posts-actn"><span class="post-created-time">' + value.timestampFormatted + '</span>' +
					'<a href="#" class="like fa fa-thumbs-o-up"></a><a href="#" class="reply fa fa-mail-reply"></a>' +
					'<a href="#" class="fa fa-comments comments"> (' + (value.lstFeedComments ? value.lstFeedComments.length : 0) + ')</a>' +
					'</div>';
                cmnt += rxHome.addComments(value);
            }

            desc += cmnt + '</div>';
            postItem.append(desc);
            content.append(postItem);
            postItem.data('postItem', value);
            $('#feedImg').bind('click',function(){
                rxHome.bindImagePopup(this);
            });
            rxHome.insertComment();
            rxHome.addLike();
        }, null);
    },
    isUserLikes: function (postItem) {
        if (postItem.lstFeedAnalytics != null && postItem.lstFeedAnalytics.length > 0) {
            for (var i = 0; i <= postItem.lstFeedAnalytics.length - 1; i++) {
                var u = postItem.lstFeedAnalytics[i];
                if (u.UserId == Services.defaults.userId && u.Is_Liked == true)
                    return true;
            }
        }
        return false;
    },
    
    uploadFileTransfer: function(imageURI, data, mediaType, success, fail) {
        var options = new FileUploadOptions();
        options.fileKey="filename";
        if (mediaType == Camera.MediaType.PICTURE) {
        	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.jpg';
            options.mimeType="image/jpeg";
        }
        if (mediaType == Camera.MediaType.VIDEO) {
        	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.mp4';
            options.mimeType="video/mp4";
        }
        var params = {};
        params.companyId = Services.defaults.companyId;
        params.userId = Services.defaults.userId;
        
        options.params = params;
        
        fileTransfer_g = new FileTransfer();
        var url = CoreREST._addContext(CoreREST._defaultServer, ['Attachment', 'FileUpload']);
        fileTransfer_g.upload(imageURI, encodeURI(url), success, fail, options);
    },
    
    uploadFileTransferFileName: function(imageURI, data, mediaType, fileName, success, fail) {
        var options = new FileUploadOptions();
        options.fileKey="filename";
        options.fileName=fileName;
        //options.mimeType="image/jpeg";
        
        var params = {};
        params.companyId = Services.defaults.companyId;
        params.userId = Services.defaults.userId;
        
        options.params = params;
        
        var ft = new FileTransfer();
        var url = CoreREST._addContext(CoreREST._defaultServer, ['Attachment', 'FileUpload']);
        ft.upload(imageURI, encodeURI(url), success, fail, options);
    },
    
    passFileSizeValidation: function(imageURI, success, failure) {
        rxHome.getFileEntryURI(imageURI, function(fileEntry) {
            if(fileEntry.size <= rxHome.imageMaxSize) {
                if(success) success(true);
            } else {
                if(success) success(false);
            }
        }, function(e) { if(failure) failure(e); });
    },
    getFileEntryURI: function(imageUri, success, failure) {
        window.resolveLocalFileSystemURI(imageUri, function(fileEntry) {
            fileEntry.file(function(fileObj) {
                if(success) success(fileObj)
            }, failure);
        }, failure);
    },
    bindImagePopup: function(elem) {
    	function addImage(ref, imageUrl) {
        	ref.executeScript({ code: "var elem = document.createElement(\"img\"); " +
        			"elem.setAttribute(\"src\", \"" + imageUrl + "\");" +
        			"document.getElementsByTagName(\"body\")[0].appendChild(elem);"});
        }
		var ref = window.open("ImagePreview.html?image=" + encodeURIComponent($(elem).attr("src")), "_blank", "directories=no,location=no,status=no,scrollbars=no,resizable=no");
        ref.addEventListener('loadstart', function() {
        });
        ref.addEventListener('loadstop', function() { 
        	addImage(ref, $(elem).attr("src"));
        });
        ref.addEventListener('exit', function() { });
        //window.open(encodeURI($(elem).attr("src")), "_blank", "directories=no,location=no,status=no,scrollbars=no,resizable=no");
        //window.open("ImagePreview.html?image=" + $(elem).attr("src"), "_blank", "directories=no,location=no,status=no,scrollbars=no,resizable=no");
    }
};

var getExtension = function(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

var isImage = function(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
            //etc
            return true;
    }
    return false;
}

var isVideo = function(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
            // etc
            return true;
    }
    return false;
}