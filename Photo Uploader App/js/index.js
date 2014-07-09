function onBodyLoad() {       
    document.addEventListener("deviceready", onDeviceReady, false);
}
//functions for a datetime.Now() type call
// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() + "/" + (((this.getMonth() + 1) < 10)?"0":"") + (this.getMonth() + 1) + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() + ":" + ((this.getMinutes() < 10)?"0":"") + this.getMinutes() + ":" + ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

//shortcut code to fetch controls
function id(element) {
    return document.getElementById(element);
}

//detect app enviornment
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }

};

//Notes:
//both = normal application use
//phonegap = method or code chunk used in phonegap uploader
//non-phonegap = method or code chunk used with html file upload (IOS only)
//phonegap loaded function, fire constructor
function onDeviceReady() {
    cameraApp = new cameraApp();
    cameraApp.run();
}

function cameraApp() {
}

cameraApp.prototype = {
    _pictureSource: null,
    _destinationType: null,
    
    run: function() {
        var that = this;
        that._pictureSource = navigator.camera.PictureSourceType;
        that._destinationType = navigator.camera.DestinationType;
        //phonegap
        $('#cameraPhoto').bind("click", function() {
            that._fetchPhoto.apply(that, arguments);
        });
         $('#btnTakeImage').bind("click", function(){
           that._takePhoto.apply(that, arguments);
        });
        $('#btnChoseImage').bind("click", function() {
            that._photoAccepted.apply(that, arguments);            
        });
        $('#btnRedo').bind("click", function() {
            that._cancelCapture.apply(that, arguments);            
        });	        
        $('#btnCancel').bind("click", function() {
            that._cancelCapture.apply(that, arguments);            
        });	        
    },
   
    //phonegap
    _fetchPhoto: function() {
        //fetch from library
        var that = this;
        navigator.camera.getPicture(function() {
            that._onPhotoTaken.apply(that, arguments);
        }, function() {
            cameraApp._onFail.apply(that, arguments);
        }, {
                quality: 40,
                destinationType: navigator.camera.FILE_URI,
                encodingType : navigator.camera.EncodingType.JPEG, 
                sourceType: that._pictureSource.SAVEDPHOTOALBUM
            });
    },
    
     _takePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
          navigator.camera.getPicture(function() {
            that._onPhotoTaken.apply(that, arguments);
        }, function() {
            cameraApp._onFail.apply(that, arguments);
        }, {
                quality: 40,
                destinationType: navigator.camera.FILE_URI,
                encodingType : navigator.camera.EncodingType.JPEG, 
                sourceType: that._pictureSource.CAMERA
            });
    },
    
    _onPhotoTaken: function(source) {
        //var smallImage = ;
        $('#smallImage').css("display", "block");
        $('#smallImage').attr("src", source);
        $('#divSiteSelection').hide();
        $('#divViewPhoto').show();
    },
   
    //both
    _photoAccepted: function() {
        $('#divViewPhoto').hide();
        $('#divUploadPhoto').show();
        $('#dateNow').valueAsDate = new Date().today();
    },
    
    _cancelCapture: function() {
        $('#smallImage').attr("src", "");
        $("#txtDesc").val("");
        $("#selDirection").val('0');
        $("#dateNow").val("");
        $('#divUploadPhoto').hide();
        $('#divViewPhoto').hide();
        $('#divSiteSelection').show();
    },
    
    _onFail
    : function(message) {
        //alert('message');
    }
}

var retries = 0;

function onPhotoDataSuccess(imageData){
    $('#smallImage').show();
    $('#smallImage').attr("src", "data:image/jpeg;base64," + imageData);
    $('#divSiteSelection').hide();
    $('#divViewPhoto').show();
}

function CommenceUpload() {
    var imgStr = $('#smallImage').attr("src");
    var fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1);
    
    if (fileName.indexOf(".jpg") == -1)
        fileName += ".jpg";
    
    var win = function() {
        commitPhotoData(fileName);
    }

    var onFail = function(FileTransferError) {
        if (retries === 0) {
            retries ++
            setTimeout(function() {
                CommenceUpload();
            }, 1000)
        } else {
            alert("An error has occurred: Code = " + FileTransferError.code);
            switch (FileTransferError.code) { 
                case '1': 
                    console.log("Error Type: FILE_NOT_FOUND_ERR"); 
                    break; 
                case '2': 
                    console.log("Error Type: INVALID_URL_ERR"); 
                    break; 
                case '3':
                    console.log("Error Type: CONNECTION_ERR"); 
                    break; 
            } 
            console.log("upload error source " + FileTransferError.source);
            console.log("upload error target " + FileTransferError.target);	
        }
    }
    
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileName;
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    options.headers = {
        Connection: "close"
    }
    
       var params = {};
            params.fullpath = imgStr;
            params.name = options.fileName;
   options.params = params;
    var ft = new FileTransfer();
    ft.upload(imgStr, "http://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx", win, onFail, options, true);
}


function commitPhotoData(fileName) {
    var directionKey = $('#selDirection').val();
    var desc = $('#txtDesc').val()
    var date = $('#dateNow').val();
    var ddlSites = $('#ddlSites').val();
    $.ajax({
               type: "GET",
        	   url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/UploadPhotoInfo",
               headers: {'Authentication':token},
               data: { projectKey: ddlSites, directionKey: directionKey, photographer: "Keith", description: desc, filename: fileName, date: date },
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: function (boolean) {
                   if (boolean.d == true) {//boolean is an obj, .d is the returned bool value
                       alert("Your photo was successfully uploaded!");
                       $('#btnCancel').click(); 
                   } else {
                       alert("Hit Service, Failed to save Server Side.");
                   }
               },
               error: function (xhRequest, ErrorText, thrownError) {
                   $('#btnCancel').click();
                   alert("Failed to send PhotoData. " + ErrorText);
               },
           })
}