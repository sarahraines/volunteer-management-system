from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import AttendeeSerializer
from api.models import Attendee, EventFeedback, Member
from django.db.models import Count, CharField, Value as V, F, ExpressionWrapper, fields, Sum, Avg
from django.db.models.functions import Concat
from django.utils import timezone
from django_mysql.models import GroupConcat
from collections import Counter

class VolunteerBreakdown(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        duration = ExpressionWrapper(F('events__enddate') - F('events__begindate'), output_field=fields.BigIntegerField())
        events_attended = Attendee.objects.filter(events__organizations__id=org_id, events__enddate__lte=timezone.now()).values(
            'username__id', 'username__first_name', 'username__last_name', 'username__email').annotate( \
            count=Count('username__id'), total=Sum(duration), event_list=GroupConcat('events__name')).order_by('-count')
        members = Member.objects.filter(organization__id=org_id).values('user__first_name', 'user__last_name')
        for event in events_attended:
            event['key'] = event['username__id']
            event['name'] = event['username__first_name'] + ' ' + event['username__last_name']
            event['email'] = event['username__email']
            event['total'] = (event['total'])/10**6//3600
            event['event_list'] = (event['event_list']).replace(',', ', ')
        
        returning_count = 0
        one_count = 0
        zero_count = 0

        returning_hours = 0
        one_hours = 0
        zero_hours = 0

        returning_names = ''
        one_names = ''
        zero_names = ''

        for event in events_attended:
            if event['count'] > 1:
                returning_count += 1
                returning_hours += event['total']
                returning_names = returning_names + ', ' + event['name']
            elif event['count'] == 1:
                one_count += 1
                one_hours += event['total']
                one_names = one_names + ', ' + event['name']

        zero_count = len(members) - returning_count - one_count

        active_names = returning_names.split(', ') + one_names.split(', ')
        
        for member in members:
            member['name'] = member['user__first_name'] + ' ' + member['user__last_name']
            if member['name'] not in active_names:
                zero_names = zero_names + ', ' + member['name']
        
        breakdown = [
        {
            "key": '1',
            "label": 'Returning Volunteers',
            "count": returning_count,
            "hours": returning_hours,
            "name" : returning_names[1:]
        },
        {
            "key": '2',
            "label": 'One-Time Volunteers',
            "count": one_count,
            "hours": one_hours,
            "name" : one_names[1:]
        },
        {
            "key": '3',
            "label": 'Inactive Volunteers',
            "count": zero_count,
            "hours": zero_hours,
            "name" : zero_names[1:]
        },
        {
            "key": '4',
            "label": 'Total',
            "count": returning_count + one_count + zero_count,
            "hours": returning_hours + one_hours + zero_hours,
            "name" : ""
        }
      ]

        return Response(breakdown, status = status.HTTP_200_OK)
        
class VolunteerLeaderboard(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        duration = ExpressionWrapper(F('events__enddate') - F('events__begindate'), output_field=fields.BigIntegerField())
        events_attended = Attendee.objects.filter(events__organizations__id=org_id, events__enddate__lte=timezone.now()).values(
            'username__id', 'username__first_name', 'username__last_name', 'username__email').annotate( \
            count=Count('username__id'), total=Sum(duration), event_list=GroupConcat('events__name')).order_by('-count')
        for event in events_attended:
            event['key'] = event['username__id']
            event['name'] = event['username__first_name'] + ' ' + event['username__last_name']
            event['email'] = event['username__email']
            event['total'] = (event['total'])/10**6//3600
            event['event_list'] = (event['event_list']).replace(',', ', ')
        
        return Response(events_attended, status = status.HTTP_200_OK)

class EventLeaderboard(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        num_attendees = EventFeedback.objects.annotate(name=Concat('username__first_name', V(' '), 'username__last_name')).filter(
            event__organizations__id=org_id, event__enddate__lte=timezone.now()).values(
                'event__id', 'event__name', 'event__location', 'event__begindate', 'event__enddate').annotate(
                count = Count('event__id'), avg_rating = Sum('overall'), avg_satisfaction = Sum('satisfaction'),
                attendees = GroupConcat('name'), ratings = GroupConcat('overall'), satisfactions = GroupConcat('satisfaction'), 
                likely = GroupConcat('likely'), expectations=GroupConcat('expectations'), future=GroupConcat('future'))

        for attendee in num_attendees:
            attendee['key'] = attendee['event__id']
            attendee['attendees'] = attendee['attendees'].replace(',', ', ')
            attendee['avg_rating'] = round(attendee['avg_rating']/attendee['count'], 1)
            attendee['avg_satisfaction'] = round(attendee['avg_satisfaction']/attendee['count'], 1)
            attendee['avg_likely'] = round(attendee['avg_satisfaction']/attendee['count'], 1)

            overall = dict(EventFeedback.OVERALL_CHOICES)
            satisfaction = dict(EventFeedback.SATISFACTION_CHOICES)
            likely = dict(EventFeedback.LIKELY_CHOICES)

            ratings = attendee['ratings'].split(',')
            satisfactions = attendee['satisfactions'].split(',')
            likelihoods = attendee['likely'].split(',')
            expectations = attendee['expectations'].split(',')
            future = attendee['future'].split(',')

            for i in range(len(ratings)):
                ratings[i] = overall[int(ratings[i])]

            for i in range(len(satisfactions)):
                satisfactions[i] = satisfaction[int(satisfactions[i])]
            
            for i in range(len(likelihoods)):
                likelihoods[i] = likely[int(likelihoods[i])]
            
            dict_ratings = Counter(ratings)
            dict_satisfactions = Counter(satisfactions)
            dict_likely = Counter(likelihoods)
            dict_expectations = Counter(expectations)
            dict_futures = Counter(future)

            attendee['ratings_arr'] = [list(dict_ratings.keys()), list(dict_ratings.values())]
            attendee['satisfactions_arr'] = [list(dict_satisfactions.keys()), list(dict_satisfactions.values())]
            attendee['likely_arr'] = [list(dict_likely.keys()), list(dict_likely.values())]
            attendee['expectations_arr'] = [list(dict_expectations.keys()), list(dict_expectations.values())]
            attendee['future_arr'] = [list(dict_futures.keys()), list(dict_futures.values())]

        return Response(num_attendees, status = status.HTTP_200_OK)