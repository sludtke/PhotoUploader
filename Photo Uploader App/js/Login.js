var token;


function LoginUser(){
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
    alert("beforeusername");
    var userName = $("#txbUsername").val();
    var passWord = $("#txbPassword").val();
    alert(userName + ", " + passWord);
    $.ajax({
       type: "GET",
       url: "https://monoservicetest.trihydro.com/MobileLogin/MobileLoginService.svc/LoginUser",
       data: { userName: userName, password: passWord},
       dataType: "json",
       success: function(data){
           alert("on success");
           $('#divLogin').hide();
		   $('#divSiteSelection').show();
           if(data.d != null && data.d != -1){
               token = data.d;
               if(document.createElement("datalist").options) {
 
        		$("#ddlSites").on("input", function(e) {
        			var val = $(this).val();
        			if(val === "") return;
        			//You could use this to limit results
        			//if(val.length < 3) return; 
        			console.log(val);
        			$.ajax({
                    	type:"GET",
                        url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/GetProjects",
                        data: {userKey:userName},
                        dataType: "json",
                        success: function(data){
                            var dataList = $("#searchResults");
                            dataList.empty();
                            if(data.d.length){
                                var options = '';
                                for(var i = 0, len = data.d.length; i<len; i++){
                                    options += '<option value="'+data.d[i].PortalName+'" />';
                                    dataList.innerHtml = options;
                                    //var opt = $("<option></option>").attr("value", data.d[i].PortalName);
                                    //dataList.append(opt);
                                }
                            }
                        }
                    });
                    
        		});
         
        	}
           }
           else{
               $("#txbUsername").val("");
               $("#txbPassword").val("");
               $("#divError").text("There was an error logging please try again.");
           }
               
       },
       error: function(data){
           alert("There was an error with your login, please try again.");
       }
    });
}



function forceNext(){
    $('#divSiteSelection').hide();
    $('#divUploader').show();
}