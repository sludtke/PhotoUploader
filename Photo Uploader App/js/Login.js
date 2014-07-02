var token;
var selectedSite;

function LoginUser(){
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
    var userName = $("#txbUsername").val();
    var passWord = $("#txbPassword").val();
    $.ajax({
               type: "GET",
               url: "https://monoservicetest.trihydro.com/MobileLogin/MobileLoginService.svc/LoginUser",
               data: { userName: userName, password: passWord},
               dataType: "json",
               success: function(data) {
                   if (data.d != null && data.d != -1) {
                       $('#divLogin').hide();
                       $('#divSiteSelection').show();
                       token = data.d;
                   
                       $.ajax({
                                  type:"GET",
                                  url: "http://monoservicetest.trihydro.com/MobilePhoto/PhotoService.svc/GetProjects",
                           	   headers: {'Authentication':token},
                                  data: {userKey:userName},
                                  dataType: "json",
                                  success: function(data) {
                                      var dataList = $("#ddlSites");
                                      dataList.empty();
                                      if (data.d.length) {
                                          for (var i = 0, len = data.d.length; i < len; i++) {
                                              dataList.append("<option value='" + data.d[i].PortalKey + "'>" + data.d[i].PortalName + "</option>");
                                          }
                                      }
                                  },
                                  error: function(data) {
                                      alert(data);
                                  }
                              });
                   } else {
                       $("#txbUsername").val("");
                       $("#txbPassword").val("");
                       $("#divError").text("There was an error logging please try again.");
                   }
               },
               error: function(data) {
                   alert("There was an error with your login, please try again.");
               }
           });
}



function forceNext(){
    $('#divSiteSelection').hide();
    $('#divUploader').show();
}

function ddlSites_OnChange(){
	$('#divSiteSelection').hide();
    $('#divUploader').show();  
    selectedSite = $('#ddlSites').val();
}