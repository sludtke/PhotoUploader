//document.addEventListener("deviceready", onDeviceReady, false);
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
        id("cameraPhoto").addEventListener("click", function() {
            that._takePhoto.apply(that, arguments);
        });
        //non-phonegap
        /* id("cameraPhoto").addEventListener("change", function() {
        that._onPhotoTaken.apply(that, arguments);
        });*/
        id("btnChoseImage").addEventListener("click", function() {
            that._photoAccepted.apply(that, arguments);            
        });
        id("btnRedo").addEventListener("click", function() {
            that._cancelCapture.apply(that, arguments);            
        });	        
        id("btnCancel").addEventListener("click", function() {
            that._cancelCapture.apply(that, arguments);            
        });	        
    },
   
    //phonegap
    _takePhoto: function() {
        //fetch from library
        var that = this;
        navigator.camera.getPicture(function() {
            that._onPhotoTaken.apply(that, arguments);
        }, function() {
            cameraApp._onFail.apply(that, arguments);
        }, {
                                        quality: 40,
                                        destinationType: navigator.camera.FILE_URI,//cameraApp._destinationType.FILE_URI,
                                        encodingType : navigator.camera.EncodingType.JPEG, 
                                        targetWidth: 500,
                                        targetHeight: 500,
                                        saveToPhotoAlbum: 1,
                                        sourceType: that._pictureSource.SAVEDPHOTOALBUM
                                    });
    },
    
    _onPhotoTaken: function(source) {
        //nonphonegap
        /* if (source.target.files.length === 1 &&
        source.target.files[0].type.indexOf("image/") === 0) {*/
        //used by both
        var smallImage = id('smallImage');
        smallImage.style.display = "block";
        smallImage.src = source; //URL.createObjectURL(source.target.files[0]); //non-phonegap source
        $('#divSiteSelection').hide();
        id('btnChoseImage').style.display = "block";
        id('btnRedo').style.display = "block";
        //}
    },
   
    //both
    _photoAccepted: function() {
        id('smallImage').style.display = "none";
        id('btnChoseImage').style.display = "none";
        id('btnRedo').style.display = "none";
        id('dateNow').style.display = "block";
        id('dateNow').valueAsDate = new Date().today();
        id('txtDesc').style.display = "block";
        id('selDirection').style.display = "block";
        id('submitImage').style.display = "block";
        id('btnCancel').style.display = "block";
    },
    
    //both
    _cancelCapture: function() {
        document.getElementById('smallImage').src = "";
        var desc = $("#txtDesc");
        desc.val("");
        var sel = $("#selDirection");
        sel.val('0');
        var date = $("#dateNow"); 
        date.val("");
        id('smallImage').style.display = "none";
        id('btnChoseImage').style.display = "none";
        id('dateNow').style.display = "none";
        id('txtDesc').style.display = "none";
        id('selDirection').style.display = "none";
        id('submitImage').style.display = "none";
        id('btnCancel').style.display = "none";
        id('btnRedo').style.display = "none";
        $('#divSiteSelection').show();
    },
    
    _onFail
    : function(message) {
        //alert('message');
    }
}

//non-phonegap
/*function CommenceUpload() {
var files = id('cameraPhoto').files
if (typeof files !== "undefined") {
for (var i = 0, l = files.length; i < l; i++) {
UploadFile(files[i]);
}
}
}

function UploadFile(file) {
var xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {//Image is on other side, may not be correkt
commitPhotoData(fileName);
}, false);
var fileName = file.name;
xhr.open('POST', 'http://10.10.11.81/JsonMobilePhoto/PhotoUpload.aspx', true);
//xhr.open('POST', 'http://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx', true);
xhr.setRequestHeader("Content-Type", "multipart/form-data");
xhr.setRequestHeader("X-File-Name", file.name);
xhr.setRequestHeader("X-File-Size", file.size);
xhr.setRequestHeader("X-File-Type", file.type);
xhr.send(file);
}*/

//phonegap
var retries = 0;

function CommenceUpload() {
    var smallImage = id('smallImage');
    var imgStr = smallImage.src.toString();
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
    //ft.upload(imgStr, encodeURI("http://10.10.11.81/JsonMobilePhoto/PhotoUpload.aspx"), win, onFail, options, true);
    ft.upload(imgStr, "http://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx", win, onFail, options, true);
}

//both
function commitPhotoData(fileName) {
    var directionKey = document.getElementById('selDirection').value;
    var desc = document.getElementById('txtDesc').value;
    var date = $('#dateNow').val();
    var ddlSites = $('#ddlSites').val();
    $.ajax({
               type: "GET",
        	   url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/UploadPhoto",
               //url: "http://10.10.11.81/JsonMobilePhoto/PhotoService.svc/UploadPhotoInfo",
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
               error: function () {
                   $('#btnCancel').click();
                   alert("Failed to send PhotoData.");
               },
           })
}