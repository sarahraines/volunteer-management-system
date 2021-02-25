from rest_framework import serializers
from api.models import Event, Attendee, EventFeedback, OrgFile, UserFile

class EventSerializer(serializers.ModelSerializer):
	class Meta:
		model = Event
		fields = ['id', 'organization', 'name', 'virtual', 'location', 'begindate', 'enddate', 'causes', 'description', 'instructions', 'attendee_cap', 'clearance_form']

class AttendeeSerializer(serializers.ModelSerializer):
	events = EventSerializer(read_only=True, many=True)
	class Meta:
		model = Attendee
		fields = ['id', 'username', 'events']

class EventFeedbackSerializer(serializers.ModelSerializer):
	class Meta:
		model = EventFeedback
		fields = ['id', 'username', 'event', 'overall', 'satisfaction', 'likely', 'expectations', 'future', 'better', 'experience']

class OrgFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgFile
        fields = ['id', 'organization', 'empty_form']
        
class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ['id', 'org_file', 'user', 'filled_form', 'status', 'comment']