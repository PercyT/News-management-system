//点击登录按钮，弹出模块动态框
// $(function () {
//    $("#btn").click(function () {
//       $(".mask-wrapper").show();
//    });
//    $('.close-btn').click(function () {
//        $(".mask-wrapper").hide();
//    });
// });

// $(function () {
//    $(".switch").click(function () {
//       var scrollWrapper = $(".scroll-wrapper");
//       var currentleft = scrollWrapper.css("left");
//       currentleft = parseInt(currentleft);
//       if (currentleft<0){
//           scrollWrapper.animate({"left":'0'});
//       }else{
//           scrollWrapper.animate({"left":"-400px"});
//       }
//    });
// });

function Auth() {
   var self = this;
   self.maskwrapper = $('.mask-wrapper');
}
Auth.prototype.run = function () {
   var self = this;
   self.listenShowEvent();
   self.listenSwitchEvent();
   self.listenSigninEvent();
};
Auth.prototype.showEvent = function(){
   var self = this;
   self.maskwrapper.show();
};
Auth.prototype.hideEvent = function(){
   var self = this;
   self.maskwrapper.hide();
};
Auth.prototype.listenSwitchEvent = function(){
     var switcher = $(".switch");
     switcher.click(function () {
      var scrollWrapper = $(".scroll-wrapper");
      var currentleft = scrollWrapper.css("left");
      currentleft = parseInt(currentleft);
      if (currentleft<0){
          scrollWrapper.animate({"left":'0'});
      }else{
          scrollWrapper.animate({"left":"-400px"});
      }
   });
};
Auth.prototype.listenShowEvent = function(){
   var self = this;
   var signinBtn = $(".signin-btn");
   var signupBtn = $(".signup-btn");
   var closeBtn = $(".close-btn");
   var scrollwrapper = $(".scroll-wrapper");
   signinBtn.click(function () {
      self.showEvent();
      scrollwrapper.css({"left":"0"});
   });
   signupBtn.click(function () {
      self.showEvent();
      scrollwrapper.css({"left":"-400"});
   });
   closeBtn.click(function () {
      self.hideEvent();
   });
};
Auth.prototype.listenSigninEvent = function(){
   var self = this;
   var siginGroup = $(".signin-group");
   var telephoneInput = siginGroup.find("input[name='telephone']");
   var passwordInput = siginGroup.find("input[name='password']");
   var rememberInput = siginGroup.find("input[name='remember']");
   var submitBtn = siginGroup.find(".submit-btn");
   submitBtn.click(function () {
      var telephone = telephoneInput.val();
      var password = passwordInput.val();
      var remember = rememberInput.prop("checked");

      xfzajax.post({
          'url' : "/account/login/",
          'data': {
              'telephone': telephone,
              'password':password,
              'remember':remember?1:0,
          },
          'success': function (result) {
              if(result['code'] === 200){
                  self.hideEvent();
                  window.location.reload();
              }else {
                  var messageObject = result['message'];
                  if(typeof messageObject == 'string'||messageObject.constructor ==String){
                      window.messageBox.show(messageObject);
                  }else {
                      for(var key in messageObject){
                          var messages = messageObject[key];
                          var message = messages[0];
                          window.messageBox.show(message);
                      }

                  }
              }
          },
          'fail': function (error) {
              console.log(error);
          }
      });
   });
};
$(function () {
   var auth = new Auth();
   auth.run();
});