from django.shortcuts import render
from .models import News,NewsCategroy,Comment,Banner
from django.conf import settings
from utils import restful
from .serializers import NewsSerializer,CommentSerizlizer
from django.http import Http404
from .forms import PublicCommentForm
from django.db.models import Q
def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    news = News.objects.select_related('category','author').all()[0:count]
    categories = NewsCategroy.objects.all()
    context = {
        'news':news,
        'categories':categories,
        'banners':Banner.objects.all(),
    }
    return render(request, 'news/index.html',context=context)

def news_list(request):
    # 通过p参数来指定要获取第几页的数据
    # 并且这个p,category_id参数是通过查询字符串的方式传过来的
    page = int(request.GET.get('p',1))
    category_id = int(request.GET.get('category_id',0))
    # category_id为0表示不进行任何分类，直接按照时间分类
    start = (page - 1) * settings.ONE_PAGE_NEWS_COUNT
    end = start + settings.ONE_PAGE_NEWS_COUNT
    if category_id == 0:
        news = News.objects.all()[start:end]
    else:
        news = News.objects.select_related('category','author').filter(category_id=category_id)[start:end]
    serializer = NewsSerializer(news,many=True)
    data = serializer.data
    return restful.result(data=data)


def news_detail(request, news_id):
    try:
        news = News.objects.select_related('category','author').prefetch_related("comments__author").get(pk=news_id)

        context = {
            'news': news
        }
        return render(request, 'news/news_detail.html', context=context)
    except News.DoesNotExist:
        raise Http404

def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content,news=news,author=request.user)
        serizlizer = CommentSerizlizer(comment)
        return restful.result(data=serizlizer.data)
    else:
        return restful.params_error(message=form.get_errors())


# def search(request):
#     q = request.GET.get('q')
#     context = {}
#     if q:
#         newes = News.objects.filter(Q(title__icontains=q)|Q(context__icontains=q))
#         context['newes'] = newes
#     return render(request, 'search/search.html', context=context)




