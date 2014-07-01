document.addEventListener("deviceready", onDeviceReady, false);
 
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
        
        id("capturePhotoButton").addEventListener("click", function() {
            that._capturePhoto.apply(that, arguments);
        });
        id("getPhotoFromLibraryButton").addEventListener("click", function() {
            that._getPhotoFromLibrary.apply(that, arguments)
        });
        id("getPhotoFromAlbumButton").addEventListener("click", function() {
            that._getPhotoFromAlbum.apply(that, arguments);
        });
       /* id("btnSettings").addEventListener("click", function() {
            that._showConfirm.apply(that, arguments);            
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
    
    _showConfirm: function() {
        navigator.notification.confirm(
            'Exit Photo Tool?', // message
            closeApp(), // callback to invoke with index of button pressed
            'Close App?', // title
            'Yes,No'          // buttonLabels
            );
        
        function closeApp() {
            if (navigator.app && navigator.app.exitApp) {
                navigator.app.exitApp(); //Android
            } else if (navigator.device && navigator.device.exitApp) {
                navigator.device.exitApp(); //Iphone
            }
        }
    },
   
    _capturePhoto: function() {
        var that = this;
        
        // Take picture using device camera and retrieve image as base64-encoded string.
        navigator.camera.getPicture(function() {
            that._onPhotoTakenSuccess.apply(that, arguments);
        }, function() {
            that._onFail.apply(that, arguments);
        }, {
                                        quality: 50,
                                        destinationType: that._destinationType.FILE_URI
                                    });
    },
    
    _getPhotoFromLibrary: function() {
        var that = this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);
    },
    
    _getPhotoFromAlbum: function() {
        var that = this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function() {
            that._onPhotoFetchedSuccess.apply(that, arguments);
        }, function() {
            cameraApp._onFail.apply(that, arguments);
        }, {
                                        quality: 50,
                                        destinationType: cameraApp._destinationType.FILE_URI,
                                        sourceType: source
                                    });
    },
    
    _onPhotoTakenSuccess: function(imageURI) {
        id('capturePhotoButton').style.display = "none";
        id('getPhotoFromLibraryButton').style.display = "none";
        id('getPhotoFromAlbumButton').style.display = "none";
        id('btnSettings').style.display = "none";
        var smallImage = id('smallImage');
        smallImage.style.display = "block";
        id('btnChoseImage').style.display = "block";
        id('btnRedo').style.display = "block";
        // Show the captured photo.
        smallImage.src = imageURI;
    },
    
    _onPhotoFetchedSuccess: function(imageURI) {
        id('capturePhotoButton').style.display = "none";
        id('getPhotoFromLibraryButton').style.display = "none";
        id('getPhotoFromAlbumButton').style.display = "none";
        id('btnSettings').style.display = "none";
        var smallImage = id('smallImage');
        smallImage.style.display = "block";
        id('btnChoseImage').style.display = "block";
        id('btnRedo').style.display = "block";
        smallImage.style.display = 'block';
         
        // Show the captured photo.
        smallImage.src = imageURI;
    },
    
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
    
     _cancelCapture: function() {
        id('smallImage').style.display = "none";
        id('btnChoseImage').style.display = "none";
        id('dateNow').style.display = "none";
        id('txtDesc').style.display = "none";
        id('selDirection').style.display = "none";
        id('submitImage').style.display = "none";
        id('btnCancel').style.display = "none";
        id('btnRedo').style.display = "none";
        id('capturePhotoButton').style.display = "block";
        id('getPhotoFromLibraryButton').style.display = "block";
        id('getPhotoFromAlbumButton').style.display = "block";
        id('btnSettings').style.display = "block";
    },
    
    _onFail: function(message) {
         setTimeout("alert('message');", 0);
    }
}

function UploadData() {
    var smallImage = id('smallImage');
    //var opts = { img: 'Images/ajax-loader.gif', hide: true, height: 48, width: 48, position: 'center' };
    var imgStr = smallImage.src.toString();

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1);
    options.mimeType = "image/jpeg";
    fileName = imgStr.substring(imgStr.lastIndexOf("/") + 1) + ".jpg";
    var ft = new FileTransfer();
    ft.upload(imgStr, "http://monoservicetest.trihydro.com/MobilePhoto/PhotoUpload.aspx", win, onFail, options);
}

function win(r) {
    var directionKey = document.getElementById('selDirection').value;
    var desc = document.getElementById('description').value;
    var date = document.getElementById("datePicker").value;

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

function onFail(message) {
    alert(message);
}
