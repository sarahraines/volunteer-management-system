from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import UserSerializer, EventSerializer, AttendeeSerializer, MemberSerializer, OrganizationSerializer, EventFeedbackSerializer, CauseSerializer
from api.models import Event, User, Attendee, Member, Organization, Cause, EventFeedback
from django.db.models import Count, CharField, Value as V, F, ExpressionWrapper, fields, Sum, Avg
from django.db.models.functions import Concat
from collections import OrderedDict
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django_mysql.models import GroupConcat
from django.utils import timezone
from django.db.models import TextField
from django.db.models.functions import Cast
from django.conf import settings
import jwt

if settings.DATABASES['default']['ENGINE'] == 'django.db.backends.postgresql_psycopg2':
    from django.contrib.postgres.aggregates import StringAgg
    GroupConcat = lambda expression: StringAgg(Cast(expression, TextField()), ',')

class AddAttendee(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        serializer = AttendeeSerializer(data=data)
        user = User.objects.filter(id=data['user_id'])[0]
        event = Event.objects.filter(id=data['event'])
        if serializer.is_valid():
            serializer.save(username=user, events=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAttendee(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        event = Event.objects.filter(id=data['event'])[0]
        _attendee = Attendee.objects.filter(username=data['user_id'], events=event).delete()
        return Response("deleted", status=status.HTTP_200_OK)   

class GetEvents(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        date = timezone.now()
        events = Event.objects.filter(enddate__gte=date).order_by('begindate')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteEvent(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def delete(self, request):
        id = request.GET.get('id')
        event = get_object_or_404(Event, pk=id)
        event.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

class GetEventsByOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        if request.GET.get('orgId'):
            date = timezone.now()
            orgId = request.GET['orgId']
            events = Event.objects.filter(organization=orgId).filter(enddate__gte=date).order_by('begindate')
            serializer = EventSerializer(events, many=True)
            is_localhost = request.get_host() == "127.0.0.1:8000" or request.get_host() == "localhost:8000"
            
            for i in range(len(events)):
                attendees = Attendee.objects.filter(events__id=events[i].id)
                attendees = list(attendees)
                attendee_count = len(attendees)
                serializer.data[i]["attendee_count"] = attendee_count
                serializer.data[i]["key"] = events[i].id
                if is_localhost and serializer.data[i]['image'] :
                    serializer.data[i]['image'] = "http://" + request.get_host() + serializer.data[i]['image']
                 

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Request missing parameter orgId", status=status.HTTP_400_BAD_REQUEST) 

class GetEventCountForOrg(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        if request.GET.get('orgId'):
            orgId = request.GET['orgId']
            events = Event.objects.filter(organization=orgId)
            return Response(len(events), status=status.HTTP_200_OK)
        return Response("Request missing parameter orgId", status=status.HTTP_400_BAD_REQUEST) 

class GetCausesByEvent(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        if request.GET.get('eventId'):
            event_id = request.GET['eventId']
            causes = Cause.objects.filter(event=event_id).all()
            serializer = CauseSerializer(causes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response("Request missing parameter eventId", status=status.HTTP_400_BAD_REQUEST)

class UpsertEvent(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data.dict()

        if 'causes' in data and not isinstance(data['causes'], list):
            data['causes'] = [data['causes']]

        id = data.get('id')
        no_error_status = status.HTTP_200_OK if id else status.HTTP_201_CREATED

        image = data.get('image')
        if image == 'null':
            data['image'] = None

        if id:
            event = Event.objects.get(pk=id)
            serializer = EventSerializer(event, data=data)
        else:
            serializer = EventSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=no_error_status)

        print(serializer.errors)
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

class GetEventById(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        try:
            data = jwt.decode(request.GET['rt'], settings.SECRET_KEY, algorithms=["HS256"])
            attendee_id = data['attendee_id']
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)

        attendees = Attendee.objects.filter(id=attendee_id). \
        values('events__name', 'events__location', 'events__begindate',  \
        'events__enddate', 'events__causes__name', 'events__description',  \
        'events__organization__name', 'username__email', 'username__first_name', 'username__last_name')

        return Response(attendees, status=status.HTTP_200_OK)

class CreateEventFeedback(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request, format='json'):
        data = request.data
        print(request.user)
        
        ids = Attendee.objects.filter(id=data['id']).values('events__id', 'username__id')
        
        event_id = ids[0]['events__id']
        username_id = ids[0]['username__id']

        event = Event.objects.filter(id=event_id)[0]
        username = User.objects.filter(id=username_id)[0]

        serializer = EventFeedbackSerializer(data=data)

        if serializer.is_valid():
            serializer.save(username=username, event=event)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetEventFeedback(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        org_id = request.GET['orgId']
        is_admin = request.GET['isAdmin']
        user_id = request.GET['userId']

        if str(is_admin)=='1':
            feedback = EventFeedback.objects.filter(event__organization__id=org_id, event__enddate__lte=timezone.now()).values(
            'id', 'event__name', 'event__location', 'event__begindate', 'event__enddate', 
            'username__email', 'username__first_name', 'username__last_name',
            'overall', 'satisfaction', 'likely', 'expectations', 'future', 'better', 'experience')
        else:
            feedback = EventFeedback.objects.filter(event__organization__id=org_id, username__id=user_id, event__enddate__lte=timezone.now()).values(
            'id', 'event__name', 'event__location', 'event__begindate', 'event__enddate', 
            'username__email', 'username__first_name', 'username__last_name',
            'overall', 'satisfaction', 'likely', 'expectations', 'future', 'better', 'experience')

        overall = dict(EventFeedback.OVERALL_CHOICES)
        satisfaction = dict(EventFeedback.SATISFACTION_CHOICES)
        likely = dict(EventFeedback.LIKELY_CHOICES)

        for f in feedback:
            f['key'] = f['id']
            f['name'] = f['username__first_name'] + ' ' + f['username__last_name']
            f['overall'] = overall[f['overall']]
            f['satisfaction'] = satisfaction[f['satisfaction']]
            f['likely'] = likely[f['likely']]
        return Response(feedback, status=status.HTTP_200_OK)

class GetEventAttendeeCount(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        eventId = request.GET['event']
        attendees = Attendee.objects.filter(events__id=eventId)
        attendees = list(attendees)
        data = len(attendees)

        return Response(data, status=status.HTTP_200_OK)

class GetRegisterStatus(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        attendee_id = request.GET['user_id']
        event_id = request.GET['event']
        username = User.objects.filter(id=attendee_id)[0]
        attendees = Attendee.objects.filter(username=username, events__id=event_id)
        attendees = list(attendees)
        data = 0
        if (len(attendees) > 0):
            data = 1
        return Response(data, status=status.HTTP_200_OK)

class GetVolunteerEvents(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        attendee_id = request.GET['user_id']
        username = User.objects.filter(id=attendee_id)[0]
        events = Attendee.objects.filter(username=username).values('events__id',
        'events__name', 'events__virtual', 'events__location', 'events__begindate', 'events__enddate',
        'events__causes', 'events__description', 'events__organization', 'events__instructions',
        'events__attendee_cap')

        return Response(events, status=status.HTTP_200_OK)

class GetAttendees(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        org_id = request.GET['org_id']
        num_attendees = Attendee.objects.annotate(name=Concat('username__first_name', V(' '), 'username__last_name')).filter(
            events__organization__id=org_id, events__begindate__gte=timezone.now()).values(
                'events__id', 'events__name', 'events__location', 'events__begindate', 'events__enddate', 'events__attendee_cap',).annotate(
                    count=Count('events__id'), attendees = GroupConcat('name')).order_by('events__begindate')


        for attendee in num_attendees:
            attendee['key'] = attendee['events__id']
            attendee['attendees'] = attendee['attendees'].replace(',', ', ')

        return Response(num_attendees, status=status.HTTP_200_OK)

