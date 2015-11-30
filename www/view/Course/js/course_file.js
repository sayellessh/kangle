var courseFile = {
	//download asset and open using file opener
	//delete the asset after the test is passed
	urlPrefix: '',
	courseId: '',
	asset: null,
	callback: null,
	start: function(courseId, asset, callback) {
		courseFile.callback = callback;
		courseFile.courseId = courseId;
		courseFile.asset = asset;
		//app.hideLoading();
		/*Code in course_service for companylogo*/
		var companyLogoUrl = window.localStorage.getItem("companyLogoUrl");
		if(companyLogoUrl === undefined || companyLogoUrl === '' || companyLogoUrl === null)
			companyLogoUrl = '';
		$('header .logo a').css({'background-image': 'url(' + companyLogoUrl + ')',
			'background-position':'0% 50%',
			'background-repeat':'no-repeat',
			'background-size':'100%'});
		/*Code in course_service for companylogo*/
		if(device.platform=='Android'){
			courseFile.urlPrefix = 'file:///sdcard/' + resource.courseFolder;
		} else if (device.platform = 'iOS') {
			//courseFile.urlPrefix = 'cdvfile://localhost/persistent/' + resource.courseFolder;
		}
		
		courseFile.checkIfFileExistsInLocal(courseId, courseFile.asset.DA_Code, courseFile.ifFileFound, 
				courseFile.ifFileNotFound);
	},
	checkIfFileExistsInLocal: function(courseId, assetId, ifFileFound, ifFileNotFound) {
		var fileName = courseFile.getFileName(courseFile.asset.File_Path);
		var filePath = resource.courseFolder + '/' + courseId + '/' + fileName;
		courseFile.checkIfFileExists(filePath, function (fileEntry) {
			if(ifFileFound) ifFileFound(fileEntry);
		}, function(){
			if(ifFileNotFound) ifFileNotFound(courseId, assetId);
		});
	},
	checkIfTempFileExistsInLocal: function(courseId, assetId, success, failure) {
		var fileName = courseFile.getFileName(courseFile.asset.File_Path);
		var filePath = resource.courseFolder + '/' + courseId + '/' + 'temp_' + fileName;
		courseFile.checkIfFileExists(filePath, function (fileEntry) {
			if(success) success(fileEntry);
		}, function(){
			if(failure) failure(courseId, assetId);
		});
	},
	ifFileFound: function(fileEntry) {
		console.log(JSON.stringify(fileEntry));
		courseFile.callback(fileEntry.nativeURL);
	},
	ifFileNotFound: function(courseId, assetId) {
		eLearningAPP.showProgress(0);
		var fileName = courseFile.getFileName(courseFile.asset.File_Path);
		courseFile.checkIfTempFileExistsInLocal(courseId, '', function(fileEntry){
            fileEntry.remove(function(){
            	courseFile.downloadFile(courseId, fileName, function(){}, function(){});
            }, function(){
            	courseFile.downloadFile(courseId, fileName, function(){}, function(){});
            });
        }, function(){
        	courseFile.downloadFile(courseId, fileName, function(){}, function(){});
        });
		
	},
	downloadFile: function(courseId, fileName, success, failure) {
		var fileTransfer = new FileTransfer();
		fileName = 'temp_' + fileName;
		app.hideLoading();
		var pStatus = 0;
/*
		var intv = window.setInterval(function(){ 
			console.log('the progress status: ' + pStatus);
			if(pStatus <= 100) {
				eLearningAPP.showProgress(pStatus);
			} else {
				clearInterval(intv);
			}
		}, 1000);
*/	
		/*downloaderUtil.downloadFile(courseFile.asset.File_Path, resource.courseFolder + '/' + courseId, fileName, 
			{}, function(progressStatus){
			//eLearningAPP.showProgress(30);	
			console.log('the status is ' + progressStatus);
			pStatus = progressStatus.progress;
			if(progressStatus.progress == 100) {
				if(courseFile.callback) {
					var lastUrl = courseFile.urlPrefix + '/' + courseId + '/' + fileName;
					//courseFile.callback(lastUrl);
					
					var oldFileName = resource.courseFolder + '/' + courseId + '/' + fileName,
                    newFileName = resource.courseFolder + '/' + courseId + '/' + fileName.replace('temp_', '');
                    courseFile.renameFile(courseId, oldFileName, newFileName, function(nativeURL){
                       courseFile.callback(nativeURL);
                    });
				}
			}
		});*/
		
		fileTransfer.download(courseFile.asset.File_Path, cordova.file.externalRootDirectory + '/' + 
				resource.courseFolder + '/' + courseId + '/' + fileName, function(progressStatus){
			if(courseFile.callback) {
				var lastUrl = courseFile.urlPrefix + '/' + courseId + '/' + fileName;
				var oldFileName = resource.courseFolder + '/' + courseId + '/' + fileName,
                newFileName = resource.courseFolder + '/' + courseId + '/' + fileName.replace('temp_', '');
                courseFile.renameFile(courseId, oldFileName, newFileName, function(nativeURL){
                   courseFile.callback(nativeURL);
                });
			}
		}, function(){}, false, null);
		fileTransfer.onprogress = function (progressStatus) {
			var perc = Math.floor(progressStatus.loaded / progressStatus.total * 100);
			eLearningAPP.showProgress(perc);
		};
	},
	deleteFolder: function(courseId, success, failure) {
		var dirPath = resource.courseFolder + '/' + courseId;
		fileUtil.deleteDirectory(dirPath, function(){
			if(success) success();
		}, function(){
			if(failure) failure();
		});
	},
	getFileName: function(filePath) {
		var fileName = filePath.split('/');
		if(fileName[fileName.length-1] == '') {
			fileName.pop(); 
		}
		fileName = fileName[fileName.length-1];
		return fileName;
	},
	renameFile: function(courseId, oldFileName, newFileName, success, failure) {
		console.log(oldFileName);
		console.log(newFileName);
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
        	console.log(fs);
            fs.root.getFile(oldFileName, {}, function(fileEntry){
                fileEntry.moveTo(fs.root, newFileName);
                var nativeURL = fileEntry.nativeURL;
                console.log(nativeURL);
                nativeURL = nativeURL.replace('temp_','');
                console.log(nativeURL);
                if(success) success(nativeURL);
            }, function(e){
                console.log(JSON.stringify(e));
            });
        }, failure);
    },
    checkIfFileExists: function(fileUrl, success, failure) {
    	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
    		fs.root.getFile(fileUrl, {}, function(fileEntry){
    			if(fileEntry != null) {
    				fileExists = true;
    				success(fileEntry);
    			}
    		}, function(fileEntry){
    			fileExists = false;
    			failure();
    		});
    	}, function(fileEntry){
			fileExists = false;
			failure();
		});
    }
};