from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import EventSerializer, AttendeeSerializer, MemberSerializer, OrganizationSerializer
from api.models import Event, User, Attendee, Member, Organization
from collections import OrderedDict

class AddAttendees(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = AttendeeSerializer(data=data)
        user = User.objects.filter(id=data['user_id'])[0]
        event = Event.objects.filter(id=data['events'])
        if serializer.is_valid():
            serializer.save(username=user, events=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAttendees(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        event = Event.objects.filter(id=data['events'])[0]
        attendee = Attendee.objects.filter(username=data['user_id'], events=event).delete()
        return Response("deleted", status=status.HTTP_200_OK)   

class GetEvents(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

class GetAttendees(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        attendees = Attendee.objects.all()
        serializer = AttendeeSerializer(attendees, many=True)
        return Response(serializer.data)

class CreateEvent(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        data['begindate']=data['date'][0]
        data['enddate']=data['date'][1]
        del data['date']
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








