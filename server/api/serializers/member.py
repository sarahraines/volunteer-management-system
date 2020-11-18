from rest_framework import serializers
from api.models import Member, Organization, User
from api.serializers import OrganizationSerializer

class MemberSerializer(serializers.ModelSerializer):
    username = serializers.RelatedField(source='user', read_only=True)
    organization = serializers.RelatedField(source='organization', read_only=True)

    class Meta:
        model = Member
        fields = ['username', 'organization', 'user_type']