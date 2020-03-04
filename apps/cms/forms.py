from django import forms
from apps.forms import FormMixmin
from apps.news.models import News,Banner
from apps.course.models import Course

class EditNewsCategoryForm(forms.Form,FormMixmin):
    pk = forms.IntegerField()
    name = forms.CharField(max_length=100)

class WriteNewsForm(forms.ModelForm, FormMixmin):
    category = forms.IntegerField()
    class Meta:
        model = News
        exclude = {'category','author','pub_time'}

class AddBannerForm(forms.ModelForm,FormMixmin):
    class Meta:
        model = Banner
        fields = ('priority','link_to','image_url')

class EditBannerForm(forms.ModelForm,FormMixmin):
    pk = forms.IntegerField()
    class Meta:
        model = Banner
        fields = ('priority','link_to','image_url')

class EditNewsForm(forms.ModelForm,FormMixmin):
    category = forms.IntegerField()
    pk = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category','author','pub_time']

class PubCourseForm(forms.ModelForm,FormMixmin):
    category_id=forms.IntegerField()
    teacher_id=forms.IntegerField()
    class Meta:
        model=Course
        exclude=['category','teacher']