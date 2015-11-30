
var setting = {
	init: function() {
		/*popup settings*/
        var hdcustomer = window.localStorage.getItem('hidoctorcustomer');
        if(hdcustomer == 0){
            showChangePassword = true;
        }
        var popSettingsAry = [
            {
                displaytitle: "My Profile",
                iconclass: 'arrow-profile',
                onclick: function () {
                //window.changeActivity.change();
                window.location.href = '../Rxbook/UserProfile.Mobile.html';
                },
                isVisible: true
            }
        ];
        if(showChangePassword) {
            var cpAry = {
                    displaytitle: "Change password",
                    iconclass: 'arrow-offline',
                    onclick: function () {
                    //window.changeActivity.change();
                    window.location.href='../changePassword.html';
                },
                isVisible: true
            };
        popSettingsAry.push(cpAry);
        }
        
        var arrowPopup = new ArrowPopup($('#pop-settings'), {
            container: "body",
            offset: 41,
            bodyDiv: "settings",
            contents : popSettingsAry
            
        });
        /*home settings*/
          var arrowPopuphome = new ArrowPopup ($('#pop-home'),{
                container: "body",
                bodyDiv: "home",
                contents: [
                    {
                        displaytitle: "Kangle Home",
                        iconclass: 'arrow-wire',
                        onclick: function () {
                            //window.changeActivity.change();
                              window.location.href = '../homePage.html';
                        },
                        isVisible: true
                    },{
                        displaytitle: "Go to calender",
                        iconclass: 'arrow-offline',
                        onclick: function () {
                            //window.changeActivity.change();
                               window.location.href="MeetingHome.html";
                        },
                        isVisible: true
                           }
               ]
        });
        /*popup settings*/
	}
};