var rxHome = {
    el: $('.posts-view'),
    lastFeedId: 0,
    firstFeedId: 0,
    lastStreamId: 0,
    lastCompanyStreamId: 0,
    updateFeedInterval: 180000,
    filesSelected: null,
    start: 1,
    companystart: 1,
    bCreate: true,
    init: function () {
        $('#menu-home').addClass('active');
        rxCommon.togglePostBtn(false);
        rxHome.getUpdateFeedsForUser();
        rxHome.startActivityThread();
        rxHome.fileUpload();
        rxHome.insertNewFeed();
        rxHome.showMore();
    },
    /*getUserFeedsForUser: function () {
        Services.getUserFeeds(Services.defaults.userId, 0, function (data) {
            if (data.length <= 0)
                $('.btn-smore').hide();
            else
                rxHome.bindUserFeed(rxHome.el, data);
        }, null);
    },*/
    getUserFeedsAfterId: function () {
        Services.getUserFeedAfterId(Services.defaults.userId, rxHome.firstFeedId, function (data) {
            if(data.length > 0)
                rxHome.bindUserFeed(rxHome.el, data);
            else
                $('.btn-smore').hide();
        }, null);
    },
    getUpdateFeedsForUser: function () {
        var postItem = $('.posts-item').first().data('postItem');
        if (postItem != null) rxHome.lastFeedId = postItem.Id;
        else rxHome.lastFeedId = 0;
        Services.getUserFeeds(Services.defaults.userId, rxHome.lastFeedId, function (data) {
            var newDatas = new Array();
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    newDatas.push(data[data.length - (i + 1)]);
                }
                rxHome.bindUserFeed(rxHome.el, newDatas, true);
            }
        }, null);
    },
    getUserFeedsById: function (feedId, success) {
        Services.getUserFeedsById(feedId, function (data) {
            rxHome.refreshPost(data[0]);
            if (success) success(data[0]);
        }, null);
    },
    bindUserFeed: function (el, data, bUpdated) {
        $('.btn-smore').show();

        $.each(data, function (index, value) {
            var postItem = $('<div class="posts-item clearfix"></div>');
            postItem.data('postItem', value);
            postItem.append('<div class="posts-prof"><a href="/User/UserProfile/' + value.User_Id + '"><img src="' + (value.Profile_Photo_BLOB_URL!=null?value.Profile_Photo_BLOB_URL:Services.defaults.defaultThumbnail) + '" alt="" /></a></div>');

            var postDesc = $('<div class="posts-desc"></div>');
            var postTitle = $('<div class="posts-title"><a href="/User/UserProfile/' + value.User_Id + '" class="post-by-user">' + value.FirstName + ' ' + value.LastName + '</a>' +
                '<span>' + (value.Action_Required ? value.Message_Text : '') + '</span></div>');
            postDesc.append(postTitle);
            postItem.append(postTitle);
            if (!value.Action_Required) {
                var postContent = $('<div class="post-content"></div>');
                postContent.append('<p>' + value.Message_Text + '</p>');
                if (value.Attachment != undefined && value.Attachment != null && value.Attachment != 'null' && value.Attachment != '') {
                    var attachment = null;
                    if (isImage(value.Attachment))
                        attachment = $('<a href="#"><img src="' + value.Attachment + '" alt="" /></a>');
                    if (isVideo(value.Attachment))
                        attachment = $('<video controls><source src="' + value.Attachment + '" type="video/mp4">Your browser does not support the video tag.</video>');
                    if (attachment != null && isImage(value.Attachment)) {
                        attachment.data('postItem', value);
                        attachment.bind('click', function (e) {
                            rxHome.bindPostPopup($(this).data('postItem'));
                            ShowModalPopup('dvPostOverlay');
                            return false;
                        });
                    }
                }
                postContent.append(attachment);
                postDesc.append(postContent);
                postDesc.append('<div style="clear: both"></div>');

                var postAction = $('<div class="posts-actn"></div>');
                var likeBtn = $('<a href="#" class="like" style="font-size: 12px;"><div class="fa fa-thumbs-up" style="color: #0054A5; font-size: 15px;"></div> Like (' + value.Likes + ') </a>');
                if (value.lstFeedAnalytics == null || value.lstFeedAnalytics.length <= 0 || !rxHome.isUserLikes(value)) {
                    likeBtn.bind('click', function (e) {
                        var postItem = $(this).parents('.posts-item').data('postItem');
                        Services.updateFeedLikes(postItem.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                            if (data) {
                                rxHome.getUserFeedsById(postItem.Id);
                            }
                        }, function (e) { });
                        return false;
                    });
                } else {
                    likeBtn.css('color', '#A6A6A6');
                    likeBtn.find('div').css('color', '#A6A6A6');
                    likeBtn.bind('click', function (e) { return false; });
                }
                /*var replyBtn = $('<a href="#" class="reply" style="font-size: 12px;"><div class="fa fa-mail-reply" style="color: #0054A5; font-size: 15px;"></div> Reply</a>');
                replyBtn.bind('click', function (e) {
                    postAction.find('.add-comment').focus();
                    return false;
                });*/
                var cmntBtn = $('<a href="#" class="comments" style="font-size: 12px;"><div class="fa fa-comments" style="color: #0054A5; font-size: 15px;"></div> Comment (' + (value.lstFeedComments ? value.lstFeedComments.length : 0) + ')</a>');
                cmntBtn.bind('click', function (e) {
                    postAction.find('.add-comment').focus();
                    return false;
                });
                var timeStamp = $('<span style="float: right;"><a href="#" style="font-size: 12px; color: #888;">' + value.timestampFormatted + '</a></span>');
                timeStamp.bind('click', function (e) {
                    return false;
                });
                var comments = rxHome.addComments(value);

                postAction.append(likeBtn);
                //postAction.append(replyBtn);
                postAction.append(cmntBtn);
                postAction.append(timeStamp);
                postAction.append(comments);
                postDesc.append(postAction);
            }
            postItem.append(postDesc);
            if (bUpdated)
                el.prepend(postItem);
            else
                el.append(postItem);
        });
        rxHome.insertComment();
        //rxHome.requestAction();
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
    bindPostPopup: function (postItem) {
        var postPopup = $('#postPopupContent'); 
        var postComments = $('#postPopupComments');
        if (postPopup.getNiceScroll().length > 0)
            postPopup.getNiceScroll().resize();
        else
            postPopup.niceScroll();
        if (postComments.getNiceScroll().length > 0)
            postComments.getNiceScroll().resize();
        else
            postComments.niceScroll();

        postPopup.empty();

        $('.popupPostUserPic').attr('src', postItem.Profile_Photo_BLOB_URL);
        $('#popupPostUserName').html('<a href="/User/UserProfile/' + postItem.User_Id + '">' + postItem.FirstName + '</a>');
        $('#popupPostTimestamp').html(postItem.timestampFormatted);

        var message = $('<p>' + postItem.Message_Text + '</p>');
        postPopup.append(message);
        
        if (postItem.Attachment != undefined && postItem.Attachment != null && postItem.Attachment != 'null' && postItem.Attachment != '') {
            var attachment = null;
            if (isImage(postItem.Attachment))
                attachment = $('<img src="' + postItem.Attachment + '" alt="" />');
            if (isVideo(postItem.Attachment))
                attachment = $('<video controls><source src="' + postItem.Attachment + '" type="video/mp4">Your browser does not support the video tag.</video>');
            attachment.bind('click', function (e) {
                return false;
            });
            postPopup.append(attachment);
        }

        var comments = rxHome.addPopupComments(postItem);
        postComments.html(comments);

        var postPopupActn = $('#postPopupActn');
        postPopupActn.empty();
        var likeBtn = $('<a href="#" class="like" style="font-size: 12px;"><div class="fa fa-thumbs-up" style="color: #0054A5; font-size: 15px;"></div> Like (' + postItem.Likes + ') </a>');
        if (postItem.lstFeedAnalytics == null || postItem.lstFeedAnalytics.length <= 0 || !rxHome.isUserLikes(postItem)) {
            likeBtn.bind('click', function (e) {
                //var postItem = $(this).parents('.posts-item').data('postItem');
                Services.updateFeedLikes(postItem.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                    if (data) {
                        rxHome.getUserFeedsById(postItem.Id, function (postResultItem) { rxHome.bindPostPopup(postResultItem); });
                        //rxHome.getUserFeedsById(postItem.Id);
                    }
                }, function (e) { });
                return false;
            });
        } else {
            likeBtn.css('color', '#A6A6A6');
            likeBtn.find('div').css('color', '#A6A6A6');
            likeBtn.bind('click', function (e) { return false; });
        }
        var replyBtn = $('<a href="#" class="reply" style="font-size: 12px;"><div class="fa fa-mail-reply" style="color: #0054A5; font-size: 15px;"></div> Reply</a>');
        replyBtn.bind('click', function (e) {
            $('#popupAddComment').focus();
            return false;
        });
        var cmntBtn = $('<a href="#" class="comments" style="font-size: 12px;"><div class="fa fa-comments" style="color: #0054A5; font-size: 15px;"></div> Comment (' + (postItem.lstFeedComments ? postItem.lstFeedComments.length : 0) + ')</a>');
        cmntBtn.bind('click', function (e) {
            $('#popupAddComment').focus();
            return false;
        });
        postPopupActn.append(likeBtn);
        //postPopupActn.append(replyBtn);
        postPopupActn.append(cmntBtn);

        $('#popupAddComment').val('');
        $('#popupImgComment').attr('src', Services.defaults.myProfileURL);
        rxHome.insertPopupComment(postItem);
    },
    startActivityThread: function () {
        setInterval(function () {
            rxHome.getUpdateFeedsForUser();
        }, rxHome.updateFeedInterval);
    },
    
    insertUserFeedComment: function () {
        var inputdata = new Array();
        var input = {};

        input.name = "subdomainName";
        input.value = Services.defaults.subdomainName;
        inputdata.push(input)

        var feedData = {}
        feedData.Company_Id = Services.defaults.companyId;
        feedData.Feed_User_Id = Services.defaults.userId;
        feedData.User_Id = Services.defaults.userId;
        feedData.Timestamp = new Date().toLocaleString();

        feedData.Message_Text = $("#txtPost").val();
        feedData.Action_Required = false;
        feedData.Attachment = null;

        input = {};

        input.name = "feedData";
        input.value = feedData;
        input.type = 'JSON'
        inputdata.push(input);

        Services.insertUserComment(feedData, function (data) { }, function (e) { });
    },
    addPopupComments: function (value) {
        var cmnt = '';
        if (value.lstFeedComments != null && value.lstFeedComments.length > 0) {
            $.each(value.lstFeedComments, function (ind, value1) {
                cmnt += '<div class="comment-item clearfix">';
                cmnt += '<div class="comment-prof"><a href="/User/UserProfile/' + value1.UserId + '"><img src="' + (value1.Profile_Photo_BLOB_URL != null ? value1.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt="" /></a></div>';
                cmnt += '<div class="comment-desc"><span><label><a href="/User/UserProfile/' + value1.UserId + '">' + value1.Display_Name + '</a>&nbsp</label>' + value1.Message_Text + '</span><span class="suffix">' + value1.timestampFormatted + '</span></div>';
                cmnt += '</div>';
            });
        }
        return cmnt;
    },
    addComments: function (value) {
        var cmnt = '<div class="posts-comment">';
        if (value.lstFeedComments != null && value.lstFeedComments.length > 0) {
            $.each(value.lstFeedComments, function (ind, value1) {
                cmnt += '<div class="comment-item clearfix">';
                cmnt += '<div class="comment-prof"><a href="/User/UserProfile/' + value1.UserId + '"><img src="' + (value1.Profile_Photo_BLOB_URL != null ? value1.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt="" /></a></div>';
                cmnt += '<div class="comment-desc"><span><label><a href="/User/UserProfile/' + value1.UserId + '">' + value1.Display_Name + '</a></label>' + value1.Message_Text + '</span><span class="suffix">' + value1.timestampFormatted + '</span></div>';
                cmnt += '</div>';
            });
        }
        cmnt += '<div class="comment-item clearfix"><div class="comment-prof"><a href="/User/UserProfile"><img src="' + Services.defaults.myProfileURL + '" alt="" /></a></div>';
        cmnt += '<div class="comment-desc">' +
        	'<textarea name="comment-text" class="add-comment" cols="30" rows="1" placeholder=""></textarea>' +
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
                postItem.empty();
                postItem.data('postItem', data);
                postItem.append('<div class="posts-prof"><a href="/User/UserProfile/' + value.User_Id + '"><img src="' + (data.Profile_Photo_BLOB_URL != null ? data.Profile_Photo_BLOB_URL : Services.defaults.defaultThumbnail) + '" alt="" /></a></div>');

                var postDesc = $('<div class="posts-desc"></div>');
                var postTitle = $('<div class="posts-title"><a href="/User/UserProfile/' + value.User_Id + '" class="post-by-user">' + data.FirstName + '</a>' +
                    '<span>' + (data.Action_Required ? data.Message_Text : '') + '</span></div>');
                postDesc.append(postTitle);
                postItem.append(postTitle);
                if (!value.Action_Required) {
                    var postContent = $('<div class="post-content"></div>');
                    postContent.append('<p>' + data.Message_Text + '</p>');
                    if (data.Attachment != undefined && data.Attachment != null && data.Attachment != 'null' && data.Attachment != '') {
                        var attachment = null;
                        if (isImage(data.Attachment))
                            attachment = $('<a href="#"><img src="' + data.Attachment + '" alt="" /></a>');
                        if (isVideo(data.Attachment))
                            attachment = $('<video controls><source src="' + data.Attachment + '" type="video/mp4">Your browser does not support the video tag.</video>');
                        if (attachment != null) {
                            attachment.data('postItem', data);
                            attachment.bind('click', function (e) {
                                rxHome.bindPostPopup($(this).data('postItem'));
                                ShowModalPopup('dvPostOverlay');
                                return false;
                            });
                            $('#dvPostClose').unbind().bind('click', function (e) {
                                HideModalPopup('dvPostOverlay');
                            });
                        }
                    }
                    postContent.append(attachment);
                    postDesc.append(postContent);
                    postDesc.append('<div style="clear: both"></div>');
                    var postAction = $('<div class="posts-actn"></div>');
                    var likeBtn = $('<a href="#" class="like" style="font-size: 12px;"><div class="fa fa-thumbs-up" style="color: #0054A5; font-size: 15px;"></div> Like (' + data.Likes + ') </a>');
                    if (data.lstFeedAnalytics == null || data.lstFeedAnalytics.length <= 0 || !rxHome.isUserLikes(data)) {
                        likeBtn.bind('click', function (e) {
                            Services.updateFeedLikes(value.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                                if (data) {
                                    rxHome.getUserFeedsById(value.Id);
                                }
                            }, function (e) { });
                            return false;
                        });
                    } else {
                        likeBtn.css('color', '#A6A6A6');
                        likeBtn.find('div').css('color', '#A6A6A6');
                        likeBtn.bind('click', function (e) { return false; });
                    }
                    /*var replyBtn = $('<a href="#" class="reply" style="font-size: 12px;"><div class="fa fa-mail-reply" style="color: #0054A5; font-size: 15px;"></div> Reply</a>');
                    replyBtn.bind('click', function (e) {
                        postAction.find('.add-comment').focus();
                        return false;
                    });*/
                    var cmntBtn = $('<a href="#" class="comments" style="font-size: 12px;"><div class="fa fa-comments" style="color: #0054A5; font-size: 15px;"></div> Comment (' + (data.lstFeedComments ? data.lstFeedComments.length : 0) + ')</a>');
                    cmntBtn.bind('click', function (e) {
                        postAction.find('.add-comment').focus();
                        return false;
                    });
                    var timeStamp = $('<span style="float: right;"><a href="#" style="font-size: 12px; color: #888;">' + value.timestampFormatted + '</a></span>');
                    timeStamp.bind('click', function (e) {
                        return false;
                    });
                    var comments = rxHome.addComments(data);

                    postAction.append(likeBtn);
                    //postAction.append(replyBtn);
                    postAction.append(cmntBtn);
                    postAction.append(timeStamp);
                    postAction.append(comments);
                    postDesc.append(postAction);
                }
                postItem.append(postDesc);
            }
        });
        rxHome.insertComment();
    },
    insertUserFeed: function (message, attachment) {
        var feedData = {};
        feedData.Company_Id = Services.defaults.companyId;
        feedData.Feed_User_Id = Services.defaults.userId;
        feedData.User_Id = Services.defaults.userId;

        feedData.Timestamp = Date.getDateString();
        feedData.Message_Text = message.autoLink();
        feedData.Action_Required = false;
        feedData.Attachment = attachment;

        Services.insertUserFeed(feedData, function (data) {
            rxHome.filesSelected = null;
            $('#create-post').val('');
            $('.post-uploaded-files').empty();
            rxHome.getUpdateFeedsForUser();
            rxCommon.togglePostBtn(false);
        }, function (e) { });
    },
    insertNewFeed: function () {
        var frm = $('#post-form form');
        var inp = $('#add-post');
        $('#create-post').unbind().bind('click', function (e) {
            rxCommon.togglePostBtn(true);
        });
        frm.bind('submit', function () {
            return false;
        });
        inp.bind('click', function () {
            if (!rxHome.bCreate) { alert('please wait until file uplaoded'); return false; }
            var message = $('#create-post').val(),
    			attachment = rxHome.filesSelected;
            if (message == '' || message.length == 0) {
                alert('Please enter some post message');
                return false;
            }
            rxHome.insertUserFeed(message, attachment);
            return false;
        });
    },
    showMore: function () {
        $('.btn-smore').on('click', function () {
            if ($('.posts-item').last().length < 0) {
                rxHome.getUserFeedsAfterId();
                return false;
            } else {
                var postItem = $('.posts-item').last().data('postItem');
                if (postItem != null)
                    rxHome.firstFeedId = postItem.Id;
                else
                    rxHome.firstFeedId = 0;
                rxHome.getUserFeedsAfterId();
                return false;
            }
        });
    },
    insertComment: function () {
        $('.add-comment').unbind('keypress').bind('keypress', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                var curPost = $(this).parents('.posts-item').eq(0);
                var messageTxt = $(this).val();
                var feedCommentData = {}
                feedCommentData.UserId = Services.defaults.userId;
                feedCommentData.FeedId = curPost.data('postItem').Id;
                feedCommentData.FeedMasterId = curPost.data('postItem').Feed_Master_Id;
                feedCommentData.MessageText = messageTxt.autoLink();
                feedCommentData.Attachment = null;
                Services.insertUserComment(feedCommentData, function (data) {
                    if (data) {
                        rxHome.getUserFeedsById(curPost.data('postItem').Id);
                    }
                }, function () { });
            }
        });
    },
    insertPopupComment: function (postItem) {
        $('#popupAddComment').unbind('keypress').bind('keypress', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                var curPost = $(this).parents('.posts-item').eq(0);
                var messageTxt = $(this).val();
                var feedCommentData = {}
                feedCommentData.UserId = Services.defaults.userId;
                feedCommentData.FeedId = postItem.Id;
                feedCommentData.FeedMasterId = postItem.Feed_Master_Id;
                feedCommentData.MessageText = messageTxt.autoLink();
                feedCommentData.Attachment = null;
                Services.insertUserComment(feedCommentData, function (data) {
                    if (data) {
                        rxHome.getUserFeedsById(postItem.Id, function (postResultItem) { rxHome.bindPostPopup(postResultItem); });
                    }
                }, function () { });
            }
        });
    },
    /*fileUpload: function () {
        var triggerEl = $('#add-image,#add-video');
        triggerEl.bind('click', function () {
            if ($(this).attr('id') == 'add-video')
                $('.file-upload input').attr('accept', 'video/*');
            else
                $('.file-upload input').attr('accept', 'image/*');
            $('.file-upload input').trigger('click');
            return false;
        });
        $('.post-uploaded-files').hide();
        $('.file-upload input').bind('change', function () {
            var fileInp = $("#post-file"), fileData = new FormData();
            rxHome.bCreate = false;
            if (isImage(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/><img class="loader" src="/Images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (isVideo(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt="" /><img class="loader" src="/Images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            $('.post-uploaded-files').show();
            rxHome.filesSelected = null;
            fileData.append("companyId", 0);
            fileData.append("userId", 1);
            fileData.append("filename", fileInp[0].files[0]);
            var context = ['Attachment', 'FileUpload'];
            CoreREST.attach(context, fileData, function (data) {
                //console.log('success');
                rxHome.filesSelected = data.url;
                if (data.url != '') {
                    if (isImage(data.url))
                        $('.post-uploaded-files img.post-img').attr('src', data.url);
                    if (isVideo(data.url))
                        $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                    $('img.loader').hide();
                    $('.post-uploaded-files').show();
                }
                rxHome.bCreate = true;
            }, function (err) {
                //console.log('error');
                rxHome.filesSelected = null;
                rxHome.bCreate = true;
            });
            //return false;
            $('.post-thumb-delete').bind('click', function () {
                rxHome.filesSelected = '';
                $('.post-thumb').remove();
                return false;
            });
        });
    }*/
    fileUpload: function () {
        var triggerEl = $('#add-image,#add-video');
        /*triggerEl.bind('click', function () {
            if ($(this).attr('id') == 'add-video')
                $('.file-upload input').attr('accept', 'video/*');
            else
                $('.file-upload input').attr('accept', 'image/*');
            $('.file-upload input').trigger('click');
            return false;
        });*/
        /*$('.file-upload input').mousemove(function (e) {
            var mouseLocation = e.pageX;
            var video = $('#add-video');
            var image = $('#add-video');
            var imageOffset = image.offset().left;
            var videoOffset = video.offset().left;
            if (mouseLocation >= imageOffset && mouseLocation < videoOffset) {
                console.log('image');
                image.addClass('fileupload-btn-hover');
                $('.file-upload input').attr('accept', 'image/*');
            }
            if (mouseLocation >= videoOffset) {
                console.log('video');
                video.addClass('fileupload-btn-hover');
                $('.file-upload input').attr('accept', 'video/*');
            }
            if (mouseLocation < imageOffset || mouseLocation > videoOffset) {
                console.log('else');
                image.removeClass('fileupload-btn-hover');
                video.removeClass('fileupload-btn-hover');
            }
        });*/
        $('input[name="companyId"]').val(Services.defaults.companyId);
        $('input[name="userId"]').val(Services.defaults.userId);
        $('.post-uploaded-files').hide();
        $('.file-upload input:file').bind('change', function () {
            var fileInp = $(this);
            var formFields = $(this).parents('form.file-upload-form');
            rxHome.bCreate = false;
            if (isImage(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/><img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (isVideo(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt="" /><img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (!isImage(fileInp.val()) && !isVideo(fileInp.val())) {
                alert('Please choose only image or video');
                return;
            }
            $('.post-uploaded-files').show();
            rxHome.filesSelected = null;
            
            Services.attachFile(formFields, function (formData, jqForm, options) {
                console.log('Before submit');
            }, function (data) {
                rxHome.filesSelected = data.url;
                if (isImage(data.url))
                    $('.post-uploaded-files img.post-img').attr('src', data.url);
                if (isVideo(data.url))
                    $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                $('img.loader').hide();
                $('.post-uploaded-files').show();
                rxHome.bCreate = true;
            }, function (e) {
                rxHome.bCreate = true;
            });

            $('.post-thumb-delete').unbind().bind('click', function () {
                rxHome.bCreate = true;
                rxHome.filesSelected = '';
                $('.post-thumb').remove();
                return false;
            });
        });
    }
};

Date.getDateString = function () {
    var dte = new Date();
    var hours = dte.getHours() > 12 ? dte.getHours() - 12 : dte.getHours();
    var zone = dte.getHours() > 12 ? 'PM' : 'AM';
    dte = (dte.getMonth() + 1) + '/' + dte.getDate() + '/' + dte.getFullYear() + ' ' + hours + ':' + dte.getMinutes() + ' ' +
     zone;
    return dte;
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