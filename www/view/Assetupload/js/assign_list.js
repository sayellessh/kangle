var assgin = {
    pageRecords: 30,
    pageNumbers: 1,
    listEl: null,
    listScrollStop: false,
    listFilterResults: null,
    listSelectedElements: new Array(),
    filterSelection: { category: new Array(), types: new Array(), users: new Array(), tags: new Array() },
    showCustomerShare: true,
    hdrEl: null,
    userId: 1,
    bfilterResult: false,
    init: function (userId) {
        this.userId = userId;
        this.getAssignedList(false);
        $(window).scroll(function () {
            if ($('.file-wrapper').is(':visible'))
                return false;
            var scrollHeight = $(document).height();
            var scrollPosition = $(window).height() + $(window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                if (assgin.listScrollStop == false) {
                    assgin.pageNumbers += 1;
                    assgin.getAssignedList(true);
                } else {
                    assgin.pageNumbers -= 1;
                }
            }
        });

        /** Page Header **/
        var hdrOptions = [
            //{ className: 'fa-search' },
            { className: 'fa-filter' },
            { className: 'fa-ellipsis-v' }
        ];

        assgin.hdrEl = new header();
        assgin.hdrEl.hdrElActions = function (index) {
            if (index == 0) {
                assgin.showFilter();
            } else if (index == 1) {
                if (assgin.listSelectedElements.length > 0) {
                    function onElementSelect(objId) {
                        var elementSelected = new Array(), daCodes = '', ids = '';
                        for (var i = 0; i < assgin.listSelectedElements.length; i++) {
                            elementSelected.push(assgin.listSelectedElements[i].data('listobj'));
                            daCodes += assgin.listSelectedElements[i].data('listobj').daCode;
                            ids += assgin.listSelectedElements[i].data('listobj').daCode;
                            if (i < assgin.listSelectedElements.length - 1) {
                                daCodes += '~';
                                ids += ',';
                            }
                        }
                        if (objId == 'quick-assign') {
                            window.location.href = 'AssetQuickAssign.Mobile.html?'+ daCodes + '_N';
                        }
                        if (objId == 'customer-assign') {
                            window.location.href = 'CustomerShareHome.Mobile.html?' + daCodes + '_N';
                        }
                        if (objId == 'assg-prop') {
                            var assetProperties = [
                                { type: 'select', displayName: 'Category', name: 'category', id: 'form-category', options: new Array(), value: elementSelected.DA_Category_Code },
                                { type: 'desc', displayName: 'Description', name: 'description', id: 'form-desc', value: elementSelected.DA_Description },
                                { type: 'tags', displayName: 'Tags', name: 'tags', id: 'form-tags', options: new Array() },
                                { type: 'date', displayName: 'Expiry Date', name: 'expiredaet', id: 'form-date', value: elementSelected.ToDate },
                                { type: 'check', displayName: '', name: 'downloadable', id: 'form-down', text: 'Allow People to download this asset', checked: (elementSelected.Is_Downloadable == 'N' ? false : true) },
                                { type: 'check', displayName: '', name: 'shareable', id: 'form-share', checked: true, text: 'Allow People to share this file with customers' }
                            ];

                            var elementSelected = new Array();
                            for (var i = 0; i < assgin.listSelectedElements.length; i++) {
                                elementSelected.push(assgin.listSelectedElements[i].data('listobj'));
                            }
                            console.log(elementSelected);
                            assgin.updateAssetPropertiesSingle(elementSelected, assetProperties, assgin.onCompleteMultipleFormRender);
                        }
                        if (objId == 'asset-retire') {
                            var idArray = new Array();
                            for (var i = 0; i < assgin.listSelectedElements.length; i++) {
                                idArray.push(assgin.listSelectedElements[i].data('listobj').daCode);
                            }
                            assgin.retireAssets(idArray.join(','));
                        }
                    }
                    var sett = new Settings(null, { assigned: true, oneElementClick: onElementSelect });
                    sett.show();
                } else {
                    alert('Please select assets to enable this option');
                }
            }
        };
        assgin.hdrEl.onBackClick = function () {
            window.location.href = 'UserUpload.Mobile.html';
        };
        assgin.hdrEl.createHeaderWithIcons(hdrOptions, 'Shared Assets');
        $('.wrapper header').replaceWith(assgin.hdrEl.el);
    },
    getAssignedList: function (bScroll) {
        var categoryList = this.filterSelection.category.length > 0 ? this.filterSelection.category.join(',') : null,
            typeList = this.filterSelection.types.length > 0 ? this.filterSelection.types.join(',') : null,
            tagList = this.filterSelection.tags.length > 0 ? this.filterSelection.tags.join(',') : null,
            userList = this.filterSelection.users.length > 0 ? this.filterSelection.users.join(',') : null;

        Services.showLoader();
        Services.getAssignedAssetsWithPaging(this.userId, assgin.pageNumbers, assgin.pageRecords, categoryList, typeList, tagList, userList, null, function (data) {
            assgin.bindAssignedList(data, bScroll);
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    },
    bindAssignedList: function (data, bScroll) {
        if (data && data.length > 0) {
            if (assgin.listEl == null || this.bfilterResult == true) {
                assgin.unList = new List('.list-items');
            }
            if (!bScroll && this.bfilterResult == true) {
                assgin.unList.clear();
            }
            for (var i = 0; i < data.length > 0; i++) {
                assgin.unList.createUnAssignedList({
                    thumbnailUrl: data[i].DA_Thumbnail_URL, fileName: data[i].DA_Name, tags: data[i].Tag_Name.split('~'),
                    uploadedBy: data[i].Uploaded_By_Name, uploadedOn: data[i].Last_Modified_Date, categoryCode: data[i].DA_Category_Code,
                    fileSize: data[i].DA_Size_In_MB, fileRating: data[i].Star_Count, fileViews: data[i].Views_Count,
                    fileLikes: data[i].Likes_Count, daCode: data[i].DA_Code, isDownloadable: data[i].Is_Downloadable,
                    description: data[i].DA_Description,isShareable: data[i].Is_Customer_Sharable, expiryDate: data[i].ToDate
                });
            }
            assgin.unList.onElementSelect = function (el, obj, selElements, evt) {
                assgin.listSelectedElements = selElements;
                if (selElements.length > 0 || assgin.listFilterResults != null) {
                    $('.list-cont').addClass('show-result');
                    assgin.hdrEl.changeHeaderTitle(selElements.length + ' Selected');
                }
                if (selElements.length == 0)
                    assgin.hdrEl.changePreviousHeaderTitle();

                if (selElements.length == 0 && assgin.listFilterResults == null) {
                    $('.list-cont').removeClass('show-result');
                }
            };
            assgin.unList.onActionElClick = function (obj, elm, evt) {
                var options =
                    [
                        { id: 'quick-assign', display_name: 'Quick Share', icon: 'fa-share-alt', bShow: true },
						{ id: 'seperator' },
                        //{ id: 'customer-share', display_name: 'Share with Customers', icon: 'fa-users', bShow: assgin.showCustomerShare },
                        //{ id: 'seperator' },
                        { id: 'assign-user', display_name: 'Share with specific user', icon: 'fa-user', bShow: true },
                        //{ id: 'assign-list', display_name: 'Show Shared Users', icon: 'fa-user', bShow: true },
						{ id: 'seperator' },
						{ id: 'change-thumb', display_name: 'Change thumbnail', icon: 'fa-image', bShow: true },
						{ id: 'asset-detl', display_name: 'Asset properties', icon: 'fa-list', bShow: true },
						{ id: 'seperator' },
						//{ id: 'asset-play', display_name: 'Preview', icon: 'fa-play-circle-o', bShow: true },
						{ id: 'asset-retire', display_name: 'Retire', icon: 'fa-remove', bShow: true }
                    ];
                var popup = new ActionPopup(elm, evt, options);
                popup.onSelectAction = function (id) {
                    if (id == 'change-thumb') {
                        window.location.href = 'ChangeThumbnail.Mobile.html?' + obj.daCode + '_N';
                    } else if (id == 'customer-share') {
                        window.location.href = 'CustomerShareHome.Mobile.html?' + obj.daCode + '_N';
                    } else if (id == 'quick-assign') {
                        window.location.href = 'AssetQuickAssign.Mobile.html?' + obj.daCode + '_N';
                    } else if (id == 'asset-detl') {
                        if (assgin.unList.selectedElements.length > 1) {
                            assgin.updateAssetPropertiesMultiple(assgin.unList.selectedElements);
                        } else {
                            var assetProperties = [
                                { type: 'text', displayName: 'File Name', name: 'filename', id: 'form-file-name', value: obj.DA_Name },
                                { type: 'select', displayName: 'Category', name: 'category', id: 'form-category', options: new Array(), value: obj.DA_Category_Code },
                                { type: 'desc', displayName: 'Description', name: 'description', id: 'form-desc', value: obj.DA_Description },
                                { type: 'tags', displayName: 'Tags', name: 'tags', id: 'form-tags', options: new Array() },
                                { type: 'date', displayName: 'Expiry Date', name: 'expiredaet', id: 'form-date', value: obj.ToDate},
                                { type: 'check', displayName: '', name: 'downloadable', id: 'form-down', text: 'Allow People to download this asset', checked: (obj.isDownloadable == 'N' ? false : true) },
                                { type: 'check', displayName: '', name: 'shareable', id: 'form-share', checked: true, text: 'Allow People to share this file with customers', hidden: true }
                            ];
                            assgin.updateAssetPropertiesSingle(obj, assetProperties, assgin.onCompleteFormRender);
                        }
                    } else if (id == 'assign-user') {
                        window.location.href = 'AssetUserAssignment.Mobile.html?' + obj.daCode + '_N';
                    } else if (id == 'asset-retire') {
                        assgin.retireAssets(obj.daCode);
                    }
                    popup.remove();
                };
                popup.show();
            };
            assgin.unList.onElementClick = function (obj, element, index) {
                if ($('.popup-actn').length > 0) {
                    $('.popup-actn').remove();
                    return false;
                }
                window.location.href = 'AssetDetail.Mobile.html?' + obj.daCode + '_N';
            };
            assgin.unList.refresh();

            $('.result-select').unbind('click').bind('click', function () {
                if (assgin.listSelectedElements.length == 0) {
                    alert('Please choose atleast one asset');
                }
                if ($(this).hasClass('select-all')) {
                    $(this).text('Show All Assets');
                    $('li', assgin.unList.el).hide();
                    $('li.list-select', assgin.unList.el).show();
                    $(this).removeClass('select-all')
                } else {
                    $(this).text('Show only selected assets');
                    $('li', assgin.unList.el).show();
                }
            });
        } else {
            assgin.listScrollStop = true;
            $('.no-asset').remove();
            $('.content.list-cont').append('<p class="no-asset">No More Assets found</p>');
        }
    },
    retireAssets: function(ids) {
        Services.showLoader();
        Services.retireAssignedAsset(assgin.userId, ids, function (data) {
            if (data && data.Transaction_Status) {
                alert('Assigned assets retired successfully');
                window.location.href = 'AssignedAssets.Mobile.html';
            }
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    },
    showFilter: function () {
        $('body').css({ 'height': $(window).height, 'overflow': 'hidden' });
        this.bfilterResult = true;

        var filterEl = new Filter({ selectedAssets: assgin.filterSelection, isUnassign: false, userId: assgin.userId });
        filterEl.show();

        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        assgin.hdrEl = new header();
        assgin.hdrEl.hdrElActions = function (index) {
            filterEl.hide();
            $('body').removeAttr('style');
            if (index == 1) {
                assgin.filterSelection = filterEl.selectedAssets;
                assgin.getAssignedList(false);
            }
        };
        assgin.hdrEl.onBackClick = function () {
            filterEl.hide();
            $('body').removeAttr('style');
        };
        assgin.hdrEl.createHeaderWithIcons(hdrOptions, 'File Properties');
        $('.wrapper-filter header').replaceWith(assgin.hdrEl.el);
    },
    updateAssetPropertiesSingle: function (asset, assetProperties, onCompleteRender) {
        Services.showLoader();
        Services.getAssetCategories(function (data) {
            var categOptions = new Array();
            var options = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    categOptions.push({ value: data[i].DA_Category_Code, displayValue: data[i].DA_Category_Name });
                }
            }

            Services.getAssetTags(function (tags) {
                var tagOptions = new Array();
                if (tags && tags.length > 0) {
                    for (var i = 0; i < tags.length; i++) {
                        tagOptions.push({ value: tags[i].Real_Tag_Name, displayValue: tags[i].Real_Tag_Name });
                    }
                }

                for (var i = 0; i < assetProperties.length; i++) {
                    if (assetProperties[i].id == 'form-category') {
                        assetProperties[i].options = categOptions;
                    }
                    if (assetProperties[i].id == 'form-tags') {
                        assetProperties[i].options = tagOptions;
                    }
                }

                Services.hideLoader();
                assgin.formProp = new fileForm({ assetProperties: assetProperties, userId: this.userId, assets: asset, onCompleteRender: onCompleteRender });
                assgin.formProp.show();
            }, function () {
                Services.hideLoader();
            });
        }, function () {
            Services.hideLoader();
        });
    },
    onCompleteFormRender: function (asset) {
        console.log(asset);
        var assetName = asset.fileName.substr(0, asset.fileName.lastIndexOf('.')),
        ext = asset.fileName.substr(asset.fileName.lastIndexOf('.'), asset.fileName.length - 1);

        $('#form-file-name').val(assetName);
        $('.file-ext').text(ext);
        $('#form-category').val(asset.categoryCode);
        $('#form-desc').val(asset.description);
        var date = asset.expiryDate.split('-');
        $('#form-date').val(date[2] + '-' + date[1] + '-' + date[0]);
        //$('#form-date').val(date[0] + '-' + date[1] + '-' + date[2]);
        for (var i = 0; i < asset.tags.length; i++) {
            console.log('option[value="' + asset.tags[i] + '"]');
            $('option[value="' + asset.tags[i] + '"]').attr('selected', 'selected');
        }
        assgin.setPropertiesHeader(true, asset);
        $('#form-tags').select2({
            tags: true
        });
    },
    onCompleteMultipleFormRender: function (assets) {
        assgin.setPropertiesHeaderMultiple(assets);
        $('#form-tags').select2({
            tags: true
        });
    },
    setPropertiesHeader: function (bSingle, asset) {
        /** Page Header **/
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        assgin.hdrEl = new header();
        assgin.hdrEl.hdrElActions = function (index) {
            if (index == 1) {
                assgin.insertFormdetails(asset.daCode, false);
            } else {
                $('body').attr('style', '');
                assgin.formProp.hide();
                $('.wrapper').show();
            }
        };
        assgin.hdrEl.onBackClick = function () {
            $('body').attr('style', '');
            assgin.formProp.hide();
            $('.wrapper').show();
        };
        assgin.hdrEl.createHeaderWithIcons(hdrOptions, 'Assigned Assets');
        $('.file-wrapper header').replaceWith(assgin.hdrEl.el);
    },
    setPropertiesHeaderMultiple: function (assets) {
        /** Page Header **/
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        assgin.hdrEl = new header();
        assgin.hdrEl.hdrElActions = function (index) {
            if (index == 1) {
                var stagingIds = '';
                for (var i = 0; i < assets.length; i++) {
                    stagingIds += assets[i].daCode;
                    if (i < (assets.length - 1))
                        stagingIds += ',';
                }
                assgin.insertFormdetails(stagingIds, true);
            }
            $('body').attr('style', '');
            assgin.formProp.hide();
            $('.wrapper').show();
        };
        assgin.hdrEl.onBackClick = function () {
            window.location.href = 'UserUpload.Mobile.html';
        };
        assgin.hdrEl.createHeaderWithIcons(hdrOptions, 'Assigned Assets');
        $('.file-wrapper header').replaceWith(assgin.hdrEl.el);
    },
    insertFormdetails: function (stagingId, multiple) {
        var inpText = $('#form-file-name').val() + $('.file-ext').text(), categoryName = $('#form-category option:selected').text(),
                    category = $('#form-category').val(), desc = $('#form-desc').val(), tags = $('#form-tags').val().join('~'),
                    isDownloadable = $('#form-down').get(0).checked ? 'Y' : 'N',
                    isShareable = $('#form-share').get(0).checked ? 'Y' : 'N';

        if (inpText == '' || category == '' || desc == '' || tags == '') {
            alert("Please enter all fields");
            return false;
        }
        Services.showLoader();
        Services.updateAssignedAssets(assgin.userId, stagingId, false, (multiple == true ? null : inpText), categoryName, category, desc, tags, null,
            isDownloadable, isShareable, function (data) {
            $('body').attr('style', '');
            assgin.formProp.hide();
            $('.wrapper').show();
            window.location.reload();
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    }
};