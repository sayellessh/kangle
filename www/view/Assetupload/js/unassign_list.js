var unassign = {
    pageRecords: 30,
    pageNumbers: 1,
    listEl: null,
    listScrollStop: false,
    listFilterResults : null,
    listSelectedElements: new Array(),
    filterSelection: { category: new Array(), types: new Array(), users: new Array(), tags: new Array() },
    showCustomerShare: true,
    hdrEl: null,
    userId: 1,
    userCode: '', // new change
    bfilterResult: false,
    formProp: null,
    //init: function (userId) {
    init: function (userId,companyCode,userCode) {
        this.userId = userId;
        this.userCode = userCode; // new change
        this.getUnassignedList(false);
        $(window).scroll(function () {
            var scrollHeight = $(document).height();
            var scrollPosition = $(window).height() + $(window).scrollTop();
            if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                if (unassign.listScrollStop == false) {
                    unassign.pageNumbers += 1;
                    unassign.getUnassignedList(true);
                } else {
                    unassign.pageNumbers -= 1;
                }
            }
        });

        /** Page Header **/
        var hdrOptions = [
            //{ className: 'fa-search' },
            { className: 'fa-filter' },
            { className: 'fa-ellipsis-v'}
        ];

        unassign.hdrEl = new header();
        unassign.hdrEl.hdrElActions = function (index) {
            if (index == 0) {
                unassign.showFilter();
            } else if (index == 1) {
                if (unassign.listSelectedElements.length > 0) {
                    function onElementSelect(objId) {
                        var elementSelected = new Array(), daCodes = '', ids = '';
                        for (var i = 0; i < unassign.listSelectedElements.length; i++) {
                            elementSelected.push(unassign.listSelectedElements[i].data('listobj'));
                            daCodes += unassign.listSelectedElements[i].data('listobj').stagingId;
                            ids += unassign.listSelectedElements[i].data('listobj').stagingId;
                            if (i < unassign.listSelectedElements.length - 1) {
                                daCodes += '~';
                                ids += ',';
                            }
                        }
                        if (objId == 'quick-assign') {
                            window.location.href = 'AssetQuickAssign.Mobile.html?'+ daCodes + '_Y';
                        }
                        if (objId == 'customer-assign') {
                            window.location.href = 'CustomerShareHome.Mobile.html?' + daCodes + '_Y';
                        }
                        if (objId == 'assg-prop') {
                            var assetProperties = [
                                { type: 'select', displayName: 'Category', name: 'category', id: 'form-category', options: new Array() },
                                { type: 'desc', displayName: 'Description', name: 'description', id: 'form-desc', value: elementSelected.DA_Description},
                                { type: 'tags', displayName: 'Tags', name: 'tags', id: 'form-tags', options: new Array() },
                                { type: 'check', displayName: '', name: 'downloadable', id: 'form-down', text: 'Allow People to download this asset', checked: (elementSelected.Is_Downloadable == 'N' ? false : true) },
                                //{ type: 'check', displayName: '', name: 'shareable', id: 'form-share', checked: true, text: 'Allow People to share this file with customers' }
                            ];
                            unassign.updateAssetPropertiesSingle(elementSelected, assetProperties, unassign.onCompleteMultipleFormRender);
                        }
                        if (objId == 'assg-user') {
                            window.location.href = 'AssetUserAssignment.Mobile.html?' + daCodes + '_Y';
                        }
                        if (objId == 'assg-retire') {
                            unassign.deleteAssets(ids);
                        }
                    }
                    var sett = new Settings(null, { assigned: false, oneElementClick: onElementSelect });
                    sett.show();
                } else {
                    alert('Please select assets to enable this option');
                }
            }
        };
        unassign.hdrEl.onBackClick = function () {
            window.location.href = 'UserUpload.Mobile.html';
        };
        unassign.hdrEl.createHeaderWithIcons(hdrOptions, 'Not yet shared assets');
        $('.wrapper header').replaceWith(unassign.hdrEl.el);
    },
    getUnassignedList: function (bScroll) {
        var categoryList = this.filterSelection.category.length > 0 ? this.filterSelection.category.join(',') : null,
            typeList = this.filterSelection.types.length > 0 ? this.filterSelection.types.join(',') : null,
            tagList = this.filterSelection.tags.length > 0 ? this.filterSelection.tags.join(',') : null,
            userList = this.filterSelection.users.length > 0 ? this.filterSelection.users.join(',') : null;
        Services.showLoader();
        Services.getUnAssignedAssetsWithPaging(this.userId, unassign.pageNumbers, unassign.pageRecords, categoryList, typeList, tagList, userList, null, function (data) {
            unassign.bindUnAssignedList(data, bScroll);
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    },
    bindUnAssignedList: function (data, bScroll) {
        if (data && data.length > 0) {
            if (unassign.listEl == null || this.bfilterResult == true) {
                unassign.unList = new List('.list-items');
            }
            if (!bScroll && this.bfilterResult == true) {
                unassign.unList.clear();
            }
            for (var i = 0; i < data.length > 0; i++) {
                unassign.unList.createAssignedList({
                    thumbnailUrl: data[i].DA_Thumbnail_URL, fileName: data[i].DA_Name, tags: data[i].Tags.split('~'),
                    uploadedBy: data[i].Uploaded_By_Name, uploadedOn: data[i].Last_Modified_DateTime,
                    isDownloadable: data[i].Is_Downloadable, stagingId: data[i].Staging_Id, categoryCode: data[i].DA_Category_Code, description: data[i].DA_Description
                });
            }
            unassign.unList.onElementSelect = function (el, obj, selElements, evt) {
                unassign.listSelectedElements = selElements;
                if (selElements.length > 0 || unassign.listFilterResults != null) {
                    $('.list-cont').addClass('show-result');
                    unassign.hdrEl.changeHeaderTitle(selElements.length + ' Selected');
                }
                if (selElements.length == 0)
                    unassign.hdrEl.changePreviousHeaderTitle();

                if (selElements.length == 0 && unassign.listFilterResults == null) {
                    $('.list-cont').removeClass('show-result');
                }
            };
            unassign.unList.onActionElClick = function (obj, elm, evt) {
                var options = new Array();
                options = [
                    { id: 'quick-assign', display_name: 'Quick Share', icon: 'fa-share-alt', bShow: true },
                    { id: 'seperator' },
                    //{ id: 'customer-share', display_name: 'Share with Customers', icon: 'fa-users', bShow: unassign.showCustomerShare },
                    //{ id: 'seperator' },
                    { id: 'assign-user', display_name: 'Share with all users', icon: 'fa-user', bShow: true },
                    { id: 'assign-single', display_name: 'Share with specific user', icon: 'fa-user', bShow: true },
                    { id: 'seperator' },
                    { id: 'change-thumb', display_name: 'Change thumbnail', icon: 'fa-image', bShow: true },
                    { id: 'asset-detl', display_name: 'Asset properties', icon: 'fa-list', bShow: true },
                    { id: 'seperator' },
                    //{ id: 'asset-play', display_name: 'Preview', icon: 'fa-play-circle-o', bShow: true },
                    { id: 'asset-delete', display_name: 'Delete', icon: 'fa-trash', bShow: true }
                ];
                var popup = new ActionPopup(elm, evt, options);
                popup.onSelectAction = function (id) {
                    if (id == 'change-thumb') {
                        window.location.href = 'ChangeThumbnail.Mobile.html?' + obj.stagingId + '_Y';
                    } else if (id == 'quick-assign') {
                        window.location.href = 'AssetQuickAssign.Mobile.html?' + obj.stagingId + '_Y';
                    } else if (id == 'customer-share') {
                        window.location.href = 'CustomerShareHome.Mobile.html?' + obj.stagingId + '_Y';
                    } else if (id == 'asset-detl') {
                        if (unassign.unList.selectedElements.length > 1) {
                            unassign.updateAssetPropertiesMultiple(unassign.unList.selectedElements);
                        } else {
                            console.log(obj);
                            var assetProperties = [
                                { type: 'text', displayName: 'File Name', name: 'filename', id: 'form-file-name', value: obj.DA_Name },
                                { type: 'select', displayName: 'Category', name: 'category', id: 'form-category', options: new Array(), value: obj.DA_Category_Code },
                                { type: 'desc', displayName: 'Description', name: 'description', id: 'form-desc', value: obj.DA_Description },
                                { type: 'tags', displayName: 'Tags', name: 'tags', id: 'form-tags', options: new Array() },
                                //{ type: 'date', displayName: 'Expiry Date', name: 'expiredaet', id: 'form-date', },
                                { type: 'check', displayName: '', name: 'downloadable', id: 'form-down', text: 'Allow People to download this asset', checked: (obj.isDownloadable == 'N' ? false : true) }
                                //{ type: 'check', displayName: '', name: 'shareable', id: 'form-share', checked: true, text: 'Allow People to share this file with customers' }
                            ];
                            unassign.updateAssetPropertiesSingle(obj, assetProperties, unassign.onCompleteFormRender);
                        }
                    } else if (id == 'assign-single') {
                        window.location.href = 'AssetUserAssignment.Mobile.html?' + obj.stagingId + '_Y';
                    } else if (id == 'assign-user') {
                        var targetStagingIds = '';
                        if (unassign.listSelectedElements && unassign.listSelectedElements.length > 0) {
                            for (var i = 0; i < unassign.listSelectedElements.length; i++) {
                                targetStagingIds += unassign.listSelectedElements[i].data('listobj').stagingId;
                                console.log(targetStagingIds);
                                if (i < unassign.listSelectedElements.length - 1) {
                                    targetStagingIds += ',';
                                }
                            }
                        } else {
                            targetStagingIds = obj.stagingId;
                        }
                        Services.showLoader();
                        var assetslist = {};
                        //Services.assignAssetToAllUsers(unassign.userId ,targetStagingIds, 'UNASSIGN', unassign.userCode, function (data) { // new change
                        Services.assignAssetToAllUsers(unassign.userId, assetslist ,targetStagingIds, 1, 'UNASSIGN', unassign.userCode, function (data) { // new change
                            console.log(data);
                            Services.hideLoader();
                            window.location.reload();
                        }, function () {
                            Services.hideLoader();
                        });
                    } else if (id == 'asset-delete') {
                        unassign.deleteAssets(obj.stagingId);
                    }
                    popup.remove();
                };
                popup.show();
            };
            unassign.unList.onElementClick = function (obj, element, index) {
                if ($('.popup-actn').length > 0) {
                    $('.popup-actn').remove();
                    return false;
                }
                window.location.href = 'AssetDetail.Mobile.html?' + obj.stagingId + '_Y';
            };
            unassign.unList.refresh();

            $('.result-select').unbind('click').bind('click', function () {
                if (unassign.listSelectedElements.length == 0) {
                    alert('Please choose atleast one asset');
                }
                if ($(this).hasClass('select-all')) {
                    $(this).text('Show All Assets');
                    $('li', unassign.unList.el).hide();
                    $('li.list-select', unassign.unList.el).show();
                    $(this).removeClass('select-all')
                } else {
                    $(this).text('Show only selected assets');
                    $('li', unassign.unList.el).show();
                }
            });
        } else {
            unassign.listScrollStop = true; $('.no-asset').remove();
            $('.content.list-cont').append('<p class="no-asset">No More Assets found</p>');
        }
    },
    deleteAssets: function (stagingId) {
        Services.showLoader();
        Services.deleteUnassignedAssets(unassign.userId, stagingId, function (data) {
            if (data && data.Transaction_Status == true) {
                alert('Asset deleted Successfully');
                window.location.href = 'UnAssignedAssets.Mobile.html';
            }
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    },
    showFilter: function () {
        $('body').css({'height': $(window).height, 'overflow': 'hidden'});
        this.bfilterResult = true;

        var filterEl = new Filter({ selectedAssets: unassign.filterSelection, isUnassign: true, userId: unassign.userId });
        filterEl.show();
        
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        unassign.hdrEl = new header();
        unassign.hdrEl.hdrElActions = function (index) {
            filterEl.hide();
            $('body').removeAttr('style');
            if (index == 1) {
                unassign.filterSelection = filterEl.selectedAssets;
                unassign.getUnassignedList(false);
            }
        };
        unassign.hdrEl.onBackClick = function () {
            filterEl.hide();
            $('body').removeAttr('style');
        };
        unassign.hdrEl.createHeaderWithIcons(hdrOptions, 'File Properties');
        $('.wrapper-filter header').replaceWith(unassign.hdrEl.el);
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
                unassign.formProp = new fileForm({ assetProperties: assetProperties, userId: this.userId, assets: asset, onCompleteRender: onCompleteRender });
                unassign.formProp.show();
            });
        }, function () {
            Services.hideLoader();
        });
    },
    onCompleteFormRender: function(asset) {
        var assetName = asset.fileName.substr(0, asset.fileName.lastIndexOf('.')),
        ext = asset.fileName.substr(asset.fileName.lastIndexOf('.'), asset.fileName.length - 1);

        $('#form-file-name').val(assetName);
        $('.file-ext').text(ext);
        $('#form-category').val(asset.categoryCode);
        $('#form-desc').val(asset.description);
        for (var i = 0; i < asset.tags.length; i++) {
            console.log('option[value="' + asset.tags[i] + '"]');
            $('option[value="' + asset.tags[i] + '"]').attr('selected', 'selected');
        }
        unassign.setPropertiesHeader(true, asset);        
        $('#form-tags').select2({
            tags: true
        });
    },
    onCompleteMultipleFormRender: function(assets) {
        unassign.setPropertiesHeaderMultiple(assets);
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

        unassign.hdrEl = new header();
        unassign.hdrEl.hdrElActions = function (index) {
            if (index == 1) {
                unassign.insertFormdetails(asset.stagingId, false);
            } else {
                $('body').attr('style', '');
                unassign.formProp.hide();
                $('.wrapper').show();
            }
        };
        unassign.hdrEl.onBackClick = function () {
            $('body').attr('style', '');
            unassign.formProp.hide();
            $('.wrapper').show();
        };
        unassign.hdrEl.createHeaderWithIcons(hdrOptions, 'Unassigned Assets');
        $('.file-wrapper header').replaceWith(unassign.hdrEl.el);
    },
    setPropertiesHeaderMultiple: function (assets) {
        /** Page Header **/
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        unassign.hdrEl = new header();
        unassign.hdrEl.hdrElActions = function (index) {
            if (index == 1) {
                var stagingIds = '';
                for (var i = 0; i < assets.length; i++) {
                    stagingIds += assets[i].stagingId;
                    if (i < (assets.length - 1))
                        stagingIds += ',';
                }
                unassign.insertFormdetails(stagingIds, true);
            }
            $('body').attr('style', '');
            unassign.formProp.hide();
            $('.wrapper').show();
        };
        unassign.hdrEl.onBackClick = function () {
            window.location.href = 'UserUpload.Mobile.html';
        };
        unassign.hdrEl.createHeaderWithIcons(hdrOptions, 'Unassigned Assets');
        $('.file-wrapper header').replaceWith(unassign.hdrEl.el);
    },
    insertFormdetails: function (stagingId, multiple) {
        var inpText = $('#form-file-name').val() + $('.file-ext').text(), categoryName = $('#form-category option:selected').text(),
                    category = $('#form-category').val(), desc = $('#form-desc').val(), tags = $('#form-tags').val().join('~'),
                    isDownloadable = $('#form-down').get(0).checked ? 'Y' : 'N',
                    isShareable = null;//$('#form-share').get(0).checked ? 'Y' : 'N'; //new change

        if (inpText == '' || category == '' || desc == '' || tags == '') {
            alert("Please enter all fields");
            return false;
        }
        Services.showLoader();
        Services.updateUnassignedAssets(unassign.userId, stagingId, false, (multiple == true ? null : inpText), categoryName, category, desc, tags, null,
            isDownloadable, isShareable, function (data) {
                $('body').attr('style', '');
                unassign.formProp.hide();
                $('.wrapper').show();
                window.location.reload();
                Services.hideLoader();
            }, function () {
                Services.hideLoader();
            });
    }
};