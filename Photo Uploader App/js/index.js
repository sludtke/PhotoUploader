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

//cordova loaded function, fire constructor
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
        
        id("cameraPhoto").addEventListener("change", function() {
            that._onPhotoTaken.apply(that, arguments);
        });
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
   
    _onPhotoTaken: function(event) {
        if (event.target.files.length === 1 &&
            event.target.files[0].type.indexOf("image/") === 0) {
            var smallImage = id('smallImage');
            //show selected photo
            smallImage.style.display = "block";
            smallImage.src = URL.createObjectURL(event.target.files[0]);
            $('#divSiteSelection').hide();
            id('btnChoseImage').style.display = "block";
            id('btnRedo').style.display = "block";
        }
    },
   
    _photoAccepted
    : function() {
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
    
    _cancelCapture
    : function() {
        id('smallImage').style.display = "none";
        id('btnChoseImage').style.display = "none";
        id('dateNow').style.display = "none";
        id('txtDesc').style.display = "none";
        id('selDirection').style.display = "none";
        id('submitImage').style.display = "none";
        id('btnCancel').style.display = "none";
        id('btnRedo').style.display = "none";
         $('#divSiteSelection').show();
        /*id('lblCamera').style.display = "block";
        id('lblStorage').style.display = "block";*/
    },
    
    _onFail
    : function(message) {
        // setTimeout("alert('message');", 0);
    }
}

function CommenceUpload() {
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
        commitPhotoData(file.fileName);
    }, false);
    xhr.open('POST', 'http://10.10.11.89/JsonMobilePhoto/PhotoUpload.aspx', true);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("X-File-Name", file.fileName);
    xhr.setRequestHeader("X-File-Size", file.fileSize);
    xhr.setRequestHeader("X-File-Type", file.type);
    xhr.send(file);
}

function commitPhotoData(fileName) {
    var directionKey = document.getElementById('selDirection').value;
    var desc = document.getElementById('txtDesc').value;
    var date = $('#dateNow').val();
    var ddlSites = $('#ddlSites').val();
    //"http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/UploadPhoto",
    $.ajax({
               type: "GET",
               url: "http://localhost/JsonMobilePhoto/PhotoService.svc/UploadPhotoInfo",
               data: { projectKey: ddlSites, directionKey: directionKey, photographer: "Keith", description: desc, filename: fileName, token: token, date: date },
               contentType: "application/json; charset=utf-8",
               dataType: "json",
               success: function () {
                   alert("Your photo was successfully uploaded!");
                   document.getElementById('smallImage').src = "";
                   var desc = $("#txtDesc");
                   desc.val("");
                   var sel = $("#selDirection");
                   sel.val('0');
                   var date = $("#dateNow"); 
                   date.val("");
                   $('#btnCancel').click();                 
               },
               error: function () {
                   $('#btnCancel').click();
                   alert("there was an error");
               },
           })
}
/*var retries = 0;
function UploadData() {
var smallImage = id('smallImage');
var imgStr = smallImage.src.toString();
	
var win = function(r) {
var directionKey = document.getElementById('selDirection').value;
var desc = document.getElementById('description').value;
var date = document.getElementById("dateNow").value;
retries = 0;
$.ajax({
type: "GET",
url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/UploadPhoto",
data: { projectKey: 0, directionKey: directionKey, photographer: "", description: desc, filename: fileName, token: token, date: date },
contentType: "application/json; charset=utf-8",
dataType: "json",
success: function () {
alert("Your photo was successfully uploaded!");
document.getElementById('smallImage').src = "";
var desc = $("#txtDesc");
desc.val("");
desc.style.display = "none";
var sel = ("#selDirection");
sel.val("0");
var date = $("#dateNow"); 
date.val("");
date.style.display = "none";
            
document.getElementById('capturePhotoButton').style.display = "block";
document.getElementById('getPhotoFromLibraryButton').style.display = "block";
document.getElementById('getPhotoFromAlbumButton').style.display = "block";
document.getElementById('btnSettings').style.display = "block";
},
error: function () {
alert("there was an error");
},
})
}

var onFail = function(FileTransferError) {
if (retries === 0) {
retries ++
setTimeout(function() {
UploadData();
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
options.fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1);
options.mimeType = "image/jpeg";
options.chunkedMode = false;
options.headers = {
}
fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1) + ".jpg";
var ft = new FileTransfer();
ft.upload(imgStr, "https://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx/", win, onFail, options, true);
//http://localhost/JsonMobilePhoto/PhotoUpload.aspx
}
*/