var inprogress = {
    userId: 0,
    hdrEl: null,
    init: function (userId) {
        inprogress.userId = userId;
        inprogress.setHeader();
        inprogress.getInProgressAssets();
    },
    getInProgressAssets: function () {
        Services.showLoader();
        Services.getEncodingInProgressAssets(function (data) {
            inprogress.bindInProgressList(data);
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    },
    bindInProgressList: function (data) {
        var unList = new List('.list-items');
        for (var i = 0; i < data.length > 0; i++) {
            unList.createProgressList({
                thumbnailUrl: data[i].DA_Thumbnail_URL, fileName: data[i].File_Name, assetName: data[i].DA_Name,
                stagingId: data[i].DA_Code, status: data[i].Asset_Status_String
            });
        }
        unList.refresh();
    },
    setHeader: function () {
        var hdrOptions = [];

        inprogress.hdrEl = new header();
        inprogress.hdrEl.hdrElActions = function (index) {
           
        };
        inprogress.hdrEl.onBackClick = function () {
            window.location.href = 'UserUpload.Mobile.html';
        };
        inprogress.hdrEl.createHeaderWithIcons(hdrOptions, 'In Progress Assets');
        $('.wrapper header').replaceWith(inprogress.hdrEl.el);
    }
};