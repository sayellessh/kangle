var userassign = {
    hdrFilterEl: null,
    hdrEl: null,
    userId: 0,
    isUnassign: true,
    usersList: new Array(),
    usersSelectedList: new Array(),
    stagingId: 0,
    selectedDivisions: { divisions: new Array(), usertype: new Array() },
    init: function (userId, isUnassign, stagingId) {
        userassign.userId = userId;
        userassign.isUnassign = (isUnassign == 'Y' ? true : false);
        userassign.stagingId = stagingId;
        if (userassign.isUnassign) {
            userassign.setAssignHeader();
            userassign.createSelectedusers();
        } else {
            Services.showLoader();
            Services.getAssignedAssetById(userassign.userId, userassign.stagingId, function (data) {
                userassign.usersSelectedList = data[0].Users_Mapped;
                userassign.setAssignHeader();
                userassign.createSelectedusers();
                Services.hideLoader();
            }, function () {
                Services.hideLoader();
            });
        }
    },
    setAssignHeader: function() {
        var hdrOptions = [
            { className: 'fa-plus' },
            { className: 'fa-save' }
        ];

        userassign.hdrEl = new header();
        userassign.hdrEl.hdrElActions = function (index) {
            if (index == 0) {
                $('body').css({ 'height': $(window).height(), 'overflow': 'hidden' });
                userassign.userFilter = new UserFilter({
                    selectedDivisions: userassign.selectedDivisions, isUnassign: userassign.isUnassign,
                    userId: userassign.userId
                });
                userassign.userFilter.show();
                userassign.setFilterHeader();
            } else if (index == 1) {
                if (userassign.usersSelectedList.length > 0) {
                    var userId = new Array(); //new change
                    for (var i = 0; i < userassign.usersSelectedList.length; i++) {
                        //userId += userassign.usersSelectedList[i].User_Id;
                        userId.push(userassign.usersSelectedList[i].User_Id); // new change
                        //if (i < userassign.usersSelectedList.length -1) {
                        //    userId += ',';
                        //}
                    }
                    var retainPreUsers = 0;
                    if (userassign.isUnassign == 'N')
                        retainPreUsers = ($('#retain-user').get(0).checked ? 1 : 0);
                    Services.showLoader();
                    Services.assignUsers(userId, retainPreUsers, userassign.stagingId, 1, (userassign.isUnassign ? 'UNASSIGNED' : 'ASSIGNED'),
                        function (data) {
                            if (data && data > 0) {
                                alert('Asset successfully assigned to users');
                                //window.location.href = '/AssetUpload/' + (userassign.isUnassign ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
                                window.location.href = (userassign.isUnassign ? 'UnAssignedAssets.Mobile.html' :'AssignedAssets.Mobile.html');
                            } else {
                                alert('Cannot Assigned to users. Sorry for inconvenience');
                            }
                            Services.hideLoader();
                    }, function () {
                        Services.hideLoader();
                    });
                } else {
                    alert('Please choose atleast one user');
                }
            }
        };
        userassign.hdrEl.onBackClick = function () {
            //window.location.href = '/AssetUpload/' + (userassign.isUnassign ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
            window.location.href = (userassign.isUnassign ? 'UnAssignedAssets.Mobile.html' : 'AssignedAssets.Mobile.html');
        };
        userassign.hdrEl.createHeaderWithIcons(hdrOptions, 'User List');
        $('.wrapper header').replaceWith(userassign.hdrEl.el);
    },
    setAssignUserHeader: function(){
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];

        userassign.hdrEl = new header();
        userassign.hdrEl.hdrElActions = function (index) {
            if (index == 0) {
                $('.wrapper-user').hide();
                $('body').attr('style', '');
                $('.user-list .items-user').empty();
            } else if (index == 1) {
                $('.wrapper-user').hide();
                $('body').attr('style', '');
                $('.user-list .items-user').empty();
                userassign.createSelectedusers();
            }
        };
        userassign.hdrEl.onBackClick = function () {
            $('.wrapper-user').hide();
            $('body').attr('style', '');
            $('.user-list .items-user').empty();
        };
        userassign.hdrEl.createHeaderWithIcons(hdrOptions, 'Select Users');
        $('.wrapper-user header').replaceWith(userassign.hdrEl.el);
    },
    setFilterHeader: function () {
        var hdrOptions = [
            { className: 'fa-remove' },
            { className: 'fa-check' }
        ];
        $('body').css({ 'height': $(window).height(), 'overflow': 'hidden' });
        userassign.hdrFilterEl = new header();
        userassign.hdrFilterEl.hdrElActions = function (index) {
            userassign.userFilter.hide();
            if (index == 1) {
                userassign.selectedDivisions = userassign.userFilter.selectedDivisions;
                userassign.getUserList();
            }
        };
        userassign.hdrFilterEl.onBackClick = function () {
            userassign.userFilter.hide();
            $('body').removeAttr('style');
        };
        userassign.hdrFilterEl.createHeaderWithIcons(hdrOptions, 'Select Users');
        $('.wrapper-filter header').replaceWith(userassign.hdrFilterEl.el);
    },
    getUserList: function () {
        $('.wrapper-user').show();
        userassign.setAssignUserHeader();
        Services.showLoader();
        Services.getAllUsers(function (data) {
            var filteredUsers = new Array();
            if (data && data.length > 0) {
                if (userassign.selectedDivisions.divisions.length == 0 && userassign.selectedDivisions.usertype.length == 0) {
                    filteredUsers = userassign.getUniqueUsers(data);
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var curUser = data[i], UserDivTypeTag = curUser.User_Division_Code + '_' + curUser.User_Type_Code;
                        if (userassign.selectedDivisions.divisions.indexOf(curUser.Division_Code) > -1)
                            filteredUsers.push(curUser);
                        if (userassign.selectedDivisions.usertype.indexOf(curUser.User_Type_Code) > -1)
                            filteredUsers.push(curUser);
                    }
                    filteredUsers = userassign.getUniqueUsers(filteredUsers);
                }
                userassign.bindUserList(filteredUsers);
            }
            Services.hideLoader();
        }, function () {
            Services.hideLoader();
        });
    },
    getUniqueUsers: function (users) {
        var userIds = new Array(), newUsers = new Array();
        if (users.length > 0) {
            for (var i = 0; i < users.length; i++) {
                if (userIds.indexOf(parseInt(users[i].User_Id, 10)) == -1) {
                    userIds.push(users[i].User_Id);
                    newUsers.push(users[i]);
                }
            }
        }
        return newUsers;
    },
    bindUserList: function (users) {
        $('.user-search').remove();
        $('.user-list ul.items-user').empty();
        if (users && users.length > 0) {
            var html = '', searchHtml = '<div class="user-search" style="margin: 10px">';
            searchHtml += '<input type="text" value="" placeholder="search by username" />';
            searchHtml += '<span class="fa fa-search"></span>';
            searchHtml += '</div>';
            $('.wrapper-user .user-list').prepend(searchHtml);
            for (var i = 0; i < users.length; i++) {
                var el = $('<li data-userid=' + users[i].User_Id + '></li>');
                el.append('<div class="list-items-inner">');
                el.append('<span class="list-prof"><img src="' + 
                    (users[i].Profile_Photo_BLOB_URL == null ? '../online/imgs/profile_icon.png' : users[i].Profile_Photo_BLOB_URL) + '" alt=""/></span>');
                el.append('<span class="list-user">');
                el.append('<span class="list-user-name">' + users[i].Employee_Name + '</span>');
                el.append('<span class="list-user-loc">Chennai</span>');
                el.append('</span>');
                el.append('</div>');
                el.append('<span class="fa fa-plus"></span>');
                el.append('<span class="fa fa-minus"></span>');
                el.append('</li>');
                el.data('userobj', users[i]);
                $('.wrapper-user .user-list ul').append(el);
            }
        }
        userassign.bindUserListActions();
    },
    bindUserListActions: function () {
        $('.wrapper-user .user-list ul li').unbind('click').bind('click', function () {
            $(this).toggleClass('selected');
            userassign.usersList = new Array();
            $.each($('.wrapper-user .items-user li.selected'), function (i, el) {
                userassign.usersList.push($(el).data('userobj'));
            });
            return false;
        });
        $('.wrapper-user .user-search .fa').unbind('click').bind('click', function () {
            var val = $('.user-search input').val().toLowerCase();
            $.each($('.items-user li'), function (i, el) {
                $(el).hide();
                if ($('.list-user-name', $(el)).text().toLowerCase().indexOf(val) > -1) {
                    $(el).show();
                }
            });
        });
    },
    createSelectedusers: function () {
        $('.wrapper .user-list ul').empty();
        if (userassign.isUnassign) {
            userassign.usersSelectedList = userassign.getUniqueUsers(userassign.usersList);
        } else {
            debugger;
            if (userassign.usersList.length > 0) {
                for (var i = 0; i < userassign.usersList.length; i++) {
                    userassign.usersSelectedList.push(userassign.usersList[i]);
                }
            }
            userassign.usersSelectedList = userassign.getUniqueUsers(userassign.usersSelectedList);
            console.log(userassign.usersSelectedList);
        }
        var users = userassign.usersSelectedList;
        
        if (users && users.length > 0) {
            $('.warn-message').hide();
            $('.wrapper .list-items').show();
            $('.user-list-items .list-items').html('');

            for (var i = 0; i < users.length; i++) {
                var el = $('<li data-userid=' + users[i].User_Id + '></li>');
                el.append('<div class="list-items-inner">');
                el.append('<span class="list-prof"><img src="' +
                    (users[i].Profile_Photo_BLOB_URL == null ? '../online/imgs/profile_icon.png' : users[i].Profile_Photo_BLOB_URL) + '" alt=""/></span>');
                el.append('<span class="list-user">');
                el.append('<span class="list-user-name">' + users[i].Employee_Name + '</span>');
                el.append('<span class="list-user-loc">Chennai</span>');
                el.append('</span>');
                el.append('</div>');
                el.append('<span class="fa fa-minus" style="display: none"></span>');
                el.append('</li>');
                el.data('userobj', users[i]);
                $('.wrapper .content ul').append(el);
            }
        } else {
            $('.warn-message').show();
            $('.wrapper .list-items').hide();
        }
    }
};