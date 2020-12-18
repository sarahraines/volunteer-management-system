from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import EventSerializer,  OrganizationSerializer, UserFileSerializer, OrgFileSerializer
from api.models import Event, User, Attendee, Member, Organization, Cause, OrgFile, UserFile

class AddOrgFile(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        org = Organization.objects.filter(id=request.data['orgId'])[0]
        data = request.data
        serializer = OrgFileSerializer(data=data)
        if serializer.is_valid():
            serializer.save(organization = org)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddUserFile(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    def post(self, request, format='json'):
        data = request.data
        serializer = UserFileSerializer(data=data)
        if serializer.is_valid():
            # serializer.save(username=user, events=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






