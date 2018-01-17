from django.conf.urls import url
from django.contrib.auth.views import login
from RunningApp import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^map/$', views.map, name='map'),
    url(r'^register/', views.register, name='register'),
    url(r'^login/$', login, {'template_name': 'login.html'}, name='login'),
]
