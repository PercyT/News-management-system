//用来处理导航条
function FrontBase() {

}
FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $('.auth-box');
    var userMoreBox = $('.user-more-box');
    authBox.hover(function () {
        userMoreBox.show();
    },function () {
        userMoreBox.hide();
    });

};
FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBoxHover();
};
$(function () {
    var frontbase = new FrontBase();
    frontbase.run();
});

//用来处理登录和注册
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
   self.listenImgCaptcha();
   self.listenSmsCaptcha();
   self.listenSignupEvent();
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
      scrollwrapper.css({"left":"-400px"});
   });
   closeBtn.click(function () {
      self.hideEvent();
   });
};
Auth.prototype.listenImgCaptcha = function(){
    var imgCaptcha = $('.img_captcha');
    imgCaptcha.click(function () {
       imgCaptcha.attr("src","/account/img_captcha/"+"?random="+Math.random())
    });
};

Auth.prototype.listenSmsCaptcha = function(){
    var self = this;
    var smsCaptcha = $(".sms-captcha-btn");
    var telephoneInput = $(".signup-group input[name='telephone']");
    smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if(!telephone){
            messageBox.showInfo('请输入手机号码！');
        }else {
            xfzajax.get({
            'url':'/account/sms_captcha/',
            'data':{
                'telephone': telephone,
            },
            'success': function (result) {
                if(result['code'] === 200){
                    messageBox.showSuccess('短信验证码发送成功');
                    smsCaptcha.addClass('disabled');
                    var count = 60;
                    smsCaptcha.unbind('click');
                    var timer = setInterval(function () {
                        smsCaptcha.text(count+'s');
                        count = count-1;
                        if(count<=0){
                            clearInterval(timer); //清除计时器
                            smsCaptcha.removeClass('disabled');
                            smsCaptcha.text('发送验证码');
                            self.listenSmsCaptcha();
                        }
                    },1000);   //一千毫秒执行一次函数，也就是一秒
                }
            },
            'fail':function () {

            }
        });
        }
    });
};
Auth.prototype.listenSignupEvent = function(){
    var self = this;
    var sigupGroup = $(".signup-group");
    var submitBtn = sigupGroup.find('.submit-btn');
    submitBtn.click(function () {
        var telephoneInput = sigupGroup.find("input[name='telephone']");
        var usernameInput = sigupGroup.find("input[name='username']");
        var imgCaptchaInput = sigupGroup.find("input[name='img_captcha']");
        var password1Input = sigupGroup.find("input[name='password1']");
        var password2Input = sigupGroup.find("input[name='password2']");
        var smsCaptchaInput = sigupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var imgCaptcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var smsCaptcha = smsCaptchaInput.val();

        xfzajax.post({
           'url':'/account/register/',
            'data':{
               'telephone':telephone,
                'username':username,
                'img_captcha':imgCaptcha,
                'password1':password1,
                'password2':password2,
                'sms_captcha':smsCaptcha,
            },
            'success':function (result) {
                self.hideEvent();
                window.location.reload();
            },
        });
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
              self.hideEvent();
              window.location.reload();
          }
      });
   });
};
$(function () {
   var auth = new Auth();
   auth.run();
});

