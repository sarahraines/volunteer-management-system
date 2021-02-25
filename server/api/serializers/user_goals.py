from rest_framework import serializers
from api.models import UserGoals

class UserGoalsSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserGoals
		fields = ['id', 'user', 'hours', 'begindate', 'enddate']