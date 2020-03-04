function Banners() {

}

Banners.prototype.listenAddBanners = function(){
    var self = this;
    var addBtn = $('#add-banner-btn');
    addBtn.click(function () {
        var bannerListGroup = $('.banner-list-group');
        var length = bannerListGroup.children().length;
        if (length >= 3) {
            window.messageBox.showInfo('最多只能添加3张轮播图！');
            return;
        }
        var tpl = template("banner-item");
        bannerListGroup.prepend(tpl);
        var bannerItem = bannerListGroup.find(".banner-item:first");
        self.addImgSelectEvent(bannerItem);
        self.addRemoveBannerEvent(bannerItem);
        self.addSaveBannerEvent(bannerItem);
    });
};

Banners.prototype.addImgSelectEvent = function(bannerItem){
    var image = bannerItem.find('.thumbnail');
    var imageInput = bannerItem.find('.image-input');
    // 图片是不能够打开文件选择框的，只能通过input(type=file)
    image.click(function () {
        var that = $(this);
        imageInput.click();
    });

    imageInput.change(function () {
        var file = this.files[0];
        var formData = new FormData();
        formData.append("file",file);
        xfzajax.post({
            'url':'/cms/upload_file/',
            'data':formData,
            'processData':false,
            'contentType':false,
            'success':function (result) {
                if(result['code']===200){
                    var url = result['data']['url'];
                    image.attr('src',url);
                }
            }
        })
    });
};

Banners.prototype.addRemoveBannerEvent = function(bannerItem){
    var closeBtn = $('.close-btn');
    closeBtn.click(function () {
        var bannerId = bannerItem.attr('data-banner-id');
        if (bannerId) {
            xfzalert.alertConfirm({
                'text': '您确定要删除这个轮播图吗？',
                'confirmCallback': function () {
                    xfzajax.post({
                        'url':'/cms/delete_banner/',
                        'data':{
                            'banner_id':bannerId,
                        },
                        'success':function (result) {
                            if(result['code']===200){
                                bannerItem.remove();
                                window.messageBox.showSuccess('轮播图删除成功!');
                            }
                        }
                    })
                }
            })
        } else {
            bannerItem.remove();
        }
    });
};

Banners.prototype.addSaveBannerEvent = function(bannerItem){
    var saveBtn = bannerItem.find('.save-btn');
    var imageTag = bannerItem.find('.thumbnail');
    var priorityTag = bannerItem.find("input[name='priority']");
    var link_toTag = bannerItem.find("input[name='link_to']");
    var prioritySpan = bannerItem.find("span[class='priority']");
    var bannerId = bannerItem.attr('data-banner-id');
    var url = '';
    if (bannerId){
        url = '/cms/edit_banner/';
    }else{
        url= '/cms/add_banner/';
    }
    saveBtn.click(function () {
        var image_url = imageTag.attr('src');
        var priority = priorityTag.val();
        var link_to = link_toTag.val();
        xfzajax.post({
            'url':url,
            'data':{
                'pk': bannerId,
                'image_url':image_url,
                'priority':priority,
                'link_to':link_to,
            },
            'success':function (result) {
                if(result['code']===200){
                    if(bannerId){
                        window.messageBox.showSuccess('轮播图修改成功');
                    }else {
                        bannerId = result['data']['banner_id'];
                        bannerItem.attr('data-banner-id',bannerId);
                        window.messageBox.showSuccess('轮播图添加完成!');
                    }
                    var bannerPriority = result['data']['priority'];
                    prioritySpan.text("优先级: "+bannerPriority);
                }
            }
        })
    })
};

Banners.prototype.loadData = function(){
    var self = this;
    xfzajax.get({
        'url':'/cms/banner_list/',
        'success':function (result) {
            if(result['code']===200){
                var banners = result['data'];
                for (var i=0;i<banners.length;i++){
                    var banner = banners[i];
                    var tpl = template("banner-item",{"banner":banner});
                    var bannerListGroup = $(".banner-list-group");
                    bannerListGroup.append(tpl);
                    var bannerItem = bannerListGroup.find(".banner-item:last");
                    self.addImgSelectEvent(bannerItem);
                    self.addRemoveBannerEvent(bannerItem);
                    self.addSaveBannerEvent(bannerItem);
                }
            }
        }
    })
};
Banners.prototype.run = function () {
    this.listenAddBanners();
    this.loadData();
};

$(function () {
    var banners = new Banners();
    banners.run();
});