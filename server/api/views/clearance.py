from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Prefetch 
from api.serializers import EventSerializer,  OrganizationSerializer, UserFileSerializer, OrgFileSerializer
from api.models import Event, User, Attendee, Member, Organization, Cause, OrgFile, UserFile

class AddOrgFile(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        print("adding org file")
        print(request.data)
        org = Organization.objects.filter(id=request.data['orgId'])[0]
        print(request.data['orgId'])
        data = request.data
        serializer = OrgFileSerializer(data=data)
        if serializer.is_valid():
            serializer.save(organization = org)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOrgFiles(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request, format='json'):
        # org = Organization.objects.filter(id=request.data['orgId'])[0]
        print("get org files request")
        print(request.GET['orgId'])
        org = Organization.objects.filter(id=request.GET['orgId'])[0]
        print(org)
        org_files = OrgFile.objects.filter(organization=org)
        serializer = OrgFileSerializer(org_files, many=True)
        return Response(serializer.data)

class GetUserFiles(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request, format='json'):
        print("get user files request")
        user = User.objects.filter(id=request.GET['userId'])[0]
        user_files = UserFile.objects.filter(user=user)
        serializer = UserFileSerializer(user_files, many=True)
        return Response(serializer.data)

class GetUserFilesForOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request, format='json'):
        # org = Organization.objects.filter(id=request.data['orgId'])[0]
        print(request.GET['orgId'])
        org = Organization.objects.filter(id=request.GET['orgId'])[0]
        print(org)
        user_files = UserFile.objects.all().prefetch_related(Prefetch('org_file', queryset=OrgFile.objects.filter(organization = org))).prefetch_related('user')
        serializer = UserFileSerializer(user_files, many=True)
        return Response(serializer.data)

class SetStatusUserFile(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request, format='json'):
        data = request.data
        user_file = UserFile.objects.filter(id=request.data['id'])[0]
        serializer = UserFileSerializer(user_file, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddUserFile(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request, format='json'):
        data = request.data
        org_file = OrgFile.objects.filter(id=request.data['org_file_id'])[0]
        print(org_file)
        user = User.objects.filter(id=request.data.get('user_id'))[0]
        print(user)
        serializer = UserFileSerializer(data=data)
        if serializer.is_valid():
            serializer.save(org_file=org_file, user=user, status=False)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






