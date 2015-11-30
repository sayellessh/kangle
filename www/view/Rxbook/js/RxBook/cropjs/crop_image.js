var cropImage = {
    popupEl: null,
    photoUrl: '',

    init: function () {
        profileUserId = curUserId;
        $('#popup-wrapper').remove();
        $('body').append('<div class="loader-div" style=""><img class="loader" src="images/RxBook/animation.gif" alt=""/></div>');
        Services.getKWUserInfo(profileUserId, function (data) {
            $('.loader-div').remove();
            if (data && data.length > 0) {
                cropImage.photoUrl = data[0].Profile_Photo_BLOB_URL;
                if (cropImage.photoUrl != null && cropImage.photoUrl != '') {
                    //
                } else {
                    cropImage.photoUrl = 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg';
                }
                $('<img></img>').load(function () {
                    cropImage._createPopup();
                    cropImage.showPopup();
                }).attr('src', cropImage.photoUrl);
            } else {
                cropImage._createPopup();
                cropImage.showPopup();
            }
        });
        $('#popup-wrapper').unbind('click').bind('click', function (e) {
            if ($(e.target).attr('id') == 'popup-wrapper') {
                cropImage.hidePopup();
                return false;
            }
        });
    },
    _createPopup: function () {
        var html = '<div id="popup-wrapper" style="display: none;"><div class="upload-popup">' +
            '<div id="popup-header"><div class="popup-label">Upload Picture</div></div>' +
            '<div id="popup-content"><form id="profile-form" class="form-image-upload" action="../../Attachment/FileUpload" method="post"><div class="form-row">' +
            '<div class="browse-button"><input type="hidden" name="companyId" value="36"/>' +
            '<input type="hidden" name="userId"  value="' + profileUserId + '"/>' +
            '<input type="file" name="filename"  value=""/><input type="hidden" name="cropX"  value=""/><input type="hidden" name="cropY"  value=""/>' +
            '<input type="hidden" name="cropWidth"  value=""/><input type="hidden" name="cropHeight"  value=""/>' +
            '<input type="hidden" name="percent"  value=""/><a href="#" class="btn">Browse Picture</a></div></div></form></div>' +
            cropImage._createUploadDiv() + '<div class="uploaded-note"><p>Please upload files greater than (200 * 200) Dimension to get better image</p></div>' +
            '<div class="popup-footer"><a href="#" class="btn btn-upload disabled">Upload Image</a><a href="#" class="btn btn-cancel">Cancel</a></div></div></div>';

        $('body').append(html);
        cropImage.popupEl = $('#popup-wrapper');

        $('.popup-footer a.btn-cancel').unbind('click').bind('click', function () {
            cropImage.hidePopup();
            return false;
        });

        $('.browse-button input').bind('change', function () {
            $('#uploaded_img').addClass('loader');
            cropImage.getImage($(this));
        });

        $('#crop-button a').bind('click', function () {
            if ($('#uploaded_img img').attr('src') == cropImage.photoUrl)
                alert('Please Change the picture and click crop');
            return false;
        });
    },
    _createUploadDiv: function () {
        var imgUrl = (cropImage.photoUrl.length > 0 ? cropImage.photoUrl : '../../../images/RxBook/profile-pic.jpg');
        return '<div class="uploaded_image"><div id="uploaded_img"><div class="overlay"></div><img src="' + imgUrl + '" alt=""/><label>Uploaded Photo</label></div>' +
            '<div id="crop-button"><a href="#" title="crop" class="fa fa-crop">&nbsp;Crop</a></div><div id="cropped_img"><div class="overlay"></div><img src="../../../images/RxBook/profile-pic.jpg" alt=""/><label>Cropped Photo</label></div></div>';
    },
    showPopup: function () {
        cropImage.popupEl.show();
    },
    hidePopup: function () {
        cropImage.popupEl.remove();
    },
    getImage: function (el) {
        var fileInp = el;
        var formFields = el.parents('form.form-image-upload');//$('form#profile-form');
        $('.popup-footer a.btn-upload.disabled').unbind('click').bind('click', function () {
            return false;
        });
        Services.attachFile(formFields, function (formData, jqForm, options) {
            //console.log('Before submit');
        }, function (data) {
            $('.uploaded_image #uploaded_img img').load(function () {
                $('#uploaded_img').removeClass('loader');
                var $this = $(this);
                var cropImage = $(this).cropbox({
                    width: 200,
                    height: 200
                });

                $('#crop-button a').unbind('click').bind('click', function (e) {
                    e.stopPropagation();
                    $('#cropped_img').addClass('loader');
                                                         
                    var crpResult = cropImage.data('cropbox');
                    var result = crpResult.result;
                    console.log(crpResult);
                    var left = (crpResult.img_left < 0 ? (crpResult.img_left) * -1 : 0),
                        top = (crpResult.img_top < 0 ? (crpResult.img_top) * -1 : 0);

                    $('input[name="cropX"]').val(parseInt(left, 10));
                    $('input[name="cropY"]').val(parseInt(top, 10));
                    $('input[name="cropWidth"]').val(result.cropW);
                    $('input[name="cropHeight"]').val(result.cropH);
                    $('input[name="percent"]').val(result.percent);

                    Services.cropFile(formFields, function (formData, jqForm, options) {
                        //console.log(formData);
                    }, function (data) {
                        $('.popup-footer a.btn-upload').removeClass('disabled');
                        $('.uploaded_image #cropped_img img').attr('src', data.url);
                        $('#cropped_img').removeClass('loader');
                        $('.popup-footer a.btn-upload').not('.disabled').unbind('click').bind('click', function () {
                            var profileObj = {};
                            profileObj.User_Id = profileUserId;
                            profileObj.User_Profile_Pic = data.url;
                            Services.updateProfileImage(profileObj, function (data) {
                                window.location.href = '/User/UserProfile';
                            }, function () { });
                            return false;
                        });
                    });
                    e.preventDefault();
                });
            }).error(function () {
                //console.log('error');
            }).attr('src', data.url);
        }, function (e) {
            //console.log(e);
        });
    }

};