from django.db import models
import time


class DataFile(models.Model):
    file_path = "uploads/"+str(round((time.time()*1000)))
    datafile = models.FileField(upload_to=file_path)

    
