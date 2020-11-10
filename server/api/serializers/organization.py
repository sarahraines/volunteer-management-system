from rest_framework import serializers
from api.models import Organization, Cause


class CauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cause
        fields = ['id', 'name']

class OrganizationSerializer(serializers.ModelSerializer):
    causes = CauseSerializer(read_only=True, many=True)

    class Meta:
        model = Organization
        fields = ['id', 'name', 'causes', 'description']