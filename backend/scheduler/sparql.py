from django.contrib.contenttypes.models import ContentType

from rdflib import Graph

from rdf_io.views import build_rdf
from rdf_io.models import ObjectMapping


from .models import Scheduling, Teacher, Department, Laboratory, PasswordResetCode

from rdflib import Graph, Literal, Namespace, RDF, URIRef
from rdflib.namespace import FOAF
from rdflib.namespace._XSD import XSD

def create_RDF_Graph():
    g = Graph()
    backendRoute = f"http://127.0.0.1:8080"
    base_uri = f"{backendRoute}/request/"

    ns = Namespace(base_uri)

    # Convert Scheduling objects to RDF
    for scheduling in Scheduling.objects.all():
        scheduling_uri = ns['scheduling/' + str(scheduling.pk)]
        g.add((scheduling_uri, RDF.type, ns.Scheduling))
        g.add((scheduling_uri, ns.code, Literal(scheduling.code)))
        g.add((scheduling_uri, ns.laboratory, URIRef(f"laboratory/{scheduling.laboratory.id}")))
        g.add((scheduling_uri, ns.created_by, URIRef(f"teacher/{scheduling.created_by.id}")))
        g.add((scheduling_uri, ns.title, Literal(scheduling.title)))
        g.add((scheduling_uri, ns.description, Literal(scheduling.description)))
        g.add((scheduling_uri, ns.start_time, Literal(scheduling.start_time.isoformat(), datatype=XSD.dateTime)))
        g.add((scheduling_uri, ns.end_time, Literal(scheduling.end_time.isoformat(), datatype=XSD.dateTime)))
        g.add((scheduling_uri, ns.repeat, Literal(scheduling.repeat)))

    # Convert Laboratory objects to RDF
    for laboratory in Laboratory.objects.all():
        laboratory_uri = ns['laboratory/' + str(laboratory.pk)]
        g.add((laboratory_uri, RDF.type, ns.Laboratory))
        g.add((laboratory_uri, ns.created_by, URIRef(f"department/{laboratory.created_by.id}")))
        g.add((laboratory_uri, ns.code, Literal(laboratory.code)))
        g.add((laboratory_uri, ns.num_computers, Literal(laboratory.num_computers)))
        g.add((laboratory_uri, ns.has_blackboard, Literal(laboratory.has_blackboard)))

    # Convert Department objects to RDF
    for department in Department.objects.all():
        department_uri = ns['department/' + str(department.pk)]
        g.add((department_uri, RDF.type, ns.Department))
        g.add((department_uri, ns.code, Literal(department.code)))
        g.add((department_uri, ns.name, Literal(department.name)))
        g.add((department_uri, ns.opening_time, Literal(department.opening_time.isoformat(), datatype=XSD.time)))
        g.add((department_uri, ns.closing_time, Literal(department.closing_time.isoformat(), datatype=XSD.time)))

    # Convert Teacher objects to RDF
    for teacher in Teacher.objects.all():
        teacher_uri = ns['teacher/' + str(teacher.id)]
        g.add((teacher_uri, RDF.type, ns.Teacher))
        g.add((teacher_uri, ns.department, URIRef(f"{teacher.department.id}")))
        g.add((teacher_uri, ns.register, Literal(teacher.register)))

    
    # print("RDF Graph has length: {}".format(len(g)))
    # print("RDF Graph has {} triples".format(len(g)))
    # print("RDF Graph in turtle format:")
    # print(g.serialize(format='turtle'))
    return g

def export_database(prefix):
    import os
    from pathlib import Path
    g = create_RDF_Graph()

    #If path doesn't exist, create folder
    if not os.path.exists('RDF'):
        os.makedirs('RDF')

    # Generate RDF/XML
    rdfxml_data = g.serialize(format='xml')
    with open(Path(f"./RDF/{prefix}.rdf"), 'w') as f:
        f.write(rdfxml_data)

    # Generate Turtle
    turtle_data = g.serialize(format='turtle')
    with open(Path(f"./RDF/{prefix}.ttl"), 'w') as f:
        f.write(turtle_data)

    # Generate JSON-LD
    jsonld_data = g.serialize(format='json-ld', indent=4)
    with open(Path(f"./RDF/{prefix}.jsonld"), 'w') as f:
        f.write(jsonld_data)

    # Generate N-Triples
    nt_data = g.serialize(format='nt')
    with open(Path(f"./RDF/{prefix}.nt"), 'w') as f:
        f.write(nt_data)







################################ UNUSED ###############################
def build_RDF():
    serialized_Department = Department.objects.first()

    try:
        content_type = ContentType.objects.get(model='department')
    except ContentType.DoesNotExist:
        print("ContentType for this model does not exist.")
        return

    obj_mapping_list = ObjectMapping.objects.filter(content_type=content_type)
    print("Object Mapping List:")
    print(obj_mapping_list)

    graph = Graph()
    build_rdf(graph, serialized_Department, obj_mapping_list, includemembers=True)

    print("Building RDF...")

    if len(graph) > 0:
        print(graph.serialize(format="turtle"))
    else:
        print("O grafo está vazio. Nenhum dado para serializar.")

def queryUniversity():
    query = """
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?students ?comment_pt ?city ?country
        WHERE {
          ?entity dbp:name "Federal University of Espírito Santo"@en ;
                  dbp:students ?students ;
                  rdfs:comment ?comment .
          FILTER (LANG(?comment) = "pt")
          
          OPTIONAL {
            ?entity rdfs:comment ?comment_pt .
            FILTER (LANG(?comment_pt) = "pt")
          }
          
          ?entity dbo:city ?city ;
                  dbo:co
    """
    print("Querying University...")
    print(query)
