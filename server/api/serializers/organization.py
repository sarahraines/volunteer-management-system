from rest_framework import serializers
from api.models import Organization, Cause, FAQ


class CauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cause
        fields = ['id', 'name']
    
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer']

class OrganizationSerializer(serializers.ModelSerializer):
    causes = CauseSerializer(read_only=True, many=True)
    class Meta:
        model = Organization
        fields = ['id', 'name', 'causes', 'description']