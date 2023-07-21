from django import forms
from utils.jena import get_dataset_names_tuple

FORMAT_CHOICES = [
    ('json', 'JSON'),
    ('xml', 'XML'),
    ('csv', 'CSV'),
    ('tsv', 'TSV'),
]

class QueryForm(forms.Form):
    q = forms.CharField(label='Query', widget=forms.Textarea())
    format = forms.CharField(
        label='Format',
        widget=forms.Select(choices=FORMAT_CHOICES)
        )
    do_adjust_for_inflation = forms.BooleanField(required=False)
    target_date = forms.CharField(label='Target date (YYYY-MM-dd)', max_length=10, required=False)

class DataFileForm(forms.Form):
    datafile = forms.FileField(label='Select a file')
    dataset = forms.CharField(
        label='Dataset',
        widget=forms.Select(choices=get_dataset_names_tuple())    
        )

