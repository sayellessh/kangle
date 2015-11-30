/**
 * PENDING ITEMS 1. Integrate praffulla code - UpSync DAO (SyncGet, SyncPut,
 * Clean)
 */

var mycustomer = {};
var customerEntity = {};
var specialityEntity = {};
var specl = false;
mycustomer.init = function(){

	var mycustomers = window.localStorage.getItem("myCustomers");
	if(mycustomers == null || mycustomers == '') {
	    getMyCustomers();
	    window.localStorage.setItem("myCustomers",1);
	}
    getSpecialityAndCategory();
    editusers();
    $(".area").keyup(function(e){
    console.log($(".area").val());
        if($(".area").val().length > 2){
         var locationname = $(".area").val();
            getLocationFromService(locationname);
         } else if($(".area").val().length <= 2 && $(".custlocation").length > 0){
            $(".custlocation").empty();
            $(".custlocation").hide();
         }
    });
};

//getlocationfromservice
var getLocationFromService = function(locationname){
    Services.getCustomerLocations(locationname,function (data) {
        $(".custlocation").show();
        $(".editlocation").show();
        var locality = $(".custlocation");
        var editlocality = $(".editlocation");
        if (data != null && data.length > 0) {
            locality.empty();
            editlocality.empty();
            for(var i=0;i<=data.length-1;i++) {
                locality.append("<li value=\"" + data[i].Customer_Location_Id + "\">" + data[i].Customer_Location + "</li>");
                editlocality.append("<li value=\"" + data[i].Customer_Location_Id + "\">" + data[i].Customer_Location + "</li>");
                //locality.append("<li value=\"\">adyar</li>");
           }
            $('.custlocation li').bind('click',function() {
                var userlocation = $(this).text();
                $(".area").prop("value",userlocation);
                $(".custlocation").hide();
            });
            $('.editlocation li').bind('click',function(){
                var edituserlocation = $(this).text();
                $("#locationarea").prop("value",edituserlocation);
                $(".editlocation").hide();
            });
        }
    }, function () {  });
};
//getlocationfromservice

//get category and speciality
var getSpecialityAndCategory = function(){
    Services.getCustomerEntity(function (data) {
        customerEntity = data;
        var cat = $("#catg");
        if (data != null && data.length > 0) {
            cat.empty();
            var Entityname = "General";
        	for(var i=0;i<=data.length-1;i++) {
            	cat.append('<option value="' + data[i].Entity_Value_Id + '" ' + (Entityname == data[i].Entity_Value_Name ? 'selected':'') + '>' + data[i].Entity_Value_Name + '</option>');
        	}
            /*for (var i = 0; i <= data.length - 1; i++) {
                cat.append("<option value=\"" + data[i].Entity_Value_Id + "\">" + data[i].Entity_Value_Name + "</option>");
            }*/
        }
    }, function () {  });

    Services.getCustomerSpecialityByCompany(function (data) {
        specialityEntity = data;
        var spl = $("#spec");
        if (data != null && data.length > 0) {
            spl.empty();
            var spcltyname = "General";
        	for(var i=0;i<=data.length-1;i++) {
            	spl.append('<option value="' + data[i].Preference_Value_Id + '" ' + (spcltyname == data[i].Preference_Value ? 'selected':'') + '>' + data[i].Preference_Value + '</option>');
        	}
            /*for (var i = 0; i <= data.length - 1; i++) {
                spl.append("<option value=\"" + data[i].Preference_Value_Id + "\">" + data[i].Preference_Value + "</option>");
            }*/
        }
    }, function () {  });
    
    Services.getCustDomain(function(data){
    if(data >= 1){
    	specl = true;
    	$('#speclity').hide();
    	$('#spclnamelist').hide();
    } else {
    	$('#speclity').show();
    	$('#spclnamelist').show();
    } 
    }, function(){
    	console.log("error");
    });
};
//get category and speciality

//get all users
var getMyCustomers = function() {
    Services.getMyCustomerList(function(user){
    	
        if(user !=null && user.length > 0) {
            /*addtotable(0, user, function() {
               alert("success");
            },function(){
               //alert("fail");
            });*/
            var users = new Array();
            for(var i=0;i<=user.length-1;i++) {
                var tmp = {
                    emailId:user[i].Customer_Email,
                    customerId: user[i].Customer_Id,
                    userId: Services.defaults.userId,
                    firstName: user[i].Customer_FName,
                    lastName: user[i].Customer_LName,
                    phone: user[i].Customer_Phone,
                    categoryName: user[i].Entity_Value_Name,
                    categoryId: user[i].Entity_Value_Id,
                    specialityName: user[i].Preference_Value,
                    specialityId: user[i].Preference_Value_Id,
                    modifiedBy: user[i].Modified_By,
                    modifiedDate: user[i].Modified_Date,
                    location: user[i].Customer_Location,
                    Customer_Category2:user[i].Customer_Category2,
                    Customer_Category3:user[i].Customer_Category3,
                    status: user[i].Active_Status
                };
                users.push(tmp);
            }
            customertableLocalDAO.remove(null, function(){
                customertableLocalDAO.insert(users, function(myuserdetails){
                		// alert("success");
                }, function() { alert("fail"); });
            }, function(){
            });
        } else {
        	customertableLocalDAO.remove(null, function(){
        		console.log("cleared db");
        	});
        }
    },function(){
    });
};
//get all user

//Add new user
var submitCustomerShareForm = function () {
    // validation
    var firstname = $("#fname").val();
    if (firstname == null || firstname.trim() == '') {
        alert("First name is required.");
        return;
    }
    if (firstname != null && firstname.trim().length > 0) {
        if (!mycustomer.validateName(firstname)) {
            alert("First name is invalid.");
            return;
        }
    }
    var lastname = $("#lname").val();
    if (lastname != null && lastname.trim().length > 0) {
        if (!mycustomer.validateName(lastname)) {
            alert("Last name is invalid.");
            return;
        }
    }
    var email = $("#email").val();
    if (email == null || email.trim() == '') {
        alert("Email id is required.");
        return;
    }
    if (email != null && email.trim().length > 0) {
        if (!mycustomer.validateEmail(email)) {
            alert("Email is invalid.");
            return;
        }
    }
    var category = $("#catg").val();
    if (category == null || category.trim() == '') {
        alert("Category is required.");
        return;
    }
    
	for(var i=0; i<customerEntity.length;i++){
		if(category == customerEntity[i].Entity_Value_Id){
			var category1 = customerEntity[i].Entity_Value_Name;
		}
	}
	var speciality = $("#spec").val();
	for(var i=0; i<specialityEntity.length;i++) {
    	if(speciality == specialityEntity[i].Preference_Value_Id) {
          var speciality1 = specialityEntity[i].Preference_Value;
      }
    }
//    for(var i=1; i<= customerEntity.length;i++){
//        if(i == category){
//            var category1 = customerEntity[i-1].Entity_Value_Name;
//        }
//    }  
//    var speciality = $("#spec").val();
//    for(var i=1; i<= specialityEntity.length;i++){
//        if(i == speciality){
//            var speciality1 = specialityEntity[i-1].Preference_Value;
//        }
//    }
    var phone = $("#phno").val();
    if (phone != null && phone.trim().length > 0) {
        if (!mycustomer.validatePhone(phone)) {
            alert("Phone number is invalid.");
            return;
        }
    }
    
    var location = $(".area").val().trim();
    /*if(location != null && location.trim().length > 0){
        if (!mycustomer.validateName(location)) {
            alert("Location is invalid.");
            return;
        }
    }*/
    
    //var Active_User = $("#checkstatus:checked").length > 0 ? true : false;
    var postData = {};
    postData.Asset_Id = '';
    postData.Customer_FName = firstname;
    postData.Customer_LName = lastname;
    postData.Customer_Email = email;
    postData.Customer_Phone = phone;
    postData.Entity_Value_Id = category;
    postData.Customer_Category2 = "0";  //category added
    postData.Customer_Category3 = "0";  //category added
    //postData.Entity_Value_Name = category1;
    postData.Customer_Preference1 = speciality;
    //postData.Preference_Value = speciality1;
    postData.User_Id = Services.defaults.userId;
    postData.Customer_Location = location;
    //postData.Active_Status = Active_User;
    postData.Active_Status = true;
    
    console.log("insertmaster"+JSON.stringify(postData));
    
    Services.insertCustomerMaster(postData, function (data) {
        if (data != null) {
            customertableLocalDAO.getByData(data, function (userRecord) {
                    if(userRecord != null) {

                        userRecord.firstName = postData.Customer_FName;
                        userRecord.lastName = postData.Customer_LName;
                        userRecord.emailId = postData.Customer_Email;
                        userRecord.phone = postData.Customer_Phone;
                        userRecord.categoryId = postData.Entity_Value_Id;
                        userRecord.categoryName = category1;
                        userRecord.specialityId = postData.Customer_Preference1;
                        userRecord.specialityName = speciality1;
                        userRecord.userId = postData.User_Id;
                        userRecord.location = postData.Customer_Location;
                        userRecord.Customer_Category2 = postData.Customer_Category2;    //category added
                        userRecord.Customer_Category3 = postData.Customer_Category3;    //category added
                        userRecord.modifiedBy = Services.defaults.userId;
                        userRecord.status = postData.Active_Status;
                                                
                        customertableLocalDAO.update(userRecord, function(){
                            //alert("updated");
                            window.location.reload();
                        }, function() {
                            alert("Failed to add customer.Please retry.");
                        });
                    } else {
                        var userRecord= {};
                        userRecord.firstName = postData.Customer_FName;
                        userRecord.lastName = postData.Customer_LName;
                        userRecord.emailId = postData.Customer_Email;
                        userRecord.phone = postData.Customer_Phone;
                        userRecord.categoryId = postData.Entity_Value_Id;
                        userRecord.categoryName = category1;
                        userRecord.specialityId = postData.Customer_Preference1;
                        userRecord.specialityName = speciality1;
                        userRecord.userId = postData.User_Id;
                        userRecord.location = postData.Customer_Location;
                        userRecord.Customer_Category2 = postData.Customer_Category2;    //category added
                        userRecord.Customer_Category3 = postData.Customer_Category3;    //category added
                        userRecord.modifiedBy = Services.defaults.userId;
                        userRecord.status = postData.Active_Status;
                        userRecord.customerId = data;
                                
                        customertableLocalDAO.insert(userRecord, function(){
                            alert("Customer added successfully.");
                            window.location.reload();
                        }, function(){
                            alert("Failed to add customer.Please retry.");
                        });
                    }
            });
        } else {
            alert("error");
        }
    }, function (e) {
        alert("Failed to insert customer.Please try again later..");
    });
};
//Add new user


//edit user
var editusers = function() {
    /*Services.checkGlobalEmailAccess(function(data){
        if(data == 1){
            Services.getExcludeMyCustomerList(function (data) {
            var html = '';
                if (data != null && data.length > 0) {
                	$('#otherusers').show();
                    $(".norecords").hide();
                    
                    for(var i = 0; i < data.length; i++) {
                        html += '<li class="'+ data[i].Customer_Id + '" data-customerid = "'+ data[i].Customer_Id +'"><span>' + data[i].Customer_Email + '</span><span>'+ data[i].Customer_FName +'</span><span>'+ data[i].Entity_Value_Name +'</span></li>';
                        //<span>' + data[i].Preference_Value + '</span>
                        //html += '<li class="'+ data[i].customerId + '">' + data[i].emailId + '</li>';
                    }
                    $('.editotherusers').append(html);
                    $('.editotherusers li').bind('click',function(){
                        var editotherCustomer = $(this).data('customerid');
                        Services.getCustomerEntity(function(customerEntries){
                            Services.getCustomerSpecialityByCompany(function (specialities) {
                                //getUserToEdit(editCustomer, customerEntries, specialities);
                                  getMyUserToEdit(editotherCustomer,customerEntries,specialities);
                            });
                        });
                        $('.editlist').hide();
                    });
                } else {
                    $('#otherusers').hide();
                }
            }, function () {
                $('#otherusers').hide();
            });
        } else {
            $('#otherusers').hide();
        }
        },function() {
            $('#otherusers').hide();
    });*/
    
    customertableLocalDAO.getAll(function(user){
            if(user != null && user.length > 0) {
            	$('#myusers').show();
                var html = '';
                console.log('user : '+JSON.stringify(user));
                for(var i = 0; i < user.length; i++) {
                    //if(user[i].status != 'false'){
                        html += '<li class="'+ user[i].customerId + '" data-customerid = "'+ user[i].customerId +'"><span>' + user[i].emailId + '</span><span>'+ user[i].firstName +'</span><span>'+ user[i].categoryName+'</span><span id="spclnamelist" style="display:none;">' + user[i].specialityName + '</span></li>';
                    //}
                }
            } else {
            	$('#myusers').hide();
            	$('.norecords').show();
                //html += '<li class="">No users Available</li>';
            }
			$('.editmyusers').append(html);
            $('.editmyusers li').bind('click',function(){
                var editCustomer = $(this).data('customerid');
                Services.getCustomerEntity(function(customerEntries){
                    Services.getCustomerSpecialityByCompany(function (specialities) {
                        //getUserToEdit(editCustomer, customerEntries, specialities);
                          getMyUserToEdit(editCustomer,customerEntries,specialities);
                    });
                });
                //var customerEntity = {};
                //var specialityEntity = {};
                //getUserToEdit(editCustomer);
                $('.editlist').hide();
            });
    }, function(){
    });
};

getMyUserToEdit = function(data, customerentries, specialities){
    customertableLocalDAO.getByData(data, function (userRecord) {
    if(userRecord != null) {
        
        var html = '<div class="editcontents" id="edit_user">';
        html += '<div class="password">';
        html += '<input class="textarea" id="firstname" placeholder="First Name" maxlength="100" value="'+ userRecord.firstName +'"/>';
        html += '</div>';
        html += '<div class="password">';
        html +=	'<input class="textarea" id="emailId" style="background-color: #D1D1D1;" placeholder="Email" maxlength="100" value="'+userRecord.emailId+'"disabled />';
        html +=	'</div>';
        html +=	'<div class="password">';
        html +=	'<input class="textarea" id="lastname" placeholder="Last Name" maxlength="100" value="'+userRecord.lastName+'"/>';
        html +=	'</div>';
        html +=	'<div class="password">';
        html +=	'<input class="textarea" id="phonenumber" placeholder="Phone" maxlength="16" tabindex="0" value="'+userRecord.phone+'"/>';
        html +=	'</div>';
        html +=	'<div class="password">';
        html += '<div class="labelName" id="catogry">* Category :</div>';
        html +=	'<select class="textarea" id="categry">';
        var selectedEntityId = userRecord.categoryId;
        for(var i=0;i<=customerentries.length-1;i++) {
            html +=	'<option value="' + customerentries[i].Entity_Value_Id + '" ' + (selectedEntityId == customerentries[i].Entity_Value_Id ? 'selected':'') + '>' + customerentries[i].Entity_Value_Name + '</option>';
        }
        
        html +=	'</select>';
        html +=	'</div>';
        html +=	'<div class="password" id="editspeclity" style="display:none;">';
        html += '<div class="labelName" id="spclity">Speciality :</div>';
        html +=	'<select class="textarea" id="speclity">';
        var selectedspecialityEntityId = userRecord.specialityId;
        for(var i=0;i<=specialities.length-1;i++) {
            html +=	'<option value="' + specialities[i].Preference_Value_Id + '" ' + (selectedspecialityEntityId == specialities[i].Preference_Value_Id ? 'selected':'') + '>' + specialities[i].Preference_Value + '</option>';
        }
        //html +=	'<option value="' +  + '">' + specialities[j].Preference_Value + '</option>';
        html +=	'</select>';
        html +=	'</div>';
        html +=	'<div class="password">';
        html +=	'<input class="textarea" id="locationarea" placeholder="Location" maxlength="100" tabindex="0" value="'+userRecord.location+'"/><ul class="editlocation"></ul>';
        html +=	'</div>';
        html +=	'<div>';
        //  html +=	'<input type="checkbox" id="editcheck" value="true" checked="checked"/> Active';
        html +=	'<span id="cancelupdate"><button class="cancelupdate" type="submit">Cancel</button></span>';
        html +=	'<span id="update"><button class="update" type="submit">Update</button></span>';
        html +=	'</div>';
        html +=	'</div>';

        $('#old_user').append(html);
        
        if(specl) {
        	$('#editspeclity').hide();
        } else {
        	$('#editspeclity').show();
        }
        
			$('#locationarea').keyup(function(e){
				console.log($("#locationarea").val());
				if($("#locationarea").val().length > 2){
					var locationname = $("#locationarea").val();
					getLocationFromService(locationname);
				} else if($("#locationarea").val().length <= 2 && $(".editlocation").length > 0){
					$(".editlocation").empty();
					$(".editlocation").hide();
				}
			});
        
            $('#update').bind('click',function(){
               
                var firstname = $("#firstname").val();
                if (firstname == null || firstname.trim() == '') {
                	alert("First name is required.");
                	return;
                }
                if (firstname != null && firstname.trim().length > 0) {
	                if (!mycustomer.validateName(firstname)) {
	                    alert("First name is invalid.");
	                    return;
	                }
                }
                var lastname = $("#lastname").val();
                if (lastname != null && lastname.trim().length > 0) {
	                if (!mycustomer.validateName(lastname)) {
	                    alert("Last name is invalid.");
	                    return;
	                }
                }
                var email = $("#emailId").val();
                if (email == null || email.trim() == '') {
                	alert("Email id is required.");
                	return;
                }
                if (email != null && email.trim().length > 0) {
                if (!mycustomer.validateEmail(email)) {
                    alert("Email is invalid.");
                    return;
                }
                }
                var category = $("#categry").val();
                if (category == null || category.trim() == '') {
                	alert("Category is required.");
                	return;
                }
                
                for(var i=0; i<customerEntity.length;i++){
            		if(category == customerEntity[i].Entity_Value_Id){
            			var category1 = customerEntity[i].Entity_Value_Name;
            		}
            	}
            	
                var speciality = $("#speclity").val();
            	for(var i=0; i<specialityEntity.length;i++) {
                	if(speciality == specialityEntity[i].Preference_Value_Id) {
                      var speciality1 = specialityEntity[i].Preference_Value;
                  }
                }
                
                
                /*var category1 = '';
                Services.getCustomerEntity(function(customerEntries){
                	for(var i=0; i<customerEntries.length;i++){
                		if(category == customerEntries[i].Entity_Value_Id){
                			category1 = customerEntries[i].Entity_Value_Name;
                		}
                	}
                });
                
                var speciality = $("#speclity").val();
//                var speciality1 = '';
//                Services.getCustomerSpecialityByCompany(function (specialities) {
//                	for(var i=0; i<specialities.length;i++){
//                		if(speciality == specialities[i].Preference_Value_Id){
//                			speciality1 = specialities[i].Preference_Value;
//                		}
//                	}
//                });
//                for(var i=1; i<= customerentries.length;i++){
//                	alert(customerentries.length);
//                if(i == category){
//                    var category1 = customerentries[i-1].Entity_Value_Name;
//                }
//                }
//                var speciality = $("#speclity").val();
                for(var i=1; i<= specialities.length;i++){
	                if(i == speciality){
	                    var speciality1 = specialities[i-1].Preference_Value;
	                }
                }*/
                
                var phone = $("#phonenumber").val();
                if (phone != null && phone.trim().length > 0) {
	                if (!mycustomer.validatePhone(phone)) {
	                    alert("Phone number is invalid.");
	                    return;
	                }
                }
                
                var customerarea = $("#locationarea").val().trim();
                /*if (customerarea != null && customerarea.trim().length > 0) {
                    if (!mycustomer.validateName(customerarea)) {
                        alert("Location is invalid.");
                        return;
                    }
                }*/
                
                //var Active_User = $("#editcheck:checked").length > 0 ? true : false;
                var uploadPostData = {};
                uploadPostData.Asset_Id = '';
                uploadPostData.Customer_FName = firstname;
                uploadPostData.Customer_LName = lastname;
                //uploadPostData.Customer_Email = email;
                uploadPostData.Customer_Id = data;
                uploadPostData.Customer_Phone = phone;
                uploadPostData.Entity_Value_Id = category;
                uploadPostData.Customer_Category2 = "0";    //category added
                uploadPostData.Customer_Category3 = "0";    //category added
                uploadPostData.Customer_Preference1 = speciality;
                uploadPostData.User_Id = Services.defaults.userId;
                uploadPostData.Company_Id = Services.defaults.companyId;
                uploadPostData.Customer_Location = customerarea;
                //uploadPostData.Active_Status = Active_User;
                uploadPostData.Active_Status = true;
                
                
              Services.updateCustomerProfileInfo(uploadPostData, function (data) {
                    if (data) {
                              var userRecord = {};
								userRecord.firstName = uploadPostData.Customer_FName;
								userRecord.lastName = uploadPostData.Customer_LName;
								userRecord.emailId = email;
								userRecord.phone = uploadPostData.Customer_Phone;
								userRecord.categoryId = uploadPostData.Entity_Value_Id;
								userRecord.categoryName = category1;
								userRecord.specialityId = speciality;
								userRecord.specialityName = speciality1;
								userRecord.userId = uploadPostData.User_Id;
								userRecord.location = uploadPostData.Customer_Location;
								userRecord.Customer_Category2 = uploadPostData.Customer_Category2; //category added
								userRecord.Customer_Category3 = uploadPostData.Customer_Category3; //category added
								userRecord.modifiedBy = Services.defaults.userId;
								userRecord.status = uploadPostData.Active_Status;
                                                            
                        customertableLocalDAO.update(userRecord, function(){
                            alert("Customer updated successfully.");
                            window.location.reload();
                        }, function(){
                            alert("Customer update failed.Please retry.");
                        });
                        } else{
                            alert("error")
                        }
                    }, function(){
                    alert("Failed to update customer.Please try again later..");
                    });
                
            });

        $('#cancelupdate').bind('click',function(){
              window.location.reload();
        });
    }
    });
};
//edit user

mycustomer.validateEmail = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};
mycustomer.validatePhone = function (phone) {
    var re = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
    return re.test(phone);
};
mycustomer.validateName = function (name) {
    var re = /^[a-zA-Z .]+$/;
    return re.test(name);
};
