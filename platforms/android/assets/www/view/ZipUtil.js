var ZipUtil = function() {
};

ZipUtil.prototype = {
	extract: function(asset, success, fail) {
		var _this = this;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            var assetFolder = resource.assetDownloadFolder + '/' + asset.daCode;
            fileSystem.root.getDirectory(assetFolder, {create: true, exclusive: false}, function(assetExtractEntry) {
                fileUtil.getFileEntry(asset.downloadedFileName, function (fileEntry) {
                    zip.unzip(fileEntry.nativeURL, assetExtractEntry.nativeURL, function(done) {
                        if(done == 0) {
                            if(success) success(assetFolder + '/index.html');
                        }else
                            fail();
                    }, function(progress) {
                        //alert(JSON.stringify(progress));
                    });
                }, fail);
            }, fail);
		}, fail);
	},
    copyEdetail: function(extractPath, onSuccess) {
        //copy edetailing file to application folder
        //var configData = ED.context.configuration;
        $.ajax({
           url: 'http://wideanglebuilds.blob.core.windows.net/htmlanalytics/EdtAnalysisService.js',//"../../service/entity/asset/EdtAnalysisService.js"
           data: null,
           success: function(data){
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                    fileSystem.root.getFile(extractPath + '/EdtAnalysisService.js', {create: true},
                        function(fileEntry){
                        fileEntry.createWriter(function(writer){
                            writer.onwrite = function(evt) {
                                console.log("write success");
                            };
                            writer.write(data);
                            writer.abort();
                            if(onSuccess) onSuccess();
                        }, function(){ console.log('writer error');alert('writer error'); });
                    }, function(){ console.log('file error');alert('file error'); });
                 }, function(){ console.log('system error');alert('system error'); });
           },
           error: function(err) { console.log(err); }
        });
    },
	load : function(uri, folderName, fileName, progress, success, fail) {
		var that = this;
		that.progress = progress;
		that.success = success;
		that.fail = fail;
		filePath = "";

		that.getFilesystem(function(fileSystem) {
			console.log("GotFS");
			that.getFolder(fileSystem, folderName, function(folder) {
				filePath = folder.toURL() + "/" + fileName;
				that.transferFile(uri, filePath, progress, success, fail);
			}, function(error) {
				console.log("Failed to get folder: " + error.code);
				typeof that.fail === 'function' && that.fail(error);
			});
		}, function(error) {
			console.log("Failed to get filesystem: " + error.code);
			typeof that.fail === 'function' && that.fail(error);
		});
	},

	getFilesystem : function(success, fail) {
		window.requestFileSystem = window.requestFileSystem
				|| window.webkitRequestFileSystem;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
	},

	getFolder : function(fileSystem, folderName, success, fail) {
		fileSystem.root.getDirectory(folderName, {
			create : true,
			exclusive : false
		}, success, fail)
	},

	transferFile : function(uri, filePath, progress, success, fail) {
		var that = this;
		that.progress = progress;
		that.success = success;
		that.fail = fail;

		var transfer = new FileTransfer();
		transfer.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				var perc = Math.floor(progressEvent.loaded
						/ progressEvent.total * 100);
				typeof that.progress === 'function' && that.progress(perc); // progression on scale 0..100 (percentage) as number
			} else {
			}
		};

		transfer.download(uri, filePath, function(entry) {
			console.log("File saved to: " + entry.toURL());
			typeof that.success === 'function' && that.success(entry);
		}, function(error) {
			console.log("An error has occurred: Code = " + error.code);
			console.log("download error source " + error.source);
			console.log("download error target " + error.target);
			console.log("download error code " + error.code);
			typeof that.fail === 'function' && that.fail(error);
		});
	},

	unzip : function(folderName, fileName, success, fail) {
		var that = this;
		that.success = success;
		that.fail = fail;
		alert(folderName);

		zip
				.unzip(
						"cdvfile://localhost/persistent/" + folderName + "/"
								+ fileName,
						"cdvfile://localhost/persistent/" + folderName,
						function(code) {
							console.log("result: " + code);
							that
									.getFilesystem(
											function(fileSystem) {
												console.log("gotFS");
												that
														.getFolder(
																fileSystem,
																folderName
																		+ "/ftpack",
																function(folder) {
																	// document.getElementById("imgPlace").src = folder.nativeURL + "/img.jpg";
																	folder
																			.getFile(
																					"text.html",
																					{
																						create : false
																					},
																					function(
																							fileEntry) {
																						fileEntry
																								.file(
																										function(
																												file) {
																											var reader = new FileReader();
																											reader.onloadend = function(
																													evt) {
																												console
																														.log("Read as text");
																												console
																														.log(evt.target.result);
																												$(
																														'#myIframe')
																														.show();
																												$(
																														'#myIframe')
																														.attr(
																																'src',
																																"cdvfile://localhost/persistent/"
																																		+ folderName
																																		+ "/ftpack/index.html");

																												//document.getElementById("txtPlace").innerHTML = evt.target.result;
																												typeof that.success === ' function && that.success();'
																											};
																											reader
																													.readAsText(file);
																										},
																										function(
																												error) {
																											console
																													.log("Failed to get file");
																											typeof that.fail === 'function'
																													&& that
																															.fail(error);
																										});
																					},
																					function(
																							error) {
																						console
																								.log("failed to get file: "
																										+ error.code);
																						typeof that.fail === 'function'
																								&& that
																										.fail(error);
																					});
																},
																function(error) {
																	console
																			.log("failed to get folder: "
																					+ error.code);
																	typeof that.fail === 'function'
																			&& that
																					.fail(error);
																});
											},
											function(error) {
												console
														.log("failed to get filesystem: "
																+ error.code);
												typeof that.fail === 'function'
														&& that.fail(error);
											});
						});
	}
};

String.prototype.hashCode = function() {
	var hash = 0, i, chr, len;
	if (this.length == 0)
		return hash;
	for (i = 0, len = this.length; i < len; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var objToString = function(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
};