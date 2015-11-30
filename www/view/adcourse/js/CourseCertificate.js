var courseCertificate = {

    getCourseCentification: function (companyId, courseUserAssignmentId) {
        var _this = this;
        Services.getAdCourseCertificate(companyId, courseUserAssignmentId, function (data) {
            if (data != null && data.length > 0) {
                var cData = data[data.length-1];
                $("#certificateUserName").html(cData.Employee_Name);
                $("#courseName").html(cData.Course_Name);
                $("#courseDate").html(cData.Last_Test_Date != null ? cData.Last_Test_Date : "N/A");
                $("#companyName").html(cData.Company_Name);
            } else {
                _this.onFail();
            }
        }, this.onFail);
    },

    onFail: function(e) {
        alert('Unable to get certificate, please try again.');
        window.location.href = "UserAdCourseDetails.html";
    }
};