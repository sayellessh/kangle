/*  It's user control for wall operations like to add/display status and comments. 
*   Developed By: Brij Mohan
*   Website: http://techbrij.com
*   Developed On: 29 May 2013
*  
*/
var assetPlay = {
    defaults: {},
    
onPostEntry: function () {
    if ($("#txtMessage").val().length > 100) {
        $("#btnShare").hide();
    }
    else {
        $("#btnShare").show();
    }

    var remainingLnt = 100 - $("#txtMessage").val().length;
    $("#spnCntRemaining").html(remainingLnt)
},
onCommentEntry: function (obj) {        
    if ($(obj).val().length > 100) {
        //debugger;
        alert('Please enter less than 100 characters');
        //$(obj).val($(obj).val().slice(0,99));
        return false;
    }
}
};

/*var postApiUrl = 'http://kangle.swaas.net/api/WallPost/', commentApiUrl = 'http://kangle.swaas.net/api/Comment/';*/

var postApiUrl = 'http://'+DOMAIN+'/api/WallPost/', commentApiUrl = 'http://'+DOMAIN+'/api/Comment/';

// Model
function Post(data) {
    var self = this;
    data = data || {};
    self.PostId = data.PostId;
    self.Message = ko.observable(data.Message || "");
    self.PostedBy = data.PostedBy || "";
    //self.PostedByName = data.PostedByName || "";
    self.PostedByName = data.PostedByName || "";
    self.PostedByAvatar = data.PostedByAvatar || "";
    self.PostedDate = getTimeAgo(data.PostedDate);
    self.error = ko.observable();
    self.PostComments = ko.observableArray();

    self.newCommentMessage = ko.observable();
    /*if (self.newCommentMessage == "") {
        alert("Please enter some text");
        return false;
    }*/
    self.addComment = function () {
        
        var comment = new Comment();
        comment.Post_Id = self.PostId;        
        if (self.newCommentMessage() == "" || self.newCommentMessage() === undefined ||self.newCommentMessage().trim() == '') {
            alert("Please enter some text");
            return false;
        }
        comment.Message(self.newCommentMessage());
        
        comment.User_Id = Services.defaults.userId;
        comment.Company_Id = Services.defaults.companyId;
        comment.Company_Code = Services.defaults.companyCode;
        comment.Employee_Name = Services.defaults.displayName;
        
        return $.ajax({
            url: commentApiUrl,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'POST',
            data: ko.toJSON(comment)
        })
       .done(function (result) {
           self.PostComments.push(new Comment(result));
           self.newCommentMessage('');
           assetPlay.insertAssetAnalytics(assetPlay.defaults.comment, 1, null);
       })
       .fail(function (e) {
    	   if(e != null && e.status == 0) {
    		   error(networkProblemError);
    	   } else {
    		   error(wallPostError);
    	   }
       });


    }
    if (data.PostComments) {
        var mappedPosts = $.map(data.PostComments, function (item) { return new Comment(item); });
        self.PostComments(mappedPosts);
    }
    self.toggleComment = function (item, event) {
        $(event.target).next().find('.publishComment').toggle();
    }
}



function Comment(data) {
    var self = this;
    data = data || {};

    // Persisted properties
    self.Comment_Id = data.Comment_Id;
    self.Post_Id = data.Post_Id;
    self.Message = ko.observable(data.Message || "");
    self.CommentedBy = data.CommentedBy || "";
    self.CommentedByAvatar = data.CommentedByAvatar || "";
    self.CommentedByName = data.CommentedByName || "";
    self.CommentedDate = getTimeAgo(data.CommentedDate);
    self.error = ko.observable();
    if (self.Message == "" || self.Message === undefined) {
        alert("Please enter some text");
        return false;
    }
    //persist edits to real values on accept
    self.deleteComment = function () {

    }

}

function getTimeAgo(varDate) {
    if (varDate) {
        return $.timeago(varDate.toString().slice(-1) == 'Z' ? varDate : varDate + 'Z');
    }
    else {
        return '';
    }
}


function viewModel() {
    var self = this;
    self.posts = ko.observableArray();
    self.newMessage = ko.observable();
    self.error = ko.observable();
    self.loadPosts = function () {
        //To load existing posts
        $.ajax({
            url: postApiUrl,
            //dataType: "json",
            //contentType: "application/json",
            cache: false,
            type: 'GET',
            data: "assetId=" + assetPlay.defaults.assetId + ""// + assetPlay.defaults.assetId

        })
            .done(function (data) {
            	//alert(JSON.stringify(data));
                var mappedPosts = $.map(data, function (item) { return new Post(item); });
                self.posts(mappedPosts);

                
            })
            .fail(function (error) {
                console.log(error);
            });
    }

    self.addPost = function () {
        var post = new Post();
        
        post.User_Id = Services.defaults.userId;
        post.Company_Id = Services.defaults.companyId;
        post.Company_Code = Services.defaults.companyCode;
        post.Employee_Name = Services.defaults.displayName;
        
        post.Message(self.newMessage());
        post.Content_Id = assetPlay.defaults.assetId; // added for passing the asset id
        var jsonObject = JSON.parse(ko.toJSON(post));
        if (jsonObject.Message === undefined || jsonObject.Message == '' || jsonObject.Message.trim() == '' || jsonObject.Message.length == 0) {
            alert("Please enter some text");
            return false;
        }
        return $.ajax({
            url: postApiUrl,
            dataType: "json",
            contentType: "application/json",
            cache: false,
            type: 'POST',
            data: ko.toJSON(post)
        })
       .done(function (result) {
           self.posts.splice(0, 0, new Post(result));
           self.newMessage('');
           $("#spnCntRemaining").html('100');
           assetPlay.insertAssetAnalytics(assetPlay.defaults.comment, 1, null);
       })
       .fail(function (e) {
    	   if(e != null && e.status == 0) {
    		   error(networkProblemError);
    	   } else {
    		   error(wallPostError);
    	   }
       });
    }
    self.loadPosts();
    return self;
};

//custom bindings

//textarea autosize
ko.bindingHandlers.jqAutoresize = {
    init: function (element, valueAccessor, aBA, vm) {
        if (!$(element).hasClass('msgTextArea')) {
            $(element).css('height', '1em');
        }
        $(element).autosize();
    }
};

var error = function(e) {
	alert(e);
}

