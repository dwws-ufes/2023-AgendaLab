import requests

DATASET_GUARD = True

def get_dataset_names():
    if DATASET_GUARD == False:
        r = requests.get('http://localhost:3030/$/server')
        datasets_dict = r.json()
        dataset_names = [dataset['ds.name'] for dataset in datasets_dict['datasets']]
        return dataset_names
    else:
        return ['/api_test']

def get_dataset_names_tuple():
    if DATASET_GUARD == False:
        r = requests.get('http://localhost:3030/$/server')
        datasets_dict = r.json()
        dataset_names = [(dataset['ds.name'], dataset['ds.name']) for dataset in datasets_dict['datasets']]
        return dataset_names
    else:
        return [('/api_test', '/api_test')]