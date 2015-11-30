var cropImage = {
    popupEl: null,
    imageURI:null,
    imageMaxSize: 1572864,
    init: function () {
        $('input[name="companyId"]').val(Services.defaults.companyId);
        $('input[name="userId"]').val(Services.defaults.userId);
        Services.getKWUserInfo(Services.defaults.userId, function (data) {
            if (data && data.length > 0) {
                if (data[0].Profile_Photo_BLOB_URL !== undefined && data[0].Profile_Photo_BLOB_URL != '' && data[0].Profile_Photo_BLOB_URL !=null) {
                    $('#uploaded-img img').attr('src', data[0].Profile_Photo_BLOB_URL);
                } else {
                    $('#uploaded-img img').attr('src', "images/Rxbook/profile-pic.jpg");
                }
            }

            $('#browse-button').unbind('click').bind('click', function () {
                navigator.camera.getPicture(function(imageURI) {
            		cropImage.imageURI = imageURI;
            		var params = {};
            		params.companyId = Services.defaults.companyId;
                    params.userId = Services.defaults.userId;
                    $('#uploaded-img').addClass('loader');
                    cropImage.uploadFileTransfer(imageURI, ['Attachment','FileUpload'], params, function(response){
                    	if (response.responseCode == 200) {
                            var jsonObject = JSON.parse(response.response);
                            if (jsonObject.type == 'ERROR') {
                            	alert('Please upload file size less than ' + (cropImage.imageMaxSize / 1024 / 1024) + ' MB');
                            	$('#uploaded-img').removeClass('loader');
                            } else {
                            	cropImage.afterImageUpload(jsonObject);
                            } 
                    	}
                    }, function(){
                    	$('#uploaded-img').removeClass('loader');
                    	alert('Error in file uploading');
                    });
            	}, function(message) {
                	//alert('Unable to get picture.');
                }, {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                });
                //$('input#file-input').trigger('click');
                return false;
            });

            /*$('input#file-input').unbind('change').bind('change', function () {
                $('#uploaded-img').addClass('loader');
                cropImage.getImage($(this));
            });*/

            $('#cancel-button').unbind('click').bind('click', function () {
                window.location.href = 'UserProfile.Mobile.html?userId=' + Services.defaults.userId;
                return false;
            });
        });

        $('#upload-button').unbind('click').bind('click', function (e) {
        	$('#uploaded-img').addClass('loader');
            Services.getUserDetails(Services.defaults.userId, function (data) {
                if (data && data.length > 0) {
                    if (data[0].Profile_Photo_BLOB_URL === $('#uploaded-img img').attr('src')) {
                        cropImage.saveUserPicture(data[0].Profile_Photo_BLOB_URL);
                    }
                }
                if ($('#uploaded-img img').attr('src').indexOf('profile-pic.jpg') > -1) {
                	$('#uploaded-img').removeClass('loader');
                    alert('Please upload any image');
                }
            }, function(){
            	$('#uploaded-img').removeClass('loader');
            });
        });
    },
    /* getImage: function (el) {
        var fileInp = el, _this = cropImage;
        var formFields = el.parents('form.form-image-upload');
        Services.attachFile(formFields, function (formData, jqForm, options) {

        }, function (data) {
            $('#uploaded-img img').load(function () {
                $('#uploaded-img').removeClass('loader');
                var $this = $(this);
                var cropImage = $(this).cropbox({
                    width: 200,
                    height: 200
                });

                $('#upload-button').unbind('click').bind('click', function (e) {
                    var crpResult = cropImage.data('cropbox');
                    var result = crpResult.result;
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
                        //$('#upload-button').unbind('click').bind('click', function () {
                        _this.saveUserPicture(data.url);
                        return false;
                        //});
                    });
                    e.preventDefault();
                });
            }).error(function () { }).attr('src', data.url);
        }, function (e) {
        });
    }, */
    
    afterImageUpload: function(obj) {
    	$('#uploaded-img').removeClass('loader');
    	$('#uploaded-img img').load(function () {
    		var $this = $(this);
            var cImage = $(this).cropbox({
                width: 200,
                height: 200
            });
            
            $('#upload-button').unbind('click').bind('click', function (e) {
            	$('#uploaded-img').addClass('loader');
                var crpResult = cImage.data('cropbox');
                var result = crpResult.result;
                var left = (crpResult.img_left < 0 ? (crpResult.img_left) * -1 : 0),
                    top = (crpResult.img_top < 0 ? (crpResult.img_top) * -1 : 0);
                
                var params = {};
                params.cropX = parseInt(left, 10);
                params.cropY = parseInt(top, 10);
            	params.cropWidth = result.cropW;
            	params.cropHeight = result.cropH;
            	params.percent = result.percent;
            	
            	cropImage.uploadFileTransfer(cropImage.imageURI, ['Attachment','CropImage'], params, function(response){
                	if (response.responseCode == 200) {
                		var jsonObject = JSON.parse(response.response);
                		cropImage.saveUserPicture(jsonObject.url);
                	}
                }, function(e){
                	$('#uploaded-img').removeClass('loader');
                	alert('Error in saving');
                });
                e.preventDefault();
            });
            
    	}).error(function () { }).attr('src', obj.url);
    },
    saveUserPicture: function (url) {
        var profileObj = {};
        profileObj.User_Id = Services.defaults.userId;
        profileObj.User_Profile_Pic = url;
        profileObj.Company_Id = Services.defaults.companyId;
        Services.updateProfileImage(profileObj, function (data) {
            window.location.href = 'UserProfile.Mobile.html?userId=' + Services.defaults.userId;
        }, function () { });
    },
    uploadFileTransfer: function(imageURI, urlAry, params, success, fail) {
        var options = new FileUploadOptions();
        options.fileKey="filename";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1)+'.png';
        options.mimeType="image/jpeg";
        
        if(params == null) params = {};
        options.params = params;
        
        var fileTransfer_g = new FileTransfer();
        var url = CoreREST._addContext(CoreREST._defaultServer, urlAry);
        fileTransfer_g.upload(imageURI, encodeURI(url), success, fail, options);
    }
};