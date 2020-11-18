from rest_framework import serializers
from api.models import Member, Organization, User
from api.serializers import OrganizationSerializer, UserSerializer

class MemberSerializer(serializers.ModelSerializer):
    #username = serializers.RelatedField(source='user', read_only=True)
    #organization = serializers.RelatedField(source='organization', read_only=True)

    user_id = UserSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = Member
        fields = ['user_id', 'organization', 'member_type']