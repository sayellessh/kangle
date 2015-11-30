
function fnGetMenuContent() {
    $.ajax({
        url: '../Home/GetMenuByUserType/',
        type: "POST",
        data: "A",
        success: function (jsMenu) {
            var menuContent = fnGetMenuAccessContent(jsMenu);

            $("#ulMenu").html(menuContent);
        },
        error: function () {

        }
    });
}

function fnGetMenuAccessContent(jsData) {
    var menuContent = "";
    var parentJson = jsonPath(jsData, "$.[?(@.Menu_ParentId=='-1')]")

    for (var a = 0; a < parentJson.length; a++) {
        var levelOneJson = jsonPath(jsData, "$.[?(@.Menu_ParentId=='" + parentJson[a].Menu_Id + "')]");

        if (levelOneJson.length > 0) {
            menuContent += "<li class='dropdown'>";
            menuContent += "<a href='#' class='dropdown-toggle' data-toggle='dropdown'>" + parentJson[a].Menu_Text + " <b class='caret'></b></a>";
        }
        else {
            menuContent += "<li>";
            menuContent += "<a href='#'>" + parentJson[a].Menu_Text + "</a>";
        }

        menuContent += "<ul class='dropdown-menu'>";

        if (levelOneJson != false && levelOneJson !== undefined && levelOneJson.length > 0) {
            for (var i = 0; i < levelOneJson.length; i++) {
                menuContent += "<li><a href='#' onclick='fnLoadBody(\"" + levelOneJson[i].Menu_URL + "\",\"" + levelOneJson[i].Menu_Display_Name + "\")'>" + levelOneJson[i].Menu_Text + "</a></li>";
            }
        }
        menuContent += "</ul>";
        menuContent += "</li>";
    }

    return menuContent;

}
