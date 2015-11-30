
document.addEventListener("offline", offline, false);

function offline() {
	var lastonline = window.localStorage.getItem("lastonlinedate");
	var current_date = new Date();
	var todaydate = current_date.getTime();
	var periodDays = window.localStorage.getItem("SecurityCheckPeriodInDays");
	var dateDifference = todaydate - lastonline;
	var days = dateDifference / (1000 * 3600 * 24);
	if(periodDays != undefined && periodDays != null && periodDays != '') {
		if(days > periodDays) { 
			window.location.href = 'errorPage.html';
		}
	}
};

/*var checkOnlineStatus = function() {
	var lastonline = window.localStorage.getItem("lastonlinedate");
	var current_date = new Date();
	var todaydate = current_date.getTime();
	//var accessdays = window.localStorage.setItem("accessdays");
	var dateDifference = todaydate - lastonline;
	var periodDays = window.localStorage.getItem("SecurityCheckPeriodInDays");
	var days = dateDifference / (1000 * 3600 * 24);
	if(days > periodDays) {
		window.location.href = 'errorPage.html';
	}
};*/