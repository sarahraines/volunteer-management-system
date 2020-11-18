from rest_framework import serializers
from api.models import Event, Attendee

class EventSerializer(serializers.ModelSerializer):
	class Meta:
		model = Event
		fields = ['id', 'organizations', 'name', 'virtual', 'location', 'begindate', 'enddate', 'causes', 'description']

class AttendeeSerializer(serializers.ModelSerializer):
	events = EventSerializer(read_only=True, many=True)
	class Meta:
		model = Attendee
		fields = ['id', 'username', 'events']