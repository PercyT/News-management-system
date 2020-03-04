function News() {

}

News.prototype.run = function () {
    var self = this;
    // self.listenUploadFileEvent();
    self.listenQiniuUploadEvent();
    self.initUedior();
    self.listenSubmitEvent();
};

News.prototype.listenSubmitEvent = function(){
    var submitBtn = $('#submit-btn');
    submitBtn.click(function (event) {
        event.preventDefault();  // 阻止以传统的表单请求上传数据，因为富文本编辑器用的不再是textarea

        var btn = $(this);
        var pk = btn.attr('data-news-id');
        if (pk){
            url = '/cms/edit_news/';
        }else {
            url = '/cms/write_news/';
        }
        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var context = window.ue.getContent();
        xfzajax.post({
            'url': url ,
            'data': {
                'title':title,
                'category':category,
                'desc':desc,
                'thumbnail':thumbnail,
                'context':context,
                'pk':pk,
            },
            'success': function (result) {
                if (result['code']===200){
                    xfzalert.alertSuccess('恭喜！新闻发表成功',function () {
                        window.location.reload();
                    });
                }
            }
        })
    })
};
// 使用本地服务器
News.prototype.listenUploadFileEvent = function(){
    var uploadBtn = $('#upload-btn');
    uploadBtn.change(function () {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file',file);
        xfzajax.post({
            'url':'/cms/upload_file/',
            'data': formData,
            'processData':false,
            'contentType':false,
            'success':function (result) {
                if(result['code']===200){
                    var url = result['data']['url'];
                    var thumbnailInput = $("#thumbnail-form");
                    thumbnailInput.val(url);
                }
            }
        })
    });
};
// 使用七牛云服务器
News.prototype.listenQiniuUploadEvent = function(){
    var self = this;
    var uploadBtn = $('#upload-btn');
    uploadBtn.change(function () {
        var file = this.files[0];
        xfzajax.get({
            'url':'/cms/qntoken/',
            'success':function (result) {
                if(result['code']===200){
                    var token = result['data']['token'];
                    var time = new Date();
                    var key =  time.getTime() + '.' + file.name.split('.')[1];
                    var putExtra = {
                        fname: key,
                        params:{},
                        mimeType: ['image/png','image/jpeg','image/gif'],
                    };
                    var config = {
                        useCdnDomain: true,
                        retryCount: 6,
                        region: qiniu.region.z2
                    };
                    var observable = qiniu.upload(file, key, token, putExtra, config)
                    observable.subscribe({
                        'next': self.handleFileUploadProgress,
                        'error': self.handleFileUploadError,
                        'complete':self.handleFileUploadComplete,
                    })
                }
            }
        })
    })
};

News.prototype.handleFileUploadComplete = function(response){
    console.log(response);
    var progressGroup = $('#progress-group');
    progressGroup.hide();
    var progressBar = $(".progress-bar");
    progressBar.css({"width":0});

    var domain = 'http://pyc1lgciv.bkt.clouddn.com/';
    var filename = response.key;
    var url = domain+filename;
    var thumbnailInput = $("input[name='thumbnail']");
    thumbnailInput.val(url);
};
News.prototype.handleFileUploadError = function(error){
    window.messageBox.showError(error);
    console.log(error);
    var progressGroup = $('#progress-group');
    progressGroup.hide();
};
News.prototype.handleFileUploadProgress = function(response){
    var total = response.total;
    var percent = total.percent;
    var percentText = percent.toFixed(0) + '%';
    var progressGroup = $('#progress-group');
    progressGroup.show();
    var progressBar = $(".progress-bar");
    progressBar.css({"width":percentText});
    progressBar.text(percentText);
};
News.prototype.initUedior = function(){
    window.ue = UE.getEditor('editor',{
        'initialFrameHeight': 300,
        'serverUrl':'/ueditor/upload/',
    }); //变成全局变量

};
$(function () {
    var news =new News();
    news.run();
});