var share = {
    hdrEl: null,
    assetCode: null,
    assetCodes: null,
    multiAssetMode: false,
    isUnassign: null,
    init: function (assetCode, isUnassign) {
        share.getCustomerSpecalities();
        share.setHeader();
        share.assetCode = assetCode;
        if (assetCode != null)
            share.assetCodes = assetCode.split("~");
        else
            share.assetCodes = [];

        if (share.assetCodes != null && share.assetCodes.length <= 1) {
            $("#retain-asset-block-check").hide();
        } else {
            share.multiAssetMode = true;
            $("#retain-asset-block-check").show();
        }

        share.isUnassign = isUnassign;

        $('span.select').unbind('click').bind('click', function () {
            var bCheck = $(this).hasClass('select-all');

            if (bCheck) $(this).text('Deselect all');
            else $(this).text('Select all');

            $('.speciality-list li input').each(function (i, el) {
                el.checked = bCheck;
            });
            $(this).toggleClass('select-all');
        });
    },
    setHeader: function () {
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        share.hdrEl = new header();
        share.hdrEl.hdrElActions = function (index) {
            if (index == 1) {
                share.onDoneBtnClick();
            } else if (index == 0){
                if(share.isUnassign == 'Y')
                    window.location.href = 'UnassignedAssets.Mobile.html';
                else
                    window.location.href = 'AssignedAssets.Mobile.html';
            }
        };
        share.hdrEl.onBackClick = function () {
            if (share.isUnassign == 'Y')
                window.location.href = 'UnassignedAssets.Mobile.html';
            else
                window.location.href = 'AssignedAssets.Mobile.html';
        };
        share.hdrEl.createHeaderWithIcons(hdrOptions, 'Share with Customers');
        $('.wrapper header').replaceWith(share.hdrEl.el);
    },
    getCustomerSpecalities: function () {
        Services.getCustomerSpeciality(function (data) {
            share.createList(data);
        }, function () {
            share.createList([]);
        });
    },
    getAssetSpecialityMappingbyAssetId: function (assetId) {
        Services.getAssetSpecialityMappingbyAssetId(assetId, share.updateCustomerSelection, function () { });
    },
    updateCustomerSelection: function (data) {
        if (data && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                $("#spec_" + data[i].Spl_cat_1_Value).prop("checked", true);
            }
        }
    },
    createList: function (specialities) {
        var html = '';
        if (specialities && specialities.length > 0) {    
            for (var i = 0; i < specialities.length; i++) {
                html += '<li><div class="inn-spl">';
                /** loop the already presented specialities with this and check the input **/
                html += '<input id="spec_' + specialities[i].Preference_Value_Id + '" type="checkbox" name="specialities" value="' +
                    specialities[i].Preference_Value_Id + '" data-spid="' + specialities[i].Preference_Value_Id  + '"/>';
                html += '<label for="spec_' + specialities[i].Preference_Value_Id + '">' + specialities[i].Preference_Value + '</label>';
                html += '</div></li>';
            }
        } else {
            html += '<li>No specialities found</li>';
        }
        $('.speciality-list').html(html);
        if (!share.multiAssetMode)
            share.getAssetSpecialityMappingbyAssetId(share.assetCodes[0]);
        share.bindInputActions();
    },
    bindInputActions: function () {
        $('.speciality-list li input').bind('change', function () {
            var splLength = $('.speciality-list li input').length,
                actLength = $('.speciality-list li input:checked').length;
            if (splLength != actLength) {
                $('span.select').addClass('select-all');
                $('span.select').text('Select all');
            } else {
                $('span.select').removeClass('select-all');
                $('span.select').text('Deselect all');
            }
        });
    },
    onDoneBtnClick: function () {
        var specialities = "";
        var checkedElem = $(".speciality-list li input:checked");
        for (var i = 0; i <= checkedElem.length - 1; i++) {
            specialities += $(checkedElem.get(i)).data("spid");
            if (i < checkedElem.length-1) {
                specialities += ",";
            }
        }
        if (share.assetCodes != null && share.assetCodes.length > 0) {
            var postData = "";
            for (var i = 0; i <= share.assetCodes.length - 1 ; i++) {
                postData += share.assetCodes[i] + "^" + specialities;
                if (i < share.assetCodes.length - 1) {
                    postData += "|";
                }
            }
            
            var sharepostdata = new Array();
            sharepostdata.push(postData);
            
            var retainAsset = true;
            if (share.multiAssetMode) {
                retainAsset = $("#retain-asset:checked").length > 0 ? true : false;
            }
            var selectionMode = share.isUnassign == 'Y' ? "UNASSIGNED" : "ASSIGNED";
            Services.showLoader();
            Services.insertAssetSpecialityMapping(sharepostdata, retainAsset, share.assetCodes.length, selectionMode, share.onCompleteSave, share.onFail);
        }
    },
    onCompleteSave: function(data) {
        Services.hideLoader();
        if (data) {
            alert("Asset mappings done successfully.");
            if (share.isUnassign == 'Y')
                window.location.href = 'UnassignedAssets.Mobile.html';
            else
                window.location.href = 'AssignedAssets.Mobile.html';
        } else {
            alert("Unable to save asset, please try again.");
        }
    },
    onFail: function (e) {
        Services.hideLoader();
        alert("Unable to save asset, please check your internet and try again.");
    }
};