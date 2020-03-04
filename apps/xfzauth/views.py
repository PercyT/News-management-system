from django.shortcuts import render
import json
from django.core.cache import cache
from django.contrib.auth import login, logout, authenticate
from django.shortcuts import redirect,reverse
from django.views.decorators.http import require_POST
from utils.captcha.xfzcaptcha import Captcha
from .forms import LoginForm,RegisterForm
from .models import User
from io import BytesIO
from django.http import HttpResponse
from django.http import JsonResponse
from utils import restful
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import CommonRequest
from django.utils.decorators import method_decorator
# 设计api {"code":400, "message":"用户错误", "data":{"username":"yxp"}}
@require_POST
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message="您的账号已经被冻结了")
        else:
            return restful.params_error(message="手机号或者密码错误")
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)

def logout_view(request):
    logout(request)
    return redirect(reverse('index'))

def img_captcha(request):
    text,image = Captcha.gene_code()
    out = BytesIO() # Bytesio 相当于一个管道，用于存储图片的流数据
    image.save(out,'png') # 调用save方法，保存到Bytesto中
    out.seek(0) # 将指针移到最开始的位置
    response = HttpResponse(content_type='image/png') # 从ByetesIo中读出数据到response、
    response.write(out.read())
    response['Content-length'] = out.tell()
    cache.set(text.lower(),text.lower(),5*60)
    return response



def sms_captcha(request):
    telephone = request.GET.get('telephone')
    code = Captcha.gene_text()
    code_str = {"code":code}
    client = AcsClient('LTAI4Fr8YcVpTwtgiqZKA4GX', '4KTVuMPhOXa7Dy67EJTLEbCP4jXDxX', 'cn-hangzhou')

    request = CommonRequest()
    request.set_accept_format('json')
    request.set_domain('dysmsapi.aliyuncs.com')
    request.set_method('POST')
    request.set_protocol_type('https')  # https | http
    request.set_version('2017-05-25')
    request.set_action_name('SendSms')

    request.add_query_param('RegionId', "cn-hangzhou")
    request.add_query_param('PhoneNumbers', telephone)
    request.add_query_param('SignName', "小饭桌验证码")
    request.add_query_param('TemplateCode', "SMS_174580072")
    request.add_query_param('TemplateParam', json.dumps(code_str))

    cache.set(telephone,code, 5 * 60)
    response = client.do_action(request)
    # python2:  print(response)
    print(str(response, encoding='utf-8'))
    return restful.ok()

@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password1 = form.cleaned_data.get('password1')
        password2 = form.cleaned_data.get('password2')
        user = User.objects.create_user(telephone=telephone,username=username,password=password1)
        login(request,user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())