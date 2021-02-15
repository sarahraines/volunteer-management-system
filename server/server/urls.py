"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.urls import include, path, re_path
from django.conf import settings
from django.contrib.staticfiles.views import serve
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    re_path(r'^(?!/?assets/)(?!/?admin/)(?!/?api/)(?P<path>.*\..*)$',
        RedirectView.as_view(url='/assets/%(path)s', permanent=False)),
    re_path(r'^(?!/?assets/)(?!/?admin/)(?!/?api/).*$', serve, kwargs={'path': 'index.html'}),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

