function Banner() {
    this.bannergroup = $("#banner-group");
    this.index = 1;  //当前的下标值+
    this.left_arrow = $(".left-arrow");
    this.right_arrow = $(".right-arrow");
    this.bannerul = $("#banner-ul");
    this.lilist = this.bannerul.children('li');
    this.bannercount = this.lilist.length;  //获取li标签个数得到轮播图个数
    this.pagecontrol = $(".page-control");
}
Banner.prototype.initBanner = function(){
    self = this;
    var firstBanner = self.lilist.eq(0).clone();  //clone方法就是复制一份
    var lastBanner = self.lilist.eq(self.bannercount-1).clone();
    self.bannerul.append(firstBanner);
    self.bannerul.prepend(lastBanner);   //在头部增加
    self.bannerul.css({"width":(self.bannercount+2)*798,"left":-798});
};
Banner.prototype.initPageControl=function(){
    var self = this;
    for(var i=0;i<self.bannercount;i++){
        var circle = $("<li></li>"); //添加一个li标签
        self.pagecontrol.append(circle);
        if(i===0){
            circle.addClass("active");
        }
    }
    self.pagecontrol.css({"width":(self.bannercount-1)*16+8*2+self.bannercount*12})
};
Banner.prototype.togglenarrow=function(isshow){
  if(isshow){
      this.left_arrow.show();
      this.right_arrow.show();
  }else {
      this.left_arrow.hide();
      this.right_arrow.hide();
  }
};
Banner.prototype.listenArrowClick=function(){
    var self = this;
    self.left_arrow.click(function () {
        if(self.index===0){
            self.bannerul.css({"left":-798*self.bannercount});
            self.index = self.bannercount-1;
        }else{
            self.index--;

        }
        self.animate();
    });
    self.right_arrow.click(function () {
        if(self.index===self.bannercount+1){
            self.bannerul.css({"left":-798});
            self.index = 2;
        }else{
            self.index++;
        }
        self.animate();
    });
};
Banner.prototype.loop = function(){
    var bannerul = $("#banner-ul");
    var self = this;
    //定时器
    this.time = setInterval(function () {
        if(self.index >= self.bannercount+1){
            self.bannerul.css({"left":-798});
            self.index = 2;
        }else{
            self.index++;
        }
        self.animate();
    },2000);
};
Banner.prototype.animate = function(){
     var self = this;
     self.bannerul.stop().animate({"left":-798*(self.index)},500);
     var index = self.index;
     if(index===0){
         index = self.bannercount-1;
     }else if(index===self.bannercount+1){
         index = 0;
     }else{
         index = index-1;
     }
     self.pagecontrol.children("li").eq(index).addClass("active").siblings().removeClass('active');  //sibings找到所有的兄弟节点删去active样式
};   //eq函数获取self.index表示当前是哪一个轮播图
Banner.prototype.listenBannerHover= function(){
    var self=this;
    this.bannergroup.hover(function () {
      //当鼠标在轮播图上面会执行的操作
      clearInterval(self.time); //停止计时器
        self.togglenarrow(true);
    },function () {
        self.loop();  //继续进行轮播图
        self.togglenarrow(false);
    });
};
Banner.prototype.listenPageControl=function(){
    var self = this;
    self.pagecontrol.children("li").each(function (index,obj) {    //each函数遍历li了所有的li标签，obj代表当前的li标签，index代表下标
        $(obj).click(function () {  //因为obj是js对象，用$(obj)变成jq对象，调用click方法
            self.index = index+1;
            self.animate();
        });
    });
};
Banner.prototype.run = function () {
    this.loop();
    this.listenArrowClick();
    this.initPageControl();
    this.initBanner();
    this.listenBannerHover();
    this.listenPageControl();
};

function Index(){
    var self = this;
    self.page = 2;
    self.category_id = 0;
    template.defaults.imports.dateFormat = function (dataValue) {
        var date = new Date(dataValue);
        var datets = date.getTime(); //获取的是毫秒的
        var time =new Date();
        var nows = time.getTime(); //获取当前的时间戳
        var timestamp = (nows-datets)/1000; //除以1000得到秒
        if (timestamp < 60){
              return '刚刚';
        }
        else if (timestamp >= 60 && timestamp < 60*60){
            minutes = parseInt(timestamp/60);
            return minutes+'分钟前';
        }
        else if(timestamp >= 60*60 && timestamp < 60*60*24){
            hours = parseInt(timestamp/60/60);
            return hours+'小时前';
        }
        else if(timestamp >= 60*60*24 && timestamp < 60*60*24*30){
            days = parseInt(timestamp/60/60/24);
            return days+'天前';
        }
        else{
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDay();
            var hour = date.getHours();
            var minute = date.getMinutes();
            return year+'/'+month+'/'+day+" "+hour+":"+minute;
        }
    }
}
Index.prototype.run = function(){
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};
Index.prototype.listenCategorySwitchEvent = function(){
    var self = this;
    var tabGroup = $('.list-tab');
    tabGroup.children().click(function () {
        var li = $(this);
        var category_id = li.attr("data-category");
        var page = 1;
        xfzajax.get({
            'url':'/news/list/',
            'data':{
                'category_id':category_id,
                'p':page
            },
            'success':function (result) {
                if(result['code']===200){
                    var newes = result['data'];
                    var tpl = template("news-item",{"newes":newes});
                    // empty:将这个标签下面的所有文字删除
                    var newsListGroup = $(".list-inner-group");
                    newsListGroup.empty();
                    newsListGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;
                    li.addClass('active').siblings().removeClass('active');
                }
            }
        })
    })
};
Index.prototype.listenLoadMoreEvent = function(){
    var self = this;
    var loadBtn = $("#load-more-btn");
    loadBtn.click(function () {
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'p': self.page,
                'category_id':self.category_id,
            },
            'success':function (result) {
                if(result['code']===200){
                    var newes = result['data'];
                    var tpl = template("news-item",{"newes":newes});
                    var ul = $('.list-inner-group');
                    ul.append(tpl);
                    self.page += 1;
                }
            }
        })
    })
};
$(function () {
  var banner = new Banner();
  banner.run();
  var index = new Index();
  index.run();
});
