from django.contrib.contenttypes.models import ContentType

from rdflib import Graph

from rdf_io.views import build_rdf
from rdf_io.models import ObjectMapping

from .models import Department

# This example assumes ...
#   * you have created a model called `Task` and there’s at least one task
#   * you have created a mapping for the Task model

def build_RDF():
    serialized_Department = Department.objects.first()

    try:
        content_type = ContentType.objects.get(model='department')
    except ContentType.DoesNotExist:
        print("ContentType for this model does not exist.")
        return

    obj_mapping_list = ObjectMapping.objects.filter(content_type=content_type)

    graph = Graph()
    build_rdf(graph, serialized_Department, obj_mapping_list, includemembers=True)

    print("Building RDF...")

    if len(graph) > 0:
        print(graph.serialize(format="turtle"))
    else:
        print("O grafo está vazio. Nenhum dado para serializar.")
