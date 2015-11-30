var rxHospital = {
    el: $('.dp-center-feeds'),
    lastFeedId: 0,
    firstFeedId: 0,
    lastStreamId: 0,
    lastCompanyStreamId: 0,
    updateFeedInterval: 180000,
    filesSelected: null,
    start: 1,
    companystart: 1,
    bCreate: true,
    resources: { won: ' won ' },
    init: function () {
        //Services.defaults.companyId = 1;
        //$('#menu-home').addClass('active');
        //rxCommon.togglePostBtn(false);
        rxHospital.getUpdateFeedsForUser();
        rxHospital.getHospitalEventDetails();
        rxHospital.getHospitalAwardDetails();
        rxHospital.startActivityThread();
        //rxHospital.fileUpload();
        rxHospital.insertNewFeed();
        rxHospital.showMore();
    },
    /*getUserFeedsForUser: function () {
        Services.getUserFeeds(Services.defaults.userId, 0, function (data) {
            if (data.length <= 0)
                $('.btn-smore').hide();
            else
                rxHospital.bindUserFeed(rxHospital.el, data);
        }, null);
    },*/
    getUserFeedsAfterId: function () {
        Services.getUserFeedAfterId(Services.defaults.userId, rxHospital.firstFeedId, function (data) {
            if(data.length > 0)
                rxHospital.bindUserFeed(rxHospital.el, data);
            else
                $('.btn-smore').hide();
        }, null);
    },
    getUpdateFeedsForUser: function () {
        Services.getAllHospitalNews(rxHospital.lastFeedId, function (data) {
            var newDatas = new Array();
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    newDatas.push(data[data.length - (i + 1)]);
                }
                rxHospital.bindUserFeed(rxHospital.el, newDatas, true);
            }
        }, null);
    },
    getUserFeedsById: function (feedId, success) {
        Services.getUserFeedsById(feedId, function (data) {
            rxHospital.refreshPost(data[0]);
            if (success) success(data[0]);
        }, null);
    },
    bindUserFeed: function (el, data, bUpdated) {
        $('.btn-smore').show();
        el = $('.dp-center-feeds');
        el.empty();
        $.each(data, function (index, value) {
            var postItem = $('<div class="dp-company-post"></div>');
            postItem.data('postItem', value);
            postItem.append('<div class="dp-company-ppic" style="width: 40px; height: 40px;"><img src="' + value.Company_Logo_Url + '" style="width: 40px; height: 40px;"/></div>');
            postItem.append('<div class="dp-company-label"><a href="/">' + value.Company_Name + '</a><span>' + value.Formatted_Created_DateTime + '</span></div>');
            
            var post = $('<div class="dp-company-post-content"></div>');
            postPara = $('<p>' + '<label>' + value.News_Title + '</label>&nbsp;' + value.News_Desc + '</p>');
            post.append(postPara);
            var attachments = value.lstNewsImages;
            if (attachments != null && attachments.length > 0) {
                for (var i = 0; i <= attachments.length - 1; i++) {
                    var postAttachment = $('<a href="#"><img src="' + attachments[i].Image_URL + '" /></a>');
                    postAttachment.data('index', i);
                    postAttachment.bind('click', function (e) {
                        rxHospital.showImagePreviewPopup(postAttachment.parent().parent().data('postItem'), $(this).data('index'));
                    });
                    post.append(postAttachment);
                }
            }
            postItem.append(post);

            var postActions = $('<div class="dp-company-post-actions"></div>');
            var likeBtn = $('<a style="font-size: 12px;" class="like" href="#"><div style="color: #0054A5; font-size: 15px;" class="fa fa-thumbs-up"></div> Like (0) </a>');
            if (value.lstFeedAnalytics == null || value.lstFeedAnalytics.length <= 0 || !rxHospital.isUserLikes(value)) {
                likeBtn.bind('click', function (e) {
                    /*var postItem = $(this).parents('.posts-item').data('postItem');
                    Services.updateFeedLikes(postItem.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                        if (data) {
                            rxHospital.getUserFeedsById(postItem.Id);
                        }
                    }, function (e) { });*/
                    return false;
                });
            } else {
                likeBtn.css('color', '#A6A6A6');
                likeBtn.find('div').css('color', '#A6A6A6');
                likeBtn.bind('click', function (e) { return false; });
            }
            var replyBtn = $('<a style="font-size: 12px;" class="reply" href="#"><div style="color: #0054A5; font-size: 15px;" class="fa fa-comments"></div> Comment (0)</a>');
            replyBtn.bind('click', function (e) {
                postActions.parent().find('.add-comment').focus();
                return false;
            });
            postActions.append(likeBtn);
            postActions.append(replyBtn);
            
            var postCommentsSection = $('<div class="posts-comment"></div>');
            if (value.comments != null) {
                for (var i = 0; i <= value.comments.length - 1; i++) {
                    var postComment = $('<div class="dp-comments comment-item clearfix">');
                    postComment.append('<div class="comment-prof"><img alt="" src="http://1.bp.blogspot.com/-tnP9xlBzBJI/UQOLiNI48dI/AAAAAAAACYQ/1gFpeEhqma8/s1600/Power+Star+Srinivasan+Pic7.jpg"></div>');
                    postComment.append('<div class="comment-desc"><p><a href=""><label>Jawahar P&nbsp;</label></a>hi</p><span>20/04/2014 09:30 AM</span></div>');
                    postCommentSection.append(postComment);
                }
            }

            // insert comment textarea
            var postComment = $('<div class="dp-comments comment-item clearfix">');
            postComment.append('<div class="comment-prof"><img alt="" src="' + Services.defaults.myProfileURL + '"></div>');
            postComment.append('<div class="comment-desc"><textarea placeholder="" rows="1" cols="30" class="add-comment" name="comment-text"></textarea></div>');
            postCommentsSection.append(postComment);

            postActions.append(postCommentsSection);
            //postItem.append(postActions);
            
            if (bUpdated)
                el.prepend(postItem);
            else
                el.append(postItem);
        });
        rxHospital.insertComment();
        //rxHospital.requestAction();
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
        $('#popupPostUserName').html(postItem.FirstName);
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

        var comments = rxHospital.addPopupComments(postItem);
        postComments.html(comments);

        var postPopupActn = $('#postPopupActn');
        postPopupActn.empty();
        var likeBtn = $('<a href="#" class="like" style="font-size: 12px;"><div class="fa fa-thumbs-up" style="color: #0054A5; font-size: 15px;"></div> Like (' + postItem.Likes + ') </a>');
        if (postItem.lstFeedAnalytics == null || postItem.lstFeedAnalytics.length <= 0 || !rxHospital.isUserLikes(postItem)) {
            likeBtn.bind('click', function (e) {
                //var postItem = $(this).parents('.posts-item').data('postItem');
                Services.updateFeedLikes(postItem.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                    if (data) {
                        rxHospital.getUserFeedsById(postItem.Id, function (postResultItem) { rxHospital.bindPostPopup(postResultItem); });
                        //rxHospital.getUserFeedsById(postItem.Id);
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
        postPopupActn.append(replyBtn);
        postPopupActn.append(cmntBtn);

        $('#popupAddComment').val('');
        $('#popupImgComment').attr('src', Services.defaults.myProfileURL);
        rxHospital.insertPopupComment(postItem);
    },
    startActivityThread: function () {
        setInterval(function () {
            rxHospital.getUpdateFeedsForUser();
        }, rxHospital.updateFeedInterval);
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
        inputdata.push(input)

        Services.insertUserComment(feedData, function (data) { }, function (e) { });
    },
    addPopupComments: function (value) {
        var cmnt = '';
        if (value.lstFeedComments != null && value.lstFeedComments.length > 0) {
            $.each(value.lstFeedComments, function (ind, value1) {
                cmnt += '<div class="comment-item clearfix">';
                cmnt += '<div class="comment-prof"><img src="' + value1.Profile_Photo_BLOB_URL + '" alt="" /></div>';
                cmnt += '<div class="comment-desc"><span><label><a href="">' + value1.Display_Name + '</a>&nbsp</label>' + value1.Message_Text + '</span><span class="suffix">' + value1.timestampFormatted + '</span></div>';
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
                cmnt += '<div class="comment-prof"><img src="' + value1.Profile_Photo_BLOB_URL + '" alt="" /></div>';
                cmnt += '<div class="comment-desc"><span><label><a href="">' + value1.Display_Name + '</a></label>' + value1.Message_Text + '</span><span class="suffix">' + value1.timestampFormatted + '</span></div>';
                cmnt += '</div>';
            });
        }
        cmnt += '<div class="comment-item clearfix"><div class="comment-prof"><img src="' + Services.defaults.myProfileURL + '" alt="" /></div>';
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
                postItem.append('<div class="posts-prof"><img src="' + data.Profile_Photo_BLOB_URL + '" alt="" /></div>');

                var postDesc = $('<div class="posts-desc"></div>');
                var postTitle = $('<div class="posts-title"><a href="#" class="post-by-user">' + data.FirstName + '</a>' +
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
                                rxHospital.bindPostPopup($(this).data('postItem'));
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
                    if (data.lstFeedAnalytics == null || data.lstFeedAnalytics.length <= 0 || !rxHospital.isUserLikes(data)) {
                        likeBtn.bind('click', function (e) {
                            Services.updateFeedLikes(value.Feed_Master_Id, Services.defaults.userId, true, function (data) {
                                if (data) {
                                    rxHospital.getUserFeedsById(value.Id);
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
                        postAction.find('.add-comment').focus();
                        return false;
                    });
                    var cmntBtn = $('<a href="#" class="comments" style="font-size: 12px;"><div class="fa fa-comments" style="color: #0054A5; font-size: 15px;"></div> Comment (' + (data.lstFeedComments ? data.lstFeedComments.length : 0) + ')</a>');
                    cmntBtn.bind('click', function (e) {
                        postAction.find('.add-comment').focus();
                        return false;
                    });
                    var timeStamp = $('<span style="float: right;"><a href="#" style="font-size: 12px; color: #888;">' + value.timestampFormatted + '</a></span>');
                    timeStamp.bind('click', function (e) {
                        return false;
                    });
                    var comments = rxHospital.addComments(data);

                    postAction.append(likeBtn);
                    postAction.append(replyBtn);
                    postAction.append(cmntBtn);
                    postAction.append(timeStamp);
                    postAction.append(comments);
                    postDesc.append(postAction);
                }
                postItem.append(postDesc);
            }
        });
        rxHospital.insertComment();
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
            rxHospital.filesSelected = null;
            $('#create-post').val('');
            $('.post-uploaded-files').empty();
            rxHospital.getUpdateFeedsForUser();
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
            if (!rxHospital.bCreate) { alert('please wait until file uplaoded'); return false; }
            var message = $('#create-post').val(),
    			attachment = rxHospital.filesSelected;
            if (message == '' || message.length == 0) {
                alert('Please enter some post message');
                return false;
            }
            rxHospital.insertUserFeed(message, attachment);
            return false;
        });
    },
    showMore: function () {
        $('.btn-smore').on('click', function () {
            if ($('.posts-item').last().length < 0) {
                rxHospital.getUserFeedsAfterId();
                return false;
            } else {
                var postItem = $('.posts-item').last().data('postItem');
                if (postItem != null)
                    rxHospital.firstFeedId = postItem.Id;
                else
                    rxHospital.firstFeedId = 0;
                rxHospital.getUserFeedsAfterId();
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
                        rxHospital.getUserFeedsById(curPost.data('postItem').Id);
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
                        rxHospital.getUserFeedsById(postItem.Id, function (postResultItem) { rxHospital.bindPostPopup(postResultItem); });
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
            rxHospital.bCreate = false;
            if (isImage(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/><img class="loader" src="/Images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (isVideo(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt="" /><img class="loader" src="/Images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            $('.post-uploaded-files').show();
            rxHospital.filesSelected = null;
            fileData.append("companyId", 0);
            fileData.append("userId", 1);
            fileData.append("filename", fileInp[0].files[0]);
            var context = ['Attachment', 'FileUpload'];
            CoreREST.attach(context, fileData, function (data) {
                //console.log('success');
                rxHospital.filesSelected = data.url;
                if (data.url != '') {
                    if (isImage(data.url))
                        $('.post-uploaded-files img.post-img').attr('src', data.url);
                    if (isVideo(data.url))
                        $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                    $('img.loader').hide();
                    $('.post-uploaded-files').show();
                }
                rxHospital.bCreate = true;
            }, function (err) {
                //console.log('error');
                rxHospital.filesSelected = null;
                rxHospital.bCreate = true;
            });
            //return false;
            $('.post-thumb-delete').bind('click', function () {
                rxHospital.filesSelected = '';
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
            rxHospital.bCreate = false;
            if (isImage(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt=""/><img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            if (isVideo(fileInp.val()))
                $('.post-uploaded-files').html('<div class="post-thumb"><img class="post-img" src="" alt="" /><img class="loader" src="images/RxBook/animation.gif" alt=""/><span class="post-thumb-delete fa fa-remove"></span></div>');
            $('.post-uploaded-files').show();
            rxHospital.filesSelected = null;
            
            Services.attachFile(formFields, function (formData, jqForm, options) {
                console.log('Before submit');
            }, function (data) {
                rxHospital.filesSelected = data.url;
                if (isImage(data.url))
                    $('.post-uploaded-files img.post-img').attr('src', data.url);
                if (isVideo(data.url))
                    $('.post-uploaded-files img.post-img').attr('src', 'https://support.wright.edu/wrc/images/archive/e/e4/20090520125539!Video.png');
                $('img.loader').hide();
                $('.post-uploaded-files').show();
                rxHospital.bCreate = true;
            }, function (e) {
                rxHospital.bCreate = true;
            });

            $('.post-thumb-delete').unbind().bind('click', function () {
                rxHospital.bCreate = true;
                rxHospital.filesSelected = '';
                $('.post-thumb').remove();
                return false;
            });
        });
    },

    getHospitalEventDetails: function() {
        Services.getHospitalEventDetails(function (data) {
            rxHospital.bindHospitalEvendDetails(data);
        }, function (e) { });
    },
    bindHospitalEvendDetails: function(data) {
        var bxElement = $('#eventsBxSlider');
        bxElement.empty();
        if (data != null && data.length > 0) {
            $('#events-see-all').show();
            for (var i = 0; i <= data.length - 1; i++) {
                var list = $('<li></li>');
                var thumbnail = $('<img src="' + data[i].Thumbnail_URL + '" />');
                var docDetail = $('<div class="document-detail"></div>');
                docDetail.append('<p class="document-title">' + data[i].Event_Name + '</p>')
                docDetail.append('<p class="document-date">' + data[i].Formated_Start_Datetime + '</p>');
                var join = $('<a href="" class="document-join">Join</a>');
                docDetail.append(join);
                list.append(thumbnail);
                list.append(docDetail);
                bxElement.append(list);
            }
        } else {
            $('#events-see-all').hide();
            bxElement.html('<div class="empty">Events not Found</div>');
        }
        //bxElement.bxSlider({
        //    autoHidePager: true
        //});
    },

    getHospitalAwardDetails: function () {
        Services.getHospitalAwardDetails(function (data) {
            console.log(data);
            rxHospital.bindHospitalAwardDetails(data);
        }, function (e) { });
    },
    bindHospitalAwardDetails: function (data) {
        var bxElement = $('#awardsBody');
        bxElement.empty();
        if (data != null && data.length > 0) {
            $('#awards-see-all').show();
            for (var i = 0; i <= data.length - 1; i++) {
                var list = $('<div class="comment-item clearfix"></div>');
                var thumbnail = $('<div class="comment-prof"><img alt="" src="' + data[i].Logo_Url + '"></div>');
                var docDetail = $('<div class="comment-desc">' + data[i].Awarded_Organization + rxHospital.resources.won + data[i].Award_Name + '</div>');
                list.append(thumbnail);
                list.append(docDetail);
                bxElement.append(list);
            }
        } else {
            $('#awards-see-all').hide();
            bxElement.html('<div class="empty">Awards & Recognition not found</div>');
        }
    },

    showImagePreviewPopup: function (postItem, clickedIndex) {
        var ulList = $('<ul class="bxPreviewSlider"></ul>');
        var attachments = postItem.lstNewsImages;
        if (attachments != null && attachments.length > 0) {
            for (var i = 0; i <= attachments.length - 1; i++) {
                var data = '<li>';
                data += '<img style="width: 500px; height: 300px;" src="' + attachments[i].Image_URL + '" />';
                data += '</li>';
                ulList.append(data);
            }
        }
        $('#postPopupContent').empty().append(ulList);
        //if(rxHospital.bxSlider != null) rxHospital.bxSlider.destroySlider();
        rxHospital.bxSlider = ulList.bxSlider({
            minSlides: 1,
            maxSlides: 1,
            slideWidth: 500,
            slideHeight: 300,
            onSliderLoad: function () {
                // do funky JS stuff here
                //console.log(rxHospital.bxSlider.getCurrentSlide());
            },
            onSlideAfter: function () {
                // do mind-blowing JS stuff here
                //alert('A slide has finished transitioning. Bravo. Click OK to continue!');
                //rxHospital.bxSlider.goToNextSlide();
            }
        });
        ShowModalPopup('dvPostOverlay');
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