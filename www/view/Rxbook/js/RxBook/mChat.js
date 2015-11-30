//var mobileClient = new WindowsAzure.MobileServiceClient(MOBILE_SERVICE_URL, MOBILE_SERVICE_APP_KEY);
//var todoItemTable = mobileClient.getTable(AZURE_TABLE);
var UPLOAD_CONSTANTS_IMAGE = 'IMAGE';
var UPLOAD_CONSTANTS_VIDEO = 'VIDEO';
var UPLOAD_CONSTANTS_DOCUMENT = 'DOCUMENT';
var BYTES_TO_MB = 1024 * 1024;

function elementInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == value)
            return true;
    }
    return false;
}

var chat = {
    topicId: 0,
topic: null,
    selectedTopic: null,
    intervalId: null,
    filesSelected: null,
    currentDocumentType: '',
    previousId: 0,
    bCreate: null,
    bGroup: false,
    bEnter: true,
    supportedFileFormats: {},
    fileFormatsWithThumbnail: {},
    currentSelectedFile: null,
    currentImageFileName: null,
    currentDocumentType: '',
    init: function () {
        //if(callback)
          //chat.callback = callback;
        $(".form-btn").show();
        //chat.topicId = window.location.href;
        //chat.topicId = parseInt(chat.topicId.substr(chat.topicId.lastIndexOf('/') + 1, chat.topicId.length));
        chat.topicId = rxBookInit.parse('topicId');
        pubnub.triggerState(pubnub.stateDefaultKey, chat.topicId);
        //pubnub.bindChat = chat.refreshChats;
        pubnub.bindChat = function(d) {
        	var chatItems = $('.chat-items li'), lastMessageId = 0;
            if (chatItems && chatItems.length > 0)
                lastMessageId = chatItems.last().data('messageid');
            chat.getChats(true, lastMessageId);
        };
        chat.fileUpload();
        Services.getTopicById(Services.defaults.userId, chat.topicId, function (data) {
            chat.bCreate = true;
            if (data !== undefined && data != null) {
                chat.topic = data;
                if (data.Topic_Category == 3)
                    $('.chat-form').hide();
                else
                    $('.chat-form').show();
                chat.bGroup = false;
                $('#group-desc').hide();
                if (data.Topic_Category == 2) {
                    chat.bGroup = true;
                    chat.loadGroupChats(data);
                } else if (data.Topic_Category == 1) {
                    chat.loadSharedFilesDiv(data);
                }
                Services.getKADocumentTypeMaster(function (data) {
                    for (var i = 0 ; i < data.length; i++) {
                        var curObj = data[i];
                        if (chat.supportedFileFormats[curObj.Document_Type] == undefined) {
                            chat.supportedFileFormats[curObj.Document_Type] = new Array();
                        }
                        chat.supportedFileFormats[curObj.Document_Type].push(curObj.Extension);
                        chat.fileFormatsWithThumbnail[curObj.Extension] = curObj.Thumbnail_Url;

                    }
                chat.refreshChatsInterval();
                chat.getChats(false, 0);
                });
                
                chat.resizeChatView();
                $(window).resize(function () {
                    chat.resizeChatView();
                });
                $('.chat-container').niceScroll();
                chat.createChat();
                chat.selectedTopic = data;
            }

            var cScroll = $('.chat-container').getNiceScroll().eq(0);
            cScroll.onscrollend = function (e) {
                if (e.end.y <= 0) {
                    chat.getChatsBeforeId(cScroll);
                }
            };

        }, function () {
          //if(chat.callback)
          //chat.callback();
        	app.bindUserErrorFeed($(".chat-items"), networkProblemError);
        	$('.chat-form').hide();
        });
    },
    loadGroupChats: function (data) {
        console.log(data);
        $('#group-desc').show();
        $('#group-desc h2 ').html(data.Topic_Name + '<a href="GroupMembers.Mobile.html?topicId=' + data.Topic_Id + '" class="group-member fa fa-group" title="show member"></a>'+
                '<a href="SharedFiles.html?topicId=' + data.Topic_Id + '" class="shared-files fa fa-file-text" title="show member"></a>');
        $('#group-desc ul').empty();
    },
    loadSharedFilesDiv: function(data) {
        $('#group-desc').show().css('text-align', 'right');
        $('#group-desc h2').html('<a href="SharedFiles.html?topicId=' + data.Topic_Id + '" class="shared-files fa fa-file-text" title="show member" style="display: block"></a>');
        $('#group-desc ul').empty();
    },
    refreshChatsInterval: function () {
        /*chat.intervalId = window.setInterval(function () {
            var chatItems = $('.chat-items li'), lastMessageId = 0;
            if (chatItems && chatItems.length > 0)
                lastMessageId = chatItems.last().data('messageid');
            chat.getChats(true, lastMessageId);
        }, 10000);*/
    },
    getChats: function (bNewChats, messageId) {
    	app.showLoading();
        Services.getMessage(Services.defaults.userId, chat.topicId, messageId, 0, function (data) {
            if (bNewChats) {
                chat.refreshChats(data);
            } else {
                chat.createChats(data);
            }
            var cont = $('.chat-container').get(0);
            $('.chat-container').getNiceScroll().resize();
            if (bNewChats) {
                if (data && data.length > 0)
                    $('.chat-container').animate({ scrollTop: cont.scrollHeight }, 200, null);
            } else {
                $('.chat-container').animate({ scrollTop: cont.scrollHeight }, 200, null);
            }
            app.hideLoading();
            //if(chat.callback)
            //chat.callback();
        }, function () {
            app.hideLoading();
            //if(chat.callback)
            //chat.callback();
        });
    },
    getChatsBeforeId: function (cScroll) {
        app.showLoading();
    	var chatCont = $('.chat-items');
        var chatItems = $('.chat-items li'), firstMessageId = 0;
        if (chatItems && chatItems.length > 0)
            firstMessageId = chatItems.first().data('messageid');

        Services.getMessageBeforeId(Services.defaults.userId, chat.topicId, firstMessageId, 0, function (messages) {
            if (messages && messages.length > 0) {
                    app.hideLoading();                
                var html = '';
                for (var i = messages.length - 1; i >= 0; i--) {
                    var curMsg = messages[i];
                    //console.log(curMsg.timestampFormatted);
                    var cMessage = messages[i];
                    var el = $('.chat-items li#msg_' + cMessage.Message_Id);
                    if(el.size() > 0)
                    	return;
                    var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                    var hasAttachements = false;

                    if (cMessage.Attachment != undefined && cMessage.Attachment != null && cMessage.Attachment != 'null' && cMessage.Attachment != '')
                        hasAttachements = true;
                    var profilePic = (cMessage.Profile_Photo_BLOB_URL != null ? cMessage.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail);
                    var messageText = cMessage.Message_Text != null ? cMessage.Message_Text : "";
                    messageText = messageText.replace(/\n/g, "<br />");
                    html += '<li id="msg_' + cMessage.Message_Id + '" data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
				     '<div class="chat-prof"><img src="' + (isMe ? Services.defaults.myProfileURL : profilePic) + '" alt=""/></div>' +
				     '<div class="chat-box"><p><a href="UserProfile.Mobile.html?userId=' + cMessage.User_Id + '"><label>' + cMessage.FirstName + ' ' + cMessage.LastName +
                     '</label></a>';
                    if (hasAttachements) {
                        var type = chat.getFileType(cMessage.Attachment);
                        if (type == 'IMAGE') {
                        	html += '<img src="' + cMessage.Attachment + '" alt="" style="max-width: 100%;"/>';
                            //html += '<span class="chat-thumb-blk"><span class="chat-thumb"><span class="chat-thumb-over"><span class="fa-loader"></span><a href="' + cMessage.Attachment + '" class="fa fa-download"></a></span></span></span>';
                        } else {
                            html += '<span class="document-text"><span class="document-img"><a class="fa fa-file-text" href="' + cMessage.Attachment + '"></a></span>' +
                                '<span class="document-details"><span class="document-title">' + cMessage.Attachment_Name +
                                '</span><span class="document-type">' + cMessage.Attachment_Type.toLowerCase() + '</span></span></span>';
                        }
                    }
                    var messageText = cMessage.Message_Text;
                    messageText = messageText.replace(/\n/g, "<br />");

                    html += messageText + '</p><span>' + cMessage.timestampFormatted + '</span></div></li>';
                }
                chatCont.prepend(html);
                $('.chat-items li .chat-box img').bind("click", function (e) {
                    chat.bindImagePopup(this);
                });
                $('.chat-thumb-blk .fa-download').unbind('click').bind('click', function () {
                    var pEl = $(this).parents('.chat-thumb-blk').eq(0), top = pEl.offset().top, self = $(this);
                    $('.fa-download', pEl).hide();
                    $('.fa-loader', pEl).css('display', 'inline-block');
                    $('<img/>').load(function () {
                        $('.fa-loader', pEl).css('display', 'none');
                        //pEl.replaceWith('<img src="' + self.attr('href') + '" alt="" width="100%" height = "100%"/>');
                        // edit start for bzoom
                        chat.bindZoomableImage(self, pEl);
                    }).error(function () {
                        $('.fa-loader', pEl).css('display', 'none');
                        $('.fa-download', pEl).removeClass('fa-download').addClass('fa-refresh');
                    }).attr('src', self.attr('href'));
                    return false;
                });
            }
            app.hideLoading();
        }, function (e) {
        app.hideLoading();
        });
    },
    createChats: function (messages) {
        var chatCont = $('.chat-items');
        chatCont.empty();
        if (messages && messages.length > 0) {
            var html = '', wid = chat.setWidth(chatCont);
            for (var i = messages.length - 1; i >= 0; i--) {
                var cMessage = messages[i];
                var el = $('.chat-items li#msg_' + cMessage.Message_Id);
                if(el.size() > 0)
                	return;
                var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                var hasAttachements = false;
                if (cMessage.Attachment != undefined && cMessage.Attachment != null && cMessage.Attachment != 'null' && cMessage.Attachment != '')
                    hasAttachements = true;
                var profilePic = (cMessage.Profile_Photo_BLOB_URL != null ? cMessage.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail);
                var messageText = cMessage.Message_Text != null ? cMessage.Message_Text : "";
                messageText = messageText.replace(/\n/g, "<br />");
                html += '<li id="msg_' + cMessage.Message_Id + '" data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
			     '<div class="chat-prof"><img src="' + (isMe ? Services.defaults.myProfileURL : profilePic) + '" alt=""/></div>' +
			     '<div class="chat-box"><p><a href="UserProfile.Mobile.html?userId=' + cMessage.User_Id + '"><label>' + cMessage.FirstName + ' ' + cMessage.LastName +
                     '</label></a>';
                if (hasAttachements) {
                    var type = chat.getFileType(cMessage.Attachment);
                    if (type == 'IMAGE') {
                        html += '<img src="' + cMessage.Attachment + '" alt="" style="max-width: 100%;"/>';
                        //html += '<span class="chat-thumb-blk"><span class="chat-thumb"><span class="chat-thumb-over"><span class="fa-loader"></span><a href="' + cMessage.Attachment + '" class="fa fa-download"></a></span></span></span>';
                    } else {
                        //html += '<video id="video" style="max-width: 100%; max-height: 100%;" tabindex="0" controls="" preload="none">' +
                        //	'<source type="video/mp4" src="' + cMessage.Attachment + '"></source></video>';
                        html += '<span class="document-text"><span class="document-img"><a class="fa fa-file-text" href="' + cMessage.Attachment + '" onclick="return chat.loadSystemURL(this);"></a></span>' +
                            '<span class="document-details"><span class="document-title">' + (cMessage.Attachment_Name != null ? cMessage.Attachment_Name : '') +
                            '</span><span class="document-type">' + (cMessage.Attachment_Type != null ? cMessage.Attachment_Type.toLowerCase() : 'document') + '</span></span></span>';
                    }
                }

                var messageText = cMessage.Message_Text;
                messageText = messageText.replace(/\n/g, "<br />");

                html += messageText + '</p><span>' + cMessage.timestampFormatted + '</span></div></li>';

                if (!cMessage.Is_Read) {
                    /*Services.markIsRead(Services.defaults.userId, cMessage.Message_Id, function (data) {
                    	app.getUnreadCounts();
                    }, function () { 
                    	app.getUnreadCounts();
                    });*/
                }
            }
            chatCont.html(html);
            $('.chat-items li .chat-box img').bind("click", function (e) {
                chat.bindImagePopup(this);
            });
            $('.chat-thumb-blk .fa-download').unbind('click').bind('click', function () {
                var pEl = $(this).parents('.chat-thumb-blk').eq(0), top = pEl.offset().top, self = $(this);
                $('.fa-download', pEl).hide();
                $('.fa-loader', pEl).css('display', 'inline-block');
                $('<img/>').load(function () {
                    $('.fa-loader', pEl).css('display', 'none');
                    //pEl.replaceWith('<img src="' + self.attr('href') + '" alt="" width="100%" height = "100%"/>');
                    // edit start for bzoom
                    chat.bindZoomableImage(self, pEl);
                }).error(function () {
                    $('.fa-loader', pEl).css('display', 'none');
                    $('.fa-download', pEl).removeClass('fa-download').addClass('fa-refresh');
                }).attr('src', self.attr('href'));
                return false;
            });
        }
    },
    setWidth: function (chatCont) {
        var wid = chatCont.width();
        var newWid = parseInt((wid * 74) / 100, 10);
        return newWid;
    },
    createChat: function () {
    	$('#message-text').bind('keyup', function(e){
    		if(e.keyCode == 13) {
    			$('#send-text').trigger('click');
    		}
    	});
        $('#send-text').unbind('click').bind('click', function () {
        	if (!chat.bCreate) { alert('please wait until file uplaoded'); return false; }
        	if(!chat.bEnter) return false; chat.bEnter = false;
            clearInterval(chat.intervalId);
            var chatText = $('#message-text').val();
            chatText = chatText.trim();
            if (chatText == '' && chatText.length == 0 && (chat.filesSelected == null || chat.filesSelected == '')) {
                alert('Enter any text');
                chat.bEnter = true;
                return false;
            }
            var msgObj = {};
            msgObj.TimeStamp = 0;
            msgObj.Message_Text = chatText;
            msgObj.Message_Text = msgObj.Message_Text.autoLink();
            //alert(msgObj.Message_Text);
            msgObj.utcOffset = Services.defaults.utcOffset;
            msgObj.Priority = true;
            msgObj.Delivery_Mode = "N";
            msgObj.Attachment = chat.filesSelected;

            if (chat.currentSelectedFile != null) {
                msgObj.Attachment_Name = chat.currentSelectedFile.name != null ? chat.currentSelectedFile.name : chat.currentImageFileName;
                msgObj.Attachment_Type = chat.fileUploadType;
                msgObj.Attachment_Thumbnail = chat.fileFormatsWithThumbnail['.' + chat.getFileExtension(msgObj.Attachment_Name)];
                msgObj.Attachment_Size_In_MB = (chat.currentSelectedFile.size != null ? (chat.currentSelectedFile.size / BYTES_TO_MB) : 0);
                msgObj.Is_Shared = 1;
            }
            var _this = this;
            $('.post-uploaded-files').html('');
            chat.resizeChatView();
            $('#message-text').attr('disabled', 'disabled');
            Services.sendMessage(Services.defaults.userId, chat.topicId, msgObj, function (data) {
                var chatItems = $('.chat-items li'), lastMessageId = 0;
                if (chatItems && chatItems.length > 0)
                    lastMessageId = chatItems.last().data('messageid');
                $('#message-text').val('');
                //chat.getChats(true, lastMessageId);
                chat.refreshChatsInterval();
                chat.filesSelected = null;
                chat.currentSelectedFile = null;
                $('.post-thumb-delete').trigger('click');
                $('#message-text').removeAttr('disabled');
                chat.bEnter = true;
            }, function (e) {
            	alert("Unable to send message.");
            	$('#message-text').removeAttr('disabled');
                chat.bEnter = true;
                $('#message-text').removeAttr('disabled');
            });
            return false;
        });
    },
    refreshChats: function (messages) {
        var chatCont = $('.chat-items');
        if (messages && messages.length > 0) {
        	var html = '', wid = chat.setWidth(chatCont);
            for (var i = messages.length - 1; i >= 0; i--) {
            	var cMessage = messages[i];
            	if(chat.topicId != cMessage.Topic_Id) {
            		app.bindOtherNotification(cMessage);
            		return;
            	}
            	var el = $('.chat-items li#msg_' + cMessage.Message_Id);
            	if(el.size() > 0)
                	return;
            	var isMe = (cMessage.User_Id == Services.defaults.userId ? true : false);
                var hasAttachements = false;
                if (cMessage.Attachment != undefined && cMessage.Attachment != null && cMessage.Attachment != 'null' && cMessage.Attachment != '')
                    hasAttachements = true;
                var profilePic = (cMessage.Profile_Photo_BLOB_URL != null ? cMessage.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail);
                html += '<li id="msg_' + cMessage.Message_Id + '" data-messageid="' + cMessage.Message_Id + '" class="clearfix ' + (isMe ? 'chat-right' : '') + '">' +
				     '<div class="chat-prof"><img src="' + (isMe ? Services.defaults.myProfileURL : profilePic) + '" alt=""/></div>' +
				     '<div class="chat-box"><p><a href="UserProfile.Mobile.html?userId=' + cMessage.User_Id + '"><label>' + cMessage.FirstName + ' ' + cMessage.LastName +
                     '</label></a>';
                if (hasAttachements) {
                    var type = chat.getFileType(cMessage.Attachment);
                    if (type == 'IMAGE') {
                        html += '<img src="' + cMessage.Attachment + '" alt="" style="max-width: 100%;"/>';
                        //html += '<span class="chat-thumb-blk"><span class="chat-thumb"><span class="chat-thumb-over"><span class="fa-loader"></span><a href="' + cMessage.Attachment + '" class="fa fa-download"></a></span></span></span>';
                    } else {
                        //html += '<video id="video" style="max-width: 100%; max-height: 100%;" tabindex="0" controls="" preload="none">' +
                        //	'<source type="video/mp4" src="' + cMessage.Attachment + '"></source></video>';
                        html += '<span class="document-text"><span class="document-img"><a class="fa fa-file-text" href="' + cMessage.Attachment + '" onclick="return chat.loadSystemURL(this);"></a></span>' +
                            '<span class="document-details"><span class="document-title">' + (cMessage.Attachment_Name != null ? cMessage.Attachment_Name : '') +
                            '</span><span class="document-type">' + (cMessage.Attachment_Type != null ? cMessage.Attachment_Type.toLowerCase() : "document") + '</span></span></span>';
                    }
                }
                var messageText = cMessage.Message_Text;
                messageText = messageText.replace(/\n/g, "<br />");
                html += messageText + '</p><span>' + cMessage.timestampFormatted + '</span></div></li>';
                if (!cMessage.Is_Read && !isMe) {
                    /*Services.markIsRead(Services.defaults.userId, cMessage.Message_Id, function (data) {
                        app.getUnreadCounts();
                    }, function () {
                    	app.getUnreadCounts();
                    });*/
                }
            }
            chatCont.append(html);
            $('.chat-items li .chat-box img').bind("click", function (e) {
                chat.bindImagePopup(this);
            });
            $('.chat-thumb-blk .fa-download').unbind('click').bind('click', function () {
                var pEl = $(this).parents('.chat-thumb-blk').eq(0), top = pEl.offset().top, self = $(this);
                $('.fa-download', pEl).hide();
                $('.fa-loader', pEl).css('display', 'inline-block');
                $('<img/>').load(function () {
                    $('.fa-loader', pEl).css('display', 'none');
                    //pEl.replaceWith('<img src="' + self.attr('href') + '" alt="" width="100%" height = "100%"/>');
                    // edit start for bzoom
                    chat.bindZoomableImage(self, pEl);
                }).error(function () {
                    $('.fa-loader', pEl).css('display', 'none');
                    $('.fa-download', pEl).removeClass('fa-download').addClass('fa-refresh');
                }).attr('src', self.attr('href'));
                return false;
            });
        }
        $('.chat-container').getNiceScroll().resize();
        var cont = $('.chat-container').get(0);
        $('.chat-container').animate({ scrollTop: cont.scrollHeight }, 200, null);
    },
    
    loadSystemURL: function(element) {
    	var $elem = $(element);
    	var href = $elem.attr("href");
    	window.open(href, "_system");
    	return false;
    },
    resizeChatView: function () {
        var hgt = $(window).height() - ($('.chat-form').outerHeight() + 44 + 25 + 35);
        if (chat.bGroup) {
            hgt = hgt - 12;
        }
        $('.chat-container').css('height', hgt + 'px');
    },
    
    fileUpload: function () {
        var _this = this;
        var triggerEl = $('#add-image,#add-video,#add-camera,#add-doc');
        triggerEl.bind('click', function () {
            var fileBrowseOptions = {};
            if ($(this).attr('id') == 'add-image') {
                chat.fileUploadType = 'IMAGE';
                fileBrowseOptions = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: Camera.MediaType.PICTURE
                };
            } else if ($(this).attr('id') == 'add-camera') {
            	chat.fileUploadType = 'IMAGE';
                fileBrowseOptions = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    correctOrientation: true,
                    mediaType: Camera.MediaType.PICTURE
                };
            } else if($(this).attr('id') == 'add-doc') {
            	fileBrowseOptions = {
                    mediaType: UPLOAD_CONSTANTS_DOCUMENT
                };
            	return chat.addDocument(this, fileBrowseOptions);
            } else {
                chat.fileUploadType = 'VIDEO';
                fileBrowseOptions = {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: Camera.MediaType.VIDEO
                };
            }
            navigator.camera.getPicture(function(imageURI) {
            	chat.resizeChatView();
                chat.processAndStartUpload(fileBrowseOptions, imageURI);
            }, function(message) {
                alert('Unable to get picture.');
            }, fileBrowseOptions);

            return false;
        });
    },
    
    processAndStartUpload: function(fileBrowseOptions, imageURI) {
    	chat.bCreate = false
        
        $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/>' +
        '<img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
        $('.post-thumb-delete').bind('click', function () {
            chat.filesSelected = '';
            chat.currentSelectedFile = null;
            $('.post-thumb').remove();
            chat.bCreate = true;
            if(fileTransfer_g != null)
            fileTransfer_g.abort();
            return false;
        });
        chat.filesSelected = '';
        chat.currentSelectedFile = imageURI;
        if(fileBrowseOptions.mediaType == Camera.MediaType.VIDEO) {
        	imageURI = JSON.parse(imageURI);
        	chat.currentSelectedFile = imageURI;
        	rxHome.validateAndUploadImageFileName(imageURI.path, fileBrowseOptions.mediaType, imageURI.name, function(data) {
        		var jsonObject = JSON.parse(data.response);
        		chat.filesSelected = jsonObject.url;
                if (jsonObject.url != '') {
                	if (isImage(jsonObject.url))
                        $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                	else if (isVideo(jsonObject.url))
                        $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                	else 
                		$('.post-uploaded-files img.post-img').attr('src', 'http://wideanglebuilds.blob.core.windows.net/wideangleimages/Default_Document.png');
                    $('img.loader').hide();
                    $('.post-uploaded-files').show();
                } else {
                    $('.post-thumb-delete').trigger('click');
                }
                chat.bCreate = true;
        	}, function(e) {
        		$('.post-thumb-delete').trigger('click');
        		chat.bCreate = true;
        	});
        } else if(fileBrowseOptions.mediaType == Camera.MediaType.PICTURE) {
        	var storagePath = cordova.file.externalRootDirectory + "Kangle/files";
        	UploadImageResizer.resizeImage(imageURI, storagePath, function(data, width, height) {
        		var imgPath = storagePath + "/" + data.filename;
        		chat.currentImageFileName = data.filename;
        		rxHome.validateAndUploadImage(imgPath, fileBrowseOptions.mediaType, function(response) {
            		var jsonObject = JSON.parse(response.response);
            		chat.filesSelected = jsonObject.url;
                    if (jsonObject.url != '') {
                    	if (isImage(jsonObject.url))
                            $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                    	else if (isVideo(jsonObject.url))
                            $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                    	else 
                    		$('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                        $('img.loader').hide();
                        $('.post-uploaded-files').show();
                    } else {
                        $('.post-thumb-delete').trigger('click');
                    }
                    chat.bCreate = true;
            	}, function(e) {
            		$('.post-thumb-delete').trigger('click');
            		chat.bCreate = true;
            	});
            }, function(e) {
            	alert('Unable to resize image, please try again.');
            	$('.post-thumb-delete').trigger('click');
            	chat.bCreate = true;
            });
        } else if(typeof imageURI != "string") {
        	rxHome.validateAndUploadImageFileName(imageURI.path, fileBrowseOptions.mediaType, imageURI.name, function(data) {
        		var jsonObject = JSON.parse(data.response);
        		chat.filesSelected = jsonObject.url;
                if (jsonObject.url != '') {
                	if (isImage(jsonObject.url))
                        $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                	else if (isVideo(jsonObject.url))
                        $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                	else 
                		$('.post-uploaded-files img.post-img').attr('src', 'http://wideanglebuilds.blob.core.windows.net/wideangleimages/Default_Document.png');
                    $('img.loader').hide();
                    $('.post-uploaded-files').show();
                } else {
                    $('.post-thumb-delete').trigger('click');
                }
                chat.bCreate = true;
        	}, function(e) {
        		$('.post-thumb-delete').trigger('click');
        		chat.bCreate = true;
        	});
        } else {
        	rxHome.validateAndUploadImage(imageURI, fileBrowseOptions.mediaType, function(data) {
        		var jsonObject = JSON.parse(data.response);
        		chat.filesSelected = jsonObject.url;
                if (jsonObject.url != '') {
                	if (isImage(jsonObject.url))
                        $('.post-uploaded-files img.post-img').attr('src', jsonObject.url);
                	else if (isVideo(jsonObject.url))
                        $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                	else 
                		$('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                    $('img.loader').hide();
                    $('.post-uploaded-files').show();
                } else {
                    $('.post-thumb-delete').trigger('click');
                }
                chat.bCreate = true;
        	}, function(e) {
        		$('.post-thumb-delete').trigger('click');
        		chat.bCreate = true;
        	});
        }
    },
    
    validateAndUploadImage: function(imageURI, mediaType, success, failure) {
    	var _this = this;
    	rxHome.passFileSizeValidation(imageURI, function(isPass) {
            if(isPass) {
                rxHome.uploadFileTransfer(imageURI, null, mediaType, function(response) {
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
    getFileType: function (fileName) {
        if (fileName == null || fileName === undefined || fileName == '')
            return 'INVALID';
        var parts = fileName.split('.'), ext = parts[parts.length - 1];
        if (ext == 'jpg' || ext == 'gif' || ext == 'png') {
            return 'IMAGE';
        } else if (ext == 'mp4' || ext == 'MOV' || ext == 'mov') {
            return 'VIDEO';
        }
        return 'INVALID';
    },
    getFileExtension: function (fileName) {
        if (fileName == null || fileName === undefined || fileName == '')
            return 'INVALID';
        var parts = fileName.split('.'), ext = parts[parts.length - 1];
        return ext;
    },
    uploadFileTransfer: function(imageURI, data, success, fail) {
        var options = new FileUploadOptions();
        options.fileKey="filename";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
        options.mimeType="image/jpeg";
        
        var params = {};
        params.companyId = Services.defaults.companyId;
        params.userId = Services.defaults.userId;
        
        options.params = params;
        
        var ft = new FileTransfer();
        var url = CoreREST._addContext(CoreREST._defaultServer, ['Attachment', 'FileUpload']);
        ft.upload(imageURI, encodeURI(url), success, fail, options);
    },
    
    uploadFileTransferFileName: function(imageURI, data, fileName, success, fail) {
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
    
    /*new shared file*/
    
    checkIsValidFileExtension: function (type, ext) {
        var docExtensions = chat.supportedFileFormats[type];
        if (elementInArray(docExtensions, '.' + ext)) {
            return true;
        }
        return false;
    },
    createSharedFilesView: function (data) {
        var html = '';
        $('.dvDocSearchElement').not('.docListHeading').remove();
        if (data && data.length > 0) {
        	//$('.dvDocSearch, .dvDocFilter').css('display','block');
            for (var i = 0 ; i < data.length; i++) {
                var file = data[i];
                var fileImg = 'fa-file-text';
                if (file.Attachment_Type == 'VIDEO')
                    fileImg = 'fa-file-movie-o';
                else if (file.Attachment_Type == 'IMAGE')
                    fileImg = 'fa-file-image-o';
                else if (file.Attachment_Type == 'AUDIO')
                    fileImg = 'fa-file-audio-o';
                //<img src="' + file.Attachment_Thumbnail + '">
                console.log(file);
                html += '<div class="dvDocSearchElement" data-id="">';
                html += '<div class="dvDocSearchThumb"><span class="fa ' + fileImg + '"></span><a href="' + file.Attachment + '" class="fa fa-download down-link"></a></div>';
                html += '<p class="title"><span class="fa ' + fileImg + '">&nbsp;</span>' + file.Attachment_Name + '<a href="' + file.Attachment + '" class="fa fa-download down-link"></a></p>';
                html += '<p class="docType">' + file.Attachment_Type.toLowerCase() + '</p>';
                html += '<p class="dateTime">' + file.timestampFormatted + '</p>';
                html += '<p class="userName">' + file.EmployeeName.toLowerCase() + ' (' + file.RegionName.toLowerCase() + ')' + '</p></div>';
            }
        } else {
        	//$('.dvDocSearch, .dvDocFilter').css('display','none');
        	//$('.dvDocSearchResult').css('paddin-top','55');
            html += '<div class="dvDocSearchElement">No Records found</div>';
        }
        $('.dvDocSearchResult').append(html);
        $('.fa-download.down-link').bind('click',function(){
        	window.open($(this).attr('href'), '_system');
        	return false;
        });
        
    },
    /*showFileShared: function () {
        Services.getSharedFiles(chat.topicId, function (data) {
            chat.createSharedFilesView(data);
            $('.dvDocSearch .fa-search').unbind('click').bind('click', function () {
                var val = $('.dvDocSearch input').val().toLowerCase();
                chat.getSearchResults(data, val);
                return false;
            });
            $('.dvDocSearch input').bind('keyup', function (e) {
                console.log(e);
                //if (e.keyCode == 13) {
                    var val = $('.dvDocSearch input').val().toLowerCase();
                    chat.getSearchResults(data, val);
                //}
            });
            $('.fa-filter').unbind('click').bind('click', function () {
                $('.dvFilterOptions').toggle();
            });

            $('.dvFilterOptions input').unbind('change').bind('change', function () {
                var newVal = new Array();
                $('.dvFilterOptions input[name="file-type"]').each(function () {
                    if(this.checked)
                    newVal.push(this.value);
                });

                var newData = new Array();
                if (newVal.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var curRow = data[i];
                        if (newVal.indexOf(curRow.Attachment_Type) > -1)
                            newData.push(curRow);
                    }
                } else {
                    newData = data;
                }
                chat.createSharedFilesView(newData);
                return false;
            });
        });
    },
    getSearchResults: function (data, val) {
        var isSearchByName = (val.charAt(0) == '@' ? true : false);
        var newData = new Array();
        if (isSearchByName) val = val.substr(1, val.length);
        for (var i = 0; i < data.length; i++) {
            if (isSearchByName) {
                if (data[i].EmployeeName && data[i].EmployeeName.toLowerCase().indexOf(val) > -1) {
                    newData.push(data[i]);
                }
            } else {
                console.log(data[i].EmployeeName.toLowerCase().indexOf(val));
                if (data[i].Attachment_Name && data[i].Attachment_Name.toLowerCase().indexOf(val) > -1) {
                    newData.push(data[i]);
                }
            }
        }
        chat.createSharedFilesView(newData);
    },*/
    
    /* 4-15-2015 - chat page for changes shared file  */
     showFileShared: function () {
    	        Services.getSharedFiles(chat.topicId, function (data) {
    	            chat.createSharedFilesView(data);
    	            $('.dvDocSearch .fa-search').unbind('click').bind('click', function () {
    	                var val = $('.dvDocSearch input').val().toLowerCase();
    	                chat.getSearchResults(data, val);
    	                return false;
    	            });
    	            $('.dvDocSearch input').bind('keyup', function (e) {
    	                if (e.keyCode == 13) {
    	                    var val = $('.dvDocSearch input').val().toLowerCase();
    	                    var newVal = chat.getSelectedFilters();
    	                    chat.getSearchResults(data, val, newVal);
    	                }
    	            });
    	            $('.fa-filter').unbind('click').bind('click', function () {
    	                $('.dvFilterOptions').toggle();
    	            });

    	            $('.dvFilterOptions input').unbind('change').bind('change', function () {
    	                var val = $('.dvDocSearch input').val().toLowerCase();
    	                var newVal = chat.getSelectedFilters();
    	                chat.getSearchResults(data, val, newVal);
    	                return false;
    	            });
    	        });
    	    },
    	    getSearchResults: function (data, val, checkArray) {
    	        var isSearchByName = (val.charAt(0) == '@' ? true : false);
    	        var newData = new Array();
    	        if (isSearchByName) val = val.substr(1, val.length);
    	        for (var i = 0; i < data.length; i++) {
    	            if (isSearchByName) {
    	                if (data[i].EmployeeName && data[i].EmployeeName.toLowerCase().indexOf(val) > -1) {
    	                    newData.push(data[i]);
    	                }
    	            } else {
    	                console.log(data[i].EmployeeName.toLowerCase().indexOf(val));
    	                if (data[i].Attachment_Name && data[i].Attachment_Name.toLowerCase().indexOf(val) > -1) {
    	                    newData.push(data[i]);
    	                }
    	            }
    	        }

    	        if (checkArray && checkArray.length > 0) {
    	            var filterArray = new Array();
    	            for (var i = 0; i < newData.length; i++) {
    	                var curRow = newData[i];
    	                if (checkArray.indexOf(curRow.Attachment_Type) > -1) {
    	                    filterArray.push(curRow);
    	                }
    	            }
    	            newData = filterArray;
    	        }

    	        chat.createSharedFilesView(newData);
    	    },
    	    getSelectedFilters: function () {
    	        var newVal = new Array();
    	        $('.dvFilterOptions input[name="file-type"]').each(function () {
    	            if (this.checked)
    	                newVal.push(this.value);
    	        });
    	        return newVal;
    	    },
    
    addDocument: function(element, fileBrowseOptions){
    	fileChooser.open(function(data){
    		data = JSON.parse(data);
    		var imgExt = chat.getFileExtension(data.name);
    		var docCheckType = 0;
            if (chat.checkIsValidFileExtension(UPLOAD_CONSTANTS_DOCUMENT, imgExt)) {
            	chat.fileUploadType = UPLOAD_CONSTANTS_DOCUMENT;
            } else if (chat.checkIsValidFileExtension(UPLOAD_CONSTANTS_VIDEO, imgExt)) {
            	chat.fileUploadType = UPLOAD_CONSTANTS_VIDEO;
            } else if (chat.checkIsValidFileExtension(UPLOAD_CONSTANTS_IMAGE, imgExt)) {
            	chat.fileUploadType = UPLOAD_CONSTANTS_IMAGE;
            }
            fileBrowseOptions.mediaType = chat.fileUploadType; 
    		chat.processAndStartUpload(fileBrowseOptions, data);
    	}, function(){
    		alert('Unabble to add document');
    	});
    },
    
    /*new shared file*/
    	    
	// zoomable image
	bindZoomableImage: function (self, pEl) {
	    var messageId = self.parents("li").eq(0).data("messageid");
	    messageId = 'chat_img_' + messageId;
	    var $img = $('<img class="chat_img" src="' + self.attr('href') + '" id="' + messageId + '" alt="" width="100%" height = "100%"/>');
	    pEl.replaceWith($img);
	    $img.bind("click", function (e) {
	        chat.bindImagePopup(this);
	    });
	    /*Zoomerang.config({
	        onOpen: function () {
	            $(".chat-items li").css("z-index", "0");
	        },
	        onClose: function () {
	            $(".chat-items li").css("z-index", "auto");
	        }
	    }).listen('.chat_img');*/
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
	}
	// zoomable image
    
};

/*help text*/

/*help text*/