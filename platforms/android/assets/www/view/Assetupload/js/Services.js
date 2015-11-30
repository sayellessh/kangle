var commonValues = {
    defaults: {
        timeZoneOffSet: new Date().getTimezoneOffset()
    },
    getUTCOffset: function () {
        var offset = (new Date()).getTimezoneOffset();
        if (offset < 0) {
            offset = 10000 + Math.abs(offset);
        }
        return offset;
    },
}
var Services = {

    defaults: {
        subdomainName: window.location.hostname,
        userId: null,
        displayName: null,
        userPrefix: 'Dr. ',
        companyId: 0,
        companyCode: '',
        userMood: 'cool',
        utcOffset: commonValues.getUTCOffset(),
        userMood: 'Hi!',
        timeStamp: 1010101010,
    },

    context: {
        upload: 'AutoSignOnApi',
        selfsign: 'SelfSignOnApi',
        customer: 'CustomerApi'
    },
    showLoader: function () {
        $('.loader-image').show();
    },
    hideLoader: function () {
        $('.loader-image').hide();
    },
    getInProgressAssetsCount: function(userCode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetInProgressAssetsCount', _this.defaults.subdomainName, _this.defaults.companyId, userCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUnassignedAssetsCount: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetsCount', _this.defaults.subdomainName, _this.defaults.companyId, userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAssignedAssetsCount: function (userCode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssignedAssetsCount', _this.defaults.subdomainName, _this.defaults.companyId, userCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUnAssignedAssets: function (userId, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssets', _this.defaults.subdomainName, _this.defaults.companyId, userId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUnAssignedAssetsWithPaging: function (userId, pageNumber, pageSize, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, searchText,
            success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetsWithPaging', _this.defaults.subdomainName, 
            _this.defaults.companyId, userId, pageNumber, pageSize, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, searchText,
            _this.defaults.utcOffset, 'DESC']; //ASC to DESC commented
        CoreREST.get(_this, context, null, success, failure);
    },
    getAssignedAssetsWithPaging: function (userId, pageNumber, pageSize, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, searchText,
            success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssignedAssetsWithPagingForV38', _this.defaults.subdomainName,
            _this.defaults.companyId, userId, pageNumber, pageSize, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, searchText,
            _this.defaults.utcOffset, 'DESC']; // ASC to DESC commented
        CoreREST.get(_this, context, null, success, failure);
    },
    getEncodingInProgressAssets: function (success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetEncodingInProgressAssets', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userCode];
        CoreREST.get(_this, context, null, success, failure);
    },
    uploadFilesToStaging: function (fileSize, userId, data, showProgress, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'UploadFileToStaging', _this.defaults.subdomainName, _this.defaults.companyId, userId, 'MOBILE', fileSize];
        CoreREST.postFile(_this, context, data, showProgress, success, failure);
    },
    getFilterCategoriesUnassign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetFilterCategory', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFilterFilesUnassign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetFilterFileExtension', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFilterTagsUnassign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetFilterTags', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFilterUsersUnassign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetFilterUsers', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },

    //Assign filters
    getFilterCategoriesAssign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssignedAssetFilterCategoryForV38', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFilterFilesAssign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssignedAssetFilterFileExtensionForV38', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFilterTagsAssign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssignedAssetFilterTagsForV38', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },
    getFilterUsersAssign: function (userId, categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssignedAssetFilterUsersForV38', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            categoryFilters, fileTypeFilters, tagFilters, fileOwnerFilters];
        CoreREST.get(_this, context, null, success, failure);
    },

    //Get Asset by staging id
    getUnAssignedAssetByStagingId: function (userId, stagingId, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUnassignedAssetInfoByStagingId', _this.defaults.subdomainName, _this.defaults.companyId, userId,
            _this.defaults.utcOffset, stagingId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAssignedAssetById: function (userId, assetId, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssetDetailsByAssetId', _this.defaults.subdomainName, _this.defaults.companyId, 
            assetId, _this.defaults.utcOffset];
        CoreREST.get(_this, context, null, success, failure);
    },

    //asset update properties
    changeUnAssignedThumbnail: function (userId, stagingId, data, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'ChangeUnassignedAssetThumbnail', _this.defaults.subdomainName, _this.defaults.companyId,
            userId, stagingId];
        CoreREST.postFile(_this, context, data, null, success, failure);
    },
    changeAssignedThumbnail: function (userId, daCode, data, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'UpdateAssetThumbnailOfAssignedAsset', _this.defaults.subdomainName, _this.defaults.companyId,
            daCode, userId];
        CoreREST.postFile(_this, context, data, null, success, failure);
    },
    getAssetTags: function (success, failure) {
        var _this = Services;
        var context = [_this.context.selfsign, 'GetAssetTags', _this.defaults.subdomainName, _this.defaults.companyCode,
            _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAssetCategories: function (success, failure) {
        var _this = Services;
        var context = [_this.context.selfsign, 'GetAssetCategories', _this.defaults.subdomainName, _this.defaults.companyCode, 
            _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
//    updateUnassignedAssets: function (userId, stagingIds, retainPrevTags, assetName, categoryName, categoryCode, description,
//        tags, expiryDate, isDownloadable, isShareable, success, failure) {
//        var _this = Services;
//        var context = [_this.context.upload, 'ChangeUnassignedAssetProperties', _this.defaults.subdomainName, _this.defaults.companyId, userId,
//            stagingIds, retainPrevTags, assetName, categoryName, categoryCode, description, tags, expiryDate, isDownloadable, isShareable];
//        CoreREST.get(_this, context, null, success, failure);
//    },
//    updateAssignedAssets: function (userId, stagingIds, retainPrevTags, assetName, categoryName, categoryCode, description,
//        tags, expiryDate, isDownloadable, isShareable, success, failure) {
//        var _this = Services;
//        var context = [_this.context.upload, 'UpdateAssignedAssetProperties', _this.defaults.subdomainName, _this.defaults.companyId, userId,
//            stagingIds, retainPrevTags, _this.defaults.userCode, _this.defaults.companyCode, assetName, categoryName, categoryCode, description, tags,
//            expiryDate, isDownloadable, isShareable];
//        CoreREST.get(_this, context, null, success, failure);
//    },
    updateUnassignedAssets: function (userId, stagingIds, retainPrevTags, assetName, categoryName, categoryCode, description,
            tags, expiryDate, isDownloadable, isShareable, success, failure) {
            var _this = Services;
            var obj = {};
            obj.DA_Name = assetName;
            obj.DA_Category_Code = categoryCode;
            obj.DA_Category_Name = categoryName;
            obj.DA_Description = description;
            obj.Tags = tags;
            obj.ToDate = expiryDate;
            obj.Is_Downloadable = isDownloadable;
            obj.Is_Customer_Sharable = isShareable;
            obj.Target_Asset_Ids = stagingIds;
            
            var context = [_this.context.upload, 'ChangeUnassignedAssetProperties', _this.defaults.subdomainName, _this.defaults.companyId, userId,retainPrevTags];
            CoreREST.postArray(_this, context, obj, success, failure);
        },
        updateAssignedAssets: function (userId, stagingIds, retainPrevTags, assetName, categoryName, categoryCode, description,
            tags, expiryDate, isDownloadable, isShareable, success, failure) {
            var _this = Services;
            var obj = {};
            obj.DA_Name = assetName;
            obj.DA_Category_Code = categoryCode;
            obj.DA_Category_Name = categoryName;
            obj.DA_Description = description;
            obj.Tags = tags;
            obj.ToDate = expiryDate;
            obj.Is_Downloadable = isDownloadable;
            obj.Is_Customer_Sharable = isShareable;
            obj.Target_Asset_Ids = stagingIds;
            
            var context = [_this.context.upload, 'UpdateAssignedAssetPropertiesForV38', _this.defaults.subdomainName, _this.defaults.companyId, userId,retainPrevTags, _this.defaults.userCode, _this.defaults.companyCode];
            CoreREST.postArray(_this, context, obj, success, failure);
        },

    /** User Divisions **/
    getDivisions: function (success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetDivisions', _this.defaults.subdomainName, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getUserTypeDetails: function (success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetUserTypeDetails', _this.defaults.subdomainName, _this.defaults.companyCode,
            _this.defaults.regionCode, _this.defaults.companyId];
        CoreREST.get(_this, context, null, success, failure);
    },
    getAllUsers: function (success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetDistinctActiveUsers', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId];
        CoreREST.get(_this, context, null, success, failure);
    },
    /*assignUsers: function (userId, retainPreUsers, daCode, assetSelection, mode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'InsertAssetUserShared', _this.defaults.subdomainName, retainPreUsers, daCode,
            assetSelection, _this.defaults.companyId, _this.defaults.companyCode, _this.defaults.userCode, mode, _this.defaults.userId];
        CoreREST.postArray(_this, context, userId , success, failure); // new change userId
    },
    assignAssetToAllUsers: function (userId, targetStagingIds, pagename, userCode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'AssignAssetToAllUsersForEnterprise', _this.defaults.subdomainName, _this.defaults.companyId,userId, targetStagingIds, pagename , userCode]; // new change
        CoreREST.get(_this, context, null, success, failure);
    },*/
    assignUsers: function (userId, retainPreUsers, daCode, assetSelection, mode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'InsertAssetUserShared', _this.defaults.subdomainName, retainPreUsers, daCode,
            assetSelection, _this.defaults.companyId, _this.defaults.companyCode, _this.defaults.userCode, mode, _this.defaults.userId, false];
        CoreREST.postArray(_this, context, userId , success, failure); // new change userId
    },
    assignAssetToAllUsers: function (userId, allusers, targetStagingIds, assetSelection, mode, userCode ,success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'InsertAssetUserShared', _this.defaults.subdomainName, 0 , targetStagingIds, assetSelection, _this.defaults.companyId, _this.defaults.companyCode, userCode, mode, userId, true]; // new change
        CoreREST.postArray(_this, context, allusers, success, failure);
    },
    getAssetsCount: function (userId, userCode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAssetsCountForV38', _this.defaults.subdomainName, _this.defaults.companyId, 
            userId, userCode];
        CoreREST.get(_this, context, null, success, failure);
    },

    // new change Customer Share
    getCustomerSpeciality: function (success, failure) {
        var _this = Services;
        var context = [_this.context.customer, 'GetCustomerSpeciality', _this.defaults.subdomainName];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertAssetSpecialityMapping: function (assetSpeciality, isRetain, assetSelection, selectionMode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'InsertAssetSpecialityMapping', _this.defaults.subdomainName
            , _this.defaults.companyId, _this.defaults.userId
            , isRetain, assetSelection, selectionMode];
        CoreREST.postArray(_this, context, assetSpeciality, success, failure);
    },
    getAssetSpecialityMappingbyAssetId: function (assetId, success, failure) {
	var _this = Services;
        var context = [_this.context.upload, 'GetAssetSpecialityMappingbyAssetId', _this.defaults.subdomainName
            , _this.defaults.companyId, assetId];
        CoreREST.get(_this, context, null, success, failure);
    },
    //new change
    retireAssignedAsset: function (userId, targetIds, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'RetireAssignedAssetsForV38', _this.defaults.subdomainName, _this.defaults.companyId,
            userId, _this.defaults.userCode, targetIds];
        CoreREST.get(_this, context, null, success, failure);
    },
    // new Change
    getAllCKCustomer: function (firstName, lastName, speciality, email, searchText, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'GetAllCKCustomer', _this.defaults.subdomainName
            , _this.defaults.companyId, firstName, lastName, speciality, email, searchText];
        CoreREST.get(_this, context, null, success, failure);
    },
    insertAssetCustomerMapping: function (assetSpeciality, isRetain, assetSelection, selectionMode, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'InsertAssetCustomerMapping', _this.defaults.subdomainName, _this.defaults.companyId, _this.defaults.userId, isRetain, assetSelection, selectionMode];
        CoreREST.postArray(_this, context, assetSpeciality, success, failure);
    },
    getAssetsMappedCustomersbyAssetId: function (assetId, success, failure) {
	var _this = Services;
        var context = [_this.context.upload, 'GetAssetsMappedCustomersbyAssetId', _this.defaults.subdomainName
            , _this.defaults.companyId, assetId];
        CoreREST.get(_this, context, null, success, failure);
    },
    // new Change
    deleteUnassignedAssets: function(userId, targetIds, success, failure) {
        var _this = Services;
        var context = [_this.context.upload, 'DeleteUnassignedAssets', _this.defaults.subdomainName, _this.defaults.companyId,
            userId, targetIds];
        CoreREST.get(_this, context, null, success, failure);
    }
};

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
*/

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};