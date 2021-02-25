from rest_framework import serializers
from api.models import UserSettings

class UserSettingsSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserSettings
		fields = ['id', 'user', 'email', 'text', 'phone_number']