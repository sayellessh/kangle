function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function fnFileSelectedThumbnail(obj) {
    var ext = $(obj).val().match(/\.([^\.]+)$/)[1];
    switch (ext) {
        case 'jpg':
            break;
        case 'png':
            break;
        default:
            fnMsgAlert('info', 'File Type', 'Following extension only allowed :*.jpg,*.png');
            $(obj).val('');
    }
}

function fnGetDocumentType(ext) {
    var documentType = ""
    
    switch (ext) {
        case 'jpg':
            documentType = "IMAGE";
            break;
        case 'bmp':
            documentType = "IMAGE";
            break;
        case 'jpeg':
            documentType = "IMAGE";
            break;
        case 'gif':
            documentType = "IMAGE";
            break;
        case 'tiff':
            documentType = "IMAGE";
            break;
        case 'png':
            documentType = "IMAGE";
            break;
        case 'doc':
            documentType = "DOCUMENT";
            break;
        case 'docx':
            documentType = "DOCUMENT";
            break;
        case 'xls':
            documentType = "DOCUMENT";
            break;
        case 'xlsx':
            documentType = "DOCUMENT";
            break;
        case 'ppt':
            documentType = "DOCUMENT";
            break;
        case 'tif':
            documentType = "DOCUMENT";
            break;
        case 'pptx':
            documentType = "DOCUMENT";
            break;
        case 'ppts':
            documentType = "DOCUMENT";
            break;
        case 'pdf':
            documentType = "DOCUMENT";
            break;
        case 'mp4':
            documentType = "VIDEO";
            break;
        case 'wmv':
            documentType = "VIDEO";
            break;
        case 'swf':
            documentType = "DOCUMENT";
            break;
        case 'flv':
            documentType = "VIDEO";
            break;
        default:
            documentType = "DOCUMENT";
            break;
    }

    return documentType;
}

function fnValidateSpecialChar(val) {
    var ALPHANUMERICREGX_g = new RegExp("^[a-zA-Z0-9 _]+$");
    if (!ALPHANUMERICREGX_g.test($.trim(val))) {
        return false;
    }
    return true;
}

function fnLoginLoad() {
    window.location.href = document.domain;
    window.location.href = "http://" + document.domain;
}

function fnPutPageHeader(pageHeader) {
    $.ajax({
        type: "POST",
        async: false,
        url: '../Infrastructure/PutPageHeader/',
        data: "pageHeader=" + pageHeader + "",
        success: function (message) {
            
        }
    });

}

var setLeftSecUserName = function (dvElementId, userName, profilePic) {
    var dvElement = $('#' + dvElementId);
    dvElement.html(userName);
    if (profilePic == null || profilePic == '')
        profilePic = 'http://kangle.blob.core.windows.net/kangle-admin/default_profile_pic.jpg';
    console.log(profilePic);
    dvElement.css('background', 'url("' + profilePic + '") no-repeat top left');
    dvElement.css('background-size', '35px 35px');
    dvElement.unbind('click').bind('click', function (e) {
		//window.location.href = '/User/UserProfile';
    	window.location.href = '../Rxbook/UserProfile.Mobile.html';
    });
};