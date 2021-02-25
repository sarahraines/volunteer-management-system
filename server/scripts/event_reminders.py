from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from api.models import Event, Attendee, Organization, UserSettings
from api.serializers import EventSerializer, AttendeeSerializer
from twilio.rest import Client
from django.conf import settings
import os

def run():

	#Event reminders
	startdate = datetime.now(tz=timezone.utc) + timedelta(hours=23)
	enddate = datetime.now(tz=timezone.utc) + timedelta(hours=24)
	attendees = Attendee.objects.filter(events__begindate__range=[startdate, enddate]). \
		values('events__name', 'events__location', 'events__begindate',  \
		'events__enddate', 'events__organizations__name', 'username__id', 'username__email', 'username__first_name')
	# print(attendees)

	for item in attendees:

		exists = UserSettings.objects.filter(user__id=item['username__id']).values('email', 'text', 'phone_number')

		name = item['events__name']
		location = item['events__location']
		begindate = item['events__begindate']
		enddate = item['events__enddate']
		org = item['events__organizations__name']
		email = item['username__email']
		fname = item['username__first_name']

		subject = 'Volunteer Event Reminder'

		message = ('Hello ' + fname + ','
		'\n\nThis is your reminder to attend the following event.\n\n'
		'Name: ' + name + 
		'\nOrganization: ' + org + 
		'\nLocation: ' + location + 
		'\nDate: ' + str(begindate) + '-' + str(enddate))

		from_email = 'vol.mgmt.system@gmail.com'

		if len(exists) == 0:
			send_mail(subject, message, from_email, [email], fail_silently=False)
		else:
			if exists[0]['email']:
				send_mail(subject, message, from_email, [email], fail_silently=False)
		
		if len(exists) != 0:
			if exists[0]['text']:
				account_sid = 'AC937604210086bea49b3e995018116280'
				auth_token='bf8b35572e4b92d8592b47e50cd2f9af'
				client = Client(account_sid, auth_token)

				message = client.messages.create(
					body=message,
					from_='+12052935356',
					to='+1' + exists[0]['phone_number']
				)
				# print(message.sid)

	#Event feedback
	startdate = datetime.now(tz=timezone.utc) - timedelta(hours=1)
	enddate = datetime.now(tz=timezone.utc)
	attendees = Attendee.objects.filter(events__enddate__range=[startdate, enddate]). \
		values('id', 'events__name', 'events__location', 'events__begindate',  \
		'events__enddate', 'events__causes__name', 'events__description',  \
		'events__organizations__name', 'username__id', 'username__email', 'username__first_name')
	
	for item in attendees:

		exists = UserSettings.objects.filter(user__id=item['username__id']).values('email', 'text', 'phone_number')

		name = item['events__name']
		location = item['events__location']
		begindate = item['events__begindate']
		enddate = item['events__enddate']
		org = item['events__organizations__name']
		email = item['username__email']
		fname = item['username__first_name']

		subject = 'Volunteer Event Feedback'

		message = ('Hello ' + fname + ','
		'\n\nThank you for attending the following event.\n\n'
		'Name: ' + name + 
		'\nOrganization: ' + org + 
		'\nLocation: ' + location + 
		'\nDate: ' + str(begindate) + '-' + str(enddate) + 
		'\n\nPlease take a moment to fill out a feedback form here:' + 
		'\n\nhttps://volunteersense.com/feedback?attendee_id=' + str(item['id']))

		from_email = 'vol.mgmt.system@gmail.com'

		if len(exists) == 0:
			send_mail(subject, message, from_email, [email], fail_silently=False)
		else:
			 if exists[0]['email']:
				 send_mail(subject, message, from_email, [email], fail_silently=False)

	