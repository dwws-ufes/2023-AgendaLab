from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound 
from urllib.parse import quote, unquote
from . import query_store
from django.core.handlers.wsgi import WSGIRequest

from .models import DataFile
from .forms import QueryForm, DataFileForm

from pathlib import Path

import cucopy
import json, time, os, requests

# NOTE: REMEMBER TO ENCODE VALUES IN GUI INTERFACE
#         => to allow for the query to contain ampersands, forward slashes, etc.
# Example URL: 
# 134.94.130.210:80/query?format=json&q=PREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0Aprefix%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0Aprefix%20owl%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0Aprefix%20bibo%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fontology%2Fbibo%2F%3E%0Aprefix%20dc%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0A%0A%0A%0ASELECT%20%3Fpublisher%0AWHERE%20%7B%0A%20%20%3Fbook%20dc%3Apublisher%20%3Fpublisher%3B%0A%20%20%20%20%20%20%20%20dc%3Atitle%20%22Dorsch-Lexikon%20der%20Psychologie%22%20.%0A%7D%0ALIMIT%2025
# EXAMPLE_QUERY_ENCODED = "PREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0Aprefix%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0Aprefix%20owl%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0Aprefix%20bibo%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fontology%2Fbibo%2F%3E%0Aprefix%20dc%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0A%0A%0A%0ASELECT%20%3Fpublisher%0AWHERE%20%7B%0A%20%20%3Fbook%20dc%3Apublisher%20%3Fpublisher%3B%0A%20%20%20%20%20%20%20%20dc%3Atitle%20%22Dorsch-Lexikon%20der%20Psychologie%22%20.%0A%7D%0ALIMIT%2025"

_value_field_name = 'price'
_endpoint = getattr(settings, 'SPARQL_ENDPOINT', None)
server_url = getattr(settings, 'SPARQL_URL', None)

def home(request):
    if request.method == 'POST':
        form = QueryForm(request.POST)
        if form.is_valid():
            form.cleaned_data['q'] = quote(form.cleaned_data['q'])
            content, content_type = _handle_form(form.cleaned_data['q'], form.cleaned_data['format'])

            if(form.cleaned_data['do_adjust_for_inflation']):
                content = adjust_for_inflation(content, content_type, form.cleaned_data['target_date'])
                        
            if('json' in content_type):
                return JsonResponse(content)
            else:
                return HttpResponse(content=content, content_type=content_type)
    else:
        form = QueryForm()

    context = {
        'form' : form
    }

    return render(request, 'home.html', context=context)

def _handle_form(query : str, query_format : str = "json"):
    query, content_format, content_type = _handle_form_params(query=query, content_format=query_format)

    store = query_store.QueryStore(_endpoint)
    
    content = store.query(query=query, format=content_format)

    if(content_format == 'xml'):
        content = content.toxml()

    return content, content_type

def _handle_form_params(query : str, content_format : str = "json"):
    try:
        query = unquote(query)
    except:
        pass
    
    if(content_format != None):
        content_format = content_format.lower()
    if((content_format not in query_store.QueryStore.SUPPORTED_EXTENSIONS) or content_format == None):
        content_format = 'json'

    content_type = {
        'xml': 'text/xml',
        'json': 'application/json',
    #    'json-ld': 'application/ld+json',
    #    'turtle': 'application/x-turtle',
    #    'n3': 'text/n3',
    #    'rdf': 'text/plain',
    #    'rdf+xml': 'application/rdf+xml',
        'csv': 'text/csv',
        'tsv': 'text/tab-separated-values'
    }[content_format]

    return query, content_format, content_type

def _kwargs_from_request(request):
    available_params = ['format', 'target_date']
    param_dict = {}

    for param in available_params:
        param_dict[param] = request.GET.get(param)
    
    return param_dict

def query(*args, **kwargs):
    if(len(args) == 1 and isinstance(args[0], WSGIRequest)):
        query = args[0].GET.get('q')
        content_format = args[0].GET.get('format')
        try:
            target_date = args[0].GET.get('target_date')
        except:
            target_date = None
    elif(len(args) == 1 and isinstance(args[0], str)):
        query = args[0]
        content_format = kwargs.get('format') if ('format' in kwargs and kwargs.get('format') != None) else 'json'
        target_date = kwargs.get('target_date') if 'target_date' in kwargs else None    
    else:
        return HttpResponseNotFound("No query given.")

    res, content_type = _handle_form(query=query, query_format=content_format)
    
    if('json' in content_type):
        if target_date != None:
            if _value_field_name in res["results"]["bindings"][0]:
                res = adjust_for_inflation(res, content_type, target_date)
            else:
                res["head"]["api_info"] = { "type": "literal", "value" : "no value found to be adjusted for inflation. target_date was omitted from query."}


    ##################################################
    #               Recursive Queries                #
    ##################################################
        if 'keys' in kwargs:
           master_key_name = 'results'
           res = {master_key_name : res}
           keys = kwargs.get('keys')
           prev_key = None
           for key in keys:
               result_layer = res[master_key_name]
               key = int(key) if isinstance(result_layer, list) else key
               try:
                   res = {master_key_name : result_layer[key]}
               except KeyError:
                   return JsonResponse({'error' : f'invalid key {key}'})
        return JsonResponse(res)
    else:
        return HttpResponse(content=res, content_type=content_type)

def adjust_for_inflation(res, content_type, target_date, classification='all'):
    if('json' in content_type):
        for entry in res["results"]["bindings"]:
            price = float(entry[_value_field_name]["value"])
            date  = entry["release_date"]["value"]

            curr = cucopy.Currency(date, price)
            curr.set_parser(classification=classification)
            curr.set_target_date(target_date)

            entry["target_date"] = { 
                "type" : "literal",
                "value" : target_date
                }

            entry["equivalent_worth"] = { 
                "type" : "literal",
                "datatype" : "http://www.w3.org/2001/XMLSchema#decimal",
                "value" : str(curr.get_equivalent_worth())
                }

            entry["purchasing_power"] = { 
                "type" : "literal",
                "datatype" : "http://www.w3.org/2001/XMLSchema#decimal",
                "value" : str(curr.get_purchasing_power())
                }
    return res

def get_all(request):
    _kwargs = _kwargs_from_request(request)
    return query("SELECT ?s ?p ?o WHERE { ?s ?p ?o }", **_kwargs)

def get_books(request):
    query_str = """
                PREFIX ex: <http://example.org/> 
                prefix dc: <http://purl.org/dc/elements/1.1/> 
                SELECT ?title ?price ?release_date
                WHERE {
                ?b dc:title ?title;
                    ex:price ?price;
                    ex:release_date ?release_date.
                }
                """
    _kwargs = _kwargs_from_request(request)
    return query(query_str, **_kwargs)

##################################################
#               Recursive Queries                #
##################################################
def get_books_recursive(request, *args):
   query_str = """
               PREFIX ex: <http://example.org/> 
               prefix dc: <http://purl.org/dc/elements/1.1/> 
               SELECT ?title ?price ?release_date
               WHERE {
               ?b dc:title ?title;
                   ex:price ?price;
                   ex:release_date ?release_date.
               }
               """
   _kwargs = _kwargs_from_request(request)
   keys_arr = args[0].split('/')
   _kwargs["keys"] = keys_arr
   return query(query_str, **_kwargs)

def get_subject(request, subject=''):
    if not subject:
        pass
    query_str = f"SELECT ?subject ?predicate ?object WHERE {{ {subject} ?predicate ?object . }} LIMIT 100"
    #query_str = "SELECT * WHERE { ?s a {obj} }".format(obj = subject)
    _kwargs = _kwargs_from_request(request)
    return query(query_str, **_kwargs)


####################################################################################################################
#                                          Functions for uploading files                                           #
####################################################################################################################

def _get_content_type(data):
    data_name, data_extension = os.path.splitext(data)

    data_extension = data_extension.lower()
    if(data_extension not in query_store.QueryStore.SUPPORTED_UPLOAD_EXTENSIONS): return None

    content_type = {
        'ttl': 'text/turtle;charset=utf-8',
        'n3': 'text/n3;charset=utf-8',
        'nt': 'text/plain',
        'rdf': 'application/rdf+xml',
        'owl': 'application/rdf+xml',
        'nq': 'application/n-quads',
        'trig': 'application/trig',
        'jsonld': 'application/ld+json'
    }[data_extension]

    return content_type

def _upload_to_graph(data, dataset, graph = 'default'):
    content_type = _get_content_type(data.name)

    upload_url = "{url}{dataset_uri}?{graph_name}".format(url=server_url, dataset_uri = dataset, graph_name = graph)
    headers = {'Content-Type': 'text/turtle;charset=utf-8'}

    print(upload_url)

    r = requests.post(upload_url, data=data, headers=headers)
    return r.status_code, (r.reason if content_type != None else "Invalid file format")


def upload_file(request):
    message = ''
    if request.method == 'POST':
        form = DataFileForm(request.POST, request.FILES)
        if form.is_valid():
            data = request.FILES['datafile']
            dataset = form.cleaned_data['dataset']
            _status, _reason = _upload_to_graph(data, dataset)
            if _status != 200:
                message = "{status}: {reason}".format(status=_status, reason=_reason)

            #data_file = DataFile(datafile=data)
            #data_file.save()
    else:
        form = DataFileForm()

    context = {
        'form' : form,
        'message' : message
    }

    return render(request, 'upload.html', context=context)