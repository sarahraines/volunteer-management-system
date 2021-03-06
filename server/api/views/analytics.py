from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import AttendeeSerializer
from api.models import Attendee, EventFeedback, Member, UserGoals
from django.db.models import Count, CharField, Value as V, F, ExpressionWrapper, fields, Sum, Avg
from django.db.models.functions import Concat
from django.utils import timezone
from datetime import timedelta
from django_mysql.models import GroupConcat
from django.db.models.functions import Cast, Extract
from collections import Counter
from django.conf import settings
from datetime import datetime

if settings.DATABASES['default']['ENGINE'] == 'django.db.backends.postgresql_psycopg2':
    from django.contrib.postgres.aggregates import StringAgg
    GroupConcat = lambda expression: StringAgg(Cast(expression, fields.TextField()), ',')
    T = lambda e: Extract(F(e), 'epoch') * V(10**6) 
else:
    T = F

class VolunteerBreakdown(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        duration = ExpressionWrapper(T('events__enddate') - T('events__begindate'), output_field=fields.BigIntegerField())
        events_attended = Attendee.objects.filter(events__organization__id=org_id, events__enddate__lte=timezone.now()).values(
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
            "key": 1,
            "label": 'Returning Volunteers',
            "count": returning_count,
            "hours": returning_hours,
            "name" : returning_names[1:]
        },
        {
            "key": 2,
            "label": 'One-Time Volunteers',
            "count": one_count,
            "hours": one_hours,
            "name" : one_names[1:]
        },
        {
            "key": 3,
            "label": 'Inactive Volunteers',
            "count": zero_count,
            "hours": zero_hours,
            "name" : zero_names[1:]
        },
        {
            "key": 4,
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
        duration = ExpressionWrapper(T('events__enddate') - T('events__begindate'), output_field=fields.BigIntegerField())

        timeframes = [timezone.now() - timedelta(days=30), timezone.now() - timedelta(days=365), timezone.now() - timedelta(days=10**5)]

        results = []
        
        for time in timeframes:
            events_attended = Attendee.objects.filter(events__organization__id=org_id, events__enddate__lte=timezone.now(), events__begindate__gte=time).values(
                'username__id', 'username__first_name', 'username__last_name', 'username__email').annotate( \
                count=Count('username__id'), total=Sum(duration), event_list=GroupConcat('events__name')).order_by('-count')
            for event in events_attended:
                event['key'] = event['username__id']
                event['name'] = event['username__first_name'] + ' ' + event['username__last_name']
                event['email'] = event['username__email']
                event['total'] = (event['total'])/10**6//3600
                event['event_list'] = (event['event_list']).replace(',', ', ')
            results.append(events_attended)
        
        return Response(results, status = status.HTTP_200_OK)

class EventLeaderboard(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request):
        org_id = request.GET['org_id']
        num_attendees = EventFeedback.objects.annotate(name=Concat('username__first_name', V(' '), 'username__last_name')).filter(
            event__organization__id=org_id, event__enddate__lte=timezone.now()).values(
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

class VolunteerEventLeaderboard(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user = request.GET['user']
        
        events = EventFeedback.objects.filter(username__id=user, event__enddate__lte=timezone.now()).values(
            'event__id', 'event__name', 'event__organization__name', 'event__begindate', 'event__enddate', 'overall', 'satisfaction')

        for event in events:
            event['key'] = event['event__id']
            event['date'] = str(event['event__begindate']).split()[0] 
        
        return Response(events, status = status.HTTP_200_OK)

class NonprofitBreakdown(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user = request.GET['user']

        duration = ExpressionWrapper(T('events__enddate') - T('events__begindate'), output_field=fields.BigIntegerField())

        nonprofits = Attendee.objects.filter(username__id=user, events__enddate__lte=timezone.now()).values(
            'events__organization__id', 'events__organization__name').annotate(count = Count('events__organization__id'), hours = Sum(duration), events=GroupConcat('events__name'))
        
        for nonprofit in nonprofits:
            nonprofit['key'] = nonprofit['events__organization__id']
            nonprofit['hours'] = nonprofit['hours']/10**6//3600
            nonprofit['events'] = nonprofit['events'].replace(',', ', ')
        
        return Response(nonprofits, status = status.HTTP_200_OK)

class VolunteerSummary(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user = request.GET['user']

        duration = ExpressionWrapper(T('events__enddate') - T('events__begindate'), output_field=fields.BigIntegerField())

        nonprofits = []
        events = []
        hours = []
        nonprofits_list = []
        events_list = []
        dates_list = []

        timeframes = [timezone.now() - timedelta(days=30), timezone.now() - timedelta(days=365), timezone.now() - timedelta(days=10**5)]

        for time in timeframes:
            np = Attendee.objects.filter(username__id=user, events__enddate__lte=timezone.now(), events__enddate__gte=time).values(
                'events__organization__id', 'events__organization__name').annotate(
                    count = Count('events__organization__id'), hours = Sum(duration), events = GroupConcat('events__name'), dates = GroupConcat('events__enddate'))
    
            count_sum = 0
            hours_sum = 0
            nonprofits_string = ""
            events_string = ""
            events_enddate_string = ""

            for nonprofit in np:
                count_sum += nonprofit['count']
                hours_sum += nonprofit['hours']/10**6//3600
                nonprofits_string = nonprofits_string + nonprofit['events__organization__name'] + ', '
                events_string = events_string + nonprofit['events'].replace(',', ', ') + ', '
                events_enddate_string = events_enddate_string + nonprofit['dates'].replace(',', ', ') + ', '
            
            nonprofits.append(len(np))
            events.append(count_sum)
            hours.append(hours_sum)
            nonprofits_list.append(nonprofits_string[:-2])
            events_list.append(events_string[:-2])
            dates_list.append(events_enddate_string[:-2])
        
        breakdown = [
        {
            "key": 1,
            "label": 'Past Month',
            "nonprofits": nonprofits[0],
            "events": events[0],
            "hours": hours[0],
            "nonprofits_list" : nonprofits_list[0],
            "events_list" : events_list[0],
            "dates_list" : dates_list[0]
        },
         {
            "key": 2,
            "label": 'Past Year',
            "nonprofits": nonprofits[1],
            "events": events[1],
            "hours": hours[1],
            "nonprofits_list" : nonprofits_list[1],
            "events_list" : events_list[1],
            "dates_list" : dates_list[1]
        },
         {
            "key": 3,
            "label": 'Overall',
            "nonprofits": nonprofits[2],
            "events": events[2],
            "hours": hours[2],
            "nonprofits_list" : nonprofits_list[2],
            "events_list" : events_list[2],
            "dates_list" : dates_list[2]
        }
      ]
         
        return Response(breakdown, status = status.HTTP_200_OK)

class GetVolunteerGoals(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user = request.GET['user']

        duration = ExpressionWrapper(T('events__enddate') - T('events__begindate'), output_field=fields.BigIntegerField())

        goals = UserGoals.objects.filter(user__id=user).values('id', 'hours', 'begindate', 'enddate')

        for goal in goals:
            attendees = Attendee.objects.filter(username__id=user, events__begindate__gte=goal['begindate'], events__enddate__lte=timezone.now()).values(
                'username__id').annotate(completed = Sum(duration))

            if len(attendees) > 0:
                goal['completed'] = attendees[0]['completed']/10**6//3600
                goal['progress'] = round(goal['completed']/goal['hours']*100)
            else:
                goal['completed'] = 0
                goal['progress'] = 0
        
        return Response(goals, status = status.HTTP_200_OK)
        
class VolunteerFunnel(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        org_id = request.GET['org_id']
    
        members = Member.objects.filter(organization__id=org_id).values('user__id')
        attendees = Attendee.objects.filter(events__organization__id=org_id, events__enddate__lte=timezone.now()).values('username__id').distinct()
        feedback = EventFeedback.objects.filter(event__organization__id=org_id, event__enddate__lte=timezone.now()).values('username__email').distinct()

        return Response([len(members), len(attendees), len(feedback)], status=status.HTTP_200_OK)

class GetMonthlyHours(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def get(self, request):
        user = request.GET['user']

        duration = ExpressionWrapper(T('events__enddate') - T('events__begindate'), output_field=fields.BigIntegerField())

        attendees = Attendee.objects.filter(username__id=user, events__begindate__lte=timezone.now()).values('events__begindate').annotate(
            hours=Sum(duration)).order_by('events__begindate')
        
        print(attendees)

        hours_counts = dict()
        events_counts = dict()

        for attendee in attendees:
            date = str(attendee['events__begindate'].year) + '-' + str(attendee['events__begindate'].month)

            if date not in hours_counts or date not in events_counts:
                hours_counts[date] = 0
                events_counts[date] = 0
            hours_counts[date] += attendee['hours']/10**6//3600
            events_counts[date] += 1

        print(hours_counts)
        print(events_counts)

        return Response([hours_counts.keys(), hours_counts.values(), events_counts.keys(), events_counts.values()], status=status.HTTP_200_OK)