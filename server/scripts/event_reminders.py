from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail
from api.models import Event, Attendee, Organization
from api.serializers import EventSerializer, AttendeeSerializer

def run():
	startdate = datetime.now(tz=timezone.utc) + timedelta(hours=23)
	enddate = datetime.now(tz=timezone.utc) + timedelta(hours=24)
	attendees = Attendee.objects.filter(events__begindate__range=[startdate, enddate]). \
		values('events__name', 'events__location', 'events__begindate',  \
		'events__enddate', 'events__causes__name', 'events__description',  \
		'events__organizations__name', 'username__email', 'username__first_name')
	for item in attendees:
		name = item['events__name']
		location = item['events__location']
		begindate = item['events__begindate']
		enddate = item['events__enddate']
		causes = item['events__causes__name']
		desc = item['events__description']
		org = item['events__organizations__name']
		email = item['username__email']
		fname = item['username__first_name']

		subject = 'Volunteer Event Reminder'

		message = ('Hello ' + fname + ','
		'\n\nThis is your reminder to attend the following event.\n\n'
		'Name: ' + name + 
		'\nOrganization: ' + name + 
		'\nLocation: ' + location + 
		'\nDate: ' + str(begindate) + '-' + str(enddate) + 
		'\nCauses: ' + causes + 
		'\nDescription: ' + desc)

		from_email = 'vol.mgmt.system@gmail.com'

		send_mail(subject, message, from_email, [email], fail_silently=False)
	