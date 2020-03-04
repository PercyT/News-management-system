function NewsList() {
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

NewsList.prototype.run = function () {
    this.listenSubmitEvent();
};

NewsList.prototype.listenSubmitEvent = function(){
    var submitBtn = $('.submit-btn');
    var textarea = $("textarea[name='comment']");
    submitBtn.click(function () {
        var content = textarea.val();
        var news_id = submitBtn.attr('data-news-id');
        xfzajax.post({
            'url':'/news/public_comment/',
            'data':{
                'content':content,
                'news_id':news_id
            },
            'success':function (result) {
                if(result['code']===200){
                    var comment = result['data'];
                    var tpl = template('comment-item',{"comment":comment});
                    var commentListGroup = $('.comment-list');
                    commentListGroup.prepend(tpl);
                    window.messageBox.showSuccess('评论发表成功！');
                    textarea.val('');
                }
            }
        })
    })
};
$(function () {
    var newslist = new NewsList();
    newslist.run();

});