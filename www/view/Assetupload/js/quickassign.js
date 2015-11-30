var quickAssign = {
    hdrEl: null,
    userId: 0,
    isUnassign: true,
    stagingId: 0,
    init: function (userId, isUnassign, stagingId) {
        quickAssign.userId = userId;
        quickAssign.isUnassign = isUnassign;
        quickAssign.stagingId = stagingId;
        quickAssign.setHeader();
        Services.showLoader();
        Services.getAllUsers(function (data) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += '<option value="' + data[i].User_Id + '">' + data[i].Employee_Name + '</option>';
            }
            if (quickAssign.isUnassign == 'N') {
                Services.getAssignedAssetById(quickAssign.userId, quickAssign.stagingId, function (users) {
                    console.log(users[0]);
                    $('#select-users').html(html);
                    for (var i = 0; i < users[0].Users_Mapped.length; i++) {
                        console.log($('option[value="' + users[0].Users_Mapped[i].User_Id + '"]'));
                        $('option[value="' + users[0].Users_Mapped[i].User_Id + '"]').attr('selected', 'selected');
                    }
                    Services.hideLoader();
                    $('#select-users').select2();

                }, function () {
                    Services.hideLoader();
                });
            } else {
                Services.hideLoader();
                $('#select-users').html(html);
                $('#select-users').select2();
            }
        }, function () {
            Services.hideLoader();
        });
    },
    setHeader: function() {
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        quickAssign.hdrEl = new header();
        quickAssign.hdrEl.hdrElActions = function (index) {
            if (index == 0) {
                //window.location.href = '/AssetUpload/' + (quickAssign.isUnassign == 'Y' ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
                window.location.href = (quickAssign.isUnassign == 'Y' ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
            } else {
                var retainUsers = 0;
                if(quickAssign.isUnassign == 'N') { // new change 'N'
                    retainUsers = $('#retain-user').get(0).checked ? 1 : 0;
                }
                Services.assignUsers($('#select-users').val(), retainUsers, quickAssign.stagingId, 1,
                    (quickAssign.isUnassign == 'Y' ? 'UNASSIGNED' : 'ASSIGNED'), function (data) {
                        console.log(data);
                        //window.location.href = '/AssetUpload/' + (quickAssign.isUnassign == 'Y' ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
                        window.location.href = (quickAssign.isUnassign == 'Y' ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
                });
            }
        };
        quickAssign.hdrEl.onBackClick = function () {
            //window.location.href = '/AssetUpload/' + (quickAssign.isUnassign == 'Y' ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
            window.location.href = (quickAssign.isUnassign == 'Y' ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
        };
        quickAssign.hdrEl.createHeaderWithIcons(hdrOptions, 'Quick Assign');
        $('.wrapper header').replaceWith(quickAssign.hdrEl.el);
    }
};