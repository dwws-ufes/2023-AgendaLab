from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Scheduling, Teacher, Admin, Department, Laboratory, PasswordResetCode
from .serializers import *

#Django security
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required, permission_required



@api_view(['GET'])
def get_routes(request):
    routes = [
        {
            'Entities': ['schedule', 'teacher', 'admin', 'department', 'laboratory', 'user'],
            'Entrypoint': '/request/',
            'Example': 'http://127.0.0.1:8080/request/schedule/',
        },
        {
            'Endpoint': '/entity/',
            'method': 'GET',
            'description': 'Returns an array of entity'
        },
        {
            'Endpoint': '/entity/id',
            'method': 'GET',
            'description': 'Returns a single entity object'
        },
        {
            'Endpoint': '/entity/create/',
            'method': 'POST',
            'description': 'Creates new entity with post request'
        },
        {
            'Endpoint': '/entity/id/update/',
            'method': 'PUT',
            'description': 'Update entity with data sent in post request'
        },
        {
            'Endpoint': '/entity/id/delete/',
            'method': 'DELETE',
            'description': 'Deletes an existing entity'
        },
    ]

    return Response(routes)

#Requered login for this POST request
@login_required
@api_view(['POST'])
def make_scheduling(request):
    if request.method == 'POST':
        saved_schedules = []
        for schedule in request.data:
            serializer = SchedulingSerializer(data=schedule)
            # verify if interval is unique of between start_time and end_time
            if Scheduling.objects.filter(laboratory=schedule['laboratory'], start_time__lte=schedule['start_time'], end_time__gte=schedule['end_time']).exists():
                return Response({'error': 'Interval already exists'}, status=status.HTTP_400_BAD_REQUEST)

            if serializer.is_valid():
                instance = serializer.save()
                saved_schedules.append(instance)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serialized_schedules = SchedulingSerializer(saved_schedules, many=True)  # Serialize the saved objects
        return Response(serialized_schedules.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def schedules_list(request):
    if request.method == 'GET':
        data = Scheduling.objects.all()

        serializer = SchedulingSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

@api_view(['GET','PUT', 'DELETE'])
def schedules_detail(request, pk):
    try:
        schedule = Scheduling.objects.get(pk=pk)
    except Scheduling.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SchedulingSerializer(schedule,context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = SchedulingSerializer(schedule, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        schedule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def teachers_list(request):

    if request.method == 'GET':
        data = Teacher.objects.all()

        serializer = TeacherSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT', 'DELETE'])
def teachers_detail(request, pk):
    try:
        teacher = Teacher.objects.get(pk=pk)
    except Teacher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TeacherSerializer(teacher,context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = TeacherSerializer(teacher, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        teacher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def admins_list(request):
    if request.method == 'GET':
        data = Admin.objects.all()

        serializer = AdminSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def admins_detail(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
    except Admin.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AdminSerializer(admin,context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = AdminSerializer(admin, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        admin.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def departments_list(request):
    if request.method == 'GET':
        data = Department.objects.all()

        serializer = DepartmentSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def departments_detail(request, pk):
    try:
        department = Department.objects.get(pk=pk)
    except Department.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DepartmentSerializer(department,context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = DepartmentSerializer(department, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        department.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def laboratories_list(request):
    if request.method == 'GET':
        data = Laboratory.objects.all()

        serializer = LaboratorySerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = LaboratorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def laboratories_detail(request, pk):
    try:
        laboratory = Laboratory.objects.get(pk=pk)
    except Laboratory.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = LaboratorySerializer(laboratory,context={'request': request})
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = LaboratorySerializer(laboratory, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        laboratory.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def users_list(request):
    if request.method == 'GET':
        data = User.objects.all()

        serializer = UserSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT'])
def reset_password(request, email, code):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if PasswordResetCode.objects.filter(user=user).exists():
            handler = PasswordResetCode.objects.get(user=user)
            if handler.is_valid(code):
                serializer = UserSerializer(user,context={'request': request})
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'PUT':
        if PasswordResetCode.objects.filter(user=user).exists():
            handler = PasswordResetCode.objects.get(user=user)
            if handler.is_valid(code):
                serializer = UserSerializer(user, data=request.data,context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response(status=status.HTTP_204_NO_CONTENT)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def send_code(request, email):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        # Create a PasswordResetCode object
        if(PasswordResetCode.objects.filter(user=user).exists()):
            handler = PasswordResetCode.objects.get(user=user)
            handler.save(user) # Save the PasswordResetCode object to the database and Send the code to the user
            return Response(status=status.HTTP_200_OK)
        else:
            handler = PasswordResetCode(user=user)
            handler.save(user) # Save the PasswordResetCode object to the database and Send the code to the user
            return Response(status=status.HTTP_201_CREATED)

@login_required
@api_view(['GET', 'DELETE'])
def users_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user,context={'request': request})
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print(f"Email = {email}")
    print(f"Password = {password}")
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response("Invalid credentials", status=400)

    if (user is not None) and check_password(password,user.password):
        #Login if user exists and password is correct
        auth_login(request,user)
        return Response({ "name": user.name, "email": user.email, "id":user.id }, status= 200)
    else:
        return Response("Invalid credentials", status=400)

@login_required
@api_view(['POST'])
def logout(request):
    auth_logout(request)
    return Response("User logged out with success", status=200)

@api_view(['GET'])
def exportRDF(request):
    from .services import serviceHandler as serviceHandler
    serviceHandler.export_database()
    return Response("REQUEST WAS SENT WITH SUCCESS", status=200)
