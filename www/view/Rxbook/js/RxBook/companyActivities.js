var companyActivities = {
    lastStreamId: 0,
    start: 1,
    uniqueDatesData: {},
    init: function () {
    //alert("hai");
        companyActivities.displayMoreActivities();
        $('#btn-show-more').hide();
        $('#btn-show-more').bind('click', function (e) {
            companyActivities.getActivityStreamBeforeId();
        });
    },
    displayMoreActivities: function () {
        var userId = Services.defaults.userId;
        Services.getCompanyActivityStream(userId, companyActivities.lastStreamId, function (data) {
            if (data.length > 0) {
                companyActivities.lastStreamId = data[0].Notification_Id;
            }
            companyActivities.sortByDate(data, function (uniqueDatesData) {
                companyActivities.bindcompanyActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
       // var list = $(".activityBody");
    },

    sortByDate: function (data, success, failure) {
        companyActivities.uniqueDatesData = {};
        for (var i = 0; i < data.length; i++) {
            var curDate = new Date(Date.parse(data[i].Notification_DateTime));
            var date = curDate.getDate();
            var month = curDate.getMonth();
            var year = curDate.getFullYear();
            if (date < 10)
                date = '0' + date;
            if (month < 10)
                month = '0' + month;
            var formattedDate = (date + '/' + month + '/' + year);

            if (companyActivities.uniqueDatesData[formattedDate] != null) {
                companyActivities.uniqueDatesData[formattedDate].push(data[i]);
            } else {
                companyActivities.uniqueDatesData[formattedDate] = [];
                companyActivities.uniqueDatesData[formattedDate].push(data[i]);
            }
        }
        success(companyActivities.uniqueDatesData);
    },

    bindcompanyActivities: function (userDatesData) {
        var list = $(".activityBody");
        for (var data in userDatesData) {
            var $lastElement = list.find('.activityDay').last();
            var lastDate = $lastElement.data('activityDate');
            var arrayActivities = userDatesData[data];
            if (lastDate != null && lastDate == data) {
                var html = '';
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    html += '<div class="activity">';
                    html += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + arrayActivities[i].Profile_Photo_BLOB_URL + '"></div> ';
                    html += '<div class="activityMsg"><p><a href="' + arrayActivities[i].Url + '">' + arrayActivities[i].Message_HTML + '</a></p></div>';
                    html += '</div>';
                }
                $lastElement.append(html);
            } else {
                var html = '';
                html += '<div class="activityDay">';
                html += '<div class="activityDate"><span class="line_center">' + data + '</span></div>';
                for (var i = 0; i <= arrayActivities.length - 1; i++) {
                    html += '<div class="activity">';
                    html += '<div class="activityImg"><img class="cls_img_user_profile" alt="" src="' + arrayActivities[i].Profile_Photo_BLOB_URL + '"></div> ';
                    html += '<div class="activityMsg"><p><a href="' + arrayActivities[i].Url + '">' + arrayActivities[i].Data + '</a></p></div>';
                    html += '</div>';
                }
                html += '</div>';
                var $html = $(html);
                $html.data('activityDate', data);
                list.append($html);
            }
            $('#btn-show-more').show();
        }
    },

    getActivityStreamBeforeId: function() {
        var userId = Services.defaults.userId;
        Services.getCompanyActivityStreamBeforeId(userId, companyActivities.lastStreamId, function (data) {
            if (data.length > 0) {
                companyActivities.lastStreamId = data[0].Notification_Id;
            } else
                $('#btn-show-more').hide();
            companyActivities.sortByDate(data, function (uniqueDatesData) {
                companyActivities.bindcompanyActivities(uniqueDatesData, false);
            }, function (e) { });
        }, null);
    }
};