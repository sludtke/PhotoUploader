/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


document.addEventListener("deviceready", onDeviceReady, false);
 
function id(element) {
    return document.getElementById(element);
}

function onDeviceReady() {
	cameraApp = new cameraApp();
    document.getElementById("deviceready").Style = "Block";
    cameraApp.run();
}

function cameraApp(){}

cameraApp.prototype={
    _pictureSource: null,
    
    _destinationType: null,
    
    run: function(){
        var that=this;
        that._pictureSource = navigator.camera.PictureSourceType;
        that._destinationType = navigator.camera.DestinationType;
        id("capturePhotoButton").addEventListener("click", function(){
                    that._capturePhoto.apply(that,arguments);
                });
        id("getPhotoFromLibraryButton").addEventListener("click", function(){
                    that._getPhotoFromLibrary.apply(that,arguments)
                });
        id("getPhotoFromAlbumButton").addEventListener("click", function(){
                    that._getPhotoFromAlbum.apply(that,arguments);
                });
        id("btnExit").addEventListener("click", function(){
			that._showConfirm.apply(that,arguments);            
        });
    },
    
    _showConfirm: function() {
        navigator.notification.confirm(
            'Exit Photo Tool?',  // message
             closeApp(),              // callback to invoke with index of button pressed
            'Close App?',            // title
            'Yes,No'          // buttonLabels
        );
        
    	function closeApp(){
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
        navigator.camera.getPicture(function(){
            that._onPhotoDataSuccess.apply(that,arguments);
        },function(){
            that._onFail.apply(that,arguments);
        },{
            quality: 50,
            destinationType: that._destinationType.DATA_URL
        });
    },
    
    _getPhotoFromLibrary: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.PHOTOLIBRARY);
    },
    
    _getPhotoFromAlbum: function() {
        var that= this;
        // On Android devices, pictureSource.PHOTOLIBRARY and
        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
    },
    
    _getPhoto: function(source) {
        var that = this;
        // Retrieve image file location from specified source.
        navigator.camera.getPicture(function(){
            that._onPhotoURISuccess.apply(that,arguments);
        }, function(){
            cameraApp._onFail.apply(that,arguments);
        }, {
            quality: 50,
            destinationType: cameraApp._destinationType.FILE_URI,
            sourceType: source
        });
    },
    
    _onPhotoDataSuccess: function(imageData) {
         var smallImage = document.getElementById('smallImage');
         smallImage.style.display = 'block';
    
         // Show the captured photo.
         smallImage.src = "data:image/jpeg;base64," + imageData;
     	document.getElementById("pOut").innerHTML = "Image Capture Successful";
    },
    
    _onPhotoURISuccess: function(imageURI) {
        var smallImage = document.getElementById('smallImage');
        smallImage.style.display = 'block';
         
        // Show the captured photo.
        smallImage.src = imageURI;
        document.getElementById("pOut").innerHTML = "Image Capture Successful";
    },
    
    _onFail: function(message) {
       alert(message);
    }
}