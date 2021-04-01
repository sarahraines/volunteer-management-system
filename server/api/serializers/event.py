from rest_framework import serializers
from api.models import Event, Attendee, EventFeedback

class EventSerializer(serializers.ModelSerializer):
	class Meta:
		model = Event
		fields = ['id', 'organization', 'name', 'virtual', 'location', 'begindate', 'enddate', 'causes', 'description', 'instructions', 'attendee_cap', 'image']

class AttendeeSerializer(serializers.ModelSerializer):
	events = EventSerializer(read_only=True, many=True)
	class Meta:
		model = Attendee
		fields = ['id', 'username', 'events']

class EventFeedbackSerializer(serializers.ModelSerializer):
	class Meta:
		model = EventFeedback
		fields = ['id', 'username', 'event', 'overall', 'satisfaction', 'likely', 'expectations', 'future', 'better', 'experience']