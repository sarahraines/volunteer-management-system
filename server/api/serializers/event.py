from rest_framework import serializers
from api.models import Event, Cause

class CauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cause
        fields = ['id', 'name']

class EventSerializer(serializers.ModelSerializer):
	causes = CauseSerializer(read_only=True, many=True)

	class Meta:
		model = Event
		fields = ['id', 'name', 'virtual', 'location', 'date', 'causes', 'description']

