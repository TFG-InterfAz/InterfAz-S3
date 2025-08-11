"""
URL configuration for InterfAz project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from starcoder import views
from ollama import views as ollamaViews
from html_renderizer import views as htmlViews
from authentification import views as authViews


from .views import home
from .views import axios_connection
from .views import get_csrf_token
from gemini import views as gemini_views
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt import views as jwt_views


router = routers.DefaultRouter()
router.register(f'Renderizer', htmlViews.RenderizerView, 'Renderizer')

urlpatterns = [
    #API for forntend 
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title="Renderizer API")),
    #URL from Djgango's templates
    path('admin/', admin.site.urls),
    path("ask/starcoder", views.prompt_view, name="prompt_view"),
    path('prompts/starcoder', views.show_prompts, name='show_prompts'),
    path('', home, name='home'),
    path('ask/ollama/', ollamaViews.ollama, name='ollama'),
    path('prompts/ollama', ollamaViews.prompts_list, name='prompts_list'),
    path('store_code', htmlViews.generate_html_view, name='generate_html'),
    path('generated/<int:html_id>/', htmlViews.show_generated_html, name='show_generated_html'),
    path('get_all_html/', htmlViews.get_all_html, name='show_all_html'),
    path('modify_html/<int:html_id>/', htmlViews.modify_html, name='modify_html'),
    path('delete_html/<int:html_id>/', htmlViews.delete_html, name='delete_html'),
    path('axios_connection', axios_connection, name='connection'),
    path('get_csrf/', get_csrf_token),
    
    #URL Login and lOGOUT
    path('token/', jwt_views.TokenObtainPairView.as_view(), name ='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name ='token_refresh'),
    path('home/', authViews.HomeView.as_view(), name ='home'),
    path('logout/', authViews.LogoutView.as_view(), name ='logout'),
    path('private/', authViews.PrivateView.as_view(), name='private'),


    #User registration
    path('signup/',authViews.SignupView.as_view(), name='auth_signup'),
    path('password/reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    #Ask Gemini
    path('api/gemini_query/', gemini_views.gemini_query, name='gemini_query'),












]
