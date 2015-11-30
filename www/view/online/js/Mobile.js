var deviceReady = false;
document.addEventListener('deviceready', function () { }, function () { });

$(function () {
   // eLearningAPP.initApp();

    var hgt = $(window).height();
    if ($(document).height() > hgt) {
        hgt = $(document).height();
    }
    /*var leftHeight = (hgt) - ($(".header").height() + $(".footer").height()) + 'px';
    var rightWidth = $(window).width() - $("#menu-panel").width() + 'px';
    $("#menu-panel").css("min-height", leftHeight);*/
    /*if ($(window).width() < 768) {
        $("#menu-panel").addClass("menu-collapse");
        $("#category").css("height", leftHeight);
    } else {
        $("#menu-panel").removeClass("menu-collapse");
    }*/

    //panel hide and show 
    /*$("ul.slide_menu li#menu-btn").bind("click", function () {
        if ($(window).width() < 768) {
            if ($("#menu-panel").hasClass("menu-collapse")) {
                $("#menu-panel").removeClass("menu-collapse");
            } else {
                $("#menu-panel").addClass("menu-collapse");
            }
        }
    });*/
    /*popup settings*/
    var hdcustomer = window.localStorage.getItem('hidoctorcustomer')
    if(hdcustomer == 0){
        showChangePassword = true;
    }
    var popSettingsAry = [
          {
              displaytitle: "My Profile",
              iconclass: 'arrow-profile',
              onclick: function () {
                  //window.changeActivity.change();
                    window.location.href = 'Rxbook/UserProfile.Mobile.html';
              },
              isVisible: true
          },{
              displaytitle: "Go Offline",
              iconclass: 'arrow-offline',
              onclick: function () {
                  //window.changeActivity.change();
                 var todo = confirm("Are you sure, do you wish to go offline?");
                 if(todo) {
                     window.location.href='eLearningOffline.html';
                 }
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
         window.location.href='changePassword.html';
      },
      isVisible: true
    };
    popSettingsAry.push(cpAry);
    }
      var arrowPopup = new ArrowPopup($('#pop-settings'), {
          container: "headersection",
          bodyDiv: "settings",
          contents: popSettingsAry
      });
    /*home settings*/// need not use this
    var arrowPopuphome = new ArrowPopup ($('.show-home-popup'),{
          container: "headersection",
          bodyDiv: "home",
          contents: [
              {
                  displaytitle: "Kangle Home",
                  iconclass: 'arrow-wire',
                  onclick: function () {
                      //window.changeActivity.change();
                        window.location.href = 'homePage.html';
                  },
                  isVisible: true
              },{
                  displaytitle: "Asset page",
                  iconclass: 'arrow-offline',
                  onclick: function () {
                      //window.changeActivity.change();
                         window.location.reload();
                  },
                  isVisible: true
                     }
         ]
  });
    /*popup settings*/
});

var getParameter = function (key) {
	var result = "", tmp = [];
	location.search
	//.replace ( "?", "" )
	// this is better, there might be a question mark inside
	.substr(1).split("&").forEach(function(item) {
                                  tmp = item.split("=");
                                  if (tmp[0] === key)
                                  result = decodeURIComponent(tmp[1]);
                                  });
	return result;
};