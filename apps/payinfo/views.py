from django.shortcuts import render
from .models import Payinfo
def index(request):
    context = {
        'payinfos':Payinfo.objects.all()
    }

    return render(request,'payinfo/payinfo_index.html',context=context)