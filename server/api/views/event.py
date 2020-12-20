from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import EventSerializer, AttendeeSerializer, MemberSerializer, OrganizationSerializer
from api.models import Event, User, Attendee, Member, Organization, Cause
from collections import OrderedDict
from django.shortcuts import get_object_or_404

class AddAttendee(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = AttendeeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAttendee(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        event = get_object_or_404(Event, pk=data['events'])
        Attendee.objects.filter(username=data['user_id'], events=event).delete()
        return Response(None, status=status.HTTP_200_OK)   

class GetEvents(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetEventsByOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        if request.GET.get('orgId'):
            orgId = request.GET['orgId']
            events = Event.objects.filter(organizations__in=[orgId])
            serializer = EventSerializer(events, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Request missing parameter orgId", status=status.HTTP_400_BAD_REQUEST) 

class CreateEvent(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        try:
            data['begindate']=data['date'][0]
            data['enddate']=data['date'][1]
            del data['date']
        except: 
            return Response("Incorrect date format", status=status.HTTP_400_BAD_REQUEST)
        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAdminOrganizations(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user_id = request.GET['user_id']
        organizations = Member.objects.filter(user_id=user_id, member_type=1).values('organization')
        orgs = []
        for item in organizations:
            orgs.append(Organization.objects.filter(id=item['organization'])[0])
        serializer = OrganizationSerializer(orgs, many=True)
        return Response(serializer.data)








