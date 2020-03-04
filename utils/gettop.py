#导入redis，进行建立连接，直接操作redis,而不是cache
from redis import Redis
#需求先启动redis服务器
rds = Redis(host='10.0.114.179',port=6379)

#zincrby方法表示:为有序集 Article-clicks 的成员 article_id 的 score 值加上增量 count
记录点击的次数的方法
def record_click(article_id,count=1):
    rds.zincrby('Article-clicks',article_id,count)

获取排行前num位的数据
def get_top_n_articles(num):
    #zrevrange key start stop [WITHSCORES]
    #返回有序集 key 中，指定区间内的成员
    article_clicks=rds.zrevrange('Article-clicks',0,num,withscores=True)
    #返回前num项数据，每一包含（'Article-clicks',article_id,count）
    #取出id和count
    articles = Article.objects.in_bulk([item[0] for item in article_clicks])
    #根据列表中的所有id,一次取出所有的文章

    for item in article_clicks:
    #遍历列表，将列表中的id值替换成对应的文章对象
        aid = item[0]
        item[0]=articles[aid]

    return article_clicks