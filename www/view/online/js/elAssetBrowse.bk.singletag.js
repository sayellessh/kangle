
AssetBrowse = {
    generateMetaData: function (data, success, failure) {
        if (data != null) {
            var data1 = eval(data);

            eLearningAPP.metaTags = [];
            eLearningAPP.assets = [];

            var categoryCode = new Array();
            for (var i = 0; i < data1.length; i++) {
                if ($.inArray(data1[i].DACategoryCode, categoryCode) == -1) {
                    categoryCode.push(data1[i].DACategoryCode);
                }
            }

            var content = "";

            for (var i = 0; i < categoryCode.length; i++) {
                var assetList = jsonPath(data1, "$.[?(@.DACategoryCode==" + categoryCode[i] + ")]")
                var metaTag = { metaTag: assetList[0].DACategoryCode + "~" + assetList[0].DACategoryName, tagCount: assetList[0].DACategoryUsageCount, assets: [] };
                eLearningAPP.metaTags.push(metaTag);
                if (assetList) {
                    for (var j = 0; j < assetList.length; j++) {
                        var views = 0, likes = 0, dislikes = 0, ratings = 0;
                        var udTags = "";

                        //To Get the asset analytics
                        views = assetList[j].TotalViews;
                        likes = assetList[j].TotalLikes;
                        dislikes = assetList[j].TotalDislikes;
                        ratings = assetList[j].TotalRatings;

                        //To get the asset meta tag2 (user defined tags)
                        udTags = assetList[j].UDTags.split('_')[1];

                        var asset = {
                            daCode: assetList[j].DAID, name: assetList[j].DAName, description: assetList[j].DA_Description, documentType: assetList[j].DA_Type, lastFileUpdatedTimeStamp: new Date(),
                            analyticsHistory: { daCode: assetList[j].DAID, starValue: ratings, totalViewsCount: views, totalLikesCount: likes, totalDislikesCount: dislikes }, metaTag2: udTags
                        };
                        //asset.downloaded = assetList[j].IsDownloadable;
                        asset.downloaded = "N";
                        asset.thumbnailURL = assetList[j].ThumnailURL;
                        asset.onlineURL = assetList[j].onlineURL;
                        asset.offLineURL = assetList[j].offlineURL;

                        asset.offLineOutPutId = assetList[j].OfflineOutPutId;
                        asset.onLineOutPutId = assetList[j].OnlineOutPutId;

                        eLearningAPP.assets.push(asset);
                        metaTag.assets.push(asset);
                        metaTag.tagCount = metaTag.assets.length;
                    }
                }
            }

            //var content = "";
            //for (var i = 0; i < data[0].lstDACategory.length; i++) {
            //    var metaTag = { metaTag: data[0].lstDACategory[i].DA_Category_Code + "~" + data[0].lstDACategory[i].DA_Category_Name, tagCount: data[0].lstDACategory[i].DA_Usage_Count, assets: [] };

            //    var assetList = jsonPath(data, "$..lstDAHeader[?(@.DA_Category_Code==" + data[0].lstDACategory[i].DA_Category_Code + ")]")

            //    eLearningAPP.metaTags.push(metaTag);

            //    if (assetList) {

            //        for (var j = 0; j < assetList.length; j++) {

            //            var assetAnalytic = jsonPath(data, "$..lstDAAnalytic[?(@.DA_Code==" + assetList[j].DA_Code + ")]")

            //            var assetMetaTag2 = jsonPath(data, "$..lstDAUDTags[?(@.DA_Code==" + assetList[j].DA_Code + ")]")

            //            var views = 0, likes = 0, dislikes = 0, ratings = 0;

            //            //To Get the asset analytics
            //            if (assetAnalytic) {
            //                views = assetAnalytic[0].Views;
            //                likes = assetAnalytic[0].Likes;
            //                dislikes = assetAnalytic[0].Dislike;
            //                ratings = assetAnalytic[0].Rating;
            //            }

            //            //To get the asset meta tag2 (user defined tags)
            //            var udTags = "";
            //            if (assetMetaTag2) {
            //                udTags = assetMetaTag2[0].DA_Tag_Name;
            //            }


            //            var asset = {
            //                daCode: assetList[j].DA_Code, name: assetList[j].DA_Name, description: assetList[j].DA_Description, documentType: assetList[j].DA_Type, lastFileUpdatedTimeStamp: new Date(),
            //                analyticsHistory: { daCode: assetList[j].DA_Code, starValue: ratings, totalViewsCount: views, totalLikesCount: likes, totalDislikesCount: dislikes }, metaTag2: udTags
            //            };
            //            asset.downloaded = assetList[j].Is_Downloadable;
            //            asset.thumbnailURL = assetList[j].DA_Thumbnail_URL;
            //            asset.onlineURL = assetList[j].File_Path;
            //            asset.offLineURL = assetList[j].File_Path;
            //            eLearningAPP.assets.push(asset);
            //            metaTag.assets.push(asset);

            //            metaTag.tagCount = metaTag.assets.length;
            //        }
            //    }
            //}

            $.each(eLearningAPP.metaTags, function (i, metaTag) {
                $.each(metaTag.assets, function (j, asset) {
                    if (asset.metaTag1 == null) {
                        asset.metaTag1 = "#";
                    }
                    asset.metaTag1 = asset.metaTag1 + metaTag.metaTag + "#";
                    if (metaTag.subTags == null) {
                        metaTag.subTags = [];
                    }
                    var subTag = null;
                    var index = -1;
                    $.each(metaTag.subTags, function (j, subtag) {
                        if (subtag.subTag == asset.metaTag2) {
                            index = j;
                        }
                    });

                    if (index != -1) {
                        subTag = metaTag.subTags[index];
                        subTag.tagCount++;
                    } else {
                        subTag = { subTag: asset.metaTag2, tagCount: 1, assets: [] };
                        metaTag.subTags.push(subTag);
                    }
                    subTag.assets.push(asset);
                });


            });
            success(eLearningAPP.metaTags)
        }
        else {
            eLearningAPP.metaTags = null;
            success(eLearningAPP.metaTags)
        }
    },
    searchByTags: function (expression, success, fail) {
        var result = [];
        if (eLearningAPP.metaTags.length > 0)
            AssetBrowse.iterateMetatag(0, expression, eLearningAPP.metaTags, result, success, fail);
        else
            success(result);
    },

    iterateMetatag: function (index, expression, metatags, result, success, fail) {
        if (index <= metatags.length - 1) {
            if (metatags[index].assets.length > 0) {
                AssetBrowse.iterateAssets(0, expression, metatags[index].assets, result, function (out) {
                    result.concat(out);
                    AssetBrowse.iterateMetatag(++index, expression, metatags, result, success, fail);
                }, fail);
            } else {
                AssetBrowse.iterateMetatag(++index, expression, metatags, result, success, fail);
            }
        } else {
            success(result);
        }
    },
    iterateAssets: function (index, expression, assets, result, success, fail) {
        if (index <= assets.length - 1) {
            if (assets[index].metaTag2.toLowerCase().indexOf(expression.toLowerCase()) !== -1)
                result.push(assets[index]);
            AssetBrowse.iterateAssets(++index, expression, assets, result, success, fail);
        } else {
            success(result);
        }
    },
    removeDuplicates: function (index, assets, uniqueAssets, result, success, fail) {
        if (index <= assets.length - 1) {
            if (uniqueAssets[assets[index].daCode] == null) {
                result.push(assets[index]);
                uniqueAssets[assets[index].daCode] = assets[index];
            }
            AssetBrowse.removeDuplicates(++index, assets, uniqueAssets, result, success, fail);
        } else {
            success(result);
        }
    },

    getByTags: function (index, assets, taggedAssets, success, fail) {
        if (index <= assets.length - 1) {
            var asset = assets[index];
            var tag = asset.metaTag2;
            if (taggedAssets[tag] == null) taggedAssets[tag] = [];
            taggedAssets[tag].push(asset);
            AssetBrowse.getByTags(++index, assets, taggedAssets, success, fail);
        } else {
            success(taggedAssets);
        }
    }
}