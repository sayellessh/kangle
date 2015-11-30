var share = {
    hdrEl: null,
    assetCode: null,
    assetCodes: null,
    multiAssetMode: false,
    isUnassign: null,
    filterOptions: null,
    init: function (assetCode, isUnassign) {
        share.getCustomers(null, null, 0, null, null);
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
            { className: 'fa-filter' }
        ];

        share.hdrEl = new header();
        share.hdrEl.hdrElActions = function (index) {
            if (index == 0) {
                share.showFilter();
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
    getCustomers: function (firstName, lastName, speciality, email, searchText) {
        Services.showLoader();
        Services.getAllCKCustomer(firstName, lastName, speciality, email, searchText, function (data) {
            share.createList(data);
            Services.hideLoader();
        }, function () {
            share.createList([]);
            Services.hideLoader();
        });
    },
    createList: function (customers) {
        var html = '';
        if (customers && customers.length > 0) {
            for (var i = 0; i < customers.length; i++) {
                html += '<li><div class="inn-spl">';
                /** loop the already presented customers with this and check the input **/
                html += '<input id="spec_' + customers[i].Customer_Id + '" type="checkbox" name="specialities" value="' +
                    customers[i].Customer_Id + '" data-spid="' + customers[i].Customer_Id + '"/>';
                html += '<label for="spec_' + customers[i].Customer_Id + '"><span class="name">' + customers[i].Customer_FName
                    + ' ' + customers[i].Customer_LName + '</span>';
                html += '<span>' + customers[i].Preference_Value + '</span><span>' + customers[i].Customer_Email + '</span><span>' + customers[i].Customer_Phone + '</span></label>';
                html += '</div></li>';
            }

        } else {
            html += '<li>No customers found</li>';
        }
        $('.speciality-list').html(html);
        if (!share.multiAssetMode)
            share.getAssetsMappedCustomersbyAssetId(share.assetCodes[0]);
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
            for (var i = 0; i <= share.assetCodes.length - 1; i++) {
                postData += share.assetCodes[i] + "^" + specialities;
                if (i < share.assetCodes.length - 1) {
                    postData += "|";
                }
            }
            
            var custerShare= new Array();
            custerShare.push(postData);
            
            var retainAsset = true;
            if (share.multiAssetMode) {
                retainAsset = $("#retain-asset:checked").length > 0 ? true : false;
            }
            var selectionMode = share.isUnassign == 'Y' ? "UNASSIGNED" : "ASSIGNED";
            Services.insertAssetCustomerMapping(custerShare, retainAsset, share.assetCodes.length, selectionMode, share.onCompleteSave, share.onFail);
        }
    },
    onCompleteSave: function(data) {
        if (data) {
            alert("Asset mappings done successfully.");
            if(share.isUnassign == 'Y') {
                window.location.href = "UnAssignedAssets.Mobile.html";
            } else {
                window.location.href = "AssignedAssets.Mobile.html";
            }
        } else {
            alert("Unable to share asset, please try again.");
        }
    },
    onFail: function (e) {
        alert("Unable to save asset, please check your internet and try again.");
    },
    showFilter: function () {
        var splOpts = new Array();
        Services.showLoader();
        share.getCustomerSpecalities(function (data) {
            Services.hideLoader();
            if (data && data.length > 0) {
                var d = {};
                d.value = 0;
                d.displayValue = "Select speciality (Optional)";
                splOpts.push(d);
                for (var i = 0; i <= data.length - 1; i++) {
                    var d = {};
                    d.value = data[i].Preference_Value_Id;
                    d.displayValue = data[i].Preference_Value;
                    splOpts.push(d);
                }
            }

            //$('body').css({ 'height': $(window).height, 'overflow': 'hidden' });
            this.bfilterResult = true;

            var assetProperties = [
                { type: 'text', displayName: 'First Name', name: 'firstname', id: 'form-first-name' },
                { type: 'text', displayName: 'Last Name', name: 'lastname', id: 'form-last-name' },
                { type: 'select', displayName: 'Speciality', name: 'speciality', id: 'form-speciality', options: splOpts },
                { type: 'text', displayName: 'Email ID', name: 'email', id: 'form-email' }
            ];

            var filterHdrOptions = [
                { className: 'fa-remove' },
                { className: 'fa-check' }
            ];

            share.formProp = new fileForm({
                assetProperties: assetProperties,
                userId: this.userId,
                assets: null,
                onCompleteRender: null,
                title: "Filter",
                headerOpts: filterHdrOptions,
                hdrElActions: function (index) {
                    if (index == 1) {
                        share.searchCustomerByFilter($("#" + assetProperties[0].id).val()
                            , $("#" + assetProperties[1].id).val(), $("#" + assetProperties[2].id).val()
                            , $("#" + assetProperties[3].id).val());
                        this.onBackClick();
                    } else if (index == 0) {
                        this.onBackClick();
                    }
                },
                onBackClick: function () {
                    share.formProp.hide();
                }
            });
            share.formProp.show();

            var hdrOptions = [
                { className: 'fa-remove' },
                { className: 'fa-check' }
            ];

            share.hdrEl = new header();
            share.hdrEl.hdrElActions = function (index) {
                filterEl.hide();
                $('body').removeAttr('style');
                if (index == 1) {
                    share.filterSelection = filterEl.selectedAssets;
                    share.getUnassignedList(false);
                }
            };
            share.hdrEl.onBackClick = function () {
                filterEl.hide();
                $('body').removeAttr('style');
            };
            share.hdrEl.createHeaderWithIcons(hdrOptions, 'File Properties');
            $('.wrapper-filter header').replaceWith(share.hdrEl.el);
        });
    },
    getCustomerSpecalities: function (success) {
        Services.getCustomerSpeciality(function (data) {
            if (success) success(data);
        }, function () {
            if (success) success([]);
        });
    },
    getAssetsMappedCustomersbyAssetId: function(assetId) {
        Services.getAssetsMappedCustomersbyAssetId(assetId, share.updateCustomerSelection, function () { });
    },
    updateCustomerSelection: function(data) {
        if (data && data.length > 0) {
            for (var i = 0; i <= data.length - 1; i++) {
                $("#spec_" + data[i].Customer_Id).prop("checked", true);
            }
        }
    },
    searchCustomerByFilter: function (firstName, lastName, speciality, email) {
        if (firstName != null && firstName.trim() == '')
            firstName = null;
        if (lastName != null && lastName.trim() == '')
            lastName = null;
        if (speciality != null && (speciality.trim() == '' || speciality < 0))
            speciality = 0;
        if (email != null && email.trim() == '')
            email = null;
        share.filterOptions = {};
        share.filterOptions.firstName = firstName;
        share.filterOptions.lastName = lastName;
        share.filterOptions.speciality = speciality;
        share.filterOptions.email = email;
        $('.list-cont').addClass('show-result');
        share.getCustomers(firstName, lastName, speciality, email, null);
    }
};