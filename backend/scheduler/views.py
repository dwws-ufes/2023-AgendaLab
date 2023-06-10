from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Scheduling
from .serializers import *

def index(request):
    return HttpResponse("Hello, World!")

@api_view(['GET', 'POST'])
def schedules_list(request):
    if request.method == 'GET':
        data = Scheduling.objects.all()

        serializer = SchedulingSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SchedulingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def schedules_detail(request, pk):
    try:
        schedule = Scheduling.objects.get(pk=pk)
    except Scheduling.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = SchedulingSerializer(schedule, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        schedule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
