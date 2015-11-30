var eLearningAPP = {};

var assetMapping = {
    courseName: "N/A",
    selectedAssets: {},
    init: function(courseId, courseName) {
        var _this = this;
        _this.courseId = courseId;
        _this.courseName = courseName;
        _this.fnGetCourseAssetMappings(function () {
            if (sectionId_g > 0) {

            }
        });
    },
    fnGetCourseAssetMappings: function (success) {
        var _this = this;
        $('#assetMappingCourseName').html("Course Name: " + _this.courseName);
        DPAjax.requestInvoke('AssetUpload', 'GetAssetsForBrowse', null, "GET", function (data) {
            _this.fnGetMetatags(data, function (data1) {
                _this.metaTagDataAssets = data1;
                if (data1 == null || data1.coreAssets == null ||
                        data1.coreAssets.length == 0 || data1.metaTags == null ||
                        data1.metaTags.length == 0 || data1.taggedAssets == null ||
                        $.isEmptyObject(data1.taggedAssets)) {
                    alert('Assets are mandatory and you dont have any assets. Kindly upload assets and try again.');
                    window.location.href = "/AssetUpload/AssetUpload?pageId=10015";
                    return;
                }
                if (data1 != null) {
                    if (data1.metaTags)
                        _this.fnBindCategories(data1.metaTags);
                    if (data1.taggedAssets)
                        _this.fnBindTags(data1.taggedAssets);
                    if (data1.coreAssets)
                        _this.fnBindAssets(data1.coreAssets);
                }
                $('#txtCategorySearch').keyup(function (e) {
                    $('#dvCategoryList').removeHighlight();
                    $('#dvCategoryList').highlight($(this).val());
                    var elem = $('#dvCategoryList .highlight').eq(0);
                    if ($('.highlight').length > 0) {
                        $('#dvCategoryList').scrollTo('.highlight');
                    }
                    console.log(elem);
                });
                $('#txtTagSearch').keyup(function (e) {
                    $('#dvTagList').removeHighlight();
                    $('#dvTagList').highlight($(this).val());
                    if ($('.highlight').length > 0) {
                        $('#dvTagList').scrollTo('.highlight');
                    }
                });
                $('#dvClearAllCategory').bind('click', function (e) {
                    $('input[name=asset_category]').prop('checked', false);
                    _this.fnFilterAssets();
                    return false;
                });
                $('#dvClearAllTag').bind('click', function (e) {
                    $('input[name=asset_tag]').prop('checked', false);
                    _this.fnFilterAssets();
                    return false;
                });
                //fnMsgAlert("Success", "dvCreateCourseInfo", 'Assets loaded successfully.');
                $('#btnCreateAssetMappings').bind('click', function (e) {
                    _this.fnInsertAssetMapping(this);
                });
                $('#btnBackCreateCourse').bind('click', function (e) {
                    window.history.back();
                });

                if (sectionId_g > 0) {
                    $('#txtSectionName').val(sectionName_g);
                    var arData = new Array();
                    var course = {};
                    course.name = 'courseId';
                    course.value = courseId_g;

                    var section = {};
                    section.name = "sectionId";
                    section.value = sectionId_g;

                    arData.push(course);
                    arData.push(section);
                    DPAjax.requestInvoke('AdCourse', 'GetCourseAssets', arData, 'GET', function (data) {
                        var assetsSelection = $('input[name=asset]');
                        for (var i = 0; i <= assetsSelection.length - 1; i++) {
                            var assetSel = assetsSelection[i];
                            var curDacode = $(assetSel).parent().data('asset').daCode;
                            if (_this.fnIsSelectedAsset(curDacode, data)) {
                                $('#' + assetSel.id).attr('checked', 'checked');
                                $('#' + assetSel.id).parents().find('#asset-thumbnail-' + curDacode).addClass('open');
                                _this.selectedAssets[curDacode] = $(assetSel).parent().data('asset');
                            }
                        }
                    });
                }
            }, function (e) { });
        }, function (e) { console.log(e); });
    },

    fnIsSelectedAsset: function (daCode, assets) {
        var _this = this;
        for (var i = 0; i <= assets.length - 1; i++) {
            if (assets[i].Asset_Id == daCode) return true;
        }
        return false;
    },

    fnInsertAssetMapping: function (elem) {
        var _this = this;
        var courseName = courseName_g;
        var txtSectionName = $('#txtSectionName');
        if (txtSectionName.val() == '' || txtSectionName.val().trim() == '') {
            fnMsgAlert("Failure", "Course", 'Please enter section name.');
            txtSectionName.focus();
            return;
        }
        if (txtSectionName.val().length > 100) {
            fnMsgAlert("Failure", "Course", 'Section name should be less than 100 characters.');
            txtSectionName.focus();
            return;
        }
        if (_this.selectedAssets == null || $.isEmptyObject(_this.selectedAssets)) {
            fnMsgAlert("Failure", "Course", 'Please select at least one asset.');
            return;
        }

        var arData = new Array();

        var arAssets = new Array();
        for (var curAst in _this.selectedAssets) {
            //arAssets.push(_this.selectedAssets[curAst].daCode);
            var data = {};
            data.Section_Name = txtSectionName.val();
            data.Section_Id = sectionId_g;
            data.Course_Id = _this.courseId;
            data.Asset_Id = _this.selectedAssets[curAst].daCode
            arAssets.push(data);
        }
        var assetJson = {};
        assetJson.name = "courseAssetJson";
        assetJson.value = arAssets;
        assetJson.type = "JSON";

        //var courseId = {};
        //courseId.name = "courseId";
        //courseId.value = $('#hdnCourseId').val();

        arData.push(assetJson);
        //arData.push(courseId);
        var btnI = $(elem).find('i');
        btnI.removeClass('fa-floppy-o');
        btnI.addClass('fa-spinner');
        btnI.addClass('fa-spin');
        DPAjax.requestInvoke('AdCourse', 'InsertCourseAssetMapping', arData, "POST", function (data) {
            if (data != null) {
                sectionId = data.split('~')[0];
                courseId = data.split('~')[1];
                window.location.href = "/AdCourse/CreateQuestion?sId=" + sectionId + "&cId=" + courseId + "&cname=" + courseName + "&sname=" + $('#txtSectionName').val();
            }
            else {
                fnMsgAlert("Failure", "Course", 'Unable to add asset mappings.');
                btnI.addClass('fa-floppy-o');
                btnI.removeClass('fa-spinner');
                btnI.removeClass('fa-spin');
            }
            //$().show();
        }, function (e) {
            fnMsgAlert("Failure", "Course", 'Unable to add asset mappings.');
            btnI.addClass('fa-floppy-o');
            btnI.removeClass('fa-spinner');
            btnI.removeClass('fa-spin');
        });
    },
    fnBindCategories: function (metaTags) {
        var _this = this;
        var categoryTag = $('#dvCategoryList');
        categoryTag.empty();
        if (metaTags != null && metaTags.length > 0) {
            for (var i = 0; i <= metaTags.length - 1; i++) {
                var nameSpl = metaTags[i].metaTag.split('~');
                var name = metaTags[i].metaTag;
                if (nameSpl != null && nameSpl.length >= 2)
                    name = nameSpl[1];

                var inputGroup = $('<div class="input-group"></div>');
                var spanGroup = $('<span class="input-group-addon listInputGroup">');
                var chGrp = $('<input type="checkbox" id="category' + i + '" name="asset_category" value="' + name + '">');
                chGrp.bind('click', function (e) {
                    _this.fnFilterAssets();
                });
                var d = $('<label for="category' + i + '">' + name + '</label>');
                spanGroup.append(chGrp);
                spanGroup.append(d);
                inputGroup.append(spanGroup);
                categoryTag.append(inputGroup);
            }
            $('.hideifempty').show();
        }
    },

    fnBindTags: function (tags) {
        var _this = this;
        var tagTag = $('#dvTagList');
        tagTag.empty();
        if (tags != null) {
            var i = 0;
            var empty = true;
            for (var tag in tags) {
                empty = false;
                var inputGroup = $('<div class="input-group"></div>');
                var spanGroup = $('<span class="input-group-addon listInputGroup">');
                var chGrp = $('<input type="checkbox" id="tag' + i + '" name="asset_tag" value="' + tag + '">');
                chGrp.bind('click', function (e) {
                    _this.fnFilterAssets();
                });
                var d = $('<label for="tag' + i + '">' + tag + '</label>');
                spanGroup.append(chGrp);
                spanGroup.append(d);
                inputGroup.append(spanGroup);
                tagTag.append(inputGroup);
                i++;
            }
            if (empty == false) {
                $('.hideifempty').show();
            } else {
                $('.hideifempty').css('display', 'none');
                tagTag.append('Not available');
            }
        }
    },

    fnBindAssets: function (assets) {
        var _this = this;
        var assetsTag = $('#dvAssetsMappings');
        assetsTag.empty();
        _this.fnBindSelectedAssets(assetsTag);
        if (assets != null && assets.length > 0) {
            var empty = true;
            for (var i = 0; i <= assets.length - 1; i++) {
                if (_this.selectedAssets[assets[i].daCode] == null) {
                    empty = false;
                    var mainTag = $('<div class="">');
                    var wrapper = $('<div class="col-sm-6 col-md-4">');
                    var thumbnailDiv = $('<div class="thumbnail course-asset" id="asset-thumbnail-' + assets[i].daCode + '">');
                    thumbnailDiv.append('<span class="ticker fa fa-check-square-o"></span>');
                    var img = $('<img src="' + assets[i].thumbnailURL + '" />');
                    var caption = $('<div class="caption">');
                    var inputGroup = $('<div class="input-group clsDvCenter">');
                    inputGroup.append('<input type="checkbox" id="asset' + i + '" name="asset" value="1" aria-label="...">');
                    inputGroup.data('asset', assets[i]);
                    inputGroup.bind('change', function (e) {
                        var asset = $(this).data('asset');
                        if (_this.selectedAssets[asset.daCode] == null) {
                            _this.selectedAssets[asset.daCode] = asset;
                            $(this).parents().find('#asset-thumbnail-' + asset.daCode).addClass('open');
                        } else {
                            delete _this.selectedAssets[asset.daCode];
                            $(this).parents().find('#asset-thumbnail-' + asset.daCode).removeClass('open');
                        }
                    });
                    inputGroup.append('<label for="asset' + i + '">&nbsp;Select</label>');
                    caption.append('<p class="asset-name">' + assets[i].name + '</p>');
                    caption.append(inputGroup);
                    var btnGroup = $('<p class="clsDvCenter" style="color: #FFF"><a href="#" class="btn btn-primary" role="button">Preview</a></p>');
                    btnGroup.data('asset', assets[i]);
                    btnGroup.bind('click', function (e) {
                        var _this = this;
                        var player = new Player({ asset: $(_this).data('asset') });
                        player.show();
                    });
                    caption.append(btnGroup);
                    thumbnailDiv.append(img);
                    thumbnailDiv.append(caption);
                    wrapper.append(thumbnailDiv);
                    mainTag.append(wrapper);
                    assetsTag.append(mainTag);
                }
            }
        }
    },

    fnBindSelectedAssets: function (assetsTag) {
        var _this = this;
        var i = 0;
        for (var daCode in _this.selectedAssets) {
            var curAst = _this.selectedAssets[daCode];
            var mainTag = $('<div class="">');
            var wrapper = $('<div class="col-sm-6 col-md-4">');
            var thumbnailDiv = $('<div class="thumbnail course-asset open" id="asset-thumbnail-' + curAst.daCode + '">');
            thumbnailDiv.append('<span class="ticker fa fa-check-square-o"></span>');
            var img = $('<img src="' + curAst.thumbnailURL + '" />');
            var caption = $('<div class="caption">');
            var inputGroup = $('<div class="input-group clsDvCenter">');
            inputGroup.append('<input type="checkbox" checked id="asset_sel_' + i + '" name="asset" value="1" aria-label="...">');
            inputGroup.data('asset', curAst);
            inputGroup.bind('change', function (e) {
                var asset = $(this).data('asset');
                if (_this.selectedAssets[asset.daCode] == null) {
                    _this.selectedAssets[asset.daCode] = asset;
                    $(this).parents().find('#asset-thumbnail-' + asset.daCode).addClass('open');
                } else {
                    delete _this.selectedAssets[asset.daCode];
                    $(this).parents().find('#asset-thumbnail-' + asset.daCode).removeClass('open');
                }
            });
            inputGroup.append('<label for="asset_sel_' + i + '">Select</label>');
            caption.append('<p class="clsDvCenter asset-name">' + curAst.name + '</p>');
            caption.append(inputGroup);
            var btnGroup = $('<p class="clsDvCenter" style="color: #FFF"><a href="#" class="btn btn-primary" role="button">Preview</a></p>');
            btnGroup.data('asset', curAst);
            btnGroup.bind('click', function (e) {
                var _this = this;
                var player = new Player({ asset: $(_this).data('asset') });
                player.show();
            });
            caption.append(btnGroup);
            thumbnailDiv.append(img);
            thumbnailDiv.append(caption);
            wrapper.append(thumbnailDiv);
            mainTag.append(wrapper);
            assetsTag.append(mainTag);
            i++;
        }
    },

    fnFilterAssets: function () {
        var _this = this;
        var categories = $('input[name=asset_category]:checked');
        var tags = $('input[name=asset_tag]:checked');
        var assetsToBind = new Array();
        var filteredByCategory = new Array();
        assetsToBind = _this.metaTagDataAssets.coreAssets;
        if (categories.length > 0) {
            for (var i = 0; i <= categories.length - 1; i++) {
                var tmpCat = _this.fnFilterByCategories(categories[i].value);
                filteredByCategory = filteredByCategory.concat(tmpCat);
            }
            if (filteredByCategory.length > 0)
                assetsToBind = filteredByCategory;
        }
        var filteredByTags = new Array();
        if (tags.length > 0) {
            for (var i = 0; i <= tags.length - 1; i++) {
                filteredByTags = filteredByTags.concat(_this.fnFilterByTags(tags[i].value, assetsToBind));
            }
            if (filteredByTags.length > 0)
                assetsToBind = filteredByTags;
        }
        assetsToBind = _this.fnGetUniques(assetsToBind);
        _this.fnBindAssets(assetsToBind);
        _this.fnBindFiltered(categories, tags);
    },

    fnBindFiltered: function (categories, tags) {
        var _this = this;
        var filteredKey = $('.clsDvFiltered');
        filteredKey.empty();
        if (categories.length <= 0 && tags.length <= 0) {
            filteredKey.append('<div class="filtered">All&nbsp;</div>');
        } else {
            if (categories.length > 0) {
                for (var i = 0; i <= categories.length - 1; i++) {
                    var $div = $('<div class="filtered category">' + categories[i].value + '&nbsp;</div>');
                    var $span = $('<span aria-hidden="true" class="fa fa-close"></span>');
                    $span.data('catId', categories[i].id);
                    $span.bind('click', function (e) {
                        $('#' + $(this).data('catId')).prop('checked', false);
                        _this.fnFilterAssets();
                    });
                    $div.append($span);
                    filteredKey.append($div);
                }
            }
            if (tags.length > 0) {
                for (var i = 0; i <= tags.length - 1; i++) {
                    var $div = $('<div class="filtered tag">' + tags[i].value + '&nbsp;</div>');
                    var $span = $('<span aria-hidden="true" class="fa fa-close"></span>');
                    $span.data('tagId', tags[i].id);
                    $span.bind('click', function (e) {
                        $('#' + $(this).data('tagId')).prop('checked', false);
                        _this.fnFilterAssets();
                    });
                    $div.append($span);
                    filteredKey.append($div);
                }
            }
        }
    },

    fnGetUniques: function (assets) {
        var _this = this;
        var ret = new Array();
        if (assets != null && assets.length > 0) {
            var unique = {};
            for (var i = 0; i <= assets.length - 1; i++) {
                if (unique[assets[i].daCode] == null) {
                    ret.push(assets[i]);
                    unique[assets[i].daCode] = assets[i];
                }
            }
        }
        return ret;
    },

    fnFilterByCategories: function (categoryName) {
        var _this = this;
        var filtered = new Array();
        if (_this.metaTagDataAssets != null) {
            var coreAssets = _this.metaTagDataAssets.coreAssets;
            if (coreAssets != null && coreAssets.length > 0) {
                for (var i = 0; i <= coreAssets.length - 1; i++) {
                    var asset = coreAssets[i];
                    if (asset.metaTag1.endsWith(categoryName + '#')) filtered.push(asset);
                }
            }
        }
        return filtered;
    },
    fnFilterByTags: function (tagName, assets) {
        var _this = this;
        var filtered = new Array();
        if (assets != null && assets.length > 0) {
            for (var i = 0; i <= assets.length - 1; i++) {
                var asset = assets[i];
                if (_this.fnContainsTag(tagName, asset.metaTag2)) filtered.push(asset);
            }
        }
        return filtered;
    },
    fnContainsTag: function (tagName, tags) {
        var _this = this;
        if (tags != null && tags.length > 0) {
            for (var i = 0; i <= tags.length - 1; i++) {
                if (tags[i] == tagName) return true;
            }
        }
        return false;
    },
    fnGetMetatags: function (data, success, failure) {
        var _this = this;
        AssetBrowse.generateMetaData(data, function (data1) {
            AssetBrowse.searchByTags('', function (result) {
                AssetBrowse.removeDuplicates(0, result, {}, [], function (assets) {
                    var assetDatas = {};
                    assetDatas['coreAssets'] = assets;
                    AssetBrowse.getByTags(0, assets, {}, function (taggedAssets) {
                        assetDatas['metaTags'] = data1;
                        assetDatas['taggedAssets'] = taggedAssets;
                        success(assetDatas);
                    }, function (e) { })
                }, function (e) { });
            }, function (e) { });
        }, failure);
    }
};