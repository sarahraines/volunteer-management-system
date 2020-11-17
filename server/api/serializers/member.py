from rest_framework import serializers
from api.models import Member, Organization, User
from api.serializers import OrganizationSerializer


class CauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cause
        fields = ['id', 'name']

class OrganizationSerializer(serializers.ModelSerializer):
    username = serializers.RelatedField(source='user', read_only=True)
    organizations = OrganizationSerializer(read_only=True, many=True)

    class Meta:
        model = Member
        fields = ['username', 'organizations', 'user_type']