#!/bin/bash

# URL do servidor
backendUrl="http://localhost:8000/sparql/"

# Definir a consulta SPARQL
query='PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?students ?comment_pt ?city ?established ?name ?rector
WHERE {
  ?entity dbp:name "Federal University of Espírito Santo"@en ;
          dbp:nativeName ?name;
          dbp:students ?students ;
          dbp:rector ?rector;
          dbp:established ?established ;
          rdfs:comment ?comment .
  FILTER (LANG(?comment) = "pt")
  
  OPTIONAL {
    ?entity rdfs:comment ?comment_pt .
    FILTER (LANG(?comment_pt) = "pt")
  }
  
  ?entity dbo:city ?city ;
          dbo:country ?country .
}'

# Definir os parâmetros do formulário
format='xml'
do_adjust_for_inflation='false'
target_date=''

# Enviar o formulário usando o comando curl
curl -X POST "$backendUrl" \
     -d "q=$query" \
     -d "format=$format" \
     -d "do_adjust_for_inflation=$do_adjust_for_inflation" \
     -d "target_date=$target_date"

