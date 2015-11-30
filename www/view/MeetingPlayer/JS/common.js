var common = {
	defaults: {
	    userId: window.localStorage.getItem('userId'),
	    companyId: window.localStorage.getItem('companyId'),
	    sudDomainName: window.localStorage.getItem('domainName'),
	    outputFormat: 'jpg',
	    //publish_key: 'pub-c-33be28db-05e2-4b77-8e30-90c15ae42f72',
	    //subscribe_key: 'sub-c-d0dba368-8414-11e4-8663-02ee2ddab7fe'
	    publish_key: 'pub-c-29e631ff-6f05-4fcd-8825-ce812cd6c33f',
	    subscribe_key: 'sub-c-96949208-5419-11e4-9c6f-02ee2ddab7fe'
	},
	init: function(obj){
	    common.defaults.userId = obj.UserId;
	    common.defaults.companyId = obj.Company_Id;
	    common.defaults.sudDomainName = obj.sudDomainName;
	},
	showLoader: function () {
	    $('#loader-img').show();
	},
	hideLoader: function () {
	    $('#loader-img').hide();
	},
	clearValues: function (form) {
	    $('.form-input, textarea', form).val('');
	    $("select", form).select2("val", "");
	},
	dateFormat: function (dateStr) {
	    var now = new Date(dateStr),
            tzo = -now.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
	    return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate())
            + ' ' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds());
	},
	parseDate: function (dateStr) {
	    var now = new Date(dateStr),
            tzo = -now.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function (num) {
                var norm = Math.abs(Math.floor(num));
                return (norm < 10 ? '0' : '') + norm;
            };
	    return now.getFullYear()
            + '-' + pad(now.getMonth() + 1)
            + '-' + pad(now.getDate())
            + 'T' + pad(now.getHours())
            + ':' + pad(now.getMinutes())
            + ':' + pad(now.getSeconds())
            + dif + pad(tzo / 60)
            + ':' + pad(tzo % 60);
	},
	getFileExtension: function (fileName) {
	    var extension = '';
	    extension = fileName.substr(fileName.lastIndexOf('.') + 1, fileName.length);
	    return extension;
	}
};