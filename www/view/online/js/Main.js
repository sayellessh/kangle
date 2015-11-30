var getParameter = function (key) {
	var result = "", tmp = [];
	location.search
	//.replace ( "?", "" ) 
	// this is better, there might be a question mark inside
	.substr(1).split("&").forEach(function(item) {
		tmp = item.split("=");
		if (tmp[0] === key)
			result = decodeURIComponent(tmp[1]);
	});
	return result;
};

var isApp = function () {
    return appNew;
};

if (isApp()) {
    var mobileInitScript = document.createElement('script');
    mobileInitScript.setAttribute('src', '/Scripts/ELScripts/AssetUpload/Mobile.js');
    if(document.head)
        document.head.appendChild(mobileInitScript);
    else
        document.getElementsByTagName('head')[0].appendChild(mobileInitScript);
} else {
    var browserInitScript = document.createElement('script');
    browserInitScript.setAttribute('src', '/Scripts/ELScripts/AssetUpload/Browser.js');
    if (document.head)
        document.head.appendChild(browserInitScript);
    else
        document.getElementsByTagName('head')[0].appendChild(browserInitScript);
}
