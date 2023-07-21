import json
import requests, os
from rdflib import RDFS, Graph
from SPARQLWrapper import GET, POST, JSON, JSONLD, TURTLE, SPARQLWrapper, XML, N3, RDF, RDFXML, CSV, TSV

class QueryStore(object):

    SUPPORTED_EXTENSIONS=[XML, JSON, JSONLD, TURTLE, N3, RDF, RDFXML, CSV, TSV]
    SUPPORTED_UPLOAD_EXTENSIONS=['ttl', 'n3', 'nt', 'rdf', 'owl', 'nq', 'trig', 'jsonld']

    def __init__(self, query_endpoint):
        self.query_endpoint = query_endpoint
        self.sparql = SPARQLWrapper(query_endpoint)

    def query_graph(self, query : str, format = JSON, only_conneg = True):
        results = self.query(query, format, only_conneg)
        results_bytes = results.serialize(format = format)
        results_json = results_bytes.decode('utf-8').replace("'", '"')
        data = json.loads(results_json)
        return data

    def query(self, query : str, format = JSON, only_conneg = True):
        self.sparql.resetQuery()
        self.sparql.setMethod(GET)
        self.sparql.setOnlyConneg(only_conneg)
        self.sparql.setQuery(query)
        self.sparql.setReturnFormat(format)
        return self.sparql.queryAndConvert()

    def update_query(self, query : str, only_conneg = True):
        self.sparql.resetQuery()
        self.sparql.setMethod(POST)
        self.sparql.setOnlyConneg(only_conneg)
        self.sparql.setQuery(query)
        self.sparql.query()

"""
PREFIX ex: <http://example.org/>
prefix dc: <http://purl.org/dc/elements/1.1/>

SELECT ?title ?price ?release_date
WHERE {
  ?b dc:title ?title;
     ex:price ?price;
     ex:release_date ?release_date.
}
"""
"""
INSERT DATA { GRAPH default {
  <person0> <firstname> "Jay" .
  <person0> <lastname> "Stevens" .
  <person0> <state> "CA" .
 }
}
"""
