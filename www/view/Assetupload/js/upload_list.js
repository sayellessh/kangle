var uploadList = {
    upList: null,
    selectedFiles: new Array(),
    hdrEl: null,
    userId: 0,
    init: function (userId) {
    	uploadList.userId = userId;
        $('.del-list').unbind('click').bind('click', function () {
            if (uploadList.upList.el.length > 0) {
                uploadList.selectedFiles = new Array();
                uploadList.upList.clear();
                $('.lineheading').empty();
            }
            $(this).hide();
            $('.no-result').show();
        });

        var hdrOptions = [
            { className: 'fa-plus' },
            { className: 'fa-upload' }
        ];

        uploadList.hdrEl = new header();
        uploadList.hdrEl.hdrElActions = function (index) {
           if (index == 1) {
                uploadList.startFilestoUpload(userId);
                return false;
           } else if(index == 0){
                uploadList.chooseAssetAndAdd();
                return false;
           }
        };
        uploadList.hdrEl.onBackClick = function () {
            window.location.href = 'UserUpload.Mobile.html';
        };
        //uploadList.hdrEl.createHeaderWithUpload(hdrOptions, 'Upload Assets');
        uploadList.hdrEl.createHeaderWithIcons(hdrOptions, 'Upload Assets');
        $('.wrapper header').replaceWith(uploadList.hdrEl.el);
        $('#upload-file input').change(function () {
            var fileInp = $('#upload-file input'),
                files = fileInp[0].files;
            for (var i = 0; i < files.length; i++) {
                uploadList.selectedFiles.push(files[i]);
            }
            uploadList.getSelectedFiles(uploadList.selectedFiles);
        });
    },
    getSelectedFiles: function (files) {
        if (files && files.length > 0) {
            if (uploadList.upList)
                uploadList.upList.clear();
            uploadList.upList = new List('.upload-list-items');
            $('.lineheading').html("Files successfully chosen. Click on upload to complete");
            $('.no-result').hide();
            for (var i = 0; i < files.length; i++) {
                uploadList.upList.createUploadAssetList({
                    fileName: files[i].name, size: files[i].size
                });
            }
            uploadList.upList.deleteUploadList = function (obj, elm, index) {
                elm.remove();
                uploadList.selectedFiles.splice((index-1), 1);
                console.log(uploadList.selectedFiles);
                if (uploadList.selectedFiles.length == 0) {
                    $('.no-result').show();
                    $('.lineheading').empty();
                    $('.del-list').hide();
            	}
            }
            uploadList.upList.refresh();
            $('.del-list').show();
        } else {
            $('.no-result').show();
            $('.del-list').hide();
            $('.lineheading').empty();
            $('.upload-list-items').empty();
        }
        uploadList.upList.el.show();
        $('.upload-head').show();
        $('.upload-result').hide();
        $('.upload-prog-list-items').hide();
    },
    startFilestoUpload: function (userId) {
        if (uploadList.selectedFiles.length > 0) {
            var hdrOptions = [
                { className: 'fa-remove' },
            ];

            uploadList.hdrEl = new header();
            uploadList.hdrEl.hdrElActions = function (index) {
                if (index == 0) {
                    //window.location.href = 'UploadAssets.Mobile.html';
                	window.location.reload();
                    return false;
                }
            };
            uploadList.hdrEl.onBackClick = function () {
                //window.location.href = 'UploadAssets.Mobile.html';
            	window.location.reload();
                return false;
            };
            uploadList.hdrEl.createHeaderWithUpload(hdrOptions, 'Uploading Assets');
            $('.wrapper header').replaceWith(uploadList.hdrEl.el);

            $('.upload-head').hide();
            $('.upload-result').show();
            var uploadProgressList = new List('.upload-prog-list-items');
            for (var i = 0; i < uploadList.selectedFiles.length; i++) {
            	var fileName = uploadList.selectedFiles[i].name;
                uploadProgressList.createUploadProgressAssetList({
                    fileName: fileName, size: ""
                });
            }
            uploadProgressList.deleteUploadList = function (obj, elm) {
                elm.remove();
                uploadList.selectedFiles.splice(elm.index(), 1);
            }
            uploadProgressList.refresh();
            uploadList.upList.el.hide();
            uploadProgressList.el.show();
            $('.lineheading').html("Please don't change screen until upload finishes.");
            //uploadList.uploadIndividualFile(0, uploadList.selectedFiles, userId, uploadProgressList.el);
            uploadList.startUpload(0, uploadList.selectedFiles, userId, uploadProgressList.el);
        } else {
        	alert("Please choose one or more files to upload");
        }
    },
    chooseAssetAndAdd: function() {
    	var fileBrowseOptions = {
            quality: 50,
            destinationType: navigator.camera.DestinationType.NATIVE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: Camera.MediaType.ALLMEDIA
        };
    	//navigator.camera.getPicture(function(imageURI) {
    		//uploadList.getFileEntryURI(imageURI, function(fileEntry) {
    	fileChooser.open(function(data) {
			data = JSON.parse(data);
			if(uploadList.upList == null) {
            	uploadList.upList = new List('.upload-list-items');
            	uploadList.upList.clear();
        	}
			var docType = uploadList.upList.getDocumentType(data.name);
			if(docType) {
	            $('.lineheading').html("Files successfully chosen. Click on upload to complete");
	            $('.no-result').hide();
	            uploadList.upList.createUploadAssetList({
	                fileName: data.name, size: data.size
	            });
	            if(uploadList.selectedFiles == null) 
	            	uploadList.selectedFiles = new Array();
	            uploadList.selectedFiles.push(data);
	            uploadList.upList.deleteUploadList = function (obj, elm, index) {
	                elm.remove();
	                uploadList.selectedFiles.splice((index-1), 1);
	                console.log(uploadList.selectedFiles);
	                if (uploadList.selectedFiles.length == 0) {
	                    $('.no-result').show();
		                $('.lineheading').empty();
	                    $('.del-list').hide();
	                }
	            }
	            uploadList.upList.refresh();
			} else{
				alert("Please upload valid file type");
			}
    	}, function(e) {
    		alert("Unable to get document.");
    	});
//            }, function(e) { 
//            	alert('Unable to get picture.');
//            });
//        }, function(message) {
//            alert('Unable to get picture.');
//        }, fileBrowseOptions);
    },
    getFileEntryURI: function(imageUri, success, failure) {
        window.resolveLocalFileSystemURI(imageUri, function(fileEntry) {
            fileEntry.file(function(fileObj) {
                if(success) success(fileObj)
            }, failure);
        }, failure);
    },
    uploadIndividualFile: function (index, files, userId, el) {
        if (index == files.length) {
            //window.location.href = '/AssetUpload/UploadAssets';
            return false;
        }
        var file = files[index];
        var formData = new FormData();
        formData.append('files', file);
        $('.list-del', $('li', el).eq(index)).remove();
        $('.prog-val', $('li', el).eq(index)).css('width', '50%').text('Uploading...');
        Services.uploadFilesToStaging(file.size, 1, formData, function (data) { }, function (data) {
            $('.prog-val', $('li', el).eq(index)).css('width', '100%').text('Uploaded');
            $('.upload-result').html('Uploading Files... (<i>' + (index + 1) + '/' + files.length + ' Completed</i>)');
            uploadList.uploadIndividualFile(index+1, uploadList.selectedFiles, userId, el);
            uploadList.upList.clear();
            uploadList.upList.el.append('<li>Upload completed</li>');
        }, function (e) {

        });
    },
    startUpload: function(index, selectedFiles, userId, el) {
    	if (index == selectedFiles.length) {
            //window.location.href = '/AssetUpload/UploadAssets';
            return false;
        }
    	uploadList.getFileEntryURI(selectedFiles[index].path, function(fe) {
    		var options = new FileUploadOptions();
            options.fileKey="filename";
            options.fileName = selectedFiles[index].name;
            options.mimeType = fe.type;
            var ft = new FileTransfer();
            var context = [];
            var context = [Services.context.upload, 'UploadFileToStaging'
                           , Services.defaults.subdomainName, Services.defaults.companyId
                           , userId, 'MOBILE', 0];
            var url = CoreREST._addContext(CoreREST._defaultServer, context);
            $('.list-del', $('li', el).eq(index)).remove();
            $('.prog-val', $('li', el).eq(index)).css('width', '50%').text('Uploading...');
            ft.upload(selectedFiles[index].path, url, function(response) {
            	$('.prog-val', $('li', el).eq(index)).css('width', '100%');//.text('Uploaded');
                $('.upload-result').html('Uploading Files... (<i>' + (index + 1) + '/' + selectedFiles.length + ' Completed</i>)');
                uploadList.startUpload(index+1, uploadList.selectedFiles, userId, el);
                uploadList.upList.clear();
                uploadList.upList.el.append('<li>Upload completed</li>');
                if(response && response.response) {
                	try {
                		var out = JSON.parse(response.response);
                		if(!out.Transaction_Status) {
                			if(out.Message_To_Display) {
                				$('.prog-val', $('li', el).eq(index)).text(out.Message_To_Display);
                    		} else {
                    			$('.prog-val', $('li', el).eq(index)).text('Upload Error');
                    		}
                			$('.prog-val', $('li', el).eq(index)).css('background-color', '#DA3838');
                		} else {
                			if(out.Message_To_Display) {
                				$('.prog-val', $('li', el).eq(index)).text(out.Message_To_Display);
                			} else {
                				$('.prog-val', $('li', el).eq(index)).text('Upload completed');
                			}
                		}
                	} catch(e) {
                		$('.prog-val', $('li', el).eq(index)).text('Upload Error');
                		$('.prog-val', $('li', el).eq(index)).css('background-color', '#DA3838');
                	}
                } else {
                	$('.prog-val', $('li', el).eq(index)).text('Upload Error');
            		$('.prog-val', $('li', el).eq(index)).css('background-color', '#DA3838');
                }
                
            }, function(e) {
            	$('.prog-val', $('li', el).eq(index)).css('width', '100%');//.text('Uploaded');
                $('.upload-result').html('Uploading Files... (<i>' + (index + 1) + '/' + selectedFiles.length + ' Completed</i>)');
                uploadList.startUpload(index+1, uploadList.selectedFiles, userId, el);
                uploadList.upList.clear();
                uploadList.upList.el.append('<li>Upload completed</li>');
            	//$('.prog-val', $('li', el).eq(index)).text('Upload Error');
            	if(e != null && e.code == 1) {
                	$('.prog-val', $('li', el).eq(index)).text('Invalid file name');
                } else {
                	$('.prog-val', $('li', el).eq(index)).text('Upload Error');
                }
        		$('.prog-val', $('li', el).eq(index)).css('background-color', '#DA3838');
            }, options);
    	}, function(e) { 
    		$('.prog-val', $('li', el).eq(index)).css('width', '100%');//.text('Uploaded');
            $('.upload-result').html('Uploading Files... (<i>' + (index + 1) + '/' + selectedFiles.length + ' Completed</i>)');
            uploadList.startUpload(index+1, uploadList.selectedFiles, userId, el);
            uploadList.upList.clear();
            uploadList.upList.el.append('<li>Upload completed</li>');
            if(e != null && e.code == 1) {
            	$('.prog-val', $('li', el).eq(index)).text('Invalid file name');
            } else {
            	$('.prog-val', $('li', el).eq(index)).text('Upload Error');
            }
    		$('.prog-val', $('li', el).eq(index)).css('background-color', '#DA3838');
    	});
    },
    getDocumentType: function(fileName) {
	    if (fileName == null || fileName === undefined || fileName == '')
	        return 'image/jpeg';
	    var parts = fileName.split('.'), ext = parts[parts.length - 1];
	    if (ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'bmp') {
	        return 'image/jpeg';
	    } else if (ext == 'mp4' || ext == 'MOV' || ext == 'mov') {
	        return 'video/mp4';
	    } else if (ext == 'wmv' || ext == 'mp3' || ext == 'm4a' || ext == 'wma' || ext == 'flac' || ext == 'alac') {
	        return 'audio/wmp';
	    } else if(ext.indexOf("image:") == 0) {
	    	return 'image/jpeg';
	    } else if(ext.indexOf("video:") == 0) {
	    	return 'video/mp4';
	    } else if(ext.indexOf("file") == 0) {
	    	return 'application/document';
	    } else {
	    	return 'application/document';
	    }
	    return 'application/document';
	},
	getFileNameWithExtension: function(fileName) {
		var splFn = fileName.split("/");
        var fileName = "N/A";
        if(splFn != null && splFn.length > 0) {
        	fileName = splFn[splFn.length-1];
        	fileName = decodeURIComponent(fileName);
        }
		if(fileName.indexOf(".") >= 0) {
			return fileName;
		} else {
			return fileName + uploadList.getFileExtension(fileName);
			console.log(f)	
		}
	},
	getFileExtension: function(fileName) {
	    if (fileName == null || fileName === undefined || fileName == '')
	        return '.jpg';
	    var parts = fileName.split('.')
	    var ext = ".jpg";
        if(parts != null && parts.length > 1) {
        	ext = parts[parts.length-1];
        } else {
        	if(fileName.indexOf("image:") == 0) {
    	    	return '.jpg';
    	    } else if(fileName.indexOf("video:") == 0) {
    	    	return '.mp4';
    	    } else if(fileName.indexOf("file") == 0) {
    	    	return '.file';
    	    } else if (fileName.indexOf("audio:") == 0) {
    	        return '.mp3';
    	    } else {
    	    	return '.file';
    	    }	
        }
	    return '.file';
	}
};
