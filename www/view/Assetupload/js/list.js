var List = function(element) {
	this.el = $(element);
	this.onElementClick = null;
	this.onElementSelect = null;
	this.onActionElClick = null;
	this.selectedElements = new Array();
	this.deleteUploadList = null;
	this.createAssignedList = function(obj) {
		var el = $('<li></li>'), html = '';
		html += '<span class="asset-thumb"><img src="' + obj.thumbnailUrl + '" alt="' + obj.fileName + '"/></span>';
		html += '<span class="asset-detail">';
		html += '<span class="asset-name">' + obj.fileName + '</span>';
		html += '<span class="asset-tag">';
		for(var i = 0; i < obj.tags.length; i++) {
			html += obj.tags[i];
			if(i < obj.tags.length - 1)
				html += ' | ';
		}
		html += '</span>';
		html += '<span class="asset-upload-by">' + obj.uploadedBy + '</span>';
		html += '<span class="asset-date">' + obj.uploadedOn + '</span>';
		html += '</span>';
		html += '<span class="asset-list-actn"></span>';
		html += '<span class="asset-select"></span>';
		el.html(html).data('listobj', obj).attr('id', 'unassign_' + obj.stagingId);
		this.el.append(el);
	}
	this.createUnAssignedList = function(obj) {
		var el = $('<li></li>'), html = '';
		html += '<div>';
		html += '<span class="asset-thumb"><img src="' + obj.thumbnailUrl + '" alt="' + obj.fileName + '"/></span>';
		html += '<span class="asset-detail">';
		html += '<span class="asset-name">' + obj.fileName + '</span>';
		html += '<span class="asset-tag">';
		for(var i = 0; i < obj.tags.length; i++) {
			html += obj.tags[i];
			if(i < obj.tags.length - 1)
				html += ' | ';
		}
		html += '</span>';
		html += '<span class="asset-upload-by">' + obj.uploadedBy + '</span>';
		html += '<span class="asset-date">' + obj.uploadedOn + '</span>';
		html += '</span>';
		html += '</div>';
		
		html += '<div class="asset-status">';
		html += '<div class="asset-size">';
		html += '<span class="size-in-mb">' + obj.fileSize + ' MB</span>';
		if (obj.isDownloadable == 'Y')
		    html += '<span class="asset-store fa fa-download"></span>';
		else
            html += '<span class="asset-store fa fa-globe"></span>';
        
		if (obj.isShareable == 'Y')
		    html += '<span class="asset-share fa fa-share-alt"></span>';
		html += '</div>';
		html += '<div class="asset-detail">';
		html += '<span class="asset-rating">';
		html += '<span class="fa fa-star"></span>';
		html += '<span class="value">' + obj.fileRating + '</span>';
		html += '</span>';
		html += '<span class="asset-eye">';
		html += '<span class="fa fa-eye"></span>';
		html += '<span class="value">' + obj.fileViews + '</span>';
		html += '</span>';
		html += '<span class="asset-like">';
		html += '<span class="fa fa-heart"></span>';
		html += '<span class="value">' + obj.fileLikes + '</span>';
		html += '</span>';
		html += '</div>';
		html += '</div>';
		
		html += '<span class="asset-list-actn"></span>';
		html += '<span class="asset-select"></span>';
		el.html(html).data('listobj', obj);
		this.el.append(el);	
	}
	this.createUploadAssetList = function (obj) {
	    var el = $('<li></li>'), html = '';
	    var fileType = this.getDocumentType(obj.fileName);
	    if(fileType) {
		    html += '<div>';
		    html += '<span class="list-name">' + obj.fileName + '</span>';
		    html += '<span class="list-del"><span class="fa fa-trash"></span></span>';
	        html += '</div>';
	
	        el.html(html).data('listobj', obj).addClass('no-select');
	        el.css('background-image', 'url("images/newdoctype/' + fileType + '.png")');
		    this.el.append(el);
	    }
	}
	this.createProgressList = function (obj) {
	    var el = $('<li></li>'), html = '';
        //alert(JSON.stringify(obj));
	    var fileType = this.getDocumentType(obj.fileName);

	    html += '<span class="asset-thumb" style="width: 40px; height: 40px"><img src="images/newdoctype/' + fileType + '.png" alt="' + obj.fileName + '"/></span>';
	    html += '<span class="asset-detail" style="padding-left: 50px;">';
	    html += '<span class="asset-name">' + obj.assetName + '</span>';
	    html += '<span class="asset-upload-by">' + obj.status + '</span>';
	    html += '</span>';
	    el.html(html).data('listobj', obj).attr('id', 'unassign_' + obj.stagingId);
	    this.el.append(el);
	}
	this.createUploadProgressAssetList = function (obj) {
	    var el = $('<li></li>'), html = '';
	    var fileType = this.getDocumentType(obj.fileName);

	    html += '<div>';
	    html += '<span class="list-name">' + obj.fileName + '</span>';
	    html += '<span class="list-del"><span class="fa fa-remove"></span></span>';
	    html += '<span class="list-prog"><span class="prog-cont"><span class="prog-val"></span></span></span>';
	    html += '</div>';

	    el.html(html).data('listobj', obj).addClass('no-select');
	    el.css('background-image', 'url("images/newdoctype/' + fileType + '.png")');
	    this.el.append(el);
	}
	this.refresh = function () {
		var self = this;
        $('li', this.el).unbind('click').bind('click', function (e) {
		    e.stopImmediatePropagation();
		    var elm = $(this);
		    var obj = elm.data('listobj');
		    if (self.onElementClick)
		        self.onElementClick(obj, elm, elm.index());
		    return false;
		});
		$('li', this.el).not('.no-select').unbind('taphold').bind('taphold', function (evt) {
		    evt.preventDefault();
		    self.reset($(this));
		    self.selectedElements = new Array();
			$('.list-select', this.el).each(function (i, el) {
			    self.selectedElements.push($(this));
			});
			var obj = {};
			if(self.onElementSelect)
			    self.onElementSelect(obj, $(this), self.selectedElements, evt);
			return false;
		});
		$('li .asset-list-actn', this.el).not('.no-select').on('click', function (e) {
		    e.stopImmediatePropagation();
		    if (self.selectedElements.length > 0)
		        return false;
		    var elm = $(this).parents('li').eq(0);
			if(elm.hasClass('list-select') == false) {
				var obj = elm.data('listobj');
				if(self.onActionElClick)
					self.onActionElClick(obj, $(this), e);
			}
			return false;
		});
		$('li .list-del', this.el).unbind('click').bind('click', function (e) {
		    var elm = $(this).parents('li').eq(0);
		    e.stopImmediatePropagation();
		    var obj = elm.data('listobj');
		    if (self.deleteUploadList)
		        self.deleteUploadList(obj, elm, elm.index());
		    return false;
		});
	}

	this.reset = function(el) {
		if(el.hasClass('list-select'))
			el.removeClass('list-select');
		else
			el.addClass('list-select');
	}
    
	this.clear = function () {
	    $('li', this.el).remove();
	}

	this.getDocumentType = function(fileName) {
	    if (fileName == null || fileName === undefined || fileName == '')
	        return 'image';
	    var parts = fileName.split('.'), ext = parts[parts.length - 1].toLowerCase();
	    if(ext == 'jpg' || ext == 'jpeg'|| ext == 'gif' || ext == 'png' || ext == 'bmp' || ext == 'zip' || ext == 'docx'|| ext == 'doc' || ext == 'mp4' || ext == 'ppt' ||ext == 'pdf' ||ext == 'pptx'|| ext == 'xlsx'|| ext == 'xls') {
		    if (ext == 'jpg' || ext == 'gif' || ext == 'png' || ext == 'bmp' || ext == 'jpeg') {
		        return 'image';
		    } else if (ext == 'mp4' || ext == 'MOV' || ext == 'mov') {
		        return 'video';
		    } else if (ext == 'wmv' || ext == 'mp3' || ext == 'm4a' || ext == 'wma' || ext == 'flac' || ext == 'alac') {
		        return 'audio';
		    } else if (ext == 'zip') {
		        return 'html5';
		    } else if(ext.indexOf("image:") == 0) {
		    	return 'image';
		    } else if(ext.indexOf("video:") == 0) {
		    	return 'video';
		    } else if(ext.indexOf("file") == 0) {
		    	return 'document';
		    } else {
		        return ext;
		    }
		    return 'INVALID';
	    } else {
	    	//alert("You are trying to upload a not supporting file type.Please choose valid file type");
	    	return false;
	    }
	}
};