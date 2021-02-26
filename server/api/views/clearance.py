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
        org = Organization.objects.filter(id=request.data['orgId'])[0]
        e = Event.objects.filter(id=request.data['eventId'])[0]
        data = request.data
        serializer = OrgFileSerializer(data=data)
        if serializer.is_valid():
            serializer.save(organization = org, event=e)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetOrgFilesForEvent(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request, format='json'):
        org = Organization.objects.filter(id=request.GET['orgId'])[0]
        event_id = request.GET['eventId']
        org_files = OrgFile.objects.filter(organization=org, event__id = event_id).values('id', 'organization', 'event', 'event__name', 'empty_form.url')
        # serializer = OrgFileSerializer(org_files, many=True)
        
        for file in org_files:
            file['empty_form'] = file.empty_form.url
            file['key'] = file['id']

        return Response(org_files)

class GetUserFiles(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request, format='json'):
        user = User.objects.filter(id=request.GET['userId'])[0]
        user_files = UserFile.objects.filter(user=user)
        serializer = UserFileSerializer(user_files, many=True)
        return Response(serializer.data)

class GetUserFilesForOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def get(self, request, format='json'):
        org = Organization.objects.filter(id=request.GET['orgId'])[0]
        event_id = request.GET['eventId']
        user_files = UserFile.objects.filter(org_file__organization = org, org_file__event__id = event_id).prefetch_related('org_file').prefetch_related('user').values(
            'user__email','org_file', 'filled_form', 'status', 'id', 'comment', 'org_file__event', 'org_file__event__name')
        user_files = list(user_files)
        return Response(user_files)
        
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
        user = User.objects.filter(id=request.data.get('user_id'))[0]

        # delete old user file associated with that org file
        user_files = UserFile.objects.filter(user=user, org_file=org_file)
        if (len(user_files) > 0):
            user_files[0].delete()

        # add new user file
        serializer = UserFileSerializer(data=data)
        if serializer.is_valid():
            serializer.save(org_file=org_file, user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






