import convert from 'xml-js';

class RDFService {
  static makeRequest = async () => {
    const apiUrl = "http://localhost:8080/sparql/";
    const query = `
      PREFIX dbp: <http://dbpedia.org/property/>
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
      }
    `; // Sua consulta SPARQL

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        q: query,
        format: "xml",
        do_adjust_for_inflation: "false",
        target_date: "", // Deixe vazio se não for necessário
      }).toString(),
    };

    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.text();

      const xml = data;

      const options = {
        compact: true,
        ignoreDeclaration: true,
        ignoreInstruction: true,
        ignoreAttributes: false,
        textFn: (value: string) => value.trim(),
      };

      const result = convert.xml2js(xml, options) as any;

      const getBindingValue = (binding: any): string => {
        if (binding.literal && binding.literal._text) {
          return binding.literal._text;
        } else if (binding.uri && binding.uri._text) {
          return binding.uri._text;
        }
        return '';
      };

      if (result.sparql && result.sparql.results && result.sparql.results.result && result.sparql.results.result.binding) {
        const bindings = result.sparql.results.result.binding;

        const data: { [key: string]: string } = {};
        bindings.forEach((binding: any) => {
          const name = binding._attributes.name;
          const value = getBindingValue(binding);
          data[name] = value;
        });

        return data;
      }
    } catch (error) {
      console.error("Erro ao fazer a requisição:", error);
    }
  };
}

export default RDFService;
