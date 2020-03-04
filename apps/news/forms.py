from django import forms
from apps.forms import FormMixmin

class PublicCommentForm(forms.Form,FormMixmin):
    content = forms.CharField()
    news_id = forms.IntegerField()