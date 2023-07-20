from django.urls import re_path
try:
    from .views import ctl_signals,show_config,sync_remote,to_rdfbyid,pub_rdf, to_rdfbykey
except:
    from views import ctl_signals,show_config,sync_remote,to_rdfbyid,pub_rdf, to_rdfbykey
    
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    # Examples:
    # re_path(r'^$', 'rdf_io.views.home', name='home'),
    # re_path(r'^blog/', include('blog.urls')),
    re_path(r'to_rdf/(?P<model>[^\/]+)/id/(?P<id>\d+)$', to_rdfbyid, name='to_rdfbyid'),
    re_path(r'to_rdf/(?P<model>[^\/]+)/key/(?P<key>.+)$', to_rdfbykey, name='to_rdfbykey'),
    re_path(r'pub_rdf/(?P<model>[^\/]+)/(?P<id>\d+)$', pub_rdf, name='pub_rdf'),
    # management urls - add user auth
    re_path(r'sync_remote/(?P<models>[^\/]+)$', sync_remote, name='sync_remote'),
    re_path(r'show_config$', show_config, name='show_config'),
    re_path(r'ctl_signals/(?P<cmd>[^\/]+)$', ctl_signals, name='ctl_signals'),
    # re_path(r'^admin/', include(admin.site.urls)),
]
