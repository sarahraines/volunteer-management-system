from rest_framework import serializers
from api.models import Organization, Cause, FAQ


class CauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cause
        fields = ['id', 'name']
    
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'org_id', 'is_public']

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'causes', 'description', 'email', 'website', 'phone', 'address', 'is_public']