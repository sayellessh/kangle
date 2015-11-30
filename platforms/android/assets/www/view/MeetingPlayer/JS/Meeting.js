var meeting = {
selectedFiles: new Array(),
tempSelectedFiles: new Array(),
prevUploadedFiles: new Array(),
bEnableCreate: false,
bIsFileAvailable: false,
isPrevFiles: false,
allMeetings: new Array(),
init: function () {
    console.log('init');
    //meeting.selectFiles();
    meeting.formRadio(meeting.onRadioSelect);
    meeting.getAllMeetings($('#meeting-list'), true);
    meeting.updateMeeting();
    meeting.fileUploadChange();
    meeting.refreshList();
    //get meeting id and load slides
},
selectFiles: function () {
    console.log('meeting selected files');
    console.log(meeting.selectedFiles);
    /*if (meeting.selectedFiles && meeting.selectedFiles.length > 0) {
     alert(1);
     meeting.showCreate(true);
     }*/
},
uploadCheck: function() {
    $('input[type="file"]').unbind('click').bind('click', function () {
                                                 /*if (meeting.bIsFileAvailable == true) {
                                                  alert('Please wait until the old file process completed');
                                                  return false;
                                                  }*/
                                                 if (meeting.prevUploadedFiles && meeting.prevUploadedFiles.length > 0) {
                                                 meeting.isPrevFiles = true;
                                                 var cAct = window.confirm('A presentation already exists. Are you sure you want to continue');
                                                 if (cAct == false) {
                                                 return false;
                                                 }
                                                 } else {
                                                 meeting.isPrevFiles = false;
                                                 }
                                                 });
},
loadDefaults: function () {
    var url = window.location.href;
    if (url.lastIndexOf('?') > -1) {
        url = url.substr(url.lastIndexOf('?') + 1, url.length);
        url = url.replace('meetingId=', '');
        $('select#meeting-list').val(url);
    } else {
        url = $('select#meeting-list').val();
    }
    meeting.getMeetingMaterial(url);
},
    getMeetingMaterial: function (url) {
        Services.checkMeetingMaterial(url, function (status) {
            if (status && status.length > 0) {
                var processStatus = status[0];
                var fileName = '';
                if (processStatus.Is_Processed == 0) {
                    fileName = processStatus.File_Url.split('/');
                    fileName = fileName[fileName.length - 1];
                    $('.form-row.upload-file').show();
                    $('.file_name').html(fileName);
                    $('#show-files').show();
                } else if (processStatus.Is_Processed == 1) {
                    Services.refreshMeetingMaterial(url, function (data) {
                        fileName = processStatus.File_Url.split('/');
                        fileName = fileName[fileName.length - 1];
                        meeting.selectedFiles = new Array();
                        meeting.prevUploadedFiles = data;
                        meeting.uploadCheck();
                        meeting.addFiles(data);
                        $('.form-row.upload-file').show();
                        $('.file_name').html(fileName);
                        var el = $('.form-grid .form-grid-hdr .col-chk input');
                        el.trigger('click');
                    }, function () { });
                } else if (processStatus.Is_Processed == 2) {
                    $('.form-row.upload-file').hide();
                    $('#show-files').hide();
                }
            }
        }, function (e) { });
},
onRadioSelect: function (el) {
    if (el.attr('name') == 'material') {
        if (el.val() == 'E') {
            $('#form-upload').hide();
            $('#form-files').show();
            $('.form-grid-hdr .input-check').removeAttr('checked');
            meeting.selectedFiles = new Array();
            meeting.showSlidesMeetingList();
        } else {
            $('#form-upload').show();
            $('#form-files').hide();
            $('#form-files select').remove();
            $('.form-grid-hdr .input-check').removeAttr('checked');
            meeting.selectedFiles = new Array();
            meeting.uploadCheck();
        }
        meeting.formFiles();
    }
},
showSlidesMeetingList: function () {
    var el = $('#form-files .form-control');
    var selEl = $('<select></select>').attr('name', 'meeting-slides').attr('id', 'meeting-slides');
    meeting.getAllMeetings(selEl);
    el.html(selEl);
    meeting.selectMeetingForFiles();
},
onCheckSelect: function (el) {
    var grid = el.parents('.form-grid').eq(0),
    checkEl = $('.form-grid-row .col-chk input', grid);
    if (el.attr('name') == 'all-slides') {
        if (el.get(0).checked) {
            checkEl.each(function () {
                         $(this).get(0).checked = true;
                         meeting.addSelectedFiles(true, $(this));
                         });
        } else {
            checkEl.each(function () {
                         $(this).get(0).checked = false;
                         meeting.addSelectedFiles(false, $(this));
                         });
        }
    }
    if (el.attr('name') == 'slide[]') {
        if (el.get(0).checked) {
            meeting.addSelectedFiles(true, el);
            /** count **/
            var count = checkEl.size();
            var checkCount = $('.form-grid-row .col-chk input:checked', grid).size();
            if (count == checkCount) {
                $('input[name="all-slides"]', grid).get(0).checked = true;
            }
        } else {
            meeting.addSelectedFiles(false, el);
            $('input[name="all-slides"]', grid).get(0).checked = false;
        }
    }
    meeting.formFiles();
},
addSelectedFiles: function (bAdd, el) {
    if (bAdd) {
        if (!meeting.checkFileIsAlreadyExist(el)) {
            var pEl = $(el).parents('.form-grid-row').eq(0);
            var name = $('.col-name', pEl).text();
            
            var obj = { value: el.val(), name: name };
            meeting.selectedFiles.push(obj);
        }
    } else {
        if (meeting.selectedFiles && meeting.selectedFiles.length > 0) {
            for (var i = 0; i < meeting.selectedFiles.length; i++) {
                var curFile = meeting.selectedFiles[i];
                if (curFile.value == el.val()) {
                    meeting.selectedFiles.splice(i, 1);
                }
            }
        }
    }
},
formFiles: function () {
    var inp = '', row = '';
    var meetingId = $('#meeting-list').val();
    if (meeting.selectedFiles && meeting.selectedFiles.length > 0) {
        for (var i = 0; i < meeting.selectedFiles.length; i++) {
            var meet = meeting.selectedFiles[i];
            inp += '<input class="hidden-inp" type="hidden" name="files-selected" value="' + meet.value + '"/>';
            row += '<div class="form-grid-row"><div class="col col-name">' + meet.name + '</div></div>';
        }
        var cMeet = meeting.getMeetingById(meetingId);
        if (cMeet !== null && cMeet.Current_Status == true) {
            meeting.showCreate(true);
        }
    } else {
        row += '<div class="form-grid-row"><div class="col col-name">Please choose one or more slides for presentation</div></div>';
        meeting.showCreate(false);
    }
    
    
    $('#slides-chosen .form-grid-row').remove();
    $('#slides-chosen .hidden-inp').remove();
    $('#slides-chosen').append(row);
    $('#slides-chosen').append(inp);
},
checkFileIsAlreadyExist: function (el) {
    var isExist = false, index = 0;
    if (meeting.selectedFiles && meeting.selectedFiles.length > 0) {
        for (var i = 0; i < meeting.selectedFiles.length; i++) {
            var curFile = meeting.selectedFiles[i];
            if (curFile.value == el.val()) {
                isExist = true;
            }
        }
    }
    return isExist;
},
formRadio: function (callback) {
    $('.form-radio input').bind('change', function () {
                                if (callback)
                                callback($(this));
                                });
},
formCheck: function (callback) {
    $('.input-check').bind('change', function () {
                           if (callback)
                           callback($(this));
                           });
},
getAllMeetings: function (selEl, bFirst) {
    console.log('init getmoder');
        Services.getAllMeetings(common.defaults.userId, function (data) {
                                  console.log('init data');
            /*if (data && data.length > 0) {
                var newData = new Array();
                for (var i = 0; i < data.length; i++) {
                    var meets = data[i];
                    if (meets.Meeting_Status < 2) {
                        newData.push(meets);
                    }
                }
                data = newData;
            }*/
                                  if (data && data.length == 0) {
                                  $('.meeting-form').remove();
                                  $('#no-meet').show();
                                  return false;
                                  }
                                  console.log('init data after');
                                  meeting.allMeetings = data;
                                  var canDoMeeting = meeting.createSelect(data, selEl);
                                  if (canDoMeeting == 0) {
                                  $('#no-meet').show();
                                  return false;
                                  }
                                  
                                  if (bFirst)
                                  meeting.loadDefaults();
                                  
                                  $('#meeting-list').unbind('change').bind('change', function () {
                common.showLoader();
                var mEl = $(this);
                meeting.checkMeetingIsInTime(mEl.val(), function () {
                    meeting.getMeetingMaterial(mEl.val());
                });
                                                                           return false;
                                                                           });
                                  }, function (err) {
                                  console.log(err);
                                  });
},
createSelect: function (data, selEl) {
    var canDoMeeting = 0;
    if (data && data.length > 0) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            var meeting = data[i];
            if (meeting.Meeting_Status == 0 || meeting.Meeting_Status == 1) {
                html += '<option value="' + meeting.Meeting_Id + '">' + meeting.Meeting_Name + '</option>';
                canDoMeeting++;
            }
        }
    }
    
    if (canDoMeeting > 0) {
        $('.meeting-form').show();
        selEl.html(html);
        return 1;
    } else
        return 0;
},
addFiles: function (files) {
    var html = '';
    $('#select-slides .form-grid-row').remove();
    if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            html += '<div class="form-grid-row"><div class="col col-chk"><input type="checkbox" class="input-check" ' +
            'name="slide[]" value="' + file.Material_List_Id + '#' + file.Meeting_Id + '#' + file.Material_Id + '"/></div><div class="col col-name">' + file.Material_Name +
            '</div></div>';
        }
    } else {
        html = '<div class="form-grid-row"><div class="col col-chk"></div>No slides found</div>';
    }
    $('#select-slides').append(html);
    meeting.formCheck(meeting.onCheckSelect);
},
getUploadedFiles: function () {
    Services.getUploadedSlides(function (data) {
                               //console.log(data);
                               meeting.addFiles(data);
                               }, function (err) {
                               console.log(err);
                               });
},
selectMeetingForFiles: function () {
    $('#meeting-slides').unbind('change').bind('change', function () {
                                               var val = $(this).val();
                                               $('.form-grid-hdr .input-check').removeAttr('checked');
                                               Services.getActualMeetingMaterial(val, function (data) {
                                                                                 meeting.selectedFiles = new Array();
                                                                                 meeting.prevUploadedFiles = data;
                                                                                 console.log(meeting.prevUploadedFiles);
                                                                                 meeting.addFiles(data);
                                                                                 }, function (err) { });
                                               });
},
fileUploadChange: function () {
    $("#upload-btn").hide();
    $("#show-files").hide();
    $('#loader').hide();
    $('#form-upload input').bind('change', function () {
                                 if (meeting.isPrevFiles) {
                                 $('#upload-btn').addClass('prev-file').val('Overwrite presentation');
                                 } else {
                                 $('#upload-btn').removeClass('prev-file').val('Upload Files');
                                 }
                                 $("#upload-btn").show();
                                 });
    meeting.uploadFile();
},
    
uploadFile: function () {
    $('#upload-btn').bind('click', function () {
                          if ($(this).hasClass('prev-file')) {
                          var cVal = window.confirm('There is a presentation already uploaded. Would you like overwrite? The earlier uploaded presentation will not be available');
                          if (cVal == false)
                          return false;
                          }
                          meeting.bIsFileAvailable = true;
                          $('#show-files').show();
                          var cAction = window.confirm('Are you sure you want to upload the material. ' +
                                                       'The material might take few minutes to upload and get processed. ' +
                                                       'Click the Refresh now to see the status of the uploaded material');
                          
                          if (cAction === false) {
                          //common.hideLoader();
                          return false;
                          }
                          
                          common.showLoader();
                          var file = $('#form-upload input')[0].files[0], ext = common.getFileExtension(file.name);
                          if (ext == 'pptx' || ext == 'ppt' || ext == 'pdf') {
                          Services.getProcessUrl(ext, function (processUrl) {
                                                 if (processUrl) {
                                                 var url = CoreREST._addContext(CoreREST._defaultServer, ['FileUpload', 'ChunkFileUploadMeetingMaterial']);
                                                 var options = {
                                                 type: 'post',
                                                 url: url,
                                                 dataType: 'json',
                                                 contentType: 'multipart/form-data',
                                                 data: $('form.meeting-form').fieldSerialize(),
                                                 crossDomain: true,
                                                 processData: false,
                                                 beforeSubmit: function (formData, jqForm, options) {
                                                 console.log(options);
                                                 },
                                                 success: function (data, statusText, xhr, $form) {
                                                 if (xhr.status == 200) {
                                                 //console.log(xhr);
                                                 common.hideLoader();
                                                 var data = $.parseJSON(xhr.responseText);
                                                 meeting.uploadCloud(processUrl, data.url, file.name);
                                                 $('#show-files').show();
                                                 }
                                                 },
                                                 error: function (response, status, err) {
                                                 console.log(response);
                                                 console.log(status);
                                                 }
                                                 };
                                                 $('form.meeting-form').ajaxSubmit(options);
                                                 }
                                                 });
                          } else {
                          alert('Please upload files of type pptx, ppt, pdf');
                          common.hideLoader();
                          return false;
                          }
                          });
},
resetControls: function () {
    $('#show-files').hide();
},
uploadCloud: function (processUrl, blobUrl, fileName) {
    var data = {
    input: "download",
    file: blobUrl,
    filename: fileName,
    outputformat: common.defaults.outputFormat
    };
    
    $.ajax({
           url: processUrl,
           data: data,
           type: 'POST',
           success: function (data) {
           console.log(data);
           },
           error: function (a) {
           console.log(a);
           }
           
           });
    
    //meetingId, processUrl, fileUrl
    var materialObj = {
    meetingId: $('#meeting-list').val(),
    processUrl: processUrl,
    fileUrl: blobUrl
    };
    
    Services.insertMeetingMaterial(materialObj, function (data) {
                                   meeting.selectedFiles = new Array();
                                   meeting.formFiles();
                                   }, function () { });
},
    
    //Update Meetings
updateMeeting: function () {
    $('.meeting-form .row-submit input').unbind('click').bind('click', function () {
                                                              if (meeting.selectedFiles.length == 0) {
                                                              alert('Please select atleast 1 file for this meeting');
                                                              return false;
                                                              }
                                                              var meetingId = $('#meeting-list').val(), meetingObj = new Array();
                                                              for (var i = 0; i < meeting.selectedFiles.length; i++) {
                                                              var curMeeting = meeting.selectedFiles[i].value;
                                                              var matAry = curMeeting.split('#');
                                                              var slideId = matAry[0], fromMeetingId = matAry[1], materialId = matAry[2];
                                                              
                                                              meetingObj.push({
                                                                              "Material_List_Id": slideId, "Meeting_Id": meetingId, "Material_Id": materialId,
                                                                              "From_Meeting_Id": fromMeetingId
                                                                              });
                                                              }
                                                              
                                                              Services.insertActualMeetingMaterial(meetingObj, function (data) {
                                                                                                   if (data && data >= 1) {
                                                                                                   Services.startMeeting(meetingId, function (data) {
                                                                                                                         window.location.href = 'MeetingPlayer.html?userId=' + common.defaults.userId + '&meetingId=' + meetingId;
                                                                                                                         });
                                                                                                   } else {
                                                                                                   alert('Error in updating files to this meeting');
                                                                                                   }
                                                                                                   }, function () { });
                                                              return false;
                                                              });
},
refreshList: function () {
    $('#show-files').unbind('click').bind('click', function () {
                                          meeting.refreshMeetingList();
                                          return false;
                                          });
},
refreshMeetingList: function () {
    Services.refreshMeetingMaterial($('#meeting-list').val(), function (data) {
                                    if (data && data.length > 0) {
                                    $('#show-files').hide(); 
                                    //meeting.showCreate(true);
                                    meeting.bIsFileAvailable = false;
                                    meeting.prevUploadedFiles = data;
                                    console.log(meeting.prevUploadedFiles);
                                    meeting.addFiles(data);
                                    } else {
                                    //meeting.bEnableCreate = true;
                                    $('#show-files').hide();
                                    $('#process-msg').show();
                                    setTimeout(function () {
                                               $('#process-msg').hide();
                                               $('#show-files').show();
                                               }, 3000);
                                    }
                                    }, function () { });
},
showCreate: function (bShow) {
    if (bShow) {
        $('input.create-meeting').removeAttr('disabled');
        $('input.create-meeting').removeClass('disabled');
    } else {
        $('input.create-meeting').attr('disabled', 'true');
        $('input.create-meeting').addClass('disabled');
    }
},
getMeetingById: function (val) {
    if (meeting.allMeetings && meeting.allMeetings.length > 0) {
        for (var i = 0; i < meeting.allMeetings.length; i++) {
            var curMeeting = meeting.allMeetings[i];
            if (val == curMeeting.Meeting_Id) {
                return curMeeting;
            }
        }
    }
    return null;
},
    checkMeetingIsInTime: function (meetingId, success) {
        Services.checkMeetingTime(meetingId, function (data) {
            common.hideLoader();
            if (data == 0) {
                alert('Cannot upload files to this meeting. The current Meeting time exceeds the end date time');
                $('select#meeting-list').val('');
                return false;
            } else {
                if (success) success();
            }
        }, function () {
            common.hideLoader();
        });
}
};