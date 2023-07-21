# techdata-api

Django application providing a interface for querying a SPARQL endpoint.

## Installation

1. Clone the repo
    ```sh
    git clone https://jugit.fz-juelich.de/j.schoenau/techdata-api.git techapi
    ```

2. Install the requirements into your django environment
    ```sh
    pip install -e techapi/.
    ```

3. Add the API to your INSTALLED_APPS
    ```python
    INSTALLED_APPS = (
        ...
        'techapi',
        ...
    )
    ```

4. Add the API URL patterns to your django project:
    ```python
    urlpatterns = [
        ...
        path('api/', include('techapi.urls', namespace='techapi')),
        ...
    ]
    ```

5. Add the endpoint for your SPARQL endpoint in your project's settings file
    ```python
    SPARQL_ENDPOINT = 'http://path-to-triple-store/query'
    ```
    
Done! Visit https://my-project/api/ to reach the interface.

## Using the Inflation module

- In your virtual environment, download the needed consumer price index (CPI) timeseries from the Deutsche Bundesbank
    ```sh
    python -m cucopy.manage -c [classifier] [-l language]
    ```

The following classifiers are available:
| Command-line parameter   | Classifier                  | Deutsche Bundesbank ID |
|--------------------------|-----------------------------|------------------------|
| all                      |           VPI_ALL           |         A00000         |
| food                     |           VPI_FOOD          |         C2C011         |
| consumer_goods_no_energy | VPI_CONSUMER_GOOD_NO_ENERGY |       GOODS0MFXE       |
| energy                   |          VPI_ENERGY         |         NRGY00         |
| service_no_rent          |     VPI_SERVICE_NO_RENT     |           VXR          |
| rent                     |           VPI_RENT          |         C2C041         |

The 'language' argument specifies, which region seetings to use. 
This affects, among other things, which delimiter is used (','/ ';').
The default 'language' value is 'de'.

Note that the Deutsche Bundesbank updates its timeseries monthly; it is advised to fetch the latest timeseries every month.